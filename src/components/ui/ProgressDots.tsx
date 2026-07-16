import React, { useState, useEffect, useRef, useMemo } from "react";
import { green } from "../../constants";

export default function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className="h-1.5 rounded-full transition-all"
          style={{ width: index === current ? 22 : 7, background: index === current ? green : "#cfebd8" }}
        />
      ))}
    </div>
  );
}
