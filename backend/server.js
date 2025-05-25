require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');
const session  = require('express-session');

const authRouter    = require('./routes/auth');
const recipesRouter = require('./routes/recipes');
const plansRouter   = require('./routes/plans');
const uploadRouter  = require('./routes/uploads');

const app = express();

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// 1) JSON parsing
app.use(express.json());

// 2) Session middleware (in-memory store)
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'change_this_to_a_strong_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 👈 ΠΡΟΣΘΕΣΕ ΤΟ
      path: '/'        // 👈 ΠΡΟΣΘΕΣΕ ΤΟ
    }
  })
);


// 4) Mount routers
app.use('/api/auth',    authRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/plans',   plansRouter);
app.use(uploadRouter);

// 5) MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// 6) Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
