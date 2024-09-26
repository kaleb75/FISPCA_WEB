const sql = require('mssql');

// Configuración para la conexión a la base de datos
const config = {
    user: 'taopcav2',
    password: 'Pca2.0@Mes',
    server: 'IMX2SQL',
    database: 'PCA',
    options: {
        encrypt: true, // Utilizar cifrado si es necesario
        trustServerCertificate: true // Solo si estás utilizando certificados de servidor no verificados
    },
    pool: {
        max: 10, // Número máximo de conexiones en el pool
        min: 0,
        idleTimeoutMillis: 30000 // Tiempo de espera antes de liberar una conexión no utilizada
    }
};

sql.connect(config, err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to SQL Server');
    }
});

module.exports = sql;