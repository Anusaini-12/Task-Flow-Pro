"use client";

import { Task } from "@/app/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Clock } from "lucide-react";

// Updated to accept dueAt (full timestamp)
function getDueMeta(dueAt: Date | string | null, isDone: boolean) {
  if (!dueAt) return null;
  const date = new Date(dueAt);
  const now = new Date();

  // 1. Format the time cleanly (e.g., "5:00 PM" or "11:59 PM")
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  // 2. Date-only math to determine "Today" vs "Tomorrow" vs "Jul 25"
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / 86400000);

  const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // 3. Exact timestamp check: It's overdue if the current time is past dueAt (and not done)
  const isOverdue = !isDone && date.getTime() < now.getTime();

  if (isOverdue) {
    return {
      label: `${diffDays < 0 ? dateLabel : "Today"}, ${timeLabel} (overdue)`,
      className: "text-danger font-bold bg-danger/10 px-1.5 py-0.5 rounded",
    };
  }

  if (diffDays === 0) {
    return { label: `Today, ${timeLabel}`, className: "text-warning font-medium" };
  }
  if (diffDays === 1) {
    return { label: `Tomorrow, ${timeLabel}`, className: "text-accent font-medium" };
  }
  return { label: `${dateLabel}, ${timeLabel}`, className: "text-muted-foreground" };
}

export default function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isDone = task.status === "done";
  // Read from dueAt instead of dueDate
  const dueMeta = getDueMeta(task.dueAt, isDone);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg cursor-grab touch-none active:cursor-grabbing"
    >
      <div className="flex items-start gap-2 py-3 pl-4 pr-3">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onClick}>
          <h4 className={`mb-1 text-sm font-semibold ${isDone ? "text-muted-foreground line-through" : ""}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className="mb-2.5 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
          )}
        </div>

        {/* Added shrink-0 so the longer date+time string doesn't get squished by the title */}
        {dueMeta && (
          <span className={`flex shrink-0 items-center gap-1 text-[10px] ${dueMeta.className}`}>
            <Calendar size={10} />
            {dueMeta.label}
          </span>
        )}
      </div>
    </div>
  );
}