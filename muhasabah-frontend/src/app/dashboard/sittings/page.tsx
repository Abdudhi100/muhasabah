"use client";

import { useEffect, useState } from "react";
import { getSittings, getProfile } from "@/lib/api";
import SittingTable from "@/components/sittings/SittingTable";
import SittingForm from "@/components/sittings/SittingForm";
import { Button } from "@/components/ui/button";
import { Sitting} from "@/types/sitting";
import { Profile } from "@/types/user";

export default function SittingsPage() {
  const [sittings, setSittings] = useState<Sitting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sitting | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    load();
    getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const list = await getSittings();
      setSittings(list);
    } catch (err) {
      console.error("Failed to fetch sittings:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSaved = (s: Sitting) => {
    setSittings((prev) => {
      const idx = prev.findIndex((p) => p.id === s.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = s;
        return copy;
      }
      return [s, ...prev];
    });
    setShowForm(false);
    setEditing(null);
  };

  const onEdit = (s: Sitting) => {
    setEditing(s);
    setShowForm(true);
  };

  const onDeleted = (id: number) => {
    setSittings((prev) => prev.filter((p) => p.id !== id));
  };

  const canManage = profile?.role === "overall_head";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sittings</h2>
        {canManage ? (
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            New Sitting
          </Button>
        ) : (
          <div className="text-sm text-gray-500">
            Only overall head can manage sittings
          </div>
        )}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <SittingTable sittings={sittings} onEdit={onEdit} onDeleted={onDeleted} />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editing ? "Edit Sitting" : "Create Sitting"}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="text-sm"
              >
                Close
              </button>
            </div>
            <SittingForm
              initial={editing}
              onSaved={onSaved}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
