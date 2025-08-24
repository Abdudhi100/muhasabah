// components/dashboard/SittingHeadTab.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MemberProgress {
  member: string;
  progress_percent: number;
}

interface JoinRequest {
  id: number;
  member_name: string;
}

interface SittingHeadTabProps {
  data: {
    member_progress: MemberProgress[];
    pending_requests: JoinRequest[];
  };
}

export default function SittingHeadTab({ data }: SittingHeadTabProps) {
  const [evaluationNotes, setEvaluationNotes] = useState("");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Member Progress Table */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Member Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {data.member_progress.length > 0 ? (
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3">Member</th>
                  <th className="text-left py-2 px-3">Progress %</th>
                </tr>
              </thead>
              <tbody>
                {data.member_progress.map((mp, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-3">{mp.member}</td>
                    <td className="py-2 px-3">{mp.progress_percent.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No member progress data available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pending Join Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Join Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {data.pending_requests.length > 0 ? (
            <ul className="space-y-2">
              {data.pending_requests.map((req) => (
                <li
                  key={req.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="text-sm">{req.member_name}</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 p-0 h-auto"
                  >
                    Approve
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No pending requests.</p>
          )}
        </CardContent>
      </Card>

      {/* Weekly Evaluation */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={evaluationNotes}
            onChange={(e) => setEvaluationNotes(e.target.value)}
            className="w-full border rounded p-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter evaluation notes..."
            rows={4}
          />
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
