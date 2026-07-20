import KanbanBoard from "@/app/components/kanban/KanbanBoard";
import { getTasks } from "@/app/lib/actions/tasks";
import { Task } from "@/app/types";

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const tasks = (await getTasks()) as Task[];

  return (
    <div className="flex flex-col gap-6">
      <KanbanBoard initialTasks={tasks} />
    </div>
  );
}