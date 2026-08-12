import React from 'react';
import ScreenShell from './ScreenShell';
import { ink } from '../constants';

export default function ProfilePrivacyPolicyScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell
      title="Privacy Policy"
      subtitle="Last updated: August 2026"
      onBack={onBack}
    >
      <div className="space-y-4 pb-8">
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border space-y-4"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              <strong>1. Information We Collect</strong><br/>
              Fitma.ai collects information you provide directly to us when you create an account, log meals, track activities, or communicate with Liva (our AI assistant).
            </p>
            <p>
              <strong>2. How We Use Information</strong><br/>
              We use the information we collect to provide, maintain, and improve our services, to personalize your experience, and to provide recommendations tailored to your goals.
            </p>
            <p>
              <strong>3. Data Security</strong><br/>
              We implement appropriate technical and organizational security measures to protect your personal data against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure.
            </p>
            <p>
              <strong>4. Your Rights</strong><br/>
              You have the right to access, update, or delete your information at any time through the profile settings or by contacting our support team.
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
