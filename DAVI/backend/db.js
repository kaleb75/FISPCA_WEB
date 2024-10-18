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
    }
};

// Función para obtener una conexión a la base de datos
const getConnection = async () => {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Error al obtener la conexión a la base de datos:', error);
        throw error;
    }
};

// Exportar la función de conexión
module.exports = {
    getConnection
};