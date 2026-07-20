import { getTasks } from "@/app/lib/actions/tasks";
import { Task } from "@/app/types";
import TaskListView from "../../components/tasks/TaskListView";

export default async function MyTasksPage() {
  const tasks = (await getTasks()) as Task[];
  return <TaskListView initialTasks={tasks} />;
}