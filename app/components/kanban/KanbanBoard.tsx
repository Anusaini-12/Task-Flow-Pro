"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Task, TaskStatus } from "@/app/types";
import TaskModal from "./TaskModal";
import { updateTaskStatus } from "@/app/lib/actions/tasks";
import { Plus } from "lucide-react";
import KanbanColumn from "./TaskColumn";
import { useSession } from "@/app/lib/auth-client";

const statuses: TaskStatus[] = ["todo", "in_progress", "done"];

export default function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>("todo");

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const newStatus = statuses.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find((t) => t.id === overId)?.status;

    if (!newStatus) return;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    updateTaskStatus(taskId, newStatus);
  }

  function openNewTaskModal(status: TaskStatus) {
    setActiveTask(null);
    setModalDefaultStatus(status);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setActiveTask(task);
    setModalOpen(true);
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <>
      {/* 1. Responsive Header: Stacks on mobile, aligns row justify-between on desktop */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground py-1 md:text-4xl">
            {getGreeting()}{firstName ? `, ${firstName}..` : ""}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {total === 0
              ? "Nothing on your plate yet — add your first task!"
              : done === total
                ? "Everything's done. Nice work! 🎉"
                : `You have ${total - done} task${total - done === 1 ? "" : "s"} left today`}
          </p>

          {/* Progress Bar stays underneath the greeting text */}
          {total > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                <div className="gradient-brand h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{done}/{total} done</span>
            </div>
          )}
        </div>

        {/* 2. Top-Right Action Button: Full width on mobile, auto-width on desktop */}
        <button
          onClick={() => openNewTaskModal("todo")}
          className="bg-primary flex w-full shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg  transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto cursor-pointer"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-5 overflow-x-auto pb-4">
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onTaskClick={openEditModal}
              onAddClick={() => openNewTaskModal(status)}
            />
          ))}
        </div>
      </DndContext>

      {modalOpen && (
        <TaskModal task={activeTask} defaultStatus={modalDefaultStatus} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}