class WaterEngine {
  evaluateUser(profile, todayLogs, user) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    const createdAt = user?.createdAt || Date.now();
    const daysSinceCreated = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);

    // Only send water reminders between 9 AM and 9 PM
    if (currentHour < 9 || currentHour >= 21) {
      return null;
    }

    const goal = 2500; // default goal

    // We check either waterObj (new format) or water (old format number, for backward compatibility)
    let consumed = 0;
    let lastLogTime = new Date();
    lastLogTime.setHours(9, 0, 0, 0); // Default to 9:00 AM today if no logs

    if (todayLogs.waterObj) {
      consumed = todayLogs.waterObj.total || 0;
      if (todayLogs.waterObj.lastUpdate) {
        lastLogTime = new Date(todayLogs.waterObj.lastUpdate);
      }
    } else if (typeof todayLogs.water === 'number') {
      consumed = todayLogs.water;
    }

    if (consumed >= goal) {
      console.log('[Water Engine] Goal met, skipping reminders');
      return null;
    }

    const diffMins = (now - lastLogTime) / (1000 * 60);

    // Check if it's been a multiple of 3 hours (180 mins) since the last log
    // Since cron runs every 15 minutes, we look for the remainder being within a 15-min window
    const intervalsOf3Hours = Math.floor(diffMins / 180);
    const remainder = diffMins % 180;

    if (intervalsOf3Hours >= 1 && remainder >= 0 && remainder < 15) {
      return {
        category: 'WATER',
        priority: 'MEDIUM',
        message: `It's been 3 hours since your last water log! You've drank ${(consumed / 1000).toFixed(1)}L out of ${(goal / 1000).toFixed(1)}L today. Stay hydrated!`,
        reminderNumber: intervalsOf3Hours,
      };
    }

    return null;
  }
}

export default new WaterEngine();
