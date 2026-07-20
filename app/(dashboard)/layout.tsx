import Sidebar from "@/app/components/sidebar/Sidebar";
import { getTasks } from "@/app/lib/actions/tasks";
import { Task } from "@/app/types";
import SettingsView from "../components/settings/SettingsView";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const tasks = (await getTasks()) as Task[];

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Mobile top-bar / Desktop left-sidebar */}
      <Sidebar tasks={tasks} />

      {/* Scrollable content canvas for the Kanban board */}
      <main className="flex-1 overflow-x-auto p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}