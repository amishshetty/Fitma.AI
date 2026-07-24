import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
    foodItem: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    isCheatMeal: { type: Boolean, default: false },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("MealLog", mealSchema);
