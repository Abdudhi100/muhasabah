"use client";

import { Trash2, Edit, CheckCircle2 } from "lucide-react";
import { deleteTodo } from "@/lib/api";
import { toast } from "sonner";
import { Todo } from "@/types/todo";

export interface TodoTableProps {
  todos: Todo[];
  onEdit?: (todo: Todo) => void;
  onDeleted?: (id: number) => void;
  onToggleComplete?: (todo: Todo) => void;
}

export default function TodoTable({
  todos,
  onEdit,
  onDeleted,
  onToggleComplete,
}: TodoTableProps) {
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this todo? This action cannot be undone.")) return;
    try {
      await deleteTodo(id);
      toast.success("Todo deleted");
      onDeleted?.(id); // ✅ safe call
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const apiErr = err as { response?: { data?: { detail?: string } } };
        toast.error(apiErr.response?.data?.detail || "Delete failed");
      } else {
        toast.error("Delete failed");
      }
      console.error(err);
    }
  };

  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full divide-y text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Title</th>
            <th className="px-4 py-2 text-left font-medium">Due Date</th>
            <th className="px-4 py-2 text-left font-medium">Completed</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y">
          {todos.map((todo) => (
            <tr
              key={todo.id}
              className={todo.completed ? "bg-green-50" : ""}
            >
              {/* Title */}
              <td className="px-4 py-2">{todo.title}</td>

              {/* Due Date */}
              <td className="px-4 py-2">
                {todo.due_date || <span className="text-gray-400">—</span>}
              </td>

              {/* Completed */}
              <td className="px-4 py-2">
                {todo.completed ? "✅" : "❌"}
              </td>

              {/* Actions */}
              <td className="px-4 py-2 text-right space-x-2">
                {/* Toggle Complete */}
                <button
                  onClick={() => onToggleComplete?.(todo)} // ✅ safe call
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                  title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  aria-label="Toggle completion status"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Edit */}
                <button
                  onClick={() => onEdit?.(todo)} // ✅ safe call
                  className="p-1.5 hover:bg-gray-100 rounded"
                  title="Edit todo"
                  aria-label="Edit todo"
                >
                  <Edit className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Delete todo"
                  aria-label="Delete todo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}

          {/* Empty State */}
          {todos.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="text-center py-8 text-gray-500 text-sm"
              >
                No todos found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
