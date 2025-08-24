"use client";

import { useEffect, useState } from "react";
import { getTodos, updateTodo } from "@/lib/api";
import TodoTable from "@/components/todos/TodoTable";
import TodoForm from "@/components/todos/TodoForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Todo } from "@/types/todo";  // ✅ use proper type

export default function TodosPage() {
  const { user } = useAuth(); // { role: "student" | "sitting_head" | "overall_head" }
  const [todos, setTodos] = useState<Todo[]>([]); // ✅ no `any`
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null); // ✅

  // Load Todos
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const list = await getTodos();
      setTodos(list);
    } catch (err) {
      console.error("Error loading todos:", err);
      toast.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  // Handle Save
const onSaved = (t: Todo) => {
  setTodos((prev) => {
    const idx = prev.findIndex((p) => p.id === t.id);
    if (idx >= 0) {
      const copy = [...prev];
      copy[idx] = t;
      return copy;
    }
    return [t, ...prev];
  });
  setShowForm(false);
  setEditing(null);
};


  // Handle Delete
  const onDeleted = (id: number) => {
    setTodos((prev) => prev.filter((p) => p.id !== id));
  };

  // Handle Edit click
  const onEdit = (t: Todo) => {
    setEditing(t);
    setShowForm(true);
  };

  // Toggle Completion
  const onToggleComplete = async (t: Todo) => {
    try {
      const res = await updateTodo(t.id, { completed: !t.completed });
      setTodos((prev) => prev.map((p) => (p.id === res.id ? res : p)));
      toast.success("Todo updated");
    } catch {
      toast.error("Failed to update todo");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Todos</h2>

        {user?.role === "student" && (
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            New Todo
          </Button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div>Loading...</div>
      ) : todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <TodoTable
          todos={todos}
          onEdit={user?.role === "student" ? onEdit : (() => {})}
          onDeleted={user?.role === "student" ? onDeleted : (() => {})}
          onToggleComplete={user?.role === "student" ? onToggleComplete : (() => {})}
        />
      )}

      {/* Form Modal */}
      {showForm && user?.role === "student" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editing ? "Edit Todo" : "Create Todo"}
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
            <TodoForm
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
