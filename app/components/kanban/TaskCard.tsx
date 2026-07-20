"use client";

import { Task } from "@/app/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical, CheckCircle2, Circle } from "lucide-react";
import { updateTaskStatus } from "@/app/lib/actions/tasks";

const priorityStripe: Record<string, string> = {
  low: "bg-success",
  medium: "bg-warning",
  high: "bg-danger",
};

const priorityDot: Record<string, string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-danger",
};

function getDueMeta(dueDate: Date | string | null) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);

  const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (diffDays < 0) return { label: `${label} (overdue)`, className: "text-danger" };
  if (diffDays === 0) return { label: "Today", className: "text-warning" };
  if (diffDays === 1) return { label: "Tomorrow", className: "text-accent" };
  return { label, className: "text-muted-foreground" };
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

  const dueMeta = getDueMeta(task.dueDate);
  const isDone = task.status === "done";

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
          <h4 className={`mb-1 text-sm font-semibold ${isDone ? "text-muted-foreground" : ""}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className="mb-2.5 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
          )}
        </div>

        {dueMeta && (
          <span className={`flex items-center gap-1 text-[10px] font-semibold ${dueMeta.className}`}>
            <Calendar size={10} />
            {dueMeta.label}
          </span>
        )}
      </div>
    </div>
  );
}