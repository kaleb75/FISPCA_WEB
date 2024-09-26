const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');

const app = express();

// Configurar body-parser para manejar solicitudes POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar express-session para manejar sesiones
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Usar las rutas definidas en 'routes.js'
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});