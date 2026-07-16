import React, { useState, useEffect, useRef, useMemo } from "react";

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-6"
      style={{ background: "linear-gradient(135deg, #e9faef 0%, #d9f7ef 45%, #eef7ff 100%)" }}
    >
      <div className="absolute left-8 top-8 h-56 w-56 rounded-full bg-[#34C759]/25 blur-3xl" />
      <div className="absolute bottom-8 right-6 h-64 w-64 rounded-full bg-[#00C4B0]/20 blur-3xl" />
      <div
        className="relative flex h-[812px] max-h-[812px] w-full max-w-sm flex-col overflow-hidden bg-background"
        style={{
          borderRadius: 44,
          boxShadow: "0 32px 80px rgba(16,32,26,0.18), 0 0 0 1px rgba(255,255,255,0.72)",
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        }}
      >
        {children}
      </div>
    </div>
  );
}
