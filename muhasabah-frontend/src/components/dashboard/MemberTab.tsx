// components/dashboard/MemberTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Todo = string;
type Comment = {
  id: number;
  author_name: string;
  text: string;
};

interface MemberTabProps {
  data: {
    todos_today: Todo[];
    progress_percent: number;
    streak_count: number;
    recent_comments: Comment[];
  };
}

export default function MemberTab({ data }: MemberTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Today's Todos */}
      <Card>
        <CardHeader>
          <CardTitle>Today To-Dos</CardTitle>
        </CardHeader>
        <CardContent>
          {data.todos_today.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {data.todos_today.map((todo, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {todo}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No tasks for today</p>
          )}
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-blue-600">
            {data.progress_percent.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            Streak: <span className="font-medium">{data.streak_count}</span> days
          </p>
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recent_comments.length > 0 ? (
            <ul className="space-y-2">
              {data.recent_comments.map((comment) => (
                <li key={comment.id} className="border-b border-gray-200 pb-2">
                  <p className="text-sm">
                    <strong className="text-gray-800">{comment.author_name}:</strong>{" "}
                    <span className="text-gray-700">{comment.text}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No recent comments</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
