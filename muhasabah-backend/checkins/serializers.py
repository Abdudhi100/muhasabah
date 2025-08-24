from rest_framework import serializers
from .models import DailyCheckIn


class DailyCheckInSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')  # or 'user.email' if preferred
    created_at = serializers.ReadOnlyField()
    updated_at = serializers.ReadOnlyField()

    class Meta:
        model = DailyCheckIn
        fields = [
            'id',
            'user',
            'date',
            'todo_item',
            'is_completed',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
