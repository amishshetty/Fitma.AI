import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";

export default function ProfileHelpScreen({ onBack }: { onBack: () => void }) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How accurate is Liva's meal recognition?", a: "Liva uses state-of-the-art vision networks trained on millions of dietary elements, averaging 94-96% macro estimation accuracy." },
    { q: "Can I connect my Apple Watch?", a: "Yes, go to Connected Devices under your Profile to sync calorie forecasts with workout stats." },
  ];

  return (
    <ScreenShell
      title="Help & Support FAQs"
      subtitle="Find quick fixes or contact the developers."
      onBack={onBack}
    >
      <div className="space-y-4 pb-8">
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Frequently Asked Questions</h3>
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-slate-50 last:border-b-0 pb-3 last:pb-0">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center text-xs font-bold text-left"
                style={{ color: ink }}
              >
                <span>{faq.q}</span>
                <span className="text-slate-400">{expandedFaq === idx ? "−" : "+"}</span>
              </button>
              {expandedFaq === idx && (
                <p className="mt-2 text-xs leading-relaxed text-slate-500 font-semibold">{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* Feature Suggestion Ticket */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Bug or Suggest Feature</h3>
          <textarea
            className="w-full bg-slate-50 p-3.5 rounded-xl border-none outline-none text-xs min-h-20"
            placeholder="Type your feedback details..."
          />
          <button className="w-full bg-[#34c759] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#25ad48]">
            Submit Support Request
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
