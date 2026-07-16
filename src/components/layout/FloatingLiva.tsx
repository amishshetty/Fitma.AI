import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "./LivaAvatar";

export default function FloatingLiva({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-5 z-10 border-0 bg-transparent outline-none cursor-pointer"
      aria-label="Ask Liva Voice Assistant"
    >
      <LivaAvatar floating />
    </button>
  );
}
