import NotificationPanel from "@/app/components/notifications/NotificationPanel";
import { getTasks } from "@/app/lib/actions/tasks";
import { generateNotifications } from "@/app/lib/notifications";
import { Task } from "@/app/types";

export default async function NotificationsPage() {
  const tasks = (await getTasks()) as Task[];

  const notifications = generateNotifications(tasks);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        Notifications
      </h1>

      <NotificationPanel notifications={notifications} />
    </div>
  );
}