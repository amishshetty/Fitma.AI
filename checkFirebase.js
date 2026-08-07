import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

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
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}, 1000);
