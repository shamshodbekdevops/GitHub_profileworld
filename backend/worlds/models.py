import secrets
import uuid

from django.db import models
from django.utils import timezone


class World(models.Model):
    STATUS_PROCESSING = 'processing'
    STATUS_READY = 'ready'
    STATUS_FAILED = 'failed'
    STATUS_CHOICES = [
        (STATUS_PROCESSING, 'Processing'),
        (STATUS_READY, 'Ready'),
        (STATUS_FAILED, 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, db_index=True)
    github_url = models.URLField(blank=True)
    avatar_url = models.URLField(blank=True)
    followers = models.PositiveIntegerField(default=0)
    following = models.PositiveIntegerField(default=0)
    public_repos = models.PositiveIntegerField(default=0)
    totals = models.JSONField(default=dict, blank=True)
    generation_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PROCESSING)
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(db_index=True)
    source_hash = models.CharField(max_length=64, blank=True)
    error_message = models.TextField(blank=True)

    class Meta:
        ordering = ['-generated_at']
        indexes = [
            models.Index(fields=['username', 'generated_at']),
            models.Index(fields=['generation_status']),
        ]

    def __str__(self) -> str:
        return f"World<{self.username}:{self.id}>"


class RepoSnapshot(models.Model):
    world = models.ForeignKey(World, on_delete=models.CASCADE, related_name='repos')
    repo_id = models.BigIntegerField()
    name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    html_url = models.URLField()
    description = models.TextField(blank=True)
    primary_language = models.CharField(max_length=100, blank=True)
    language_breakdown = models.JSONField(default=dict, blank=True)
    stars = models.PositiveIntegerField(default=0)
    forks = models.PositiveIntegerField(default=0)
    open_issues = models.PositiveIntegerField(default=0)
    watchers = models.PositiveIntegerField(default=0)
    size_kb = models.PositiveIntegerField(default=0)
    commits_30d = models.PositiveIntegerField(default=0)
    activity_score = models.FloatField(default=0)
    last_activity_at = models.DateTimeField(null=True, blank=True)
    is_fork = models.BooleanField(default=False)
    pos_x = models.FloatField(default=0)
    pos_y = models.FloatField(default=0)
    pos_z = models.FloatField(default=0)

    class Meta:
        ordering = ['-activity_score', '-stars']
        indexes = [
            models.Index(fields=['primary_language']),
            models.Index(fields=['stars']),
        ]

    def __str__(self) -> str:
        return f"Repo<{self.full_name}>"


class LanguageStats(models.Model):
    world = models.ForeignKey(World, on_delete=models.CASCADE, related_name='languages')
    language = models.CharField(max_length=100)
    percent = models.FloatField(default=0)
    color_token = models.CharField(max_length=20, default='primary-blue')

    class Meta:
        ordering = ['-percent']
        unique_together = ('world', 'language')


class RenderConfig(models.Model):
    world = models.OneToOneField(World, on_delete=models.CASCADE, related_name='render_config')
    seed = models.PositiveIntegerField(default=1)
    layout_version = models.CharField(max_length=20, default='v1')
    density_level = models.FloatField(default=1.0)
    lighting_profile = models.CharField(max_length=50, default='neo_city')
    enable_particles = models.BooleanField(default=True)


class ShareToken(models.Model):
    world = models.OneToOneField(World, on_delete=models.CASCADE, related_name='share_token')
    token = models.CharField(max_length=32, unique=True, db_index=True)
    is_public = models.BooleanField(default=True)
    poster_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    @staticmethod
    def make_token() -> str:
        return secrets.token_urlsafe(16)

    def is_valid(self) -> bool:
        return self.is_public and (self.expires_at is None or self.expires_at > timezone.now())
