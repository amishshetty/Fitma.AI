import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

const publicVapidKey = process.env.VAPID_PUBLIC_KEY || "BMz6RZLTAUqHW2J0zuRwZEK3TwzZbLp_LWqr4NKaSBOK9Mm18c9CnDvpuj_r7XW4PSt7eDAczkaLuJvMtZK5bRU";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "gESiDIaI4-3V_T0ExKtq6hmwlKQla-aNjY3HHE_5YzE";

webpush.setVapidDetails(
  "mailto:test@fitma.ai",
  publicVapidKey,
  privateVapidKey
);

export const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log("Push notification sent successfully.");
  } catch (err) {
    console.error("Error sending push notification", err);
  }
};
