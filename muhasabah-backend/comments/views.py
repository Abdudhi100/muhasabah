from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer

class RecentCommentsView(generics.ListAPIView):
    """
    Returns the 5 most recent comments for the logged-in user.
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(recipient=self.request.user).select_related("author")[:5]


class CreateCommentView(generics.CreateAPIView):
    """
    Allows logged-in users to send comments to another user.
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
