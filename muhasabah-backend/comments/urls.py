from django.urls import path
from .views import RecentCommentsView, CreateCommentView

urlpatterns = [
    path('recent/', RecentCommentsView.as_view(), name='recent_comments'),
    path('create/', CreateCommentView.as_view(), name='create_comment'),
]
