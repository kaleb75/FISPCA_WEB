// Importa el módulo 'mssql' para manejar la conexión con la base de datos SQL Server
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

// Variable para mantener una conexión reutilizable
let poolPromise;

// Función para obtener una conexión a la base de datos
const getConnection = async () => {
    try {
        if (!poolPromise) {
            poolPromise = sql.connect(config);
        }
        const pool = await poolPromise;
        return pool;
    } catch (error) {
        console.error('Error al obtener la conexión a la base de datos:', error);
        throw error;
    }
};

// Manejo de cierre de conexión cuando la aplicación termina
process.on('SIGINT', async () => {
    console.log('Cerrando la conexión a la base de datos...');
    if (poolPromise) {
        try {
            await sql.close();
            console.log('Conexión cerrada exitosamente.');
        } catch (error) {
            console.error('Error al cerrar la conexión a la base de datos:', error);
        }
    }
    process.exit(0);
});

// Exportar la función de conexión
module.exports = {
    getConnection
};
