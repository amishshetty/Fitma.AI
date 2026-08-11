import React from 'react';

export default function PhoneFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden sm:p-6"
      style={{
        background:
          'linear-gradient(135deg, #e9faef 0%, #d9f7ef 45%, #eef7ff 100%)',
      }}
    >
      <div className="absolute left-8 top-8 hidden h-56 w-56 rounded-full bg-[#34C759]/25 blur-3xl sm:block" />
      <div className="absolute bottom-8 right-6 hidden h-64 w-64 rounded-full bg-[#00C4B0]/20 blur-3xl sm:block" />
      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-background sm:h-[812px] sm:max-h-[812px] sm:max-w-sm sm:rounded-[44px] sm:shadow-[0_32px_80px_rgba(16,32,26,0.18),0_0_0_1px_rgba(255,255,255,0.72)]"
        style={{
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        }}
      >
        {children}
      </div>
    </div>
  );
}
