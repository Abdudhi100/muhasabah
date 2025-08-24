"use client";

import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api";
import markNotificationAsRead from "@/lib/api"; // default import
import { clearTokens } from "@/lib/auth";
import { toast } from "sonner";
import { useState } from "react";

interface Notification {
  id: number;
  is_read: boolean;
  message: string;
}

interface NavbarProps {
  profile: {
    username: string;
    role: string;
  };
  notifications: {
    unread_count: number;
    notifications: Notification[];
  };
}

export default function NavBar({ profile, notifications }: NavbarProps) {
  const router = useRouter();
  const [unread, setUnread] = useState<number>(notifications.unread_count);

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearTokens();
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleBellClick = async () => {
  try {
    for (const n of notifications.notifications) {
      if (!n.is_read) await markNotificationAsRead(`${n.id}`);
    }
    setUnread(0);
  } catch {
    toast.error("Failed to update notifications");
  }
};

  return (
    <header className="flex items-center justify-between border-b px-6 py-3 bg-white shadow-sm">
      {/* Left - App Name */}
      <h1 className="font-bold text-lg">Muhasabah Dashboard</h1>

      {/* Right - User Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <span
          onClick={handleBellClick}
          className="relative cursor-pointer hover:text-blue-600"
          title="Notifications"
        >
          <Bell className="w-5 h-5" aria-label="Notifications" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unread}
            </span>
          )}
        </span>

        {/* Username */}
        <span className="text-sm font-medium">{profile.username}</span>

        {/* Logout */}
        <span
          onClick={handleLogout}
          className="cursor-pointer text-red-500 hover:text-red-700"
          title="Logout"
        >
          <LogOut className="w-5 h-5" aria-label="Logout" />
        </span>
      </div>
    </header>
  );
}
