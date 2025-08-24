"use client";

import { Trash2, Edit, CheckCircle2 } from "lucide-react";
import { deleteCheckin } from "@/lib/api";
import { toast } from "sonner";
import type { Checkin } from "@/types/checkin"; // ✅ import Checkin

interface CheckInTableProps {
  checkins: Checkin[];
  onEdit?: (checkin: Checkin) => void;
  onDeleted?: (id: number) => void;
  onToggleComplete?: (checkin: Checkin) => void;
}

export default function CheckInTable({
  checkins,
  onEdit,
  onDeleted,
  onToggleComplete,
}: CheckInTableProps) {
  // =============================
  // HANDLERS
  // =============================
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this check-in?")) return;

    try {
      await deleteCheckin(id);
      toast.success("Check-in deleted successfully");
      onDeleted?.(id); // ✅ optional chaining
    } catch (err: unknown) {
      console.error(err);
      let message = "Failed to delete check-in";

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        message = axiosErr.response?.data?.detail ?? message;
      }

      toast.error(message);
    }
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="overflow-auto border rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Date", "Todo Item", "Completed", "Notes", "Actions"].map(
              (header) => (
                <th
                  key={header}
                  className={`px-4 py-2 text-left text-sm font-semibold text-gray-600 ${
                    header === "Actions" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {checkins.length > 0 ? (
            checkins.map((checkin) => (
              <tr key={checkin.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{checkin.date}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {checkin.todo_item}
                </td>
                <td className="px-4 py-2 text-sm">
                  {checkin.is_completed ? "✅" : "❌"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {checkin.notes || "—"}
                </td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  {onToggleComplete && (
                    <button
                      onClick={() => onToggleComplete(checkin)}
                      className="p-1 text-green-600 hover:text-green-800"
                      title="Toggle completion"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}

                  {onEdit && (
                    <button
                      onClick={() => onEdit(checkin)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Edit check-in"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(checkin.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete check-in"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-8 text-sm text-gray-500">
                No check-ins found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
