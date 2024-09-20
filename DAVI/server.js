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
                WHERE McbSno = @serialNumber;

                -- Union of multiple queries to retrieve information from various tables based on McbSno
                SELECT InputType, IsPass, BadgeNo AS Editor, McbSno AS SN, PdLine AS Line, Cdt AS Creation_Date, WC, 
                       (SELECT Description FROM STATION WHERE STATION.WC = SMT_LOG.WC) AS STATION
                FROM SMT_LOG
                WHERE McbSno = @serialNumber
                UNION
                SELECT Input_Type, IsPass, BadgeNo, McbSno, PdLine, Cdt, WC, 
                       (SELECT Description FROM STATION WHERE STATION.WC = PCA_LOG.WC) AS STATION
                FROM PCA_LOG 
                WHERE McbSno = @serialNumber
                UNION
                SELECT Input_Type, IsPass, BadgeNo, McbSno, PdLine, Cdt, WC, 
                       (SELECT Description FROM STATION WHERE STATION.WC = API_LOG.WC) AS STATION
                FROM API_LOG
                WHERE McbSno = @serialNumber
                UNION
                SELECT SPType, IsPass, BadgeNo, SNO, PdLine, Cdt, WC, 
                       (SELECT Description FROM STATION WHERE STATION.WC = PCA_WC_LOG.WC) AS STATION
                FROM PCA_WC_LOG
                WHERE SNO = @serialNumber
                UNION
                SELECT Input_Type, IsPass, BadgeNo, McbSno, PdLine, Cdt, WC, 
                       (SELECT Description FROM STATION WHERE STATION.WC = SA_LOG.WC) AS STATION 
                FROM SA_LOG
                WHERE McbSno = @serialNumber
                UNION
                SELECT Status, LogId, BadgeNo, McbSno, PdLine, Cdt, WC, 
                       (SELECT Description FROM STATION WHERE STATION.WC = AUTOSCAN_PIC_LOG.WC) AS STATION 
                FROM AUTOSCAN_PIC_LOG
                WHERE McbSno = @serialNumber
                UNION
                SELECT ShipTo, Status, Editor, Sno, Rev, Cdt, CartonNo, 
                       (SELECT Dn FROM SHIPCTRL_CARTON_DN_COMBINE WHERE SHIPCTRL_PACKING.CartonNo = SHIPCTRL_CARTON_DN_COMBINE.CartonNo) AS STATION 
                FROM SHIPCTRL_PACKING
                WHERE Sno = @serialNumber
                ORDER BY Cdt ASC;
            `);

        // Enviar los resultados como respuesta JSON
        res.json(result.recordsets);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).send('Error al ejecutar la consulta');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});