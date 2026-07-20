"use client";

import { useState } from "react";
import { User, Lock, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";
import Profile from "./Profile";
import Security from "./Security";
import Account from "./Account";

type Tab = "profile" | "security" | "account";

const tabs: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "profile", label: "Profile", icon: <User size={18} />, desc: "Personal info & identity" },
  { id: "security", label: "Security", icon: <Lock size={18} />, desc: "Passwords & sessions" },
  { id: "account", label: "Account", icon: <ShieldAlert size={18} />, desc: "Integrations & danger zone" },
];

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="mx-auto max-w-7xl pb-12">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
            <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Manage your account preferences, security credentials, and workspace integrations.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
        {/* Navigation Sidebar */}
        <div className="flex flex-row overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02] p-2 lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-visible gap-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-left transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-purple-500/0 border-l-4 border-purple-500 text-white font-medium shadow-sm"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`transition-transform duration-200 ${isActive ? "text-purple-400 scale-110" : "group-hover:scale-105"}`}>
                    {tab.icon}
                  </div>
                  <div>
                    <div className="text-sm leading-none">{tab.label}</div>
                    <div className="mt-1 text-[11px] font-normal text-gray-500 hidden lg:block">
                      {tab.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className={`hidden lg:block opacity-0 transition-opacity ${isActive ? "opacity-100 text-purple-400" : "group-hover:opacity-40"}`} />
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <Profile />}
          {activeTab === "security" && <Security />}
          {activeTab === "account" && <Account />}
        </div>
      </div>
    </div>
  );
}