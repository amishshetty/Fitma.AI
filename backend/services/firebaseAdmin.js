import { initializeApp, cert, getApps } from 'firebase-admin/app';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Attempt to load the service account key
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

try {
  if (!getApps().length) {
    let serviceAccount;
    
    if (serviceAccountKey) {
      // Check if it's a file path or a JSON string
      if (serviceAccountKey.trim().startsWith('{')) {
        // It's a JSON string (Vercel)
        serviceAccount = JSON.parse(serviceAccountKey);
      } else if (fs.existsSync(path.resolve(serviceAccountKey))) {
        // It's a file path (Local)
        serviceAccount = JSON.parse(fs.readFileSync(path.resolve(serviceAccountKey), 'utf8'));
      }
    }

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://fitma-ai-default-rtdb.asia-southeast1.firebasedatabase.app'
      });
      console.log('[Firebase Admin] Initialized successfully with service account.');
    } else {
      initializeApp({
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://fitma-ai-default-rtdb.asia-southeast1.firebasedatabase.app'
      });
      console.log('[Firebase Admin] Initialized with application default credentials (or local mock).');
    }
  }
} catch (error) {
  console.warn('[Firebase Admin] Failed to initialize (mock mode active):', error.message);
}

export default {};
