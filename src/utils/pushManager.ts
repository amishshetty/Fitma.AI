import { getDeviceId } from "./deviceInfo";

const publicVapidKey = "BMz6RZLTAUqHW2J0zuRwZEK3TwzZbLp_LWqr4NKaSBOK9Mm18c9CnDvpuj_r7XW4PSt7eDAczkaLuJvMtZK5bRU";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const subscribeToPushNotifications = async () => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      console.log("Push registered:", subscription);

      const deviceId = getDeviceId();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId, subscription }),
      });
      console.log("Push subscription sent to server");
    } catch (error: any) {
      if (error.name === 'SecurityError' || (error.message && error.message.includes('SSL'))) {
        console.warn("Push Notifications skipped: Service Worker requires a trusted SSL certificate. This is expected in local development.", error.message);
      } else {
        console.warn("Error subscribing to push notifications:", error);
      }
    }
  } else {
    console.warn("Push notifications are not supported in this browser");
  }
};

export const requestPushPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await subscribeToPushNotifications();
    }
  }
};
