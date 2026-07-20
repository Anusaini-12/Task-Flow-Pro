"use client";

import { useRef, useState } from "react";
import { useSession, authClient } from "@/app/lib/auth-client";
import { Loader2, Check, Lock, User as UserIcon, Camera, Trash2 } from "lucide-react";

export default function Profile() {
  const { data: session, refetch } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Reference to trigger the hidden <input type="file" />
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // Handle local file selection and convert to Base64
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: limit file size to 2MB to keep DB payloads lightweight
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    setSaved(false);
    
    // Send both name and the Base64 image string to Better Auth
    await authClient.updateUser({ 
      name, 
      image: image || null // Pass null if user removed their photo
    });
    
    await refetch();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // Check if any changes were made compared to session data
  const hasChanges = 
    name !== session?.user?.name || 
    image !== (session?.user?.image || "");

  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-border/60 p-6 md:p-8 shadow-xl shadow-black/5">
      {/* Top Banner Glow */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="mb-8">
        <h2 className="text-lg font-semibold tracking-tight">Profile Information</h2>
        <p className="text-sm text-muted-foreground">Update your identity and how your name is displayed across workspaces.</p>
      </div>

      {/* Avatar Section */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-xl border border-border/40 bg-muted/20 p-4">
        {/* Clickable Avatar with Hover Overlay */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative cursor-pointer"
        >
          <div className="gradient-brand relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-xl font-bold text-primary-foreground shadow-lg ring-4 ring-background">
            {image ? (
              <img src={image} alt="User Avatar" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-white">
            <Camera size={18} />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium">Avatar</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click your photo or use the controls below to update your profile picture. Max size: 2MB.
          </p>
          
          {/* Controls */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Camera size={13} /> Change photo
            </button>
            
            {image && (
              <button
                type="button"
                onClick={() => setImage("")}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                <Trash2 size={13} /> Remove
              </button>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <UserIcon size={13} /> Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm transition-all duration-200 outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Lock size={13} /> Email Address
          </label>
          <div className="relative">
            <input
              value={session?.user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground/80 outline-none"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground bg-background/80 px-2 py-0.5 rounded border border-border/40">
              Read-only
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            To change your associated email address, please reach out to account support.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-end gap-3 border-t border-border/40 pt-6">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-success animate-in fade-in slide-in-from-right-2 duration-300">
            <Check size={15} className="stroke-[2.5]" /> Profile successfully updated
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="bg-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:opacity-95 hover:shadow-lg disabled:opacity-40 disabled:hover:shadow-md active:scale-[0.98]"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}