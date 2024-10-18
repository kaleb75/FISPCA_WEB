//server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const db = require('./queries'); // Asegúrate de que este archivo tenga las funciones necesarias
const app = express();
const port = 12345;

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: true,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Estrategia de autenticación local
passport.use(new LocalStrategy((username, password, done) => {
    // Aquí deberías buscar el usuario en tu base de datos
    // Este es un ejemplo simple
    if (username === 'admin' && password === 'password') {
        return done(null, { username: 'admin' });
    } else {
        return done(null, false, { message: 'Credenciales incorrectas' });
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    // Aquí deberías buscar el usuario en tu base de datos
    done(null, { username: username });
});

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Rutas para el CRUD de tasks
app.get('/tasks', db.getTasks);
app.get('/tasks/:id', db.getTaskById);
app.post('/tasks', db.createTask);
app.put('/tasks/:id', db.updateTask);
app.delete('/tasks/:id', db.deleteTask);
app.put('/tasks/:id/complete', db.markTaskAsCompleted);

// Ruta de inicio de sesión
app.post('/login', passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/login',
}));

// Ruta de cierre de sesión
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});