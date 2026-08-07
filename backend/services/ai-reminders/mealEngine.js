class MealEngine {
  evaluateUser(profile, todayLogs, user) {
    const now = new Date();
    const createdAt = user?.createdAt || Date.now();
    const daysSinceCreated = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);

    let mealTimes = {};
    if (daysSinceCreated < 7) {
      mealTimes = { breakfast: "09:00", lunch: "13:00", dinner: "19:30" };
    } else {
      mealTimes = profile.averageMealTimes || { breakfast: "09:00", lunch: "13:00", dinner: "19:30" };
    }
    
    // We will check if current time is roughly +20 mins or +60 mins from predicted meal time
    let activeMeal = null;
    let expectedTime = null;
    
    for (const [mealName, timeStr] of Object.entries(mealTimes)) {
       const mealHour = parseInt(timeStr.split(':')[0]);
       const mealMin = parseInt(timeStr.split(':')[1]);
       
       const mealTimeDate = new Date();
       mealTimeDate.setHours(mealHour, mealMin, 0, 0);
       
       const diffMins = (now - mealTimeDate) / (1000 * 60);
       
       // PRD Logic:
       // Wait 20 mins -> Reminder 1
       // Wait 60 mins -> Reminder 2
       // Wait 120 mins -> Reminder 3
       if (diffMins > 0 && diffMins <= 120) {
          activeMeal = mealName;
          expectedTime = mealTimeDate;
          break;
       }
    }
    
    if (!activeMeal) return null; // Not currently around any meal time
    
    // Check if user logged the active meal today
    const hasLoggedMeal = (todayLogs.meals || []).some(m => m.mealType && m.mealType.toLowerCase() === activeMeal.toLowerCase());
    if (hasLoggedMeal) {
      console.log(`[Meal Engine] User already logged ${activeMeal}. Stopping reminders.`);
      return null;
    }
    
    // Check if we already sent a reminder recently
    const diffMins = (now - expectedTime) / (1000 * 60);
    
    if (diffMins >= 20 && diffMins < 60) {
      return {
        category: 'MEAL',
        priority: 'HIGH',
        message: `You usually have ${activeMeal} around now. Ready to log today's meal?`,
        reminderNumber: 1
      };
    } else if (diffMins >= 60 && diffMins < 120) {
      return {
        category: 'MEAL',
        priority: 'HIGH',
        message: `Looks like today is busier than usual. Need a quick high-protein ${activeMeal}?`,
        reminderNumber: 2
      };
    } else if (diffMins >= 120 && diffMins < 180) {
      return {
        category: 'MEAL',
        priority: 'CRITICAL',
        message: `You haven't logged ${activeMeal} yet. Let's not break your streak!`,
        reminderNumber: 3
      };
    }

    return null;
  }
}

export default new MealEngine();
