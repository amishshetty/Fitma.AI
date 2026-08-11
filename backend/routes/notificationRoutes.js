import express from 'express';
import webpush from 'web-push';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, ServerValue } from 'firebase-admin/database';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

try {
  webpush.setVapidDetails(
    'mailto:support@fitma.ai',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} catch (e) {
  console.warn(
    'WebPush missing VAPID keys, push notifications will fail:',
    e.message
  );
}

router.post('/test-timeout', async (req, res) => {
  try {
    await Promise.race([
      new Promise((resolve) => setTimeout(resolve, 10000)),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 2000)
      ),
    ]);
    res.json({ status: 'success' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// @route POST /api/notifications/subscribe
// @desc Subscribe a user to push notifications
router.post('/subscribe', async (req, res) => {
  console.log('HIT /subscribe route', req.body);
  const { subscription, deviceId } = req.body;

  if (!subscription || !deviceId) {
    return res.status(400).json({ error: 'Missing subscription or deviceId' });
  }

  try {
    const db = getDatabase();

    // Create a 5 second timeout promise
    const timeout = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error('Firebase database update timed out after 5 seconds')
          ),
        5000
      )
    );

    // Race the DB update against the timeout
    await Promise.race([
      (async () => {
        const userRef = db.ref(`users/${deviceId}`);
        const snapshot = await userRef.child('createdAt').once('value');
        const updatePayload = {
          pushSubscription: subscription,
          updatedAt: ServerValue.TIMESTAMP,
        };
        if (!snapshot.exists()) {
          updatePayload.createdAt = ServerValue.TIMESTAMP;
        }
        return userRef.update(updatePayload);
      })(),
      timeout,
    ]);

    res.status(201).json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Error saving Push Subscription:', error);
    res
      .status(500)
      .json({ error: 'Failed to save Push Subscription: ' + error.message });
  }
});

// @route POST /api/notifications/fcm-token
// @desc Save Firebase Cloud Messaging token to user profile
router.post('/fcm-token', async (req, res) => {
  const { fcmToken, deviceId } = req.body;

  if (!fcmToken || !deviceId) {
    return res.status(400).json({ error: 'Missing fcmToken or deviceId' });
  }

  try {
    const db = getDatabase();
    await db.ref(`users/${deviceId}`).update({
      fcmToken: fcmToken,
      updatedAt: ServerValue.TIMESTAMP,
    });
    res.status(200).json({ message: 'FCM Token saved successfully' });
  } catch (error) {
    console.error('Error saving FCM Token:', error);
    res.status(500).json({ error: 'Failed to save FCM Token' });
  }
});

// @route POST /api/notifications/send
// @desc Send a push notification (for testing or manual triggering)
router.post('/send', async (req, res) => {
  const { deviceId, title, body, url } = req.body;

  try {
    const db = getDatabase();
    const snapshot = await db.ref(`users/${deviceId}`).once('value');
    const user = snapshot.val();

    if (!user || !user.pushSubscription) {
      return res
        .status(404)
        .json({ error: 'Subscription not found for this device' });
    }

    const payload = JSON.stringify({
      title: title || 'Fitma Update',
      body: body || 'You have a new message!',
      url: url || '/',
    });

    await webpush.sendNotification(user.pushSubscription, payload);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    if (error.statusCode === 410) {
      // 410 Gone means the subscription is no longer valid
      await getDatabase()
        .ref(`users/${req.body.deviceId}`)
        .update({ pushSubscription: null });
    }
    res.status(500).json({ error: 'Failed to send notification' });
  }
});
// @route GET /api/notifications/cron/evaluate
// @desc Trigger the reminder evaluation loop manually (useful for external cron services if hosted on Vercel/Render)
router.get('/cron/evaluate', async (req, res) => {
  try {
    const aiReminderEngine = (await import('../services/ai-reminders/scheduler.js')).default;
    
    // Fire and forget: run in background so we don't timeout the HTTP request
    aiReminderEngine.evaluateUsers().catch(err => {
      console.error('Error in background evaluation loop:', err);
    });

    res.status(200).json({ message: 'Evaluation loop triggered successfully' });
  } catch (error) {
    console.error('Error triggering evaluation loop via cron endpoint:', error);
    res.status(500).json({ error: 'Failed to trigger evaluation loop' });
  }
});

export default router;
