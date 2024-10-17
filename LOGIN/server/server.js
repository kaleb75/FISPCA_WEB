// LOGIN/server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Para autenticación JWT
const loginRoutes = require('./routes'); // Rutas de login
const taskRoutes = require('../../Task/queries'); // Rutas de tareas
const { verifyToken } = require('./middleware'); // Middleware para proteger rutas

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos (HTML, CSS, JS)

// Rutas de autenticación y tareas
app.use('/login', loginRoutes);
app.use('/tasks', verifyToken, taskRoutes); // Rutas de tareas protegidas

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
