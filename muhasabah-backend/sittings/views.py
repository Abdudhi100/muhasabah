from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Sitting, SittingMembership
from .serializers import SittingSerializer, SittingMembershipSerializer, SittingEvaluationSerializer, SittingEvaluation

class SittingViewSet(viewsets.ModelViewSet):
    queryset = Sitting.objects.all()
    serializer_class = SittingSerializer

class SittingMembershipViewSet(viewsets.ModelViewSet):
    queryset = SittingMembership.objects.all()
    serializer_class = SittingMembershipSerializer
# sittings/views.py

from rest_framework import viewsets
from .models import SittingMembership
from .serializers import SittingMembershipSerializer
from accounts.permissions import IsRole

class SittingMembershipViewSet(viewsets.ModelViewSet):
    queryset = SittingMembership.objects.all()
    serializer_class = SittingMembershipSerializer
    permission_classes = [IsRole]
    allowed_roles = ['sitting_head']

# sittings/views.py (continued)

class SittingEvaluationViewSet(viewsets.ModelViewSet):
    queryset = SittingEvaluation.objects.all()
    serializer_class = SittingEvaluationSerializer
    permission_classes = [IsRole]
    allowed_roles = ['overall_head']
