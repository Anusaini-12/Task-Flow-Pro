import { Task } from "@/app/types";

export interface ProductivityMetrics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  completedToday: number;
  currentStreak: number;
  weeklyActivity: { day: string; count: number }[];
}

export function calculateAnalytics(tasks: Task[]): ProductivityMetrics {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const totalTasks = tasks.length;
  const completedList = tasks.filter((t) => t.status === "done");
  const completedTasks = completedList.length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 1. Completed Today
  const completedToday = completedList.filter((t) => {
    const date = t.updatedAt ? new Date(t.updatedAt) : null;
    return date && date >= startOfToday;
  }).length;

  // 2. 7-Day Activity Chart Data
  const daysMap = new Map<string, number>();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    daysMap.set(key, 0);
  }

  // Count completions per day
  completedList.forEach((t) => {
    if (!t.updatedAt) return;
    const dateKey = new Date(t.updatedAt).toISOString().split("T")[0];
    if (daysMap.has(dateKey)) {
      daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + 1);
    }
  });

  const weeklyActivity = Array.from(daysMap.entries()).map(([dateStr, count]) => {
    const dateObj = new Date(dateStr + "T00:00:00");
    return {
      day: dayNames[dateObj.getDay()],
      count,
    };
  });

  // 3. Daily Streak Counter
  // Collect all unique completion dates formatted as YYYY-MM-DD
  const completionDates = new Set(
    completedList
      .map((t) => t.updatedAt && new Date(t.updatedAt).toISOString().split("T")[0])
      .filter(Boolean) as string[]
  );

  let streak = 0;
  let checkDate = new Date(startOfToday);

  // If no tasks completed today, check if streak active as of yesterday
  const todayKey = checkDate.toISOString().split("T")[0];
  if (!completionDates.has(todayKey)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const key = checkDate.toISOString().split("T")[0];
    if (completionDates.has(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    totalTasks,
    completedTasks,
    completionRate,
    completedToday,
    currentStreak: streak,
    weeklyActivity,
  };
}