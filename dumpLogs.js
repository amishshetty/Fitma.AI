import { getDatabase } from 'firebase-admin/database';
import './backend/services/firebaseAdmin.js';
import dotenv from 'dotenv';
dotenv.config();

async function dumpLogs() {
  const db = getDatabase();
  const snapshot = await db.ref('userLogs').once('value');
  console.log(JSON.stringify(snapshot.val(), null, 2));
  process.exit(0);
}

dumpLogs();
