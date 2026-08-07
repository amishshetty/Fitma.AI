import { getDatabase } from 'firebase-admin/database';

class PriorityManager {
  constructor() {
    this.LIMITS = {
      TOTAL_DAILY: 8,
      MEAL: 3,
      WATER: 6,
      PROTEIN: 2,
      WEIGHT: 1,
      WEEKLY_REPORT: 1,
      AI_INSIGHTS: 3, // per week, but handled daily limits below if needed
    };
  }

  async checkLimits(userId, category, message) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const db = getDatabase();
    const snapshot = await db
      .ref(`notificationHistory/${userId}`)
      .orderByChild('sentAt')
      .startAt(todayTimestamp)
      .once('value');

    let sentToday = [];
    if (snapshot.exists()) {
      const history = snapshot.val();
      sentToday = Object.values(history).filter((n) => n.status === 'SENT');
    }

    if (sentToday.length >= this.LIMITS.TOTAL_DAILY) {
      console.log(
        `[Priority Manager] Daily cap (${this.LIMITS.TOTAL_DAILY}) reached for user ${userId}.`
      );
      return false;
    }

    // Check if the exact same message was already sent today (to prevent duplicate reminders)
    if (message) {
      const alreadySent = sentToday.find((n) => n.message === message);
      if (alreadySent) {
        console.log(
          `[Priority Manager] Identical notification already sent today for user ${userId}. Skipping.`
        );
        return false;
      }
    }

    // Check category specific limits
    const categoryCount = sentToday.filter(
      (n) => n.category === category
    ).length;

    if (categoryCount >= this.LIMITS[category]) {
      console.log(
        `[Priority Manager] Category cap (${category}) reached for user ${userId}.`
      );
      return false;
    }

    return true;
  }

  mergeNotifications(pendingNotifications) {
    // Return all notifications independently as requested by user.
    // They will be handled individually in the loop.
    return pendingNotifications;
  }
}

export default new PriorityManager();
