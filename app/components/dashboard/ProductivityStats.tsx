"use client";

import { Flame, CheckCircle2, Target, TrendingUp } from "lucide-react";
import { ProductivityMetrics } from "@/app/lib/analytics";

export default function ProductivityStats({ stats }: { stats: ProductivityMetrics }) {
  const maxWeeklyCount = Math.max(...stats.weeklyActivity.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Streak Widget */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Daily Streak</span>
            <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
              <Flame size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">{stats.currentStreak}</span>
            <span className="text-xs text-muted-foreground">{stats.currentStreak === 1 ? "day" : "days"}</span>
          </div>
        </div>

        {/* Completed Today */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Today's Focus</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">{stats.completedToday}</span>
            <span className="text-xs text-muted-foreground">tasks done</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
              <Target size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">{stats.completionRate}%</span>
            <span className="text-xs text-muted-foreground">overall</span>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Finished</span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">{stats.completedTasks}</span>
            <span className="text-xs text-muted-foreground">/ {stats.totalTasks} total</span>
          </div>
        </div>
      </div>

      {/* 7-Day Velocity Chart & Completion Progress */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">7-Day Completion Velocity</h3>
              <p className="text-xs text-muted-foreground">Tasks completed per day</p>
            </div>
          </div>

          <div className="flex h-36 items-end justify-between gap-3 pt-6">
            {stats.weeklyActivity.map((item, idx) => {
              const heightPercent = Math.round((item.count / maxWeeklyCount) * 100);
              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {item.count > 0 ? item.count : ""}
                  </span>
                  <div className="w-full rounded-t-md bg-muted/50 h-full max-h-[90px] flex items-end">
                    <div
                      className="w-full rounded-t-md bg-primary transition-all duration-500"
                      style={{ height: `${heightPercent}%`, minHeight: item.count > 0 ? "6px" : "0px" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ring Progress Card */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Overall Goal Progress</h3>
            <p className="text-xs text-muted-foreground">Finished vs. Pending</p>
          </div>

          <div className="my-4 flex justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted/40"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary transition-all duration-700 ease-out"
                  strokeDasharray={`${stats.completionRate}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-lg font-bold text-foreground">
                {stats.completionRate}%
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            {stats.totalTasks - stats.completedTasks} active tasks remaining
          </p>
        </div>
      </div>
    </div>
  );
}