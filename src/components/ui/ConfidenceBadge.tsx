import { Sparkles } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { softGreen } from "../../constants";

export default function ConfidenceBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold" style={{ background: softGreen, color: "#197a38" }}>
      <Sparkles size={12} />
      {value}% confident
    </span>
  );
}
