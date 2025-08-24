"use client";

import { useEffect, useState } from "react";
import { getOverallHeadSummary } from "@/lib/api";
import OverallHeadTab from "@/components/dashboard/OverallHeadTab";
import { OverallHeadTabData } from "@/types/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OverallHeadDashboard() {
  const [data, setData] = useState<OverallHeadTabData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getOverallHeadSummary(); // ✅ already mapped + safe
        setData(data);
      } catch (error) {
        console.error("Failed to load overall head dashboard:", error);
        toast.error("Failed to load dashboard data");
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
        Loading Overall Head Dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 text-red-500">
        <p>Error loading dashboard data.</p>
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
      <h1 className="text-2xl font-bold mb-6">Overall Head Dashboard</h1>
      <OverallHeadTab data={data} />
    </section>
  );
}
