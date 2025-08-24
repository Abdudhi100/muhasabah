// components/dashboard/AdminTab.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AdminTabData {
  total_users: number;
  total_sittings: number;
  checkins_this_week: number;
  pending_requests: number;
}

interface AdminTabProps {
  data: AdminTabData;
}

export default function AdminTab({ data }: AdminTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Users: {data.total_users}</p>
          <button className="bg-green-600 text-white px-3 py-1 rounded">
            Add User
          </button>
        </CardContent>
      </Card>

      {/* Sitting Management */}
      <Card>
        <CardHeader>
          <CardTitle>Sitting Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Sittings: {data.total_sittings}</p>
          <button className="bg-green-600 text-white px-3 py-1 rounded">
            Add Sitting
          </button>
        </CardContent>
      </Card>

      {/* System Statistics */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>System Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Check-ins this week: {data.checkins_this_week}</p>
          <p>Pending requests: {data.pending_requests}</p>
        </CardContent>
      </Card>
    </div>
  );
}
