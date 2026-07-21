"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/app/lib/auth-client";
import {
    Sparkles,
    Moon,
    Sun,
    Menu,
    X,
    Bell,
    LogOut,
    LayoutDashboard,
    User as UserIcon,
    Flower,
} from "lucide-react";

interface NavbarProps {
    /** Optional handler to open/close the mobile sidebar drawer in dashboard layouts */
    onToggleSidebar?: () => void;
    /** State of the mobile sidebar drawer */
    isSidebarOpen?: boolean;
    /** Unread notification count for dashboard view */
    notificationCount?: number;
}

export default function Navbar({
    onToggleSidebar,
    isSidebarOpen = false,
    notificationCount = 0,
}: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    // Define which routes should render the Dashboard-style navigation actions
    const isDashboardRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/my-tasks") ||
        pathname.startsWith("/analytics") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/notifications");

    // Extract user initials for avatar fallback
    const initials = session?.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    async function handleLogout() {
        await signOut();
        router.push("/login");
    }

    function toggleTheme() {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        document.documentElement.classList.toggle("dark");
    }

    return (
        <>
            {/* --- MOBILE HEADER --- */}
            <header className="glass sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border px-4 md:hidden">
                <div className="flex items-center gap-2">
                    <Flower className="h-6 w-6 text-purple-400" style={{ animation: "spin 4s linear infinite" }} />
                    <span className="text-lg font-bold gradient-text">TaskFlow Pro</span>
                </div>

                <div className="flex items-center gap-3">
                    {isDashboardRoute ? (
                        <>
                            <div className="gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                                {initials || "U"}
                            </div>
                            {onToggleSidebar && (
                                <button
                                    onClick={onToggleSidebar}
                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    aria-label="Toggle Menu"
                                >
                                    {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            {isPending ? (
                                <div className="h-7 w-20 animate-pulse rounded-lg bg-muted/40" />
                            ) : session ? (
                                <Link
                                    href="/dashboard"
                                    className="gradient-brand rounded-xl px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-xs font-semibold text-foreground/80 hover:text-primary">
                                        Sign In
                                    </Link>
                                    <Link href="/signup" className="gradient-brand rounded-xl px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* --- DESKTOP HEADER --- */}
            <header className="sticky top-0 z-50 hidden w-full border-b border-border/40 bg-background/60 backdrop-blur-xl md:block">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
                    {/* Left: Brand Logo */}
                    <Link
                        href="/"
                        className={`flex items-center gap-2.5 transition-opacity hover:opacity-90 ${
                            isSidebarOpen ? "invisible pointer-events-none md:visible md:pointer-events-auto" : ""
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Flower className="h-6 w-6 text-purple-400" style={{ animation: "spin 4s linear infinite" }} />
                            <span className="text-lg font-bold gradient-text">TaskFlow Pro</span>
                        </div>
                    </Link>

                    {/* Right: Adaptive Navigation Actions */}
                    <div className="flex items-center gap-4">
                        {isDashboardRoute ? (
                            <>
                                {/* Notification Bell */}
                                <Link
                                    href="/notifications"
                                    className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                    {notificationCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                                            {notificationCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User Avatar Badge & Logout */}
                                <div className="flex items-center gap-2.5 border-l border-border/60 pl-3">
                                    {session?.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                                        />
                                    ) : (
                                        <div className="gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-primary-foreground shadow-sm">
                                            {initials || <UserIcon className="h-4 w-4" />}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        title="Log out"
                                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-5">
                                {isPending ? (
                                    <div className="h-8 w-24 animate-pulse rounded-lg bg-muted/40" />
                                ) : session ? (
                                    <Link
                                        href="/dashboard"
                                        className="gradient-brand flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="gradient-brand rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}