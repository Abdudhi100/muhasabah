from rest_framework import serializers
from .models import Sitting, SittingMembership, SittingEvaluation


# ──────────────────────────────────────────────────────────────
#                           Sitting Serializer
# ──────────────────────────────────────────────────────────────

class SittingSerializer(serializers.ModelSerializer):
    sitting_head = serializers.StringRelatedField(read_only=True)  # Show email/username of head

    class Meta:
        model = Sitting
        fields = '__all__'
        read_only_fields = ['id']


# ──────────────────────────────────────────────────────────────
#                     Sitting Membership Serializer
# ──────────────────────────────────────────────────────────────

class SittingMembershipSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField(read_only=True)
    sitting = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = SittingMembership
        fields = '__all__'
        read_only_fields = ['id', 'joined_at', 'status']  # Optional: let API control status update



class SittingEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SittingEvaluation
        fields = '__all__'