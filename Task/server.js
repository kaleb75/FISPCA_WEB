//server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./queries');
const cron = require('node-cron');
const { archiveCompletedTasks } = require('./queries');


// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Rutas para el CRUD de tasks
app.get('/tasks', db.getTasks);
app.get('/tasks/:id', db.getTaskById);
app.post('/tasks', db.createTask);
app.put('/tasks/:id', db.updateTask);
app.delete('/tasks/:id', db.deleteTask);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
    console.log(`La aplicacion esta corriendo ejecuta en tu navegador http://localhost:${port}.`);
});

app.get('/tasks/completed', async (request, response) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM tasks_archive ORDER BY completed_at DESC');
        response.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener tasks completadas:', error);
        response.status(500).send('Error al obtener tasks completadas');
    }
});
