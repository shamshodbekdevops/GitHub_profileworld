from django.urls import path

from .views import GenerateWorldView, WorldDetailView, WorldShareView

urlpatterns = [
    path('world/generate', GenerateWorldView.as_view(), name='world-generate'),
    path('world/<uuid:world_id>', WorldDetailView.as_view(), name='world-detail'),
    path('world/<uuid:world_id>/share', WorldShareView.as_view(), name='world-share'),
]
