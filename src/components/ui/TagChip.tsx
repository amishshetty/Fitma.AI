import React, { useState, useEffect, useRef, useMemo } from "react";
import { ink } from "../../constants";

export default function TagChip({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-white px-4 py-2 text-sm font-semibold"
      style={{ color: ink, border: "1px solid rgba(52,199,89,0.16)" }}
    >
      {children}
    </button>
  );
}
