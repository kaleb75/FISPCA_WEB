// LOGIN/server/routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = 'supersecreto';

// Usuario "ficticio" para pruebas (puedes usar una DB en producción)
const USERS = [{ username: 'admin', password: '1234' }];

router.post('/', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }

  // Generar JWT
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ success: true, token });
});

module.exports = router;
