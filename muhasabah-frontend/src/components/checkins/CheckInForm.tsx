"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Checkin, CheckinPayload } from "@/types/checkin";
import { createCheckin, updateCheckin } from "@/lib/api";

interface CheckInFormProps {
  initial?: Checkin | null;
  onSaved: (checkin: Checkin) => void;
  onCancel?: () => void;
}

export default function CheckInForm({
  initial = null,
  onSaved,
  onCancel,
}: CheckInFormProps) {
  // =============================
  // STATE
  // =============================
  const [form, setForm] = useState<CheckinPayload>({
    date: initial?.date ?? new Date().toISOString().split("T")[0],
    todo_item: initial?.todo_item ?? "",
    notes: initial?.notes ?? "",
    is_completed: initial?.is_completed ?? false,
  });

  const [loading, setLoading] = useState(false);

  // =============================
  // HANDLERS
  // =============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, is_completed: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedCheckin: Checkin;

      if (initial?.id) {
        // Editing existing check-in
        savedCheckin = await updateCheckin(initial.id, form);
        toast.success("Check-in updated successfully");
      } else {
        // Creating new check-in
        savedCheckin = await createCheckin(form);
        toast.success("Check-in created successfully");
      }

      onSaved(savedCheckin);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        toast.error(
          axiosErr.response?.data?.detail || "Failed to save check-in"
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // RENDER
  // =============================
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date Field */}
      <Input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      {/* Todo Item Field */}
      <Input
        name="todo_item"
        placeholder="Todo item"
        value={form.todo_item}
        onChange={handleChange}
        required
      />

      {/* Notes Field */}
      <Textarea
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
      />

      {/* Completion Checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_completed}
          onChange={handleCheckbox}
        />
        <span>Completed</span>
      </label>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>

        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
