import { headers } from "next/headers";
import { auth } from "@/app/lib/auth"; // Adjust path to your auth config if necessary
import { redirect } from "next/navigation";

export default async function RootPage() {
  // Check the session on the server side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect based on authentication status
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/homepage");
  }
}