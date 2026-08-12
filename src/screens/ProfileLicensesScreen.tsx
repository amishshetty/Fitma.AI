import React from 'react';
import ScreenShell from './ScreenShell';
import { ink } from '../constants';

export default function ProfileLicensesScreen({ onBack }: { onBack: () => void }) {
  const licenses = [
    { name: 'React', version: '18.3.1', type: 'MIT' },
    { name: 'React DOM', version: '18.3.1', type: 'MIT' },
    { name: 'Tailwind CSS', version: '3.4.10', type: 'MIT' },
    { name: 'Radix UI', version: '1.0.0', type: 'MIT' },
    { name: 'Lucide React', version: '0.428.0', type: 'ISC' },
    { name: 'Framer Motion', version: '11.3.28', type: 'MIT' },
    { name: 'Vite', version: '5.4.1', type: 'MIT' },
  ];

  return (
    <ScreenShell
      title="Open-source Licenses"
      subtitle="Third-party software used in Fitma.ai"
      onBack={onBack}
    >
      <div className="space-y-4 pb-8">
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <div className="space-y-4">
            {licenses.map((lib, i) => (
              <div key={i} className="pb-3 border-b border-slate-100 dark:border-border/50 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className="text-xs font-bold block"
                     
                    >
                      {lib.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">
                      Version {lib.version}
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-muted border border-slate-100 dark:border-border">
                    <span className="text-[9px] font-medium text-muted-foreground">{lib.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-border text-[10px] text-muted-foreground leading-relaxed">
            The licenses for most software and their open source code are included with the distributions. 
            All other rights are reserved by their respective copyright holders.
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
