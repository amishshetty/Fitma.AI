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
      AI_INSIGHTS: 3 // per week, but handled daily limits below if needed
    };
  }

  async checkLimits(userId, category) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const db = getDatabase();
    const snapshot = await db.ref(`notificationHistory/${userId}`).orderByChild('sentAt').startAt(todayTimestamp).once('value');
    
    let sentToday = [];
    if (snapshot.exists()) {
      const history = snapshot.val();
      sentToday = Object.values(history).filter(n => n.status === 'SENT');
    }

    if (sentToday.length >= this.LIMITS.TOTAL_DAILY) {
      console.log(`[Priority Manager] Daily cap (${this.LIMITS.TOTAL_DAILY}) reached for user ${userId}.`);
      return false; 
    }

    // Check category specific limits
    const categoryCount = sentToday.filter(n => n.category === category).length;
    
    if (categoryCount >= this.LIMITS[category]) {
      console.log(`[Priority Manager] Category cap (${category}) reached for user ${userId}.`);
      return false;
    }

    return true;
  }

  mergeNotifications(pendingNotifications) {
    // Example: if we have a WATER (Medium) and MEAL (High) for the same user, 
    // we merge them into one to prevent fatigue.
    
    if (pendingNotifications.length <= 1) return pendingNotifications;

    // Sort by priority
    const priorityWeight = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    pendingNotifications.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

    const primary = pendingNotifications[0];
    
    // Check if we can merge
    const hasWater = pendingNotifications.find(n => n.category === 'WATER');
    const hasMeal = pendingNotifications.find(n => n.category === 'MEAL');

    if (hasWater && hasMeal) {
       console.log('[Priority Manager] Merging WATER and MEAL notifications');
       return [{
         category: 'MEAL', // Assume meal is higher priority
         priority: 'HIGH',
         title: "MISSED ROUTINE",
         message: "Skipped breakfast again, Amish? Keep a routine for better metabolism.",
         actions: [{ action: "log-meal", title: "Log Breakfast" }],
         mergedFrom: ['MEAL', 'WATER']
       }];
    }
    
    // By default just take the highest priority if we have multiple clashing at the exact same 15min block
    return [primary];
  }
}

export default new PriorityManager();
