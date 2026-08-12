import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ScreenShell from './ScreenShell';
import { ink, green } from '../constants';
import { Screen } from '../types';

export default function ProfilePrivacyScreen({
  onBack,
  onDeleteAccount,
}: {
  onBack: () => void;
  onDeleteAccount: (password: string) => Promise<boolean>;
}) {
  const [faceId, setFaceId] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [livaContext, setLivaContext] = useState(true);
  const [aiTraining, setAiTraining] = useState(false);
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showClearMemory, setShowClearMemory] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
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
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-border/50">
            <div>
              <span className="text-sm font-bold block text-foreground" >
                Biometric Login
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                Use Face ID to lock critical health files
              </span>
            </div>
            <button
              onClick={() => setFaceId(!faceId)}
              className="w-12 h-6 rounded-full p-0.5 transition-all flex items-center justify-start shrink-0"
              style={{
                background: faceId ? green : '#cbd5e1',
                justifyContent: faceId ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="w-5 h-5 rounded-full bg-card text-card-foreground shadow inline-block" />
            </button>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-border/50">
            <div>
              <span className="text-sm font-bold block text-foreground" >
                Two-Factor Auth
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                Require a code for new logins
              </span>
            </div>
            <button
              onClick={() => setTwoFactor(!twoFactor)}
              className="w-12 h-6 rounded-full p-0.5 transition-all flex items-center justify-start shrink-0"
              style={{
                background: twoFactor ? green : '#cbd5e1',
                justifyContent: twoFactor ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="w-5 h-5 rounded-full bg-card text-card-foreground shadow inline-block" />
            </button>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-border/50">
            <div>
              <span className="text-sm font-bold block text-foreground" >
                End-to-End Encryption
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                Strict database storage protection
              </span>
            </div>
            <span className="text-sm font-bold text-[#34C759]">Active</span>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Health Data exports
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-slate-50 dark:bg-muted hover:bg-slate-50 dark:hover:bg-muted text-[11px] font-bold p-3 rounded-xl text-muted-foreground text-center">
                Download JSON Data
              </button>
              <button className="bg-slate-50 dark:bg-muted hover:bg-slate-50 dark:hover:bg-muted text-[11px] font-bold p-3 rounded-xl text-muted-foreground text-center">
                Export PDF Audit
              </button>
            </div>
          </div>
        </div>

        {/* Liva AI Privacy */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-border/50">
            <div>
              <span className="text-sm font-bold block text-foreground" >
                Liva Context Access
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5 max-w-[220px]">
                Allow Liva to read past logs and custom memories for personalization
              </span>
            </div>
            <button
              onClick={() => setLivaContext(!livaContext)}
              className="w-12 h-6 rounded-full p-0.5 transition-all flex items-center justify-start shrink-0"
              style={{
                background: livaContext ? green : '#cbd5e1',
                justifyContent: livaContext ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="w-5 h-5 rounded-full bg-card text-card-foreground shadow inline-block" />
            </button>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-border/50">
            <div>
              <span className="text-sm font-bold block text-foreground" >
                AI Model Training
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5 max-w-[220px]">
                Opt-in to use anonymized data to improve Fitma.ai models
              </span>
            </div>
            <button
              onClick={() => setAiTraining(!aiTraining)}
              className="w-12 h-6 rounded-full p-0.5 transition-all flex items-center justify-start shrink-0"
              style={{
                background: aiTraining ? green : '#cbd5e1',
                justifyContent: aiTraining ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="w-5 h-5 rounded-full bg-card text-card-foreground shadow inline-block" />
            </button>
          </div>

          <div>
            <button
              onClick={() => setShowClearMemory(true)}
              className="w-full bg-slate-50 dark:bg-muted hover:bg-slate-100 dark:hover:bg-muted/80 text-foreground py-3 rounded-2xl text-sm font-bold transition-all border border-slate-100 dark:border-border"
            >
              Clear Liva's Memory
            </button>
          </div>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-red-100 dark:border-red-900/30 space-y-4"
          style={{ boxShadow: '0 6px 18px rgba(220,38,38,0.04)' }}
        >
          <div className="flex flex-col">
            <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-2">
              Danger Zone
            </h3>
            <span className="text-sm font-bold block text-foreground">
              Delete Your Account
            </span>
            <span className="text-xs text-muted-foreground block mt-1 leading-relaxed">
              Permanently erase all your data. This cannot be undone.
            </span>
          </div>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-sm shadow-red-500/20"
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
              className="bg-card text-card-foreground rounded-[28px] p-6 text-center space-y-4 max-w-[290px] w-full"
              style={{ boxShadow: '0 20px 48px rgba(16,32,26,0.16)' }}
            >
              <span className="text-4xl block">⚠</span>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  Are you absolutely sure?
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  To verify your identity, please enter your password below to
                  confirm deletion.
                </p>
              </div>
              <form onSubmit={handleDelete} className="space-y-3">
                <input
                  type="password"
                  required
                  placeholder="Enter Password"
                  className="w-full bg-slate-50 dark:bg-muted p-2.5 rounded-xl border border-slate-100 dark:border-border outline-none font-bold text-xs text-center text-foreground"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="flex-1 bg-slate-50 dark:bg-muted hover:bg-border text-muted-foreground py-2 rounded-xl text-[10px] font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    {deleting ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Clear Memory Dialog Overlay */}
        {showClearMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card text-card-foreground rounded-[28px] p-6 text-center space-y-4 max-w-[290px] w-full"
              style={{ boxShadow: '0 20px 48px rgba(16,32,26,0.16)' }}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center mx-auto">
                <span className="text-xl block">🧠</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  Clear AI Memory?
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  Liva will forget all personalized facts you've taught it. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClearMemory(false)}
                  className="flex-1 bg-slate-50 dark:bg-muted hover:bg-border text-muted-foreground py-2.5 rounded-xl text-[10px] font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('liva_memories');
                    setShowClearMemory(false);
                  }}
                  className="flex-1 bg-foreground text-background hover:opacity-90 py-2.5 rounded-xl text-[10px] font-bold transition-all"
                >
                  Clear Memory
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
