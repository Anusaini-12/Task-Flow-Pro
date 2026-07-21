"use server";

import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { tasks, user } from "@/app/db/schema";
import { db } from "@/app/db";
import { redirect } from "next/navigation";

//DELETE ACCOUNT
export async function deleteMyAccount() {
  const userId = await getUserId();

  await db
    .delete(user)
    .where(eq(user.id, userId));

  revalidatePath("/");
}

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  return session.user.id;
}

export async function getTasks() {
  const userId = await getUserId();
  return db.select().from(tasks).where(eq(tasks.userId, userId));
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "todo" | "in_progress" | "done";
  dueAt?: Date | null;
}) {
  const userId = await getUserId();
  await db.insert(tasks).values({
    userId,
    title: data.title,
    description: data.description,
    priority: data.priority || "medium",
    status: data.status || "todo",
    dueAt: data.dueAt ?? null,
  });
  revalidatePath("/dashboard");
  revalidatePath("/my-tasks");
}

export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "done",
) {
  const userId = await getUserId();
  await db
    .update(tasks)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  revalidatePath("/dashboard");
  revalidatePath("/my-tasks");
}

export async function updateTask(
  taskId: string,
  data: Partial<typeof tasks.$inferInsert>,
) {
  const userId = await getUserId();
  await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  revalidatePath("/dashboard");
  revalidatePath("/my-tasks");
}

export async function deleteTask(taskId: string) {
  const userId = await getUserId();
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  revalidatePath("/dashboard");
  revalidatePath("/my-tasks");
}
