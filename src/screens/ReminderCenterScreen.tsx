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
          <button 
            onClick={handleMarkAllRead}
            className="flex-1 flex items-center justify-center rounded-xl bg-white text-[13px] font-semibold transition-all hover:bg-slate-50"
            style={{ color: "#475569", border: "1px solid #dcf4e6", minHeight: "56px" }}
          >
            Mark All Read
          </button>
          <button
            onClick={() => onNavigate("reminder-settings")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl text-white text-[13px] font-semibold transition-all hover:opacity-90"
            style={{ background: "#34C759", minHeight: "56px", boxShadow: "0 8px 16px rgba(52,199,89,0.2)" }}
          >
            <div className="text-left leading-tight">
              Smart<br/>Reminders
            </div>
            <TrendingUp size={14} />
          </button>
        </div>
      }
    >
      <div className="space-y-4 pb-8">
        {/* Tab Selectors */}
        <div className="flex bg-[#f4f9f6] p-1 rounded-2xl relative mb-6">
          <div 
            className="absolute top-1 bottom-1 w-1/2 bg-[#34C759] rounded-xl transition-transform duration-300 shadow-sm"
            style={{
              transform: `translateX(${activeTab === 'today' ? '0%' : '100%'})`,
            }}
          />
          {["today", "earlier"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "today" | "earlier")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl relative z-10 transition-colors duration-300 capitalize ${activeTab === tab ? 'text-white' : 'text-[#6d8779]'}`}
            >
              {tab}
            </button>
          ))}
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
                  
                  <div className="mt-3 flex gap-2.5">
                    {item.screen && (
                      <button
                        onClick={() => onNavigate(item.screen!)}
                        className="text-[11px] font-bold text-[#34C759] bg-white border border-[#dcf4e6] px-3.5 py-1.5 rounded-xl hover:bg-[#f4f9f6] transition-colors"
                      >
                        Act Now
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
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
