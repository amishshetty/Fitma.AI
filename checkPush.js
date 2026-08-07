import { getDatabase } from 'firebase-admin/database';
import './backend/services/firebaseAdmin.js';
import dotenv from 'dotenv';
dotenv.config();

const db = getDatabase();
const usersRef = db.ref('users');

usersRef.once('value', (snapshot) => {
  const users = snapshot.val();
  let found = false;
  for (const id in users) {
    if (users[id].pushSubscription) {
      console.log('Found push subscription for user:', id);
      found = true;
    }
  }
  if (!found) console.log('No push subscriptions found in DB.');
  process.exit(0);
});
