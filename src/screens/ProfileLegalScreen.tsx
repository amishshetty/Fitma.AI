import React from 'react';
import ScreenShell from './ScreenShell';
import { ink } from '../constants';

export default function ProfileLegalScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell
      title="Terms of Service"
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
              <strong>1. Acceptance of Terms</strong><br/>
              By accessing and using Fitma.ai, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p>
              <strong>2. Description of Service</strong><br/>
              Fitma.ai provides users with access to a rich collection of resources, including various fitness and nutrition tools, health monitoring capabilities, personalized coaching, and AI services.
            </p>
            <p>
              <strong>3. Medical Disclaimer</strong><br/>
              Fitma.ai is not a medical device. The information provided by this application is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              <strong>4. User Conduct</strong><br/>
              You agree to not use the Service to:
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Upload, post, email, or otherwise transmit any content that is unlawful or harmful.</li>
                <li>Impersonate any person or entity.</li>
                <li>Interfere with or disrupt the Service.</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
