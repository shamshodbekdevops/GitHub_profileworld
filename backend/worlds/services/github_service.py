import hashlib
import math
import re
from collections import Counter
from datetime import datetime, timedelta, timezone as dt_timezone
from urllib.parse import urlparse

import requests
from django.conf import settings
from django.utils import timezone


class GitHubError(Exception):
    pass


class GitHubNotFoundError(GitHubError):
    pass


class GitHubRateLimitError(GitHubError):
    def __init__(self, reset_at):
        super().__init__('GitHub API rate limit reached')
        self.reset_at = reset_at


class GitHubClient:
    USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9-]{1,39}$')

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'github-profile-world-app',
            }
        )
        token = settings.GITHUB_TOKEN
        if token:
            self.session.headers.update({'Authorization': f'Bearer {token}'})

    def parse_username(self, github_url=None, username=None):
        if username:
            candidate = username.strip().lstrip('@')
        else:
            candidate = self._extract_username_from_url(github_url)

        if not candidate or not self.USERNAME_PATTERN.match(candidate):
            raise GitHubError('Invalid GitHub username or URL.')
        return candidate

    def _extract_username_from_url(self, value):
        if not value:
            return ''
        parsed = urlparse(value)
        if parsed.netloc not in ('github.com', 'www.github.com'):
            raise GitHubError('Only github.com profile URLs are supported.')
        path = parsed.path.strip('/').split('/')
        return path[0] if path and path[0] else ''

    def _request(self, path, params=None):
        response = self.session.get(f"{settings.GITHUB_API_BASE}{path}", params=params, timeout=15)
        if response.status_code == 404:
            raise GitHubNotFoundError('GitHub user or resource not found.')
        if response.status_code == 403 and response.headers.get('X-RateLimit-Remaining') == '0':
            reset_epoch = int(response.headers.get('X-RateLimit-Reset', '0'))
            reset_at = datetime.fromtimestamp(reset_epoch, tz=dt_timezone.utc)
            raise GitHubRateLimitError(reset_at=reset_at)
        if response.status_code >= 400:
            raise GitHubError(f'GitHub API error: {response.status_code}')
        return response

    def fetch_user(self, username):
        return self._request(f'/users/{username}').json()

    def fetch_repos(self, username):
        repos = []
        page = 1
        while page <= 3:
            payload = self._request(
                f'/users/{username}/repos',
                params={'per_page': 100, 'page': page, 'sort': 'updated', 'type': 'owner'},
            ).json()
            if not payload:
                break
            repos.extend(payload)
            if len(payload) < 100:
                break
            page += 1
        return repos

    def fetch_repo_languages(self, owner, repo):
        return self._request(f'/repos/{owner}/{repo}/languages').json()

    def fetch_commit_count_30d(self, owner, repo, default_branch):
        since = (timezone.now() - timedelta(days=30)).isoformat()
        response = self._request(
            f'/repos/{owner}/{repo}/commits',
            params={'sha': default_branch, 'since': since, 'per_page': 1},
        )
        link = response.headers.get('Link', '')
        if 'rel="last"' in link:
            match = re.search(r'&page=(\d+)>; rel="last"', link)
            if match:
                return int(match.group(1))
        commits = response.json()
        return len(commits)


def language_token(language):
    mapping = {
        'JavaScript': 'primary-cyan',
        'TypeScript': 'primary-blue',
        'Python': 'accent-lime',
        'Go': 'accent-amber',
        'Rust': 'text-100',
    }
    return mapping.get(language, 'text-300')


def build_world_payload(user, repos):
    total_stars = sum(repo.get('stargazers_count', 0) for repo in repos)
    total_forks = sum(repo.get('forks_count', 0) for repo in repos)
    total_watchers = sum(repo.get('watchers_count', 0) for repo in repos)

    language_counter = Counter()
    for repo in repos:
        primary_language = repo.get('language')
        if primary_language:
            language_counter[primary_language] += 1

    total_language_count = sum(language_counter.values()) or 1
    languages = [
        {
            'language': lang,
            'percent': round((count / total_language_count) * 100, 2),
            'color_token': language_token(lang),
        }
        for lang, count in language_counter.items()
    ]

    repo_payload = []
    for idx, repo in enumerate(repos):
        stars = repo.get('stargazers_count', 0)
        forks = repo.get('forks_count', 0)
        watchers = repo.get('watchers_count', 0)
        activity_score = round((stars * 1.7) + (forks * 1.3) + (watchers * 1.1), 2)
        angle = idx * 0.45
        radius = 8 + math.floor(idx / 8) * 4
        repo_payload.append(
            {
                'repo_id': repo['id'],
                'name': repo['name'],
                'full_name': repo['full_name'],
                'html_url': repo['html_url'],
                'description': repo.get('description') or '',
                'primary_language': repo.get('language') or '',
                'stars': stars,
                'forks': forks,
                'open_issues': repo.get('open_issues_count', 0),
                'watchers': watchers,
                'size_kb': repo.get('size', 0),
                'is_fork': repo.get('fork', False),
                'default_branch': repo.get('default_branch') or 'main',
                'last_activity_at': repo.get('pushed_at'),
                'activity_score': activity_score,
                'pos_x': round(math.cos(angle) * radius, 2),
                'pos_y': max(1.2, min(20.0, 1.2 + math.sqrt(stars + 1) * 2.1)),
                'pos_z': round(math.sin(angle) * radius, 2),
            }
        )

    payload_hash = hashlib.sha256(
        f"{user.get('id', '')}:{total_stars}:{len(repos)}:{user.get('followers', 0)}".encode('utf-8')
    ).hexdigest()

    totals = {
        'total_stars': total_stars,
        'total_forks': total_forks,
        'total_watchers': total_watchers,
        'repo_count': len(repos),
    }

    return {
        'source_hash': payload_hash,
        'totals': totals,
        'languages': languages,
        'repos': repo_payload,
    }
