"use client";

import { useState } from "react";
import { authClient, useSession } from "@/app/lib/auth-client";
import { Loader2, Check, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function Security() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChangePassword() {
    setError("");
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
     
    setSaving(true);
    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setSaving(false);

    if (result.error) {
      setError(result.error.message || "Failed to update security credentials");
    } else {
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-border/60 p-6 md:p-8 shadow-xl shadow-black/5">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Security Credentials</h2>
        <p className="text-sm text-muted-foreground">Manage your password and safeguard your account.</p>
      </div>

      {/* Info Callout */}
      <div className="mb-6 flex items-start gap-3.5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-primary">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
        <div className="text-xs leading-relaxed">
          <span className="font-semibold block mb-0.5">Session Revocation Enabled</span>
          Updating your password will automatically sign you out of all other active browsers and devices for security.
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 pr-11 text-sm transition-all duration-200 outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm transition-all duration-200 outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm transition-all duration-200 outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-danger/10 border border-danger/20 px-3.5 py-2.5 text-xs font-medium text-danger">
          {error}
        </div>
      )}

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-border/40 pt-6">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-success animate-in fade-in slide-in-from-right-2 duration-300">
            <Check size={15} className="stroke-[2.5]" /> Password successfully changed
          </span>
        )}
        <button
          onClick={handleChangePassword}
          disabled={saving || !currentPassword || !newPassword || !confirmPassword}
          className="bg-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:opacity-95 hover:shadow-lg disabled:opacity-40 disabled:hover:shadow-md active:scale-[0.98]"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? "Updating password..." : "Update password"}
        </button>
      </div>
    </div>
  );
}