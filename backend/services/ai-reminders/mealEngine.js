class MealEngine {
  evaluateUser(profile, todayLogs, user) {
    const now = new Date();
    const createdAt = user?.createdAt || Date.now();
    const daysSinceCreated = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);

    let mealTimes = {};
    if (daysSinceCreated < 7) {
      mealTimes = { breakfast: '09:00', lunch: '13:00', dinner: '19:30' };
    } else {
      mealTimes = profile.averageMealTimes || {
        breakfast: '09:00',
        lunch: '13:00',
        dinner: '19:30',
      };
    }

    // Get current time
    const nowMs = Date.now();

    // Determine today's date in IST
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find((p) => p.type === 'year').value;
    const month = parts.find((p) => p.type === 'month').value;
    const day = parts.find((p) => p.type === 'day').value;

    let activeMeal = null;
    let expectedTime = null;

    for (const [mealName, timeStr] of Object.entries(mealTimes)) {
      const mealHourStr = timeStr.split(':')[0].padStart(2, '0');
      const mealMinStr = timeStr.split(':')[1].padStart(2, '0');

      // Construct ISO string for the meal time today in IST (+05:30)
      const isoString = `${year}-${month}-${day}T${mealHourStr}:${mealMinStr}:00+05:30`;
      const mealTimeDate = new Date(isoString);

      const diffMins = (nowMs - mealTimeDate.getTime()) / (1000 * 60);

      // PRD Logic:
      // Wait 20 mins -> Reminder 1
      // Wait 60 mins -> Reminder 2
      // Wait 120 mins -> Reminder 3
      if (diffMins > 0 && diffMins <= 180) {
        activeMeal = mealName;
        expectedTime = mealTimeDate;
        break;
      }
    }

    if (!activeMeal) {
      // Check for End of Day Notification (10 PM)
      const eodIsoString = `${year}-${month}-${day}T22:00:00+05:30`;
      const eodDate = new Date(eodIsoString);
      const eodDiffMins = (nowMs - eodDate.getTime()) / (1000 * 60);

      // Between 22:00 and 23:00 (60 minutes window)
      if (eodDiffMins >= 0 && eodDiffMins <= 60) {
        const hasLoggedMeals = todayLogs.meals && todayLogs.meals.length > 0;
        const hasLoggedWater = todayLogs.water && todayLogs.water > 0;
        
        if (!hasLoggedMeals && !hasLoggedWater) {
          return {
            category: 'DAILY_SUMMARY',
            priority: 'CRITICAL',
            title: 'End of Day Check-in 🌙',
            message: "We missed you today! You haven't logged anything yet. A quick log helps you stay on track! 🌟",
            reminderNumber: 1,
          };
        }
      }
      return null;
    }

    // Check if user logged the active meal today
    const hasLoggedMeal = (todayLogs.meals || []).some(
      (m) => m.mealType && m.mealType.toLowerCase() === activeMeal.toLowerCase()
    );
    if (hasLoggedMeal) {
      console.log(
        `[Meal Engine] User already logged ${activeMeal}. Stopping reminders.`
      );
      return null;
    }

    // Check if we already sent a reminder recently
    const diffMins = (nowMs - expectedTime.getTime()) / (1000 * 60);

    if (diffMins >= 20 && diffMins < 60) {
      return {
        category: 'MEAL',
        priority: 'HIGH',
        message: `You usually have ${activeMeal} around now. Ready to log today's meal?`,
        reminderNumber: 1,
      };
    } else if (diffMins >= 60 && diffMins < 120) {
      return {
        category: 'MEAL',
        priority: 'HIGH',
        message: `Looks like today is busier than usual. Need a quick high-protein ${activeMeal}?`,
        reminderNumber: 2,
      };
    } else if (diffMins >= 120 && diffMins < 180) {
      return {
        category: 'MEAL',
        priority: 'CRITICAL',
        message: `You haven't logged ${activeMeal} yet. Let's not break your streak!`,
        reminderNumber: 3,
      };
    }

    return null;
  }
}

export default new MealEngine();
