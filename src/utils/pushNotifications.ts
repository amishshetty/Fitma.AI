export async function subscribeUserToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push messaging is not supported");
    return { success: false, error: "Push messaging is not supported" };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return { success: false, error: "Permission not granted" };
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    
    // Convert VAPID key to Uint8Array
    const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!publicVapidKey) {
       console.error("VITE_VAPID_PUBLIC_KEY is not defined");
       return { success: false, error: "VAPID configuration missing" };
    }
    
    const urlBase64ToUint8Array = (base64String: string) => {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };

    // Unsubscribe from any old subscriptions first to avoid InvalidStateError 
    // when the VAPID key changes or a previous dummy key was used.
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log("Found existing subscription, unsubscribing...");
      await existingSubscription.unsubscribe();
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    // Send subscription to backend
    const deviceId = localStorage.getItem("fitma_device_id") || "unknown-device";
    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription, deviceId }),
    });

    if (response.ok) {
      console.log("User is subscribed to push notifications");
      return { success: true };
    } else {
      console.error("Failed to store subscription on server");
      return { success: false, error: "Failed to store subscription" };
    }
  } catch (error) {
    console.error("Error during push subscription", error);
    return { success: false, error: String(error) };
  }
}
