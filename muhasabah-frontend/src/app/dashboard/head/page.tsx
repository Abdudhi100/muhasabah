// app/dashboard/head/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/lib/api";
import SittingHeadTab from "@/components/dashboard/SittingHeadTab";
import { useAuth } from "@/context/AuthContext"; // for role-based access
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SittingHeadData } from "@/types/dashboard"; // assuming you have this type defined

export default function HeadDashboardPage() {
  const { user } = useAuth(); // context with user data and role
  const [data, setData] = useState<SittingHeadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Protect route so only sitting_head can view it
  useEffect(() => {
    if (user && user.role !== "sitting_head") {
      setError("You do not have permission to view this dashboard.");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "sitting_head") return;

    const loadData = async () => {
      try {
        const res = await getDashboardSummary();
        setData(res?.sitting_head_data || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Loading dashboard...
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  // 📊 Dashboard content
  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500">
        No data available for your sittings.
      </div>
    );
  }
return (
  <SittingHeadTab
    data={{
      member_progress: data.member_progress.map(mp => ({
        member: mp.member,
        progress_percent: mp.progress_percent, // 👈 camel → snake
      })),
      pending_requests: data.pending_requests.map(pr => ({
        id: pr.id,
        member_name: pr.member_name, // 👈 camel → snake
      })),
    }}
  />
);
}
