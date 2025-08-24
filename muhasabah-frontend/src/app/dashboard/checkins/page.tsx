"use client";

import { useEffect, useState } from "react";
import { getCheckins, updateCheckin } from "@/lib/api";
import CheckInTable from "@/components/checkins/CheckInTable";
import CheckInForm from "@/components/checkins/CheckInForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export interface Checkin {
  id: number;
  date: string;
  todo_item: string;
  notes?: string;
  is_completed?: boolean;
}

export default function CheckInsPage() {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Checkin | null>(null);

  // Load check-ins
  useEffect(() => {
    loadCheckins();
  }, []);

  const loadCheckins = async () => {
    setLoading(true);
    try {
      const list: Checkin[] = await getCheckins();
      setCheckins(list);
    } catch (err) {
      console.error("Error loading check-ins:", err);
      toast.error("Failed to load check-ins");
    } finally {
      setLoading(false);
    }
  };

  // Handle save (create or edit)
  const onSaved = (c: Checkin) => {
    setCheckins((prev) => {
      const idx = prev.findIndex((p) => p.id === c.id);
      if (idx >= 0) {
        // Update existing
        const copy = [...prev];
        copy[idx] = c;
        return copy;
      }
      // Add new check-in
      return [c, ...prev];
    });
    setShowForm(false);
    setEditing(null);
  };

  // Handle delete
  const onDeleted = (id: number) => {
    setCheckins((prev) => prev.filter((p) => p.id !== id));
  };

  // Edit button
  const onEdit = (c: Checkin) => {
    setEditing(c);
    setShowForm(true);
  };

  // Toggle complete
  const onToggleComplete = async (c: Checkin) => {
    try {
      // Ensure response has id
     const payload = await updateCheckin(c.id, { is_completed: !c.is_completed });
const updated: Checkin = { ...c, ...payload }; // ensures id exists


      setCheckins((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      toast.success("Check-in updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update check-in");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Daily Check-ins</h2>

        {user?.role === "student" && (
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            New Check-in
          </Button>
        )}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : checkins.length === 0 ? (
        <p>No check-ins found.</p>
      ) : (
        <CheckInTable
          checkins={checkins}
          onEdit={user?.role === "student" ? onEdit : undefined}
          onDeleted={user?.role === "student" ? onDeleted : undefined}
          onToggleComplete={user?.role === "student" ? onToggleComplete : undefined}
        />
      )}

      {showForm && user?.role === "student" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editing ? "Edit Check-in" : "Create Check-in"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="text-sm"
              >
                Close
              </button>
            </div>

            <CheckInForm
              initial={editing}
              onSaved={onSaved}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
