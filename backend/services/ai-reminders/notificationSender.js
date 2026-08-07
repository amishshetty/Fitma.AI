import webpush from 'web-push';
import { getDatabase, ServerValue } from 'firebase-admin/database';

class NotificationSender {
  async dispatch(userId, notificationPayload, subscription) {
    console.log(`[Notification Sender] Sending to ${userId}: ${notificationPayload.message}`);
    
    // Save to Firebase Realtime Database
    try {
      const db = getDatabase();
      await db.ref(`notificationHistory/${userId}`).push({
        category: notificationPayload.category,
        message: notificationPayload.message,
        priority: notificationPayload.priority,
        status: 'SENT',
        sentAt: ServerValue.TIMESTAMP
      });
    } catch (err) {
      console.error(`[Notification Sender] Failed to save history for ${userId}:`, err.message);
    }
    
    // Dispatch via Web Push
    try {
      if (subscription) {
        let niceTitle = 'Message from Liva';
        if (notificationPayload.category === 'WATER') {
          niceTitle = 'Hydration Reminder 💧';
        } else if (notificationPayload.category === 'MEAL') {
          niceTitle = 'Meal Reminder 🍽️';
        } else if (notificationPayload.category === 'CALORIE') {
          niceTitle = 'Nutrition Update 🥗';
        }
        
        const payload = JSON.stringify({
          title: notificationPayload.title || niceTitle,
          body: notificationPayload.message,
          icon: '/icon-v3.png',
          url: '/',
          actions: notificationPayload.actions || []
        });
        
        await webpush.sendNotification(subscription, payload);
        console.log(`[Notification Sender] Successfully sent Web Push notification to ${userId}`);
      } else {
        console.log(`[Notification Sender] No Web Push subscription found for user ${userId}.`);
      }
    } catch (error) {
      console.error(`[Notification Sender] Web Push Failed for ${userId}:`, error.message);
    }
  }
}

export default new NotificationSender();
