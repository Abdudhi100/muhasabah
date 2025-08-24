# accounts/views.py
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_205_RESET_CONTENT
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
)

import datetime

# -------------------------------------------------------------------------------
# USER MANAGEMENT (Admin / Profile)
# -------------------------------------------------------------------------------

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class UserPermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    PERMISSIONS_MAP = {
        "student": ["dashboard.view", "checkins.submit", "todos.view"],
        "sitting_head": ["dashboard.view", "sittings.manage_members", "checkins.review"],
        "overall_head": ["dashboard.view", "sittings.manage_all", "system.admin"],
    }

    def get(self, request):
        role = getattr(request.user, "role", "student")
        permissions = self.PERMISSIONS_MAP.get(role, [])
        return Response({"role": role, "permissions": permissions})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        "id": request.user.id,
        "email": request.user.email,
        "username": request.user.username,
        "role": request.user.role,
    })


# -------------------------------------------------------------------------------
# REGISTRATION & EMAIL VERIFICATION
# -------------------------------------------------------------------------------

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"

        send_mail(
            subject="Verify your email - Muhasabah App",
            message=f"Click this link to verify your email: {activation_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )


class VerifyEmailView(APIView):
    def get(self, request, uid, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response({"error": "Invalid link."}, status=HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.is_verified = True
            user.is_active = True
            user.save()
            return Response({"message": "Email successfully verified!"}, status=HTTP_200_OK)

        return Response({"error": "Invalid or expired token."}, status=HTTP_400_BAD_REQUEST)


class ResendVerificationEmailView(generics.GenericAPIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()

        if user and not user.is_verified:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"

            send_mail(
                subject="Resend Email Verification",
                message=f"Assalaam alaykum {user.username},\n\nVerify your email: {verification_link}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=True,
            )

        return Response({
            "detail": "If the email exists and is not verified, a new link has been sent."
        })


# -------------------------------------------------------------------------------
# PASSWORD RESET
# -------------------------------------------------------------------------------

class PasswordResetRequestView(generics.GenericAPIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password-confirm/{uid}/{token}/"

            send_mail(
                subject="Reset Your Password",
                message=f"Click the link below to reset your password:\n{reset_link}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=True,
            )

        return Response({
            "detail": "If this email exists, a reset link has been sent."
        })


class PasswordResetConfirmView(generics.GenericAPIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if not default_token_generator.check_token(user, token):
                return Response({"detail": "Invalid or expired token."}, status=HTTP_400_BAD_REQUEST)

            password = request.data.get("password")
            user.password = make_password(password)
            user.save()

            return Response({"detail": "Password reset successful."})

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid request."}, status=HTTP_400_BAD_REQUEST)


# -------------------------------------------------------------------------------
# AUTHENTICATION (JWT with Cookies)
# -------------------------------------------------------------------------------

class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data.pop("remember", None)
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": str(e)}, status=HTTP_400_BAD_REQUEST)

        response = Response({"detail": "Login successful"})
        access_token = serializer.validated_data.get("access")
        refresh_token = serializer.validated_data.get("refresh")

        access_exp = datetime.datetime.utcnow() + settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
        refresh_exp = datetime.datetime.utcnow() + settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]

        response.set_cookie(
            key=settings.SIMPLE_JWT.get("AUTH_COOKIE", "access_token"),
            value=access_token,
            expires=access_exp,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Strict",
        )
        response.set_cookie(
            key=settings.SIMPLE_JWT.get("AUTH_COOKIE_REFRESH", "refresh_token"),
            value=refresh_token,
            expires=refresh_exp,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Strict",
        )

        return response


# -------------------------------------------------------------------------------
# LOGOUT
# -------------------------------------------------------------------------------

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=HTTP_400_BAD_REQUEST)
