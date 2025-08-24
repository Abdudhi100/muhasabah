from django.contrib import admin
from django.urls import path, include

# Optional: Swagger / OpenAPI
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(title="Muhasabah API", default_version='v1'),
    public=True,
)

urlpatterns = [
    # 🔐 Admin Panel
    path('admin/', admin.site.urls),

    # 🧠 Core Business Apps
    path('api/accounts/', include('accounts.urls')),
    path('api/sittings/', include('sittings.urls')),
    path('api/todos/', include('todos.urls')),
    path('api/checkins/', include('checkins.urls')),
    path('api/swot/', include('swot.urls')),
    path('api/navigation/', include('navigation.urls')),
    path('api/notification/', include('notification.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/comments/', include('comments.urls')),


    # 🌐 Social Auth via Google (Allauth)
    path('api/accounts/social/', include('allauth.socialaccount.urls')),

    # 🧾 Swagger Documentation (Optional in dev only)
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
]
