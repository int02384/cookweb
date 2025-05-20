const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

// endpoint: POST /api/recipes/:id/upload
router.post('/api/recipes/:id/upload', upload.single('image'), async (req, res) => {
  try {
    // υποθέτουμε πως υπάρχει το μοντέλο Recipe
    const Recipe = require('../models/Recipe');
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    // αποθηκεύουμε στο πεδίο image το url
    recipe.image = `/uploads/${req.file.filename}`;
    await recipe.save();

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
