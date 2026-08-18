import './services/firebaseAdmin.js';
import { getDatabase } from 'firebase-admin/database';

const db = getDatabase();
db.ref('notificationHistory').remove()
  .then(() => {
    console.log('Successfully cleared notificationHistory');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to clear notificationHistory:', err);
    process.exit(1);
  });
