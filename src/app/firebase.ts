import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";
import { getDeviceId } from "../utils/deviceInfo";

const firebaseConfig = {
    apiKey: "AIzaSyCyOYXriTx0ivDVjtBaHiesPArYz_1NOMU",
  authDomain: "fitma-ai.firebaseapp.com",
  databaseURL: "https://fitma-ai-default-rtdb.firebaseio.com",
  projectId: "fitma-ai",
  storageBucket: "fitma-ai.firebasestorage.app",
  messagingSenderId: "133103230543",
  appId: "1:133103230543:web:e4d2360d7d015161b6143a",
  measurementId: "G-2VR7YC6KZ6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = typeof window !== 'undefined' && 'serviceWorker' in navigator ? getMessaging(app) : null;

export const requestFirebaseNotificationPermission = async () => {
  if (!messaging) return false;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const fcmToken = await getToken(messaging, { 
        vapidKey: "BMz6RZLTAUqHW2J0zuRwZEK3TwzZbLp_LWqr4NKaSBOK9Mm18c9CnDvpuj_r7XW4PSt7eDAczkaLuJvMtZK5bRU" 
      });
      
      if (fcmToken) {
        console.log("FCM Token:", fcmToken);
        const deviceId = getDeviceId();
        
        // Send token to our backend
        await fetch('/api/notifications/fcm-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fcmToken, deviceId })
        });
        
        return true;
      }
    }
  } catch (error) {
    console.error("Error requesting Firebase notification permission:", error);
  }
  return false;
};
