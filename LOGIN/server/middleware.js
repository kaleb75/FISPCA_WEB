// LOGIN/server/middleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'supersecreto'; // Cambia esto por una clave más segura

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    req.user = decoded; // Guardamos la info del usuario en req
    next();
  });
}

module.exports = { verifyToken };
