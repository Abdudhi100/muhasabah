"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { getNotifications } from "@/lib/api";
import markNotificationAsRead from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: number;
  title?: string;
  message: string;
  is_read: boolean;
}

interface NotificationsResponse {
  unread_count: number;
  notifications: Notification[];
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data: NotificationsResponse = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      // Make sure ID is passed in the URL string, not as a number
      await markNotificationAsRead(`${id}`);
      await loadNotifications(); // refresh after marking as read
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative p-2 hover:bg-gray-100 rounded-full">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">
            {unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72">
        {loading ? (
          <DropdownMenuItem className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem>No notifications</DropdownMenuItem>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`cursor-pointer ${!n.is_read ? "font-bold" : ""}`}
            >
              {n.title && <span className="font-semibold">{n.title} - </span>}
              {n.message}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
