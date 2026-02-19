from django.contrib import admin

from .models import LanguageStats, RenderConfig, RepoSnapshot, ShareToken, World

admin.site.register(World)
admin.site.register(RepoSnapshot)
admin.site.register(LanguageStats)
admin.site.register(RenderConfig)
admin.site.register(ShareToken)
