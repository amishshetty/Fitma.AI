import React from "react";
import TextLoggingDrawer from "../components/TextLoggingDrawer";

export default function TextLoggingScreen({
  onBack,
  onLogMeal,
}: {
  onBack: () => void;
  onLogMeal: (meal: any) => void;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-slate-50">
      <TextLoggingDrawer onClose={onBack} onLogMeal={onLogMeal} />
    </div>
  );
}
