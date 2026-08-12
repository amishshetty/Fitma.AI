import React from 'react';
import TextLoggingDrawer from '../components/TextLoggingDrawer';

export default function TextLoggingScreen({
  onBack,
  onLogMeal,
  userProfile,
  memories,
}: {
  onBack: () => void;
  onLogMeal: (meal: any) => void;
  userProfile: any;
  memories: any[];
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-slate-50 dark:bg-muted">
      <TextLoggingDrawer onClose={onBack} onLogMeal={onLogMeal} userProfile={userProfile} memories={memories} />
    </div>
  );
}
