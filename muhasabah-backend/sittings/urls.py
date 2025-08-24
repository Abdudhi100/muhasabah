from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SittingViewSet,
    SittingMembershipViewSet,
    SittingEvaluationViewSet,
)

# ─────────────── Router Registration ─────────────── #
router = DefaultRouter()
router.register(r'sittings', SittingViewSet, basename='sitting')
router.register(r'memberships', SittingMembershipViewSet, basename='sitting-membership')
router.register(r'evaluations', SittingEvaluationViewSet, basename='sitting-evaluation')

# ─────────────── URL Patterns ─────────────── #
urlpatterns = [
    path('', include(router.urls)),
]
