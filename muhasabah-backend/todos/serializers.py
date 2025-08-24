from rest_framework import serializers
from .models import DefaultToDo, PersonalToDo


# ──────────────────────────────────────────────────────────────
#                   DEFAULT TODO SERIALIZER
# ──────────────────────────────────────────────────────────────

class DefaultToDoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultToDo
        fields = '__all__'
        read_only_fields = ['id']  # Optionally lock down for safety


# ──────────────────────────────────────────────────────────────
#                   PERSONAL TODO SERIALIZER
# ──────────────────────────────────────────────────────────────

class PersonalToDoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalToDo
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        """
        Automatically assign the user from the request context.
        """
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
