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

// Programar la tarea de archivado de tareas completadas
cron.schedule('0 0 * * *', () => {
    console.log('Ejecutando tarea programada para archivar tareas completadas');
    archiveCompletedTasks();
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
    console.log(`La aplicacion esta corriendo ejecuta en tu navegador http://localhost:${port}.`);
});