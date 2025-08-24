// components/dashboard/OverallHeadTab.tsx
"use client";
import { OverallHeadTabData, Sitting } from "@/types/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OverallHeadTabProps {
  data: OverallHeadTabData;
}

export default function OverallHeadTab({ data }: OverallHeadTabProps) {
  // =============================
  // HANDLERS
  // =============================
  const handleExportCSV = () => {
    // Placeholder: You can wire this to backend CSV export
    alert("Export CSV functionality not yet implemented.");
  };

  // =============================
  // RENDER HELPERS
  // =============================
  const renderSittingList = (sittings: Sitting[], emptyMsg: string) => {
    return sittings.length > 0 ? (
      <ul className="divide-y divide-gray-200">
        {sittings.map((sit) => (
          <li key={sit.id} className="py-2 text-sm">
            <span className="font-medium">{sit.name ?? "Unnamed Sitting"}</span> –{" "}
            {sit.progress !== undefined ? sit.progress.toFixed(1) + "%" : "N/A"}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm">{emptyMsg}</p>
    );
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Summary Across Sittings */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Summary Across Sittings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Total Sittings: {data.total_sittings}</p>
          <p className="text-sm">
            Average Progress: {data.average_progress.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* Top Performing Sittings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Top Performing Sittings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderSittingList(data.top_sittings, "No top sitting data available")}
        </CardContent>
      </Card>

      {/* Bottom Performing Sittings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Bottom Performing Sittings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderSittingList(
            data.bottom_sittings,
            "No bottom sitting data available"
          )}
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Export CSV
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
