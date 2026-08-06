import express from "express";
import { getDatabase, ServerValue } from "firebase-admin/database";

const router = express.Router();

router.post("/meal", async (req, res) => {
  const { deviceId, mealType, notes, calories, protein, carbs, fat } = req.body;

  if (!deviceId || !mealType) {
    return res.status(400).json({ error: "Missing deviceId or mealType" });
  }

  try {
    const db = getDatabase();
    
    // YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const mealsRef = db.ref(`userLogs/${deviceId}/${today}/meals`);
    
    let existingKey = null;
    if (mealType !== 'snack') {
      const snapshot = await mealsRef.once('value');
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          if (child.val().type === mealType) {
            existingKey = child.key;
          }
        });
      }
    }
    
    const logRef = existingKey ? mealsRef.child(existingKey) : mealsRef.push();
    
    // Also race this to avoid hanging if DB is unresponsive
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Firebase database update timed out")), 5000)
    );
    
    await Promise.race([
      logRef.set({
        type: mealType,
        notes: notes || "",
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        timestamp: ServerValue.TIMESTAMP
      }),
      timeout
    ]);

    res.status(201).json({ message: "Meal logged successfully", logId: logRef.key });
  } catch (error) {
    console.error("Error logging meal:", error);
    res.status(500).json({ error: "Failed to log meal: " + error.message });
  }
});

router.post("/water", async (req, res) => {
  const { deviceId, amountMl } = req.body;

  if (!deviceId || !amountMl) {
    return res.status(400).json({ error: "Missing deviceId or amountMl" });
  }

  try {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    
    // We can just keep a running total for the day, or push individual logs.
    // Let's keep a running total to make engine querying easier.
    const waterRef = db.ref(`userLogs/${deviceId}/${today}/waterObj`);
    
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Firebase database update timed out")), 5000)
    );
    
    await Promise.race([
      waterRef.transaction((currentData) => {
        const currentTotal = currentData ? currentData.total : 0;
        return {
          total: currentTotal + amountMl,
          lastUpdate: ServerValue.TIMESTAMP
        };
      }),
      timeout
    ]);

    res.status(200).json({ message: "Water logged successfully" });
  } catch (error) {
    console.error("Error logging water:", error);
    res.status(500).json({ error: "Failed to log water: " + error.message });
  }
});

export default router;
