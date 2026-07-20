"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/app/types";
import TaskCard from "./TaskCard";
import { Plus, Inbox } from "lucide-react";

const columnConfig: Record<TaskStatus, { label: string; dot: string; border: string }> = {
  todo: { label: "To Do", dot: "bg-secondary", border: "before:bg-secondary" },
  in_progress: { label: "In Progress", dot: "bg-sky-500", border: "before:bg-sky-500" },
  done: { label: "Done", dot: "bg-success", border: "before:bg-success" },
};

export default function KanbanColumn({
  status,
  tasks,
  onTaskClick,
  onAddClick,
}: {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = columnConfig[status];

  return (
    <div
      ref={setNodeRef}
      className={`glass relative flex w-full md:w-95 flex-shrink-0 flex-col rounded-b-2xl rounded-t-lg p-4 pt-5 before:absolute before:inset-x-0 before:top-0 before:h-1 before:rounded-t-2xl ${config.border} transition-colors ${
        isOver ? "ring-2 ring-primary/40" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
          <h3 className="text-sm font-semibold">{config.label}</h3>
        </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{tasks.length}</span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}

          {tasks.length === 0 && (
            <button
              onClick={onAddClick}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Inbox size={20} />
              <span className="text-xs">Drop a task here</span>
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  );
}