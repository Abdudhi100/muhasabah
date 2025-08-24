from django.contrib import admin

# Register your models here.
# navigation/admin.py
from django.contrib import admin
from .models import MenuItem

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('title','role','path','order','visible')
    list_filter = ('role','visible')
    ordering = ('role','order')
