import { Task } from "@/app/types";

export interface Notification {
  id: string;
  taskId: string;
  type: "due_soon" | "overdue" | "due_today";
  title: string;
  message: string;
  dueAt: Date | null ;
}

export function generateNotifications(tasks: Task[]): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  for (const task of tasks) {
    if (!task.dueAt || task.status === "done") continue;

    const due = new Date(task.dueAt);
    const diff = due.getTime() - now.getTime();

    // 1. ⚠️ Overdue
    if (due < now) {
      notifications.push({
        id: `overdue-${task.id}`,
        taskId: task.id,
        type: "overdue",
        title: "Task Overdue",
        message: `"${task.title}" was due ${due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        dueAt: task.dueAt,
      });
    } 
    // 2. ⏰ Due within the next hour (Higher priority than general "due today")
    else if (diff > 0 && diff <= 60 * 60 * 1000) {
      notifications.push({
        id: `soon-${task.id}`,
        taskId: task.id,
        type: "due_soon",
        title: "Due Very Soon",
        message: `"${task.title}" is due within the hour!`,
        dueAt: task.dueAt,
      });
    } 
    // 3. 📅 Due later today
    else if (due >= startOfToday && due <= endOfToday) {
      notifications.push({
        id: `today-${task.id}`,
        taskId: task.id,
        type: "due_today",
        title: "Due Today",
        message: `"${task.title}" is due today.`,
        dueAt: task.dueAt,
      });
    }
  }

  return notifications;
}