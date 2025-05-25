// routes/recipes.js
const express = require('express')
const Recipe  = require('../models/Recipe')
const User = require('../models/User')
const { isAdmin, isAuthenticated } = require('./middlewareAuth');
const router = express.Router()

// GET /api/recipes
router.get('/', async (req, res, next) => { 
  try {
    const all = await Recipe.find()
    res.json(all)
  } catch (err) {
    next(err)
  }
})

// POST /api/recipes
router.post(
  '/add',
  isAuthenticated,      // ensures req.session.userId exists
  isAdmin,   // ensures req.session.role === 'admin'
  async (req, res, next) => {
    try {
      // 1) Pull the userId from the session
      const userId = req.session.userId;

      // 2) Create the recipe, explicitly setting `user`
      const created = await new Recipe({
        ...req.body,   // title, ingredients, etc.
        user: userId
      }).save();

      return res.status(201).json(created);
    } catch (err) {
      console.error('[/api/recipes/add] failed:', err);
      // If you still want to handle validation errors specially:
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message, details: err.errors });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;

// GET /api/recipes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const r = await Recipe.findById(req.params.id)
    if (!r) return res.status(404).json({ error: 'Not found' })
    res.json(r)
  } catch (err) {
    next(err)
  }
})

// PUT /api/recipes/:id
router.put('/:id', isAdmin, async (req, res, next) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/recipes/:id
router.delete('/:id', isAdmin, async (req, res, next) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
})

// POST /api/recipes/:id/comments
router.post('/:id/comments', isAuthenticated, async (req, res) => {
  const { text, rating } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Η συνταγή δεν βρέθηκε.' });
    }
    
    // now lookup the user by ID
    const userDoc = await User.findById(req.session.userId);
    if (!userDoc) {
      return res.status(401).json({ message: 'Μη έγκυρος χρήστης.' });
    }

    const already = recipe.comments.some(c => c.user === userDoc.username);
    if (already) {
      return res
        .status(400)
        .json({ message: 'Έχετε ήδη σχολιάσει αυτή τη συνταγή.' });
    }

    // include **all** required fields:
    const newComment = {
      text,
      rating,                     // ← you must pass this!
      user: userDoc.username,
      createdAt: new Date()
    };

    recipe.comments.push(newComment);
    await recipe.save();

    return res.status(201).json({
      message: 'Σχόλιο αποθηκεύτηκε.',
      comments: recipe.comments
    });
  } catch (err) {
    console.error('❌ Σφάλμα κατά την αποθήκευση σχολίου:', err);
    return res.status(500).json({ message: 'Σφάλμα αποθήκευσης σχολίου.' });
  }
});


module.exports = router
