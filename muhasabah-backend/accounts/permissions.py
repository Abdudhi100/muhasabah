from rest_framework import permissions


class IsRole(permissions.BasePermission):
    """
    Custom permission to allow access only to users with specific roles.

    Usage:
        In your ViewSet:
        permission_classes = [IsRole]
        allowed_roles = ['student', 'sitting_head']
    """

    def has_permission(self, request, view):
        # Check if view defines which roles are allowed
        allowed_roles = getattr(view, 'allowed_roles', None)

        # If no roles are specified, allow access (acts like no restriction)
        if allowed_roles is None:
            return True

        # Allow only authenticated users with matching roles
        return (
            request.user.is_authenticated and
            request.user.role in allowed_roles
        )
{
  "menu": [
    { "label": "Dashboard", "icon": "LayoutDashboard", "path": "/dashboard", "roles": ["student", "sitting_head", "overall_head", "admin"] },
    { "label": "Sittings", "icon": "Users", "path": "/sittings", "roles": ["sitting_head", "overall_head", "admin"] },
    { "label": "Check-ins", "icon": "CheckSquare", "path": "/checkins", "roles": ["student", "sitting_head"] },
    { "label": "SWOT", "icon": "ClipboardList", "path": "/swot", "roles": ["overall_head", "admin"] },
    { "label": "Admin Panel", "icon": "Shield", "path": "/admin", "roles": ["admin"] }
  ]
}
