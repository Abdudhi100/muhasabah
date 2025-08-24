from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyCheckInViewSet

# Router setup for check-in endpoints
router = DefaultRouter()
router.register(r'checkins', DailyCheckInViewSet, basename='daily-checkin')

urlpatterns = [
    path('', include(router.urls)),
]
