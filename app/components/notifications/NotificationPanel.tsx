// app/components/notifications/NotificationPanel.tsx
"use client";

import { Bell, Calendar, Clock, TriangleAlert, ChevronRight } from "lucide-react";
import { Notification } from "@/app/lib/notifications";
import Link from "next/link";

export default function NotificationPanel({
  notifications,
}: {
  notifications: Notification[];
}) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <Bell className="mx-auto h-8 w-8 text-primary animate-pulse mb-2" />
        <h2 className="font-semibold text-lg">Notifications</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You're all caught up! No pending deadline alerts. 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-primary" />
          <h2 className="font-semibold text-lg">
            Notifications ({notifications.length})
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon =
            notification.type === "overdue"
              ? TriangleAlert
              : notification.type === "due_today"
              ? Calendar
              : Clock;

          const badgeStyle =
            notification.type === "overdue"
              ? "border-red-500/20 bg-red-500/10 text-red-500"
              : notification.type === "due_today"
              ? "border-blue-500/20 bg-blue-500/10 text-blue-500"
              : "border-amber-500/20 bg-amber-500/10 text-amber-500";

          return (
            <Link
              key={notification.id}
              href={`/dashboard`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-all hover:bg-muted/80 hover:border-border"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 border ${badgeStyle}`}>
                  <Icon size={18} />
                </div>

                <div>
                  <h3 className="font-medium text-sm text-foreground">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {notification.message}
                  </p>
                </div>
              </div>

              <ChevronRight size={16} className="text-muted-foreground/60 shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}