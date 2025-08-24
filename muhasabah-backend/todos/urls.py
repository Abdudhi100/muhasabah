from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DefaultToDoViewSet, PersonalToDoViewSet

# ─────────────── Router Registration ─────────────── #
router = DefaultRouter()
router.register(r'defaults', DefaultToDoViewSet, basename='default-todo')
router.register(r'personals', PersonalToDoViewSet, basename='personal-todo')

# ─────────────── URL Patterns ─────────────── #
urlpatterns = [
    path('', include(router.urls)),
]
