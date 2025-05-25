// routes/plans.js
const express   = require('express');
const MealPlan  = require('../models/MealPlan');

const router = express.Router();

// GET /api/plans/:weekStart
router.get('/:weekStart', async (req, res, next) => {
  try {
    const date = new Date(req.params.weekStart);
    const plan = await MealPlan.findOne({ weekStart: date })
      .populate('slots.recipe');
    if (!plan) return res.json({ weekStart: date, slots: [] });
    res.json(plan);
  } catch (err) {
    console.error('‼ ERROR GET /plans:', err);
    next(err);
  }
});

// POST /api/plans
router.post('/', async (req, res, next) => {
  console.log('\n► BODY /plans:', JSON.stringify(req.body, null, 2), '\n');
  try {
    const { weekStart, slots } = req.body;
    // Filter only slots with a recipe
    const filtered = Array.isArray(slots)
      ? slots.filter(s => s.recipe)
      : [];

    const date = new Date(weekStart);
    const plan = await MealPlan.findOneAndUpdate(
      { weekStart: date },
      { weekStart: date, slots: filtered },
      { upsert: true, new: true }
    );

    res.json(plan);
  } catch (err) {
    console.error('‼ ERROR POST /plans:', err);
    next(err);
  }
});

// DELETE /api/plans/:weekStart
router.delete('/:weekStart', async (req, res, next) => {
  try {
    const date = new Date(req.params.weekStart);
    await MealPlan.findOneAndDelete({ weekStart: date });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('‼ ERROR DELETE /plans:', err);
    next(err);
  }
});

module.exports = router;
