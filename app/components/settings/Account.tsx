"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, signOut, useSession } from "@/app/lib/auth-client";
import { LogOut, Trash2, AlertTriangle } from "lucide-react";
import { deleteMyAccount } from "@/app/lib/actions/tasks";

export default function Account() {
    const { data: session } = useSession();
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState(false);

    async function handleSignOut() {
        await signOut();
        router.push("/login");
    }

    async function handleDeleteAccount() {
        try {
            await deleteMyAccount();
            await signOut();
            router.replace("/login");
        } catch (error) {
            console.error(error);
            alert("Failed to delete account.");
        }
    }
    return (
        <div className="flex flex-col gap-6">
            {/* Connected Accounts Card */}
            <div className="rounded-2xl border border-white/10 bg-[#111117] p-6 md:p-8 shadow-2xl">
                <h2 className="mb-1 text-lg font-semibold tracking-tight text-white">Connected Accounts</h2>
                <p className="mb-6 text-sm text-gray-400">Manage third-party authentication providers tied to your profile.</p>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3.5">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black font-bold text-sm">
                            G
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Google Workspace</p>
                            <p className="text-xs text-gray-400">{session?.user?.email}</p>
                        </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-medium text-emerald-400">
                        Connected
                    </span>
                </div>
            </div>

            {/* Active Sessions Card */}
            <div className="rounded-2xl border border-white/10 bg-[#111117] p-6 md:p-8 shadow-2xl">
                <h2 className="mb-1 text-lg font-semibold tracking-tight text-white">Active Session</h2>
                <p className="mb-6 text-sm text-gray-400">Sign out of your account on this specific browser device.</p>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut size={16} />
                    Sign out of session
                </button>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-500/[0.05] to-transparent p-6 md:p-8">
                <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-400" />
                    <h2 className="text-lg font-semibold tracking-tight text-red-400">Danger Zone</h2>
                </div>
                <p className="mb-6 text-sm text-gray-400">
                    Permanently delete your account, workspace data, and all associated tasks. This action cannot be reversed.
                </p>

                {!confirmDelete ? (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
                    >
                        <Trash2 size={16} />
                        Delete account
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDeleteAccount}
                            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-all hover:bg-red-500 active:scale-[0.98]"
                        >
                            Yes, permanently delete
                        </button>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}