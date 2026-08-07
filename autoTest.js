import { getDatabase } from 'firebase-admin/database';
import webpush from 'web-push';
import './backend/services/firebaseAdmin.js';
import dotenv from 'dotenv';
dotenv.config();

webpush.setVapidDetails(
  'mailto:support@fitma.ai',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

console.log('Waiting for your iPhone to connect to the push service...');

const db = getDatabase();
const usersRef = db.ref('users');

let sent = false;

usersRef.on('child_changed', async (snapshot) => {
  if (sent) return;
  const user = snapshot.val();
  const id = snapshot.key;
  if (user && user.pushSubscription) {
    console.log('BOOM! iPhone connected! Sending test notification...');
    try {
      await webpush.sendNotification(
        user.pushSubscription,
        JSON.stringify({
          title: 'Fitma.ai is Live! 🎉',
          body: 'Push notifications are successfully configured and working on your iPhone!',
          url: '/',
        })
      );
      console.log('Test notification sent successfully to device: ' + id);
      sent = true;
      setTimeout(() => process.exit(0), 1000);
    } catch (err) {
      console.log('Failed to send:', err.message);
    }
  }
});

usersRef.on('child_added', async (snapshot) => {
  if (sent) return;
  const user = snapshot.val();
  const id = snapshot.key;
  if (user && user.pushSubscription) {
    console.log(
      'BOOM! iPhone connected (New user)! Sending test notification...'
    );
    try {
      await webpush.sendNotification(
        user.pushSubscription,
        JSON.stringify({
          title: 'Fitma.ai is Live! 🎉',
          body: 'Push notifications are successfully configured and working on your iPhone!',
          url: '/',
        })
      );
      console.log('Test notification sent successfully to device: ' + id);
      sent = true;
      setTimeout(() => process.exit(0), 1000);
    } catch (err) {
      console.log('Failed to send:', err.message);
    }
  }
});
