require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Recipe   = require('./models/Recipe');
const MealPlan = require('./models/MealPlan');
const path     = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadRouter = require('./routes/uploads');
app.use(uploadRouter);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username taken' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, passwordHash });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.get('/api/recipes', async (req, res) => {
  try { 
    res.json(await Recipe.find()); 
  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/recipes', async (req, res) => {
  try { 
    const created = await new Recipe(req.body).save();
    res.status(201).json(created); 
  } catch (e) { 
    res.status(400).json({ error: e.message }); 
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const r = await Recipe.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json(r);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try { 
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updated);
  } catch (e) { 
    res.status(400).json({ error: e.message }); 
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try { 
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' }); 
  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
});

// Comments
app.post('/api/recipes/:id/comments', async (req, res) => {
  try {
    const { user, text, rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    recipe.comments.push({ user, text, rating });
    const sum = recipe.comments.reduce((acc, c) => acc + c.rating, 0);
    recipe.rating = sum / recipe.comments.length;

    const saved = await recipe.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ———————————————————————————
// Meal Plan endpoints
// ———————————————————————————

// 1) GET πλάνο βάσει weekStart
app.get('/api/plans/:weekStart', async (req, res) => {
  try {
    const date = new Date(req.params.weekStart);
    const plan = await MealPlan.findOne({ weekStart: date }).populate('slots.recipe');
    if (!plan) return res.json({ weekStart: date, slots: [] });
    res.json(plan);
  } catch (e) {
    console.error('‼ ERROR GET /api/plans:', e);
    res.status(500).json({ error: e.message });
  }
});

// 2) POST upsert πλάνου
app.post('/api/plans', async (req, res) => {
  console.log('\n► BODY /api/plans:', JSON.stringify(req.body, null, 2), '\n');
  try {
    const { weekStart, slots } = req.body;
    // Φιλτράρουμε μόνο τα slots με recipe
    const filtered = Array.isArray(slots)
      ? slots.filter(s => s.recipe)
      : [];

    const date = new Date(weekStart);

    const plan = await MealPlan.findOneAndUpdate(
      { weekStart: date },
      { weekStart: date, slots: filtered },
      { upsert: true, new: true }
    );

    return res.json(plan);
  } catch (e) {
    console.error('‼ ERROR POST /api/plans:', e);
    return res.status(500).json({ error: e.message });
  }
});

// 3) DELETE πλάνου
app.delete('/api/plans/:weekStart', async (req, res) => {
  try {
    const date = new Date(req.params.weekStart);
    await MealPlan.findOneAndDelete({ weekStart: date });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error('‼ ERROR DELETE /api/plans:', e);
    res.status(500).json({ error: e.message });
  }
});


// Εκκίνηση server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

