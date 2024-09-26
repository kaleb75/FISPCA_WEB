const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sql = require('./db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const request = new sql.Request();
    request.input('username', sql.VarChar, username);
    const result = await request.query('SELECT * FROM KOTAPP_Users WHERE username = @username');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        req.session.user = user;
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false });
  }
});

router.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome ${req.session.user.username}`);
  } else {
    res.redirect('/');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;