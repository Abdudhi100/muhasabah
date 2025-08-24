// src/components/TodoForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createTodo, updateTodo } from "@/lib/api";
import { toast } from "sonner";
import { Todo, TodoPayload } from "@/types/todo";

interface TodoFormProps {
  initial?: Todo | null;
  onSaved: (todo: Todo) => void;
  onCancel?: () => void;
}

export default function TodoForm({
  initial = null,
  onSaved,
  onCancel,
}: TodoFormProps) {
  // ✅ internal form state uses TodoPayload only
  const [form, setForm] = useState<TodoPayload>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    due_date: initial?.due_date ?? "",
    completed: initial?.completed ?? false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, completed: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedTodo: Todo;

      if (initial?.id) {
        // ✅ updating an existing todo (server returns a Todo with id)
        savedTodo = await updateTodo(initial.id, form);
        toast.success("Todo updated");
      } else {
        // ✅ creating new todo (server returns a Todo with id)
        savedTodo = await createTodo(form);
        toast.success("Todo created");
      }

      // Always send a full Todo object back to parent
      onSaved(savedTodo);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const apiErr = err as { response?: { data?: { detail?: string } } };
        toast.error(apiErr.response?.data?.detail || "Save failed");
      } else {
        toast.error("Save failed");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block mb-1 font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter todo title"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block mb-1 font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
        />
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="due_date" className="block mb-1 font-medium">
          Due Date
        </label>
        <Input
          id="due_date"
          name="due_date"
          type="date"
          value={form.due_date ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Completed Checkbox */}
      <div className="flex items-center gap-2">
        <input
          id="completed"
          name="completed"
          type="checkbox"
          checked={form.completed ?? false}
          onChange={handleCheckboxChange}
          className="h-4 w-4"
        />
        <label htmlFor="completed" className="text-sm">
          Completed
        </label>
      </div>

      {/* Buttons */}
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
