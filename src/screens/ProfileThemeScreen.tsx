import React from 'react';
import ScreenShell from './ScreenShell';
import { useTheme } from '../providers/ThemeProvider';
import { ink, green } from '../constants';

export default function ProfileThemeScreen({ onBack }: { onBack: () => void }) {
  const { theme, setTheme } = useTheme();

  return (
    <ScreenShell
      title="Appearance"
      subtitle="Choose how Fitma.ai looks"
      onBack={onBack}
    >
      <div className="space-y-4 pb-8">
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4 transition-colors"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          {[
            {
              id: 'light',
              label: 'Light',
              desc: 'Always use light appearance',
            },
            {
              id: 'dark',
              label: 'Dark',
              desc: 'Always use dark appearance',
            },
            {
              id: 'system',
              label: 'System default',
              desc: 'Follow your device appearance',
            },
          ].map((option) => (
            <div
              key={option.id}
              onClick={() => setTheme(option.id)}
              className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-border/50 last:border-0 last:pb-0 cursor-pointer group"
              aria-label={`Theme, ${option.label}, ${theme === option.id ? 'selected' : 'unselected'}`}
            >
              <div>
                <span
                  className="text-xs font-bold block transition-colors"

                >
                  {option.label}
                </span>
                <span className="text-[9px] text-muted-foreground block mt-0.5">
                  {option.desc}
                </span>
              </div>
              
              <div 
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  theme === option.id 
                    ? `border-transparent` 
                    : 'border-slate-100 dark:border-border/50 group-hover:border-slate-100 dark:border-border/50'
                }`}
                style={{
                  background: theme === option.id ? green : 'transparent'
                }}
              >
                {theme === option.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-card text-card-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
