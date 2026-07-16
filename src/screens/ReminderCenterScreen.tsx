import { TrendingUp } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";
import { NotificationItem } from "../types";

export default function ReminderCenterScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const [activeTab, setActiveTab] = useState<"today" | "earlier">("today");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, icon: "🥗", category: "Meal", time: "1:15 PM", text: "You usually eat lunch around now. Have you had lunch today?", read: false, screen: "reminder-meal-flow" as Screen },
    { id: 2, icon: "💧", category: "Hydration", time: "11:00 AM", text: "You're only halfway to today's water goal.", read: false, screen: "reminder-hydration" as Screen },
    { id: 3, icon: "💪", category: "Protein", time: "9:30 AM", text: "Only 18g of protein left to reach today's target.", read: true, screen: "progress-dashboard" as Screen },
    { id: 4, icon: "🎉", category: "Achievement", time: "Yesterday", text: "Congratulations! You've completed a 7-day logging streak.", read: true, screen: "reminder-celebration" as Screen },
    { id: 5, icon: "📈", category: "Weekly Report", time: "Sunday", text: "Your weekly nutrition report is ready.", read: true, screen: "reminder-weekly-summary" as Screen },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "today") return n.time.includes("PM") || n.time.includes("AM");
    return !n.time.includes("PM") && !n.time.includes("AM");
  });

  return (
    <ScreenShell
      title="Notifications"
      subtitle="Supportive coaching alerts from Liva."
      onBack={onBack}
      footer={
        <div className="flex gap-3">
          <SecondaryButton onClick={handleMarkAllRead}>Mark All Read</SecondaryButton>
          <PrimaryButton onClick={() => onNavigate("reminder-settings")} icon={<TrendingUp size={16} />}>Smart Reminders</PrimaryButton>
        </div>
      }
    >
      <div className="space-y-4 pb-8">
        {/* Tab Selectors */}
        <div className="flex bg-[#f2faf5] p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("today")}
            className="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
            style={{
              background: activeTab === "today" ? "white" : "transparent",
              color: activeTab === "today" ? green : muted,
              boxShadow: activeTab === "today" ? "0 2px 8px rgba(16,32,26,0.04)" : "none",
            }}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("earlier")}
            className="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
            style={{
              background: activeTab === "earlier" ? "white" : "transparent",
              color: activeTab === "earlier" ? green : muted,
              boxShadow: activeTab === "earlier" ? "0 2px 8px rgba(16,32,26,0.04)" : "none",
            }}
          >
            Earlier
          </button>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-[24px] bg-white border border-slate-100 p-4 flex gap-3 relative transition-all"
                style={{
                  boxShadow: "0 4px 12px rgba(16,32,26,0.02)",
                  opacity: item.read ? 0.78 : 1,
                  borderLeft: !item.read ? `4px solid ${green}` : "1px solid rgba(16,32,26,0.06)",
                }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-xl font-bold flex-shrink-0">
                  {item.icon}
                </span>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                    <span>{item.category}</span>
                    <span>{item.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: ink }}>
                    {item.text}
                  </p>
                  
                  <div className="mt-2.5 flex gap-2">
                    {item.screen && (
                      <button
                        onClick={() => onNavigate(item.screen!)}
                        className="text-[10px] font-bold text-[#34C759] bg-[#f2faf5] px-2.5 py-1 rounded-full hover:bg-[#e4f4ea]"
                      >
                        Act Now
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[10px] font-bold text-[#f43f5e] bg-rose-50 px-2.5 py-1 rounded-full hover:bg-rose-100"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold">
              No notifications in this folder.
            </div>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}
