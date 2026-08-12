import React from 'react';
import ScreenShell from './ScreenShell';
import { green, ink, muted } from '../constants';
import { Screen } from '../types';
import {
  Clock,
  Calendar,
  Droplets,
  Utensils,
  Coffee,
  Droplet,
} from 'lucide-react';
import LivaAvatar from '../components/layout/LivaAvatar';

export default function ReminderPreviewScreen({
  onBack,
  onNavigate,
  userName = 'Amish',
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  userName?: string;
}) {
  const firstName = userName.split(' ')[0];

  const previews = [
    {
      reason: 'WORKING LATE',
      time: '8:42 PM',
      tagColor: '#F59E0B',
      tagBg: '#FEF3C7',
      tagIcon: Clock,
      text: `Working late? Don't forget to log your dinner.`,
      actionLabel: 'Log Dinner',
      actionIcon: Utensils,
      screen: 'reminder-meal-flow' as Screen,
    },
    {
      reason: 'MISSED ROUTINE',
      time: '9:15 AM',
      tagColor: '#3B82F6',
      tagBg: '#DBEAFE',
      tagIcon: Calendar,
      text: `Skipped breakfast again, ${firstName}? Keep a routine for better metabolism.`,
      actionLabel: 'Log Breakfast',
      actionIcon: Coffee,
      screen: 'quick-log' as Screen,
    },
    {
      reason: 'HYDRATION CHECK',
      time: '3:00 PM',
      tagColor: '#06B6D4',
      tagBg: '#CFFAFE',
      tagIcon: Droplet,
      text: `You drank 1.3L yesterday. Aim for 2.5L today!`,
      actionLabel: 'Log Water',
      actionIcon: Droplets,
      screen: 'reminder-hydration' as Screen,
    },
  ];

  return (
    <ScreenShell
      title="How Liva Reminds You"
      subtitle="Smart nudges, not noise."
      onBack={onBack}
    >
      <div className="space-y-4 pb-8 mt-2 relative z-10">
        {/* Intro text */}
        <div
          className="bg-card/60 text-card-foreground backdrop-blur-xl p-4 rounded-[20px] flex items-center gap-3 mb-6 border border-white/60"
          style={{ boxShadow: '0 8px 32px rgba(16,32,26,0.05)' }}
        >
          <div className="shrink-0">
            <LivaAvatar size={32} />
          </div>
          <p
            className="text-[13px] font-medium leading-snug text-muted-foreground"
            
          >
            Liva sends{' '}
            <span style={{ color: green, fontWeight: 'bold' }}>
              contextual nudges
            </span>{' '}
            based on your patterns — designed to support, not interrupt.
          </p>
        </div>

        {previews.map((pre, idx) => (
          <div
            key={idx}
            className="bg-card/60 text-card-foreground backdrop-blur-xl border border-white/60 rounded-[20px] p-4 flex flex-col gap-3 relative cursor-pointer transition-transform active:scale-[0.98]"
            style={{
              boxShadow: '0 8px 32px rgba(16, 32, 26, 0.05)',
              animation: `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s backwards`,
            }}
            onClick={() => onNavigate(pre.screen)}
          >
            {/* Top Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <LivaAvatar size={26} />
                <span
                  className="text-[13px] font-bold tracking-tight"
                  style={{ color: green }}
                >
                  Liva
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: pre.tagColor, backgroundColor: pre.tagBg }}
                >
                  <pre.tagIcon size={10} strokeWidth={2.5} />
                  {pre.reason}
                </div>
                <span
                  className="text-[11px] font-semibold text-muted-foreground"
                  
                >
                  {pre.time}
                </span>
              </div>
            </div>

            {/* Body text */}
            <p
              className="text-[13px] font-medium leading-relaxed pl-1 whitespace-pre-line text-foreground"
              
            >
              {pre.text}
            </p>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center mt-1">
              <button
                className="px-5 py-2.5 rounded-full text-[12px] font-bold text-muted-foreground bg-slate-50 dark:bg-muted hover:bg-slate-50 dark:hover:bg-muted transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Dismiss
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(pre.screen);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[12px] font-bold text-white transition-transform active:scale-95 shadow-sm hover:opacity-90"
                style={{
                  background: `linear-gradient(90deg, ${green}, #2db34a)`,
                }}
              >
                <pre.actionIcon size={14} strokeWidth={2.5} />
                {pre.actionLabel} &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ScreenShell>
  );
}
