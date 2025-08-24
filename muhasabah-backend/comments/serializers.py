from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author", "author_name", "recipient", "text", "created_at", "sitting", "todo_item", "checkin"]
        read_only_fields = ["id", "author", "author_name", "created_at"]
