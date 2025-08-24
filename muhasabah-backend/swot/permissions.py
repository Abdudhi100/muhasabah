# swot/permissions.py
from rest_framework.permissions import BasePermission

class IsRole(BasePermission):
    """
    Custom permission to grant access only to users whose role
    is listed in the view's allowed_roles attribute.
    """

    message = "You do not have permission to perform this action."

    def has_permission(self, request, view):
        allowed_roles = getattr(view, 'allowed_roles', None)

        # If no restriction is set, allow
        if not allowed_roles:
            return True

        # Ensure user is authenticated and role is allowed
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) in allowed_roles
        )
