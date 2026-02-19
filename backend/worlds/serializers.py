from rest_framework import serializers

from .models import LanguageStats, RenderConfig, RepoSnapshot, ShareToken, World


class GenerateWorldInputSerializer(serializers.Serializer):
    github_url = serializers.URLField(required=False)
    username = serializers.CharField(required=False, max_length=255)

    def validate(self, attrs):
        if not attrs.get('github_url') and not attrs.get('username'):
            raise serializers.ValidationError('Provide either github_url or username.')
        return attrs


class RepoSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepoSnapshot
        fields = [
            'repo_id',
            'name',
            'full_name',
            'html_url',
            'description',
            'primary_language',
            'language_breakdown',
            'stars',
            'forks',
            'open_issues',
            'watchers',
            'size_kb',
            'commits_30d',
            'activity_score',
            'last_activity_at',
            'is_fork',
            'pos_x',
            'pos_y',
            'pos_z',
        ]


class LanguageStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageStats
        fields = ['language', 'percent', 'color_token']


class RenderConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = RenderConfig
        fields = ['seed', 'layout_version', 'density_level', 'lighting_profile', 'enable_particles']


class WorldSerializer(serializers.ModelSerializer):
    repos = RepoSnapshotSerializer(many=True, read_only=True)
    languages = LanguageStatsSerializer(many=True, read_only=True)
    render_config = RenderConfigSerializer(read_only=True)

    class Meta:
        model = World
        fields = [
            'id',
            'username',
            'github_url',
            'avatar_url',
            'followers',
            'following',
            'public_repos',
            'totals',
            'generation_status',
            'generated_at',
            'updated_at',
            'expires_at',
            'repos',
            'languages',
            'render_config',
        ]


class ShareSerializer(serializers.ModelSerializer):
    repos = RepoSnapshotSerializer(many=True, read_only=True)
    languages = LanguageStatsSerializer(many=True, read_only=True)
    render_config = RenderConfigSerializer(read_only=True)
    share_token = serializers.SerializerMethodField()

    class Meta:
        model = World
        fields = [
            'id',
            'username',
            'avatar_url',
            'followers',
            'following',
            'public_repos',
            'totals',
            'generated_at',
            'repos',
            'languages',
            'render_config',
            'share_token',
        ]

    def get_share_token(self, obj):
        token = getattr(obj, 'share_token', None)
        if isinstance(token, ShareToken):
            return token.token
        return None
