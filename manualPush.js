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

const db = getDatabase();
const usersRef = db.ref('users');

usersRef.once('value', async (snapshot) => {
  const users = snapshot.val();
  if (!users) {
    console.log('No users found in database.');
    process.exit(0);
  }

  let sent = false;
  for (const id in users) {
    if (users[id].pushSubscription) {
      console.log('Found push subscription! Sending manual push to:', id);
      try {
        await webpush.sendNotification(
          users[id].pushSubscription,
          JSON.stringify({
            title: 'Fitma.ai is Live! 🎉',
            body: 'Push notifications are successfully configured and working on your iPhone!',
            url: '/',
          })
        );
        console.log('Sent successfully!');
        sent = true;
      } catch (e) {
        console.log('Send failed:', e.message);
      }
    }
  }
  if (!sent) console.log('No push subscriptions found to send to.');
  process.exit(0);
});
