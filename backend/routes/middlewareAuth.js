module.exports = {
  isAuthenticated(req, res, next) {
    if (req.session?.userId) {
      return next();
    }

    if (req.accepts('html')) {
      return res.redirect('/login');
    }

    return res.status(401).json({ message: 'Πρέπει να συνδεθείτε πρώτα' });
  },

  isAdmin(req, res, next) {
    if (req.session?.role === 'admin') {
      return next();
    }

    if (req.accepts('html')) {
      return res
        .status(403)
        .send(`
          <h1>403 - Απαγορευμένη Πρόσβαση</h1>
          <p>Η σελίδα αυτή είναι διαθέσιμη μόνο σε διαχειριστές.</p>
          <a href="/">Επιστροφή στην αρχική</a>
        `);
    }

    return res.status(403).json({ message: 'Πρόσβαση μόνο για διαχειριστές' });
  }
};
