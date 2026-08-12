import { motion } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PrimaryButton from '../components/ui/PrimaryButton';
import ScreenShell from './ScreenShell';
import { ink, green, muted } from '../constants';
import { Screen } from '../types';

export default function ProfileHealthScreen({
  onBack,
  activity: initialActivity,
  preferences: initialPreferences,
  allergies: initialAllergies,
  onUpdateHealth,
}: {
  onBack: () => void;
  activity: 'sedentary' | 'light' | 'moderate' | 'athlete';
  preferences: any;
  allergies: any;
  onUpdateHealth: (activity: any, preferences: any, allergies: any) => void;
}) {
  const [activity, setActivity] = useState(initialActivity);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [allergies, setAllergies] = useState(initialAllergies);
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [bloodReportUploaded, setBloodReportUploaded] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePref = (key: string) => {
    setPreferences((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllergy = (key: string) => {
    setAllergies((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddCustomAllergy = () => {
    if (!customAllergyInput.trim()) return;
    setAllergies((prev: any) => ({
      ...prev,
      custom: [...(prev.custom || []), customAllergyInput.trim()],
    }));
    setCustomAllergyInput('');
  };

  const handleRemoveCustomAllergy = (allergyToRemove: string) => {
    setAllergies((prev: any) => ({
      ...prev,
      custom: (prev.custom || []).filter((a: string) => a !== allergyToRemove),
    }));
  };

  const handleUpload = () => {
    setBloodReportUploaded(true);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  const handleSave = () => {
    onUpdateHealth(activity, preferences, allergies);
    onBack();
  };

  return (
    <ScreenShell
      title="Health Profile"
      subtitle="Medical markers and activity details used by Liva."
      onBack={onBack}
      footer={
        <PrimaryButton onClick={handleSave}>Save preferences</PrimaryButton>
      }
    >
      <div className="space-y-5 pb-8">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 bg-[#f2faf5] text-[#197a38] text-xs font-bold border border-[#34c759]/20"
          >
            ✓ Success: Blood report uploaded and synchronized.
          </motion.div>
        )}

        {/* Activity Level pills */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Lifestyle Activity
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                key: 'sedentary',
                label: 'Sedentary',
                desc: 'Desk job, low movement',
              },
              {
                key: 'light',
                label: 'Lightly Active',
                desc: 'Occasional walking',
              },
              {
                key: 'moderate',
                label: 'Moderately Active',
                desc: 'Daily workouts',
              },
              {
                key: 'athlete',
                label: 'Athlete Mode',
                desc: 'Extreme sports focus',
              },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActivity(item.key as any)}
                className={`rounded-2xl p-3.5 text-left border transition-all text-xs font-bold ${
                  activity === item.key 
                  ? 'bg-[#f2faf5] dark:bg-primary/10 border-[#34C759] dark:border-primary/50 text-[#34C759] dark:text-primary' 
                  : 'bg-white dark:bg-muted border-slate-100 dark:border-border text-foreground'
                }`}
              >
                <span className="block">{item.label}</span>
                <span className="text-[9px] text-muted-foreground font-medium block mt-0.5">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Preferences tags */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5">
            Dietary Preferences
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'veg', label: 'Vegetarian' },
              { key: 'egg', label: 'Eggetarian' },
              { key: 'nonveg', label: 'Non-Vegetarian' },
              { key: 'vegan', label: 'Vegan' },
              { key: 'jain', label: 'Jain Food' },
            ].map((diet) => {
              const active = (preferences as any)[diet.key];
              return (
                <button
                  key={diet.key}
                  onClick={() => togglePref(diet.key)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all border ${
                    active 
                    ? 'bg-[#34C759] dark:bg-primary border-[#34C759] dark:border-primary text-white' 
                    : 'bg-[#f8fdfb] dark:bg-muted border-[#e2eae6] dark:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {diet.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Allergies */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5">
            Allergies
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'peanuts', label: '🥜 Peanuts' },
              { key: 'gluten', label: '🌾 Gluten' },
              { key: 'dairy', label: '🥛 Dairy Lactose' },
              { key: 'shellfish', label: '🦐 Shellfish' },
            ].map((allergy) => {
              const active = (allergies as any)[allergy.key];
              return (
                <button
                  key={allergy.key}
                  onClick={() => toggleAllergy(allergy.key)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all border ${
                    active 
                    ? 'bg-[#f43f5e] border-[#f43f5e] text-white' 
                    : 'bg-[#fbf8f9] dark:bg-muted border-[#e2eae6] dark:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {allergy.label}
                </button>
              );
            })}
          </div>

          {/* Custom Allergies Input */}
          <div className="mt-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              Other Allergies
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAllergyInput}
                onChange={(e) => setCustomAllergyInput(e.target.value)}
                placeholder="e.g. Soy, Tree Nuts..."
                className="flex-1 bg-slate-50 dark:bg-background border border-slate-200 dark:border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[#34c759]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomAllergy();
                }}
              />
              <button
                onClick={handleAddCustomAllergy}
                disabled={!customAllergyInput.trim()}
                className="bg-[#f2faf5] dark:bg-primary/10 text-[#34c759] dark:text-primary px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
              >
                Add
              </button>
            </div>
            {allergies.custom && allergies.custom.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {allergies.custom.map((item: string, idx: number) => (
                  <div key={idx} className="bg-[#fbf8f9] dark:bg-muted border border-[#e2eae6] dark:border-border text-foreground px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveCustomAllergy(item)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Blood report upload */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border text-center opacity-40 pointer-events-none"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-left mb-3">
            Report Synchronizer (Coming Soon)
          </h3>
          <div className="border-2 border-dashed border-slate-100 dark:border-border rounded-2xl p-6 bg-slate-50 dark:bg-muted flex flex-col justify-center items-center gap-3">
            <span className="text-3xl">📄</span>
            {bloodReportUploaded ? (
              <span className="text-xs font-bold text-[#197a38]">
                Report_July_2026.pdf synced
              </span>
            ) : (
              <>
                <div>
                  <span className="text-xs font-bold block text-muted-foreground">
                    Upload Blood Report
                  </span>
                  <span className="text-[9px] text-muted-foreground block mt-0.5">
                    Let Liva adjust micronutrient goals automatically
                  </span>
                </div>
                <button
                  onClick={handleUpload}
                  className="rounded-full bg-card text-card-foreground px-4 py-1.5 text-[10px] font-bold border border-[#34c759] text-[#34c759]"
                >
                  Upload File
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
