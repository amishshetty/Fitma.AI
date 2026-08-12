import { motion } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PrimaryButton from '../components/ui/PrimaryButton';
import ScreenShell from './ScreenShell';
import { ink } from '../constants';
import { Screen } from '../types';
import { Plus } from 'lucide-react';
import CustomDropdown from '../components/ui/CustomDropdown';

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
  onUpdatePersonal: (
    name: string,
    email: string,
    phone: string,
    gender: string,
    height: string,
    units: string
  ) => void;
}) {
  const [name, setName] = useState(initialName || '');
  const [gender, setGender] = useState(initialGender || '');
  const [height, setHeight] = useState(initialHeight || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [units, setUnits] = useState('Metric (kg, cm)');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!phone || phone.trim() === '') {
      setError('Please add your phone number to continue.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    onUpdatePersonal(name, email, phone, gender, height, units);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  return (
    <ScreenShell
      title="Personal Information"
      subtitle="Edit your contact and body metrics. Auto-saved."
      onBack={onBack}
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
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-4 bg-red-50 text-red-700 text-xs font-bold border border-red-200"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <div 
            className="flex items-center gap-4 border-b border-slate-100 dark:border-border/50 pb-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileClick}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  // Profile photo upload logic goes here in the future
                  console.log('Selected file:', e.target.files[0]);
                }
              }}
            />
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-muted flex items-center justify-center text-muted-foreground font-black">
                {name ? name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-4.5 w-4.5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-card shadow-sm">
                <Plus size={10} className="text-white" strokeWidth={4} />
              </div>
            </div>
            <div>
              <span className="text-xs font-bold block text-foreground" >
                Change profile photo
              </span>
              <span className="text-[9px] text-muted-foreground font-semibold block mt-0.5">
                JPG or PNG. Max 2MB
              </span>
            </div>
          </div>

          {[
            { label: 'Full Name', value: name, setter: setName },
            { label: 'Gender', value: gender, setter: setGender, options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
            { label: 'Height', value: height, setter: setHeight },
            { label: 'Email Address', value: email, setter: setEmail },
            { label: 'Phone Number', value: phone, setter: setPhone, placeholder: 'Please add your phone number' },
            { label: 'Preferred Units', value: units, setter: setUnits },
          ].map((field) => (
            <div key={field.label} className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                {field.label}
              </label>
              {field.options ? (
                <CustomDropdown
                  value={field.value}
                  options={field.options}
                  onChange={(val) => field.setter(val)}
                  placeholder={`Select ${field.label.toLowerCase()}`}
                />
              ) : (
                <input
                  type="text"
                  className={`w-full bg-slate-50 dark:bg-muted p-3 rounded-xl border-none outline-none font-bold text-xs text-foreground ${field.label === 'Preferred Units' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  value={field.value}
                  placeholder={field.placeholder || ''}
                  readOnly={field.label === 'Preferred Units'}
                  onChange={(e) => field.setter(e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          <PrimaryButton onClick={handleSave}>Save Personal Data</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
