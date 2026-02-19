from datetime import timedelta

from django.conf import settings
from django.core.cache import cache
from django.db import transaction
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import LanguageStats, RenderConfig, RepoSnapshot, ShareToken, World
from .serializers import GenerateWorldInputSerializer, ShareSerializer, WorldSerializer
from .services.github_service import (
    GitHubClient,
    GitHubError,
    GitHubNotFoundError,
    GitHubRateLimitError,
    build_world_payload,
)


class GenerateWorldView(APIView):
    def post(self, request):
        serializer = GenerateWorldInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        client = GitHubClient()

        try:
            username = client.parse_username(
                github_url=serializer.validated_data.get('github_url'),
                username=serializer.validated_data.get('username'),
            )
        except GitHubError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        active_world = World.objects.filter(
            username__iexact=username,
            generation_status=World.STATUS_READY,
            expires_at__gt=timezone.now(),
        ).first()
        if active_world:
            return Response(
                {
                    'world_id': str(active_world.id),
                    'status': active_world.generation_status,
                    'cached': True,
                    'eta_seconds': 0,
                },
                status=status.HTTP_200_OK,
            )

        stale_world = World.objects.filter(
            username__iexact=username,
            generation_status=World.STATUS_READY,
        ).first()

        try:
            user_payload = client.fetch_user(username)
            repos_payload = client.fetch_repos(username)
        except GitHubNotFoundError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except GitHubRateLimitError as exc:
            if stale_world:
                return Response(
                    {
                        'world_id': str(stale_world.id),
                        'status': stale_world.generation_status,
                        'cached': True,
                        'stale': True,
                        'rate_limited_until': exc.reset_at.isoformat(),
                        'eta_seconds': 900,
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {
                    'detail': 'GitHub API rate limit reached. Try again later.',
                    'rate_limited_until': exc.reset_at.isoformat(),
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
        except GitHubError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)

        payload = build_world_payload(user_payload, repos_payload)
        world = self._create_world(client, username, user_payload, payload)

        cache.set(f'world:latest:{username.lower()}', str(world.id), timeout=settings.WORLD_TTL_HOURS * 3600)

        return Response(
            {
                'world_id': str(world.id),
                'status': world.generation_status,
                'cached': False,
                'eta_seconds': 0,
            },
            status=status.HTTP_201_CREATED,
        )

    def _create_world(self, client, username, user_payload, payload):
        expires_at = timezone.now() + timedelta(hours=settings.WORLD_TTL_HOURS)
        top_repo_count_for_deep_fetch = 12

        with transaction.atomic():
            world = World.objects.create(
                username=username,
                github_url=user_payload.get('html_url', ''),
                avatar_url=user_payload.get('avatar_url', ''),
                followers=user_payload.get('followers', 0),
                following=user_payload.get('following', 0),
                public_repos=user_payload.get('public_repos', 0),
                totals=payload['totals'],
                generation_status=World.STATUS_READY,
                source_hash=payload['source_hash'],
                expires_at=expires_at,
            )

            repo_models = []
            for idx, repo in enumerate(payload['repos']):
                commits_30d = 0
                language_breakdown = {}

                if idx < top_repo_count_for_deep_fetch:
                    owner, name = repo['full_name'].split('/', 1)
                    try:
                        commits_30d = client.fetch_commit_count_30d(owner, name, repo.get('default_branch', 'main'))
                    except GitHubError:
                        commits_30d = 0
                    try:
                        language_breakdown = client.fetch_repo_languages(owner, name)
                    except GitHubError:
                        language_breakdown = {}

                pushed_at = parse_datetime(repo['last_activity_at']) if repo.get('last_activity_at') else None
                repo_models.append(
                    RepoSnapshot(
                        world=world,
                        repo_id=repo['repo_id'],
                        name=repo['name'],
                        full_name=repo['full_name'],
                        html_url=repo['html_url'],
                        description=repo['description'],
                        primary_language=repo['primary_language'],
                        language_breakdown=language_breakdown,
                        stars=repo['stars'],
                        forks=repo['forks'],
                        open_issues=repo['open_issues'],
                        watchers=repo['watchers'],
                        size_kb=repo['size_kb'],
                        commits_30d=commits_30d,
                        activity_score=repo['activity_score'],
                        last_activity_at=pushed_at,
                        is_fork=repo['is_fork'],
                        pos_x=repo['pos_x'],
                        pos_y=repo['pos_y'],
                        pos_z=repo['pos_z'],
                    )
                )
            RepoSnapshot.objects.bulk_create(repo_models)

            LanguageStats.objects.bulk_create(
                [
                    LanguageStats(
                        world=world,
                        language=item['language'],
                        percent=item['percent'],
                        color_token=item['color_token'],
                    )
                    for item in payload['languages']
                ]
            )

            RenderConfig.objects.create(
                world=world,
                seed=(user_payload.get('id', 1) % 100000) + 7,
                layout_version='v1',
                density_level=1.0,
                lighting_profile='neo_city',
                enable_particles=True,
            )

            ShareToken.objects.create(world=world, token=ShareToken.make_token(), is_public=True)

        return world


class WorldDetailView(APIView):
    def get(self, request, world_id):
        world = get_object_or_404(
            World.objects.prefetch_related(
                Prefetch('repos', queryset=RepoSnapshot.objects.all()),
                Prefetch('languages', queryset=LanguageStats.objects.all()),
            ).select_related('render_config'),
            pk=world_id,
        )
        return Response(WorldSerializer(world).data, status=status.HTTP_200_OK)


class WorldShareView(APIView):
    def get(self, request, world_id):
        world = get_object_or_404(
            World.objects.prefetch_related(
                Prefetch('repos', queryset=RepoSnapshot.objects.all()),
                Prefetch('languages', queryset=LanguageStats.objects.all()),
            ).select_related('render_config', 'share_token'),
            pk=world_id,
        )
        token = getattr(world, 'share_token', None)
        if not token or not token.is_valid():
            return Response({'detail': 'Share link is not active.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(ShareSerializer(world).data, status=status.HTTP_200_OK)
