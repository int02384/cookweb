// routes/auth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const User    = require('../models/User');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Username taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash , role: 'admin'});
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).send('Λανθασμένα διαπιστευτήρια');
    }

    // Mark session
    req.session.userId = user._id;
    req.session.role   = user.role;
    res.json({ user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Σφάλμα διακομιστή');
  }
});

// Αποσύνδεση χρήστη
router.post('/logout', (req, res) => {
  console.log('👋 Logout called');
  req.session.destroy(err => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).send('Σφάλμα στην αποσύνδεση');
    }

    res.clearCookie('sid', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/'
    });

    res.status(200).send('Logout OK');
  });
});


module.exports = router;
