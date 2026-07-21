"use client";

import { useState } from "react";
import { signOut, useSession } from "@/app/lib/auth-client";
import { LayoutDashboard, ListTodo, Settings, LogOut, Menu, X, BookHeart, Flower, Bell, BarChart3 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Task } from "@/app/types";
import { generateNotifications } from "@/app/lib/notifications";
import Navbar from "../Navbar";
import Link from "next/link";

export default function Sidebar({ tasks }: { tasks: Task[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const notifications = generateNotifications(tasks);
    const notificationCount = notifications.length;

    async function handleLogout() {
        await signOut();
        router.push("/login");
    }

    const initials = session?.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const navItems = [
        { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/dashboard" },
        { icon: <ListTodo size={18} />, label: "My Tasks", href: "/my-tasks" },
        { icon: <BarChart3 size={18} />, label: "Analytics", href: "/analytics" },
        { icon: <Settings size={18} />, label: "Settings", href: "/settings" },
        { icon: <Bell size={18} />, label: "Notifications", href: "/notifications", count: notificationCount },
    ];

    return (
        <>
            {/* --- 1. MOBILE TOP HEADER (Hidden on Desktop) --- */}
            <div className="md:hidden">
                <Navbar
                    onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    isSidebarOpen={isMobileMenuOpen}
                    notificationCount={notificationCount}
                />
            </div>

            {/* --- 2. MOBILE OVERLAY BACKDROP --- */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
                />
            )}

            {/* --- 3. SIDEBAR DRAWER (Fixed below: changed md:static to md:sticky md:top-0) --- */}
            <aside
                className={`glass fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-border p-5 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 md:h-screen md:overflow-y-auto ${isMobileMenuOpen ? "translate-x-0 shadow-2xl shadow-primary/10" : "-translate-x-full"
                    }`}
            >
                <div>
                    {/* Brand header inside sidebar */}
                    <div className="mb-8 flex items-center justify-between px-2">
                        <Link href="/" className="flex items-center gap-2.5 transition-opacity cursor-pointer hover:opacity-90">
                        <div className="flex items-center gap-2">
                            {/* <div className="gradient-brand h-7 w-7 rounded-lg shadow-md shadow-primary/20" /> */}
                            <Flower className="h-7 w-7 text-purple-400" style={{ animation: "spin 4s linear infinite" }} />
                            <span className="text-lg font-bold gradient-text">TaskFlow Pro</span>
                        </div>
                        </Link>

                        {/* Close button inside drawer for mobile */}
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="rounded-md p-1 text-muted-foreground hover:text-foreground md:hidden"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        router.push(item.href);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive
                                        ? "bg-primary/15 text-primary font-semibold shadow-sm border border-primary/20"
                                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>

                                    {item.count !== undefined && item.count > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1.5 text-xs font-semibold text-gray-100">
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Profile Footer */}
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 backdrop-blur-sm">
                    {/* Replace the current avatar div with this logic */}
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt="Profile"
                            className="h-9 w-9 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-border"
                        />
                    ) : (
                        <div className="gradient-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground shadow-sm">
                            {initials || "U"}
                        </div>
                    )}
                    <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium leading-tight text-foreground">
                            {session?.user?.name || "User"}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                            {session?.user?.email || "user@example.com"}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Log out"
                        className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>
        </>
    );
}