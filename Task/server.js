// Importar módulos necesarios
const express = require('express');
const app = express();
const port = 4000;
const { getItems, getItemById, createItem, updateItem, deleteItem } = require('./queries');

// Middleware para procesar datos JSON y solicitudes URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos del directorio 'public'

// Ruta para obtener todos los ítems
app.get('/items', async (req, res) => {
    try {
        const items = await getItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ítems' });
    }
});

// Ruta para obtener un ítem por ID
app.get('/items/:id', async (req, res) => {
    try {
        const item = await getItemById(req.params.id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ message: 'Ítem no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ítem' });
    }
});

// Ruta para crear un nuevo ítem
app.post('/items', async (req, res) => {
    try {
        const newItem = req.body;
        await createItem(newItem);
        res.status(201).json({ message: 'Ítem creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ítem' });
    }
});

// Ruta para actualizar un ítem
app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = req.body;
        await updateItem(req.params.id, updatedItem);
        res.status(200).json({ message: 'Ítem actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar ítem' });
    }
});

// Ruta para eliminar un ítem
app.delete('/items/:id', async (req, res) => {
    try {
        await deleteItem(req.params.id);
        res.status(200).json({ message: 'Ítem eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar ítem' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
