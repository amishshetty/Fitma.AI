import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green } from "../constants";
import { Screen } from "../types";

export default function ProfilePrivacyScreen({
  onBack,
  onDeleteAccount,
}: {
  onBack: () => void;
  onDeleteAccount: (password: string) => Promise<boolean>;
}) {
  const [faceId, setFaceId] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleting(true);
    const success = await onDeleteAccount(confirmPassword);
    setDeleting(false);
    if (success) {
      setShowConfirmDelete(false);
    }
  };

  return (
    <ScreenShell
      title="Privacy & Security"
      subtitle="Configure data permissions and cryptographic encryption keys."
      onBack={onBack}
    >
      <div className="space-y-4 pb-8 relative">
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-4" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <div>
              <span className="text-xs font-bold block" style={{ color: ink }}>Biometric Login</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Use Face ID to lock critical health files</span>
            </div>
            <button
              onClick={() => setFaceId(!faceId)}
              className="w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center justify-start"
              style={{
                background: faceId ? green : "#cbd5e1",
                justifyContent: faceId ? "flex-end" : "flex-start",
              }}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow inline-block" />
            </button>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <div>
              <span className="text-xs font-bold block" style={{ color: ink }}>End-to-End Encryption</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Strict database storage protection</span>
            </div>
            <span className="text-xs font-bold text-[#34C759]">Active</span>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Data exports</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-slate-50 hover:bg-slate-100 text-[10px] font-bold p-2.5 rounded-xl text-slate-600 text-center">
                Download JSON Data
              </button>
              <button className="bg-slate-50 hover:bg-slate-100 text-[10px] font-bold p-2.5 rounded-xl text-slate-600 text-center">
                Export PDF Audit
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone: Account Deletion (User Story 32) */}
        <div className="rounded-[24px] bg-red-50/50 p-5 border border-red-100 space-y-3.5" style={{ boxShadow: "0 6px 18px rgba(220,38,38,0.02)" }}>
          <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Danger Zone</h3>
          <div>
            <span className="text-xs font-bold block text-slate-700">Delete Your Account</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              Permanently erase your nutrition history, goals, and Liva memories. This cannot be undone.
            </span>
          </div>
          <button 
            onClick={() => setShowConfirmDelete(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Delete Account
          </button>
        </div>

        {/* Deletion Dialog Overlay */}
        {showConfirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[28px] p-6 text-center space-y-4 max-w-[290px] w-full"
              style={{ boxShadow: "0 20px 48px rgba(16,32,26,0.16)" }}
            >
              <span className="text-4xl block">⚠</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-700">Are you absolutely sure?</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  To verify your identity, please enter your password below to confirm deletion.
                </p>
              </div>
              <form onSubmit={handleDelete} className="space-y-3">
                <input
                  type="password"
                  required
                  placeholder="Enter Password"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-100 outline-none font-bold text-xs text-center text-slate-700"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl text-[10px] font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    {deleting ? <Loader2 size={12} className="animate-spin" /> : "Delete"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
