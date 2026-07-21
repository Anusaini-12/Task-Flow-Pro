import type { Metadata } from "next";
import "animate.css";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TaskFlow Pro — Manage your work beautifully",
  description: "A modern task manager with drag-and-drop Kanban boards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}