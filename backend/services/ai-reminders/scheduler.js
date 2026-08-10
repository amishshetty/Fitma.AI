import cron from 'node-cron';
import mealEngine from './mealEngine.js';
import waterEngine from './waterEngine.js';
import calorieEngine from './calorieEngine.js';
import priorityManager from './priorityManager.js';
import notificationSender from './notificationSender.js';
import { getDatabase } from 'firebase-admin/database';

class AIReminderEngine {
  constructor() {
    this.cronTask = null;
    this.interval = '* * * * *'; // Production: every 1 minute for faster testing
  }

  start() {
    console.log('[Liva AI] Initializing Smart Reminder Engine...');
    this.cronTask = cron.schedule(this.interval, async () => {
      console.log(
        `[Liva AI] Running 1-minute evaluation loop at ${new Date().toISOString()}`
      );
      await this.evaluateUsers();
    });
    console.log('[Liva AI] Engine running.');
  }

  stop() {
    if (this.cronTask) {
      this.cronTask.stop();
      console.log('[Liva AI] Engine stopped.');
    }
  }

  async evaluateUsers() {
    try {
      const db = getDatabase();

      // Fetch all users
      const usersSnapshot = await db.ref('users').once('value');
      const users = usersSnapshot.val() || {};

      // Filter for users with pushSubscription
      const activeUsers = Object.entries(users)
        .map(([deviceId, userData]) => ({ deviceId, ...userData }))
        .filter((user) => user.pushSubscription != null);

      console.log(
        `[Liva AI] Evaluating ${activeUsers.length} active users with Web Push subscriptions.`
      );

      for (const user of activeUsers) {
        const behaviourSnapshot = await db
          .ref(`userBehaviours/${user.deviceId}`)
          .once('value');
        let profile = behaviourSnapshot.val();

        if (!profile) {
          // If no behavioral profile exists yet, create a default one based on user settings
          profile = {
            userId: user.deviceId,
            averageMealTimes: { lunch: '13:00' },
            averageSleepSchedule: { sleepTime: '23:00' },
            notificationStats: { ignoredConsecutive: 0 },
          };
          await db.ref(`userBehaviours/${user.deviceId}`).set(profile);
        }

        // Run modular logic passing both the behavioural profile and the user object (for subscription)
        await this.contextEngine(profile, user);
      }
    } catch (error) {
      console.error('[Liva AI] Error during evaluation loop:', error);
    }
  }

  async contextEngine(profile, user) {
    // Stage 1: Wait and Learn phase.
    // We check if it's time to send a mock notification or calculate predictions.

    // Check fatigue (disabled in local test mode to avoid MongoDB dependency)
    /*
    const recentNotifications = await NotificationHistory.find({ userId: profile.userId })
      .sort({ sentAt: -1 })
      .limit(3);
      
    const ignoredCount = recentNotifications.filter(n => n.status === 'SENT').length;
    
    if (ignoredCount >= 3) {
      console.log(`[Liva AI] Fatigue detected for User ${profile.userId}. Reducing frequency.`);
      // Update profile fatigue stat
      profile.notificationStats.ignoredConsecutive = ignoredCount;
      await profile.save();
      // Skip sending more today to prevent fatigue
      return; 
    }
    */

    // Evaluate engines
    const pendingNotifications = [];

    // Extract today's logs from the user object directly, as the frontend saves it there
    const todayStr = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    let userMeals = user.meals || [];
    if (!Array.isArray(userMeals)) {
      userMeals = Object.values(userMeals);
    }
    const todaysMeals = userMeals.filter((m) => {
      const time = parseInt(m.id);
      return time >= todayStart && time <= todayEnd;
    });

    const todayHistory =
      user.history && user.history[todayStr] ? user.history[todayStr] : {};

    const formattedLogs = {
      meals: todaysMeals,
      water: todayHistory.water || 0,
    };

    const mealNotif = mealEngine.evaluateUser(profile, formattedLogs, user);
    if (mealNotif) pendingNotifications.push(mealNotif);

    const waterNotif = waterEngine.evaluateUser(profile, formattedLogs, user);
    if (waterNotif) pendingNotifications.push(waterNotif);

    const calorieNotif = calorieEngine.evaluateUser(
      profile,
      formattedLogs,
      user
    );
    if (calorieNotif) pendingNotifications.push(calorieNotif);

    if (pendingNotifications.length === 0) return;

    const finalNotifications =
      priorityManager.mergeNotifications(pendingNotifications);

    for (const notif of finalNotifications) {
      const allowed = await priorityManager.checkLimits(
        profile.userId,
        notif.category,
        notif.message
      );
      if (allowed) {
        await notificationSender.dispatch(
          profile.userId,
          notif,
          user.pushSubscription
        );
      }
    }
  }
}

const aiReminderEngine = new AIReminderEngine();
export default aiReminderEngine;
