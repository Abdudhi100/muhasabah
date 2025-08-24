from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SWOTViewSet

# ─────────────── Router Registration ─────────────── #
router = DefaultRouter()
router.register(r'swot', SWOTViewSet, basename='swot')

# ─────────────── URL Patterns ─────────────── #
urlpatterns = [
    path('', include(router.urls)),
]
