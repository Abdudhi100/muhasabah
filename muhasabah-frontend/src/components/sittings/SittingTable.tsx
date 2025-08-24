"use client";

import { Trash2, Edit } from "lucide-react";
import { deleteSitting } from "@/lib/api";
import { toast } from "sonner";
import { Sitting } from "@/types/sitting";

interface SittingTableProps {
  sittings: Sitting[];
  onEdit: (s: Sitting) => void;
  onDeleted: (id: number) => void;
}

export default function SittingTable({ sittings, onEdit, onDeleted }: SittingTableProps) {
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this sitting? This action cannot be undone.")) return;
    try {
      await deleteSitting(id);
      toast.success("Sitting deleted");
      onDeleted(id);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Head</th>
            <th className="px-4 py-2 text-left">Day</th>
            <th className="px-4 py-2 text-left">Max Members</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {sittings.length > 0 ? (
            sittings.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.location}</td>
                <td className="px-4 py-2">{s.sitting_head_name ?? s.sitting_head ?? "—"}</td>
                <td className="px-4 py-2">{s.day_of_week}</td>
                <td className="px-4 py-2">{s.max_members}</td>
                <td className="px-4 py-2">{s.status}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => onEdit(s)}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Edit sitting"
                    aria-label={`Edit ${s.name}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1 text-red-600 rounded hover:bg-red-50"
                    title="Delete sitting"
                    aria-label={`Delete ${s.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500 italic">
                No sittings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
