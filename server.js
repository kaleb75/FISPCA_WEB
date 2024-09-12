const express = require('express');
const mssql = require('mssql');
const app = express();
const port = 4000;

// Configuración de conexión a la base de datos
const dbConfig = {
    user: 'taopcav2',
    password: 'Pca2.0@Mes',
    server: 'IMX2SQL',
    database: 'PCA',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Ruta para la consulta
app.get('/api/consulta', async (req, res) => {
    const serialNumber = req.query.serialNumber;

    if (!serialNumber) {
        return res.status(400).send('Número de serie no proporcionado');
    }

    try {
        // Conectar a la base de datos
        const pool = await mssql.connect(dbConfig);

        // Ejecutar la consulta
        const result = await pool.request()
            .input('serialNumber', mssql.VarChar, serialNumber)
            .query(`
                SELECT SnoId AS Id, McbSno AS Internal_SN, MIS_ID As Customer_SN, Rev, WkNo AS WorkOrder, Model, PdLine AS Line, WC,
                       (SELECT Description FROM STATION WHERE STATION.WC = PCA_SNO.WC) AS Current_Station,
                       NWC,
                       (SELECT Description FROM STATION WHERE STATION.WC = PCA_SNO.NWC) AS Next_Station
                FROM PCA_SNO
                WHERE McbSno = @serialNumber
            `);

        // Enviar los resultados como respuesta JSON
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).send('Error al ejecutar la consulta');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
