// backend/models/MealPlan.js
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  day:      { type: String, required: true },           
  mealType: { type: String, required: true },           
  recipe:   { type: mongoose.Schema.Types.ObjectId,      
              ref: 'Recipe', required: true }
});

const mealPlanSchema = new mongoose.Schema({
  weekStart: { type: Date, unique: true, required: true },
  slots:     [slotSchema]
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
