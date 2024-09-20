const express = require('express');
const { getProductInfo } = require('./queries'); // Importamos la función desde queries.js
const app = express();
const port = 4000;

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Ruta para la consulta
app.get('/api/consulta', async (req, res) => {
    const serialNumber = req.query.serialNumber;

    if (!serialNumber) {
        return res.status(400).send('Número de serie no proporcionado');
    }

    try {
        const result = await getProductInfo(serialNumber); // Usamos la función desde queries.js
        res.json(result);
    } catch (error) {
        res.status(500).send('Error al ejecutar la consulta');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
