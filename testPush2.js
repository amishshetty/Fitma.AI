import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import webpush from 'web-push';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

webpush.setVapidDetails(
  'mailto:support@fitma.ai',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync('./backend/firebase-key.json', 'utf8')
  );
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://fitma-ai-default-rtdb.firebaseio.com',
  });
}

setTimeout(async () => {
  const db = getDatabase();
  const snapshot = await db.ref('users').once('value');
  const users = snapshot.val();

  if (!users) {
    console.log('No users found');
    process.exit(0);
  }

  let count = 0;
  for (const [id, user] of Object.entries(users)) {
    if (user.pushSubscription) {
      try {
        await webpush.sendNotification(
          user.pushSubscription,
          JSON.stringify({
            title: 'Fitma.ai Push Test 🚀',
            body: 'If you are seeing this, notifications are working perfectly on your mobile!',
            url: '/',
          })
        );
        console.log('Sent push to device: ' + id);
        count++;
      } catch (err) {
        console.log('Failed for device: ' + id, err.message);
      }
    }
  }
  console.log('Done! Sent: ' + count);
  process.exit(0);
}, 1000);
