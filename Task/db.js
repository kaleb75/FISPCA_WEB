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

// Función para obtener una conexión a la base de datos
async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

module.exports = {
    sql, // Exportar el objeto `sql` en caso de que necesites hacer referencia a él
    getConnection // Exportar la función `getConnection`
};
