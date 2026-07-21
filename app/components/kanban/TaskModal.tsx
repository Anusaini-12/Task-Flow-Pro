"use client";

import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/app/types";
import { createTask, updateTask, deleteTask } from "@/app/lib/actions/tasks";
import { X, Trash2, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TaskModal({
  task,
  defaultStatus,
  onClose,
}: {
  task: Task | null;
  defaultStatus?: TaskStatus;
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");

  // Initialize date (YYYY-MM-DD) and time (HH:mm) from existing timestamp
  const [dueDate, setDueDate] = useState(() => {
    if (!task?.dueAt) return "";

    const d = new Date(task.dueAt);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const [dueTime, setDueTime] = useState(() => {
    if (!task?.dueAt) return "";
    const d = new Date(task.dueAt);
    return d.toTimeString().slice(0, 5); // Extracts "HH:mm" in local time
  });

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Task title is required.");
      return;
    }

    setSaving(true);

    // Combine date and time into a single timestamp
    let parsedDueAt: Date | null = null;
    if (dueDate) {
      // If time isn't selected, default to end of day (23:59)
      const timeString = dueTime || "23:59";
      const [year, month, day] = dueDate.split("-").map(Number);
      const [hour, minute] = timeString.split(":").map(Number);

      parsedDueAt = new Date(
        year,
        month - 1,
        day,
        hour,
        minute
      );
    }

    try {
      if (task) {
        await updateTask(task.id, {
          title,
          description,
          priority,
          dueAt: parsedDueAt
        });
      } else {
        await createTask({
          title,
          description,
          priority,
          status: defaultStatus,
          dueAt: parsedDueAt
        });
      }

      toast.success("Task saved successfully!");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!task) return;
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully!");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{task ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Description (optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold capitalize transition-colors ${priority === p
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Combined Date and Time Picker Controls */}
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Date Picker */}
            <label className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-within:border-primary">
              <Calendar size={15} className="text-muted-foreground" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  // Automatically set a default time when date is picked initially
                  if (!dueTime && e.target.value) setDueTime("12:00");
                }}
                className="w-full bg-transparent text-xs outline-none [color-scheme:dark] sm:text-sm"
              />
            </label>

            {/* Time Picker (Only visible/enabled if a date is selected) */}
            <label className={`flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-within:border-primary ${!dueDate && "opacity-50 pointer-events-none"}`}>
              <Clock size={15} className="text-muted-foreground" />
              <input
                type="time"
                disabled={!dueDate}
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-transparent text-xs outline-none [color-scheme:dark] sm:text-sm"
              />
            </label>
          </div>

          {/* Clear Button */}
          {(dueDate || dueTime) && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setDueDate("");
                  setDueTime("");
                }}
                className="text-xs text-muted-foreground transition-colors hover:text-danger"
              >
                Clear due date & time
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {task ? (
            <button onClick={handleDelete} className="flex items-center gap-1 text-sm text-danger hover:opacity-80">
              <Trash2 size={14} /> Delete
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary rounded-lg px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}