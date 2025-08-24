// app/dashboard/student/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/lib/api";
import MemberTab from "@/components/dashboard/MemberTab";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MemberData } from "@/types/dashboard";

export default function StudentDashboard() {
  const [data, setData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getDashboardSummary();
        setData(res.member_data ?? null);
 // ✅ no casting
      } catch (error) {
        console.error("Failed to load student dashboard:", error);
        toast.error("Failed to load student dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading Student Dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 text-red-500">
        <p>Error loading student dashboard data.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      <MemberTab data={data} />
    </section>
  );
}
