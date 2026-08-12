import { motion } from 'motion/react';
import React, { useState } from 'react';
import PrimaryButton from '../components/ui/PrimaryButton';
import ScreenShell from './ScreenShell';
import { ink } from '../constants';
import { Camera, User, Mail, Phone, Ruler, Fingerprint, ChevronDown } from 'lucide-react';

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
  const [name, setName] = useState(initialName || 'Amish Shetty');
  const [gender, setGender] = useState(initialGender || 'Male');
  const [height, setHeight] = useState(initialHeight || '178');
  const [email, setEmail] = useState(initialEmail || 'amish.shetty@example.com');
  const [phone, setPhone] = useState(initialPhone || '9876543210');
  const [units, setUnits] = useState(initialUnits || 'Metric (kg, cm)');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    onUpdatePersonal(name, email, phone, gender, height, units);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  const InputField = ({ label, icon: Icon, value, onChange, type = 'text', prefix = '' }: any) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative flex items-center group">
        <div className="absolute left-4 text-slate-400 transition-colors group-focus-within:text-blue-500">
          <Icon size={16} strokeWidth={2.5} />
        </div>
        {prefix && (
          <div className="absolute left-10 text-sm font-bold text-slate-700 border-r border-slate-200 pr-2">
            {prefix}
          </div>
        )}
        <input
          type={type}
          className={`w-full bg-slate-50/80 p-3.5 rounded-2xl border-2 border-transparent outline-none font-bold text-sm text-slate-800 transition-all focus:bg-white focus:border-blue-500/20 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] ${prefix ? 'pl-20' : 'pl-11'}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <ScreenShell
      title="Personal Information"
      subtitle="Edit your contact and body metrics. Auto-saved."
      onBack={onBack}
      footer={
        <PrimaryButton onClick={handleSave}>Save Personal Data</PrimaryButton>
      }
    >
      <div className="space-y-6 pb-8 relative">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-4 bg-green-50 text-green-700 text-sm font-bold border border-green-200 shadow-sm flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
            Profile information updated successfully.
          </motion.div>
        )}

        <div className="flex flex-col items-center pt-2 pb-4">
          <div className="relative mb-3 group cursor-pointer">
            <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-lg border-4 border-white bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-2xl shadow-md border-[3px] border-[#f2faf5] flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Camera size={16} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-lg font-extrabold text-slate-800">{name}</h2>
          <p className="text-xs font-bold text-slate-400">High Level Member</p>
        </div>

        <div
          className="rounded-[32px] bg-white p-6 border border-slate-100/50 space-y-5"
          style={{ boxShadow: '0 8px 32px rgba(16,32,26,0.04)' }}
        >
          <InputField label="Full Name" icon={User} value={name} onChange={setName} />
          <InputField label="Email Address" icon={Mail} type="email" value={email} onChange={setEmail} />
          
          <InputField label="Phone Number" icon={Phone} type="tel" value={phone} onChange={setPhone} prefix="+91" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Gender
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-slate-400">
                  <Fingerprint size={16} strokeWidth={2.5} />
                </div>
                <select
                  className="w-full appearance-none bg-slate-50/80 p-3.5 pl-11 rounded-2xl border-2 border-transparent outline-none font-bold text-sm text-slate-800 transition-all focus:bg-white focus:border-blue-500/20 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <InputField label="Height (cm)" icon={Ruler} type="number" value={height} onChange={setHeight} />
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
