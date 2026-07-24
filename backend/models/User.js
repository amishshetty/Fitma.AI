import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true }, // Anonymous user ID
    timezone: { type: String, default: "UTC" },
    age: { type: Number, required: true },
    goal: { type: String, enum: ['lose_weight', 'build_muscle', 'maintain'], required: true },
    dietPreference: { type: String, enum: ['vegetarian', 'vegan', 'non-vegetarian', 'eggetarian'], required: true },
    targetCalories: { type: Number, required: true },
    pushSubscription: { type: Object, default: null } // Web Push API subscription object
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
