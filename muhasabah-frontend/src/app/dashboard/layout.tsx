"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProfile, getNotifications, getMenu } from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Profile, Notifications } from "@/types/user";
import type { MenuItem } from "@/types/sidebar";

export interface MemberData {
  id: string;
  name: string;
  menu: MenuItem[];
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [notifications, setNotifications] = useState<Notifications>({
    unread_count: 0,
    notifications: [],
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileData, menuData, notifData] = await Promise.all([
          getProfile(),
          getMenu(),
          getNotifications(),
        ]);

        setProfile(profileData);
        setMenu(menuData);
        setNotifications(notifData);

        if (pathname === "/dashboard") {
          switch (profileData.role) {
            case "student":
              router.replace("/dashboard/student");
              break;
            case "sitting_head":
              router.replace("/dashboard/head");
              break;
            case "overall_head":
              router.replace("/dashboard/overall_head");
              break;
            default:
              router.replace("/");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pathname, router]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar menu={menu} />
      <div className="flex flex-col flex-1">
        {profile && <Navbar profile={profile} notifications={notifications} />}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
