from rest_framework import serializers
from .models import SWOT


class SWOTSerializer(serializers.ModelSerializer):
    """
    Serializer for the SWOT model.
    Allows users to create and update their SWOT.
    Automatically assigns the user during creation.
    """
    class Meta:
        model = SWOT
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        """
        On creation, assign the current user from the request context.
        """
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Allow users to update strengths, weaknesses, opportunities, and threats.
        """
        instance.strengths = validated_data.get('strengths', instance.strengths)
        instance.weaknesses = validated_data.get('weaknesses', instance.weaknesses)
        instance.opportunities = validated_data.get('opportunities', instance.opportunities)
        instance.threats = validated_data.get('threats', instance.threats)
        instance.save()
        return instance
