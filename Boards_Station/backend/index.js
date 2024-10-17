const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { sql, poolPromise } = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/executePCA', async (req, res) => {
    const { serialNumbers } = req.body;
    const numbers = serialNumbers.split('\n').map(num => num.trim());
    const parametersMIS_ID = [];
    const parametersMcbSno = [];

    numbers.forEach(num => {
        if (num.startsWith('ARVIMX')) {
            parametersMIS_ID.push(num);
        } else {
            parametersMcbSno.push(num);
        }
    });

    if (parametersMIS_ID.length === 0 && parametersMcbSno.length === 0) {
        return res.status(400).json({ message: 'Ingrese al menos un número de serie.' });
    }

    let sqlQuery = `
        SELECT 
            McbSno AS Internal_SN, 
            MIS_ID AS Customer_SN, 
            PdLine AS Line, 
            Model, 
            (SELECT Description FROM STATION WHERE STATION.WC = PCA_SNO.WC) AS Current_Station, 
            (SELECT Description FROM STATION WHERE STATION.WC = PCA_SNO.NWC) AS Next_Station 
        FROM PCA_SNO 
    `;

    const conditions = [];

    if (parametersMIS_ID.length > 0) {
        conditions.push(
            `MIS_ID IN (${parametersMIS_ID.map((_, i) => `@param${i}`).join(', ')})`
        );
    }

    if (parametersMcbSno.length > 0) {
        conditions.push(
            `McbSno IN (${parametersMcbSno.map((_, i) => `@param${parametersMIS_ID.length + i}`).join(', ')})`
        );
    }

    if (conditions.length > 0) {
        sqlQuery += `WHERE ${conditions.join(' OR ')}`;
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();

        parametersMIS_ID.forEach((param, index) => {
            request.input(`param${index}`, sql.VarChar, param);
        });

        parametersMcbSno.forEach((param, index) => {
            request.input(`param${parametersMIS_ID.length + index}`, sql.VarChar, param);
        });

        console.log('Executing SQL Query:', sqlQuery);
        const result = await request.query(sqlQuery);
        console.log('Query Result:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Error al ejecutar la consulta', error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
