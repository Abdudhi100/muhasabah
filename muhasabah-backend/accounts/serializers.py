# accounts/serializers.py
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


# ------------------------------------------------------------------------------
# USER SERIALIZERS
# ------------------------------------------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "role", "location", "whatsapp", "is_verified"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "role", "location", "whatsapp"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            role=validated_data.get("role", "student"),
            location=validated_data.get("location"),
            whatsapp=validated_data.get("whatsapp"),
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "role", "location", "whatsapp", "is_verified"]


# ------------------------------------------------------------------------------
# CUSTOM LOGIN SERIALIZER (EMAIL OR USERNAME)
# ------------------------------------------------------------------------------

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer that allows login with either email OR username.
    """

    def validate(self, attrs):
        login = attrs.get("username")  # could be username OR email
        password = attrs.get("password")

        # Try username first, then email
        user = None
        if login and password:
            user = authenticate(self.context["request"], username=login, password=password)

            if not user:
                try:
                    user_obj = User.objects.get(email__iexact=login)
                    user = authenticate(self.context["request"], username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass

        if not user:
            raise serializers.ValidationError({"detail": _("Invalid credentials. Please try again.")})

        if not user.is_active:
            raise serializers.ValidationError({"detail": _("User account is disabled.")})

        if not user.is_verified:
            raise serializers.ValidationError({"detail": _("Please verify your email before logging in.")})

        # At this point, user is authenticated
        attrs["username"] = user.username  # normalize so JWT uses username
        data = super().validate(attrs)

        # Add extra user info to the response
        data["user"] = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "role": user.role,
        }
        return data

class LoginSerializer(serializers.Serializer):
    """
    Serializer for login requests.
    """
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )