// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberTab from "@/components/dashboard/MemberTab";
import { MemberData } from "@/types/dashboard";
import SittingHeadTab from "@/components/dashboard/SittingHeadTab";
import { SittingHeadData } from "@/types/dashboard";
import OverallHeadTab from "@/components/dashboard/OverallHeadTab";
import { OverallHeadTabData } from "@/types/dashboard";
import { getDashboardSummary } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// ✅ Use explicit types instead of `any`
interface DashboardSummary {
  member_data?: MemberData;
  sitting_head_data?: SittingHeadData;
  overall_head_data?: OverallHeadTabData;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getDashboardSummary();
        setData(res);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-500">
        Error loading dashboard.
        <button
          onClick={() => window.location.reload()}
          className="ml-3 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <Tabs defaultValue="member">
        <TabsList className="mb-4 flex flex-wrap gap-2">
          {data.member_data && <TabsTrigger value="member">Student</TabsTrigger>}
          {data.sitting_head_data && (
            <TabsTrigger value="sitting_head">Sitting Head</TabsTrigger>
          )}
          {data.overall_head_data && (
            <TabsTrigger value="overall_head">Overall Head</TabsTrigger>
          )}
        </TabsList>

        {data.member_data && (
          <TabsContent value="member">
            <MemberTab data={data.member_data} />
          </TabsContent>
        )}

        {data.sitting_head_data && (
          <TabsContent value="sitting_head">
            <SittingHeadTab data={data.sitting_head_data} />
          </TabsContent>
        )}

        {data.overall_head_data && (
          <TabsContent value="overall_head">
            <OverallHeadTab data={data.overall_head_data} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
