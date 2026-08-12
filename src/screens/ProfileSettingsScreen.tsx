import React, { useState } from 'react';
import ScreenShell from './ScreenShell';
import { ink, green } from '../constants';
import { Screen } from '../types';
import { useTheme } from '../providers/ThemeProvider';
import { ChevronRight } from 'lucide-react';
import CustomDropdown from '../components/ui/CustomDropdown';

export default function ProfileSettingsScreen({
  onBack,
  onNavigate,
  onLogout,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}) {
  const [offlineMode, setOfflineMode] = useState(false);
  const { theme, setTheme, largeText, setLargeText, highContrast, setHighContrast } = useTheme();

  return (
    <ScreenShell
      title="General Settings"
      subtitle="Granular accessibility and database configuration."
      onBack={onBack}
      footer={
        <button
          onClick={onLogout}
          className="w-full bg-rose-50 text-[#f43f5e] hover:bg-rose-100 transition-colors py-3 rounded-2xl text-xs font-bold"
        >
          Logout Account
        </button>
      }
    >
      <div className="space-y-4 pb-8">
        {/* Appearance Settings */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4 transition-colors"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Appearance
          </h3>

          <div className="space-y-1">
            <span className="text-xs font-bold block mb-1">
              Theme
            </span>
            <CustomDropdown
              value={theme.charAt(0).toUpperCase() + theme.slice(1)}
              options={['Light', 'Dark', 'System']}
              onChange={(val) => setTheme(val.toLowerCase() as 'light' | 'dark' | 'system')}
            />
          </div>
        </div>

        {/* Settings categories */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4 transition-colors"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Accessibility Features
          </h3>

          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-border/50">
            <div>
              <span className="text-xs font-bold block">
                Large Text Size
              </span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                Scale interface typography for visibility
              </span>
            </div>
            <button
              onClick={() => setLargeText(!largeText)}
              className="w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center justify-start"
              style={{
                background: largeText ? green : '#cbd5e1',
                justifyContent: largeText ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-card text-card-foreground shadow inline-block" />
            </button>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-border/50">
            <div>
              <span className="text-xs font-bold block">
                High Contrast Mode
              </span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                Deep darks and high ratio alerts
              </span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className="w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center justify-start"
              style={{
                background: highContrast ? green : '#cbd5e1',
                justifyContent: highContrast ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-card text-card-foreground shadow inline-block" />
            </button>
          </div>
        </div>

        {/* Offline cache settings */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4 transition-colors"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Offline Synchronizer
          </h3>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold block">
                Offline Mode
              </span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                Save meals locally when internet drops
              </span>
            </div>
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className="w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center justify-start"
              style={{
                background: offlineMode ? green : '#cbd5e1',
                justifyContent: offlineMode ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-card text-card-foreground shadow inline-block" />
            </button>
          </div>
        </div>

        {/* About Settings */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4 transition-colors"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            About
          </h3>

          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-border/50">
            <div>
              <span className="text-xs font-bold block">
                App Version
              </span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">0.9.4 Prototype</span>
          </div>

          <div 
            onClick={() => onNavigate('profile-legal')}
            className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-border/50 cursor-pointer group"
          >
            <div>
              <span className="text-xs font-bold block transition-colors group-hover:text-emerald-500">
                Terms of Service
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <div 
            onClick={() => onNavigate('profile-privacy-policy')}
            className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-border/50 cursor-pointer group"
          >
            <div>
              <span className="text-xs font-bold block transition-colors group-hover:text-emerald-500">
                Privacy Policy
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <div 
            onClick={() => onNavigate('profile-licenses')}
            className="flex justify-between items-center cursor-pointer group"
          >
            <div>
              <span className="text-xs font-bold block transition-colors group-hover:text-emerald-500">
                Open-source Licenses
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* System Info */}
        <div className="text-center text-[10px] text-muted-foreground font-semibold space-y-0.5">
          <p>© 2026 Fitma Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </ScreenShell>
  );
}
