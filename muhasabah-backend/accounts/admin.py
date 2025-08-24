from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'role', 'is_verified', 'streak', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
