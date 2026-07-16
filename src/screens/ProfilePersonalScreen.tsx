import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";

export default function ProfilePersonalScreen({
  onBack,
  name: initialName,
  email: initialEmail,
  phone: initialPhone,
  gender: initialGender,
  height: initialHeight,
  units: initialUnits,
  onUpdatePersonal,
}: {
  onBack: () => void;
  name: string;
  email: string;
  phone: string;
  gender: string;
  height: string;
  units: string;
  onUpdatePersonal: (name: string, email: string, phone: string, gender: string, height: string, units: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState(initialGender || "Male");
  const [height, setHeight] = useState(initialHeight || "178 cm");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone || "+91 9876543210");
  const [units, setUnits] = useState(initialUnits || "Metric (kg, cm)");
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    onUpdatePersonal(name, email, phone, gender, height, units);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  return (
    <ScreenShell
      title="Personal Information"
      subtitle="Edit your contact and body metrics. Auto-saved."
      onBack={onBack}
      footer={<PrimaryButton onClick={handleSave}>Save Personal Data</PrimaryButton>}
    >
      <div className="space-y-4 pb-8 relative">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-4 bg-[#f2faf5] text-[#197a38] text-xs font-bold border border-[#34c759]/20"
          >
            ✓ Success: Profile information updated successfully.
          </motion.div>
        )}

        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-4" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black">A</div>
            <div>
              <span className="text-xs font-bold block" style={{ color: ink }}>Change profile photo</span>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">JPG or PNG. Max 2MB</span>
            </div>
          </div>

          {[
            { label: "Full Name", value: name, setter: setName },
            { label: "Gender", value: gender, setter: setGender },
            { label: "Height", value: height, setter: setHeight },
            { label: "Email Address", value: email, setter: setEmail },
            { label: "Phone Number", value: phone, setter: setPhone },
            { label: "Preferred Units", value: units, setter: setUnits },
          ].map((field) => (
            <div key={field.label} className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{field.label}</label>
              <input
                type="text"
                className="w-full bg-slate-50 p-3 rounded-xl border-none outline-none font-bold text-xs text-slate-700"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
