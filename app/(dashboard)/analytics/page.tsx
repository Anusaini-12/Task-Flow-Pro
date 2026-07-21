import { getTasks } from "@/app/lib/actions/tasks";
import { calculateAnalytics } from "@/app/lib/analytics";
import ProductivityStats from "@/app/components/dashboard/ProductivityStats";
import { Task } from "@/app/types";

export default async function AnalyticsPage() {
  const tasks = (await getTasks()) as Task[];
  const analytics = calculateAnalytics(tasks);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your task completion velocity, daily streaks, and overall productivity metrics.
        </p>
      </div>

      <ProductivityStats stats={analytics} />
    </div>
  );
}