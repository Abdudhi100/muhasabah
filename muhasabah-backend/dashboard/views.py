# dashboard/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from datetime import date, timedelta

from accounts.models import User
from sittings.models import Sitting, SittingMembership
from checkins.models import DailyCheckIn
from comments.models import Comment

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()

        # --- Common: Member To-Dos, Progress, Streak ---
        todos_today = DailyCheckIn.objects.filter(user=user, date=today)
        total_todos = todos_today.count()
        completed_todos = todos_today.filter(is_completed=True).count()
        progress_percent = (completed_todos / total_todos * 100) if total_todos else 0

        # Calculate streak
        streak_count = 0
        for offset in range(0, 30):
            day = today - timedelta(days=offset)
            checkins_for_day = DailyCheckIn.objects.filter(user=user, date=day)
            if checkins_for_day.exists() and checkins_for_day.filter(is_completed=True).count() == checkins_for_day.count():
                streak_count += 1
            else:
                break

        recent_comments = Comment.objects.filter(user=user).order_by('-created_at')[:5]
        recent_comments_data = [
            {"author": c.author.username, "text": c.text, "created_at": c.created_at} for c in recent_comments
        ]

        data = {
            "member_data": {
                "todos_today": [
                    {"id": t.id, "todo_item": t.todo_item, "is_completed": t.is_completed}
                    for t in todos_today
                ],
                "progress_percent": round(progress_percent, 1),
                "streak_count": streak_count,
                "recent_comments": recent_comments_data,
            }
        }

        # --- Sitting Head Specific Data ---
        if user.role == "sitting_head" or user.role == "admin" or user.role == "overall_head":
            sitting_ids = SittingMembership.objects.filter(user=user).values_list("sitting_id", flat=True)
            member_progress = []
            for sitting_id in sitting_ids:
                members = SittingMembership.objects.filter(sitting_id=sitting_id).values_list("user_id", flat=True)
                for m_id in members:
                    m_user = User.objects.get(id=m_id)
                    todos = DailyCheckIn.objects.filter(user=m_user, date=today)
                    total = todos.count()
                    completed = todos.filter(is_completed=True).count()
                    progress = (completed / total * 100) if total else 0
                    member_progress.append({"member": m_user.username, "progress_percent": progress})

            pending_requests = []  # Replace with real join request model if available

            data["sitting_head_data"] = {
                "member_progress": member_progress,
                "pending_requests": pending_requests,
            }

        # --- Overall Head Specific Data ---
        if user.role == "overall_head" or user.role == "admin":
            sittings = Sitting.objects.all()
            total_sittings = sittings.count()
            avg_progress = 0

            if total_sittings > 0:
                total_progress_sum = 0
                total_members = 0
                for sitting in sittings:
                    members = SittingMembership.objects.filter(sitting=sitting).values_list("user_id", flat=True)
                    for m_id in members:
                        m_user = User.objects.get(id=m_id)
                        todos = DailyCheckIn.objects.filter(user=m_user, date=today)
                        total = todos.count()
                        completed = todos.filter(is_completed=True).count()
                        progress = (completed / total * 100) if total else 0
                        total_progress_sum += progress
                        total_members += 1
                avg_progress = total_progress_sum / total_members if total_members else 0

            top_sittings = []
            bottom_sittings = []
            # This can be computed from above loop, but keeping it simple for now
            for sitting in sittings:
                members = SittingMembership.objects.filter(sitting=sitting).values_list("user_id", flat=True)
                total_progress_sum = 0
                count_members = 0
                for m_id in members:
                    m_user = User.objects.get(id=m_id)
                    todos = DailyCheckIn.objects.filter(user=m_user, date=today)
                    total = todos.count()
                    completed = todos.filter(is_completed=True).count()
                    progress = (completed / total * 100) if total else 0
                    total_progress_sum += progress
                    count_members += 1
                sitting_progress = total_progress_sum / count_members if count_members else 0
                top_sittings.append({"id": sitting.id, "name": sitting.name, "progress": sitting_progress})
                bottom_sittings.append({"id": sitting.id, "name": sitting.name, "progress": sitting_progress})

            # Sorting
            top_sittings = sorted(top_sittings, key=lambda x: x["progress"], reverse=True)[:5]
            bottom_sittings = sorted(bottom_sittings, key=lambda x: x["progress"])[:5]

            data["overall_head_data"] = {
                "total_sittings": total_sittings,
                "average_progress": round(avg_progress, 1),
                "top_sittings": top_sittings,
                "bottom_sittings": bottom_sittings,
            }

        # --- Admin Specific Data ---
        if user.role == "admin":
            checkins_this_week = DailyCheckIn.objects.filter(
                date__gte=today - timedelta(days=7)
            ).count()

            data["admin_data"] = {
                "total_users": User.objects.count(),
                "total_sittings": Sitting.objects.count(),
                "checkins_this_week": checkins_this_week,
                "pending_requests": len(data.get("sitting_head_data", {}).get("pending_requests", [])),
            }

        return Response(data)
