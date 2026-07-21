"use client";

import { useMemo, useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/app/types";
import { updateTaskStatus } from "@/app/lib/actions/tasks";
import TaskModal from "@/app/components/kanban/TaskModal";
import { Search, Plus, CheckCircle2, Circle, Calendar, ArrowUpDown, Sparkles } from "lucide-react";

type SortKey = "dueDate" | "priority" | "createdAt";
type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | TaskPriority;

const priorityWeight: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const priorityDot: Record<string, string> = {
  low: "bg-success",
  medium: "bg-warning",
  high: "bg-danger",
};
const statusLabel: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

// 1. Updated to read dueAt timestamp, format time, and check exact overdue minutes
function getDueMeta(dueAt: Date | string | null, isDone: boolean) {
  if (!dueAt) return null;
  const date = new Date(dueAt);
  const now = new Date();

  // Extract clean time string (e.g., "5:00 PM")
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / 86400000);

  const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // Exact timestamp check: overdue if current time is past dueAt (and not done)
  const isOverdue = !isDone && date.getTime() < now.getTime();

  if (isOverdue) {
    return {
      label: `${diffDays < 0 ? dateLabel : "Today"}, ${timeLabel} (overdue)`,
      className: "text-danger font-semibold bg-danger/10 px-2 py-0.5 rounded-md",
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

export default function TaskListView({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

    if (statusFilter !== "all") result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "all") result = result.filter((t) => t.priority === priorityFilter);

    result.sort((a, b) => {
      if (sortKey === "priority") return priorityWeight[a.priority] - priorityWeight[b.priority];
      
      // 2. Updated sorting to evaluate dueAt timestamps instead of dueDate
      if (sortKey === "dueDate") {
        if (!a.dueAt && !b.dueAt) return 0;
        if (!a.dueAt) return 1;
        if (!b.dueAt) return -1;
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sortKey]);

  function toggleComplete(task: Task, e: React.MouseEvent) {
    e.stopPropagation();
    const newStatus = task.status === "done" ? "todo" : "done";
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    updateTaskStatus(task.id, newStatus);
  }

  function openEdit(task: Task) {
    setActiveTask(task);
    setModalOpen(true);
  }

  function openNew() {
    setActiveTask(null);
    setModalOpen(true);
  }

  const completedCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">My Tasks</h1>
            <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {tasks.length} total · {completedCount} completed
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-primary flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <Plus size={16} />
          Create Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass mb-5 flex flex-wrap items-center gap-3 rounded-xl p-3">
        <div className="flex flex-1 min-w-[180px] items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search size={15} className="text-muted-foreground" />
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button
          onClick={() => setSortKey(sortKey === "dueDate" ? "priority" : sortKey === "priority" ? "createdAt" : "dueDate")}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ArrowUpDown size={14} />
          Sort: {sortKey === "dueDate" ? "Due date" : sortKey === "priority" ? "Priority" : "Newest"}
        </button>

        {/* PRIORITY LEGEND */}
        <div className="hidden items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground md:flex">
          <span className="font-medium">Priority:</span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${priorityDot.high}`} />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${priorityDot.medium}`} />
            <span>Med</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${priorityDot.low}`} />
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="glass flex flex-col items-center justify-center gap-2 rounded-xl py-16 text-muted-foreground">
            <Search size={22} />
            <p className="text-sm">No tasks match your filters</p>
          </div>
        )}

        {filtered.map((task) => {
          const isDone = task.status === "done";
          // 3. Passed task.dueAt and isDone to getDueMeta
          const dueMeta = getDueMeta(task.dueAt, isDone);

          return (
            <div
              key={task.id}
              onClick={() => openEdit(task)}
              className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-[0_8px_24px_-10px_oklch(66%_0.25_300_/_0.35)]"
            >
              <button onClick={(e) => toggleComplete(task, e)} className="shrink-0 text-muted-foreground transition-colors hover:text-success">
                {isDone ? <CheckCircle2 size={18} className="text-success" /> : <Circle size={18} />}
              </button>

              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDot[task.priority]}`} />

              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${isDone ? "text-muted-foreground line-through" : ""}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="truncate text-xs text-muted-foreground">{task.description}</p>
                )}
              </div>

              <span className="hidden shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
                {statusLabel[task.status]}
              </span>

              {/* Date & Time renders right here at the far right of the row */}
              {dueMeta && (
                <span className={`flex shrink-0 items-center gap-1 text-xs font-medium ${dueMeta.className}`}>
                  <Calendar size={12} />
                  {dueMeta.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <TaskModal task={activeTask} defaultStatus="todo" onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}