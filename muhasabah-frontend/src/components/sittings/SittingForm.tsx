"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSitting, updateSitting, getUsers } from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: number;
  username?: string;
  email?: string;
  role?: string;
}

export interface SittingFormValues {
  name: string;
  location: string;
  day_of_week: string;
  max_members: number;
  sitting_head: string | number;
  status: string;
}

interface SittingFormProps {
  initial?: Partial<SittingFormValues> & { id?: number } | null;
  onSaved: (sitting: SittingFormValues & { id: number }) => void;
  onCancel?: () => void;
}

interface SittingPayload {
  id: number;
  name: string;
  location?: string;
  day_of_week: string;
  max_members: number;
  sitting_head: string | number;
  status: string;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SittingForm({ initial = null, onSaved, onCancel }: SittingFormProps) {
  const [form, setForm] = useState<SittingFormValues>({
    name: initial?.name ?? "",
    location: initial?.location ?? "",
    day_of_week: initial?.day_of_week ?? "Sunday",
    max_members: initial?.max_members ?? 10,
    sitting_head: initial?.sitting_head ?? "",
    status: initial?.status ?? "active",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers()
      .then((list) => setUsers(Array.isArray(list) ? list : []))
      .catch(() => setUsers([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "max_members" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: keyof SittingFormValues, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: name === "max_members" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form, max_members: Number(form.max_members) };

      let saved: Partial<SittingPayload>;

      if (initial?.id) {
        saved = await updateSitting(initial.id, payload);
        toast.success("Sitting updated");
      } else {
        saved = await createSitting(payload);
        toast.success("Sitting created");
      }

      onSaved({
        id: saved.id!, // id should always exist after API call
        name: saved.name ?? "",
        location: saved.location ?? "",
        day_of_week: saved.day_of_week ?? "Sunday",
        max_members: saved.max_members ?? 10,
        sitting_head: saved.sitting_head ?? "",
        status: saved.status ?? "active",
      });
    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error.response?.data?.detail || error.message || "Save failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Sitting Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Sitting Name</label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter sitting name"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <Input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location (optional)"
        />
      </div>

      {/* Day of Week */}
      <div>
        <label className="block text-sm font-medium mb-1">Day of the Week</label>
        <Select value={form.day_of_week} onValueChange={(v) => handleSelectChange("day_of_week", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Max Members */}
      <div>
        <label className="block text-sm font-medium mb-1">Maximum Members</label>
        <Input
          name="max_members"
          type="number"
          value={String(form.max_members)}
          onChange={handleChange}
          min={1}
        />
      </div>

      {/* Sitting Head */}
      <div>
        <label className="block text-sm font-medium mb-1">Sitting Head</label>
        <Select value={String(form.sitting_head ?? "")} onValueChange={(v) => handleSelectChange("sitting_head", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Assign Sitting Head (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">-- None --</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.username || u.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={form.status} onValueChange={(v) => handleSelectChange("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Sitting"}
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
