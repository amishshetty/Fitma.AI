class CalorieEngine {
  evaluateUser(profile, todayLogs, user) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    // Check around 8:30 PM (20:30)
    // The cron runs at 0, 15, 30, 45. We'll catch the 20:30 run.
    if (currentHour !== 20 || currentMin < 30 || currentMin >= 45) {
      return null;
    }

    // Default daily calorie goal
    const goal = 2000;

    // Sum up the calories from today's meals
    let consumedCalories = 0;
    if (todayLogs.meals && todayLogs.meals.length > 0) {
      consumedCalories = todayLogs.meals.reduce(
        (total, meal) => total + (Number(meal.calories) || 0),
        0
      );
    }

    if (consumedCalories >= goal) {
      console.log('[Calorie Engine] Goal met, skipping reminder');
      return null;
    }

    const remaining = goal - consumedCalories;

    // Only remind if they have a significant amount remaining (e.g. > 200 kcal)
    if (remaining < 200) {
      return null;
    }

    return {
      category: 'CALORIES',
      priority: 'MEDIUM',
      message: `You have ${Math.round(remaining)} calories remaining today! How about a light, healthy evening snack?`,
      reminderNumber: 1,
    };
  }
}

export default new CalorieEngine();
