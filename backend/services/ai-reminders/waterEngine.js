class WaterEngine {
  calculateInterval(goal, consumed, remainingAwakeHours) {
    if (remainingAwakeHours <= 0) return null; // Time to sleep
    
    const remainingWater = goal - consumed;
    
    if (remainingWater <= 0) {
      console.log('[Water Engine] Goal met, skipping reminders');
      return null;
    }

    // Remaining Water / Remaining Awake Hours = ml per hour
    const mlPerHour = Math.round(remainingWater / remainingAwakeHours);
    
    // We want to remind roughly every 1.5 - 2 hours, so let's set a standard volume threshold, e.g. 250ml per glass.
    // If they need 500ml/hr, we should remind them more frequently.
    // Let's return the interval in minutes based on how much they need per hour.
    // Standard glass: 250ml
    const glassesNeededPerHour = mlPerHour / 250;
    
    let intervalMins = 120; // Default 2 hours
    if (glassesNeededPerHour > 1.5) intervalMins = 60; // Needs a lot, remind every hour
    if (glassesNeededPerHour > 2.5) intervalMins = 45; // Needs tons, remind every 45 mins
    if (glassesNeededPerHour < 0.5) intervalMins = 180; // Doesn't need much, remind every 3 hours

    return intervalMins;
  }

  evaluateUser(profile, todayLogs) {
    // Determine awake hours remaining based on profile.averageSleepSchedule
    const now = new Date();
    const currentHour = now.getHours();
    
    // Parse sleep time, assume format "23:00"
    const sleepHour = parseInt(profile.averageSleepSchedule.sleepTime.split(':')[0]);
    
    let awakeHours = sleepHour - currentHour;
    if (awakeHours < 0) awakeHours += 24; // if they sleep past midnight
    
    if (awakeHours <= 1) {
       // Near bedtime, decrease frequency / stop
       return null;
    }

    // Mock logs (in real app, fetch from DB)
    const goal = 3000;
    const consumed = todayLogs.water || 0; 
    
    const intervalMins = this.calculateInterval(goal, consumed, awakeHours);
    
    if (!intervalMins) return null;

    return {
      category: 'WATER',
      priority: 'MEDIUM',
      message: `You have ${(goal - consumed)/1000}L left today. One glass now keeps you on track.`,
      intervalMins
    };
  }
}

export default new WaterEngine();
