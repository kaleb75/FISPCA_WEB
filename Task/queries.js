// Importar la función de conexión a la base de datos
const { getConnection } = require('./db');

// Obtener todos los ítems (Read)
const getItems = async () => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Items'); // Reemplaza 'Items' con tu tabla
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener ítems de la base de datos:', error);
        throw error;
    }
};

// Obtener un ítem por ID (Read)
const getItemById = async (id) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', id)
            .query('SELECT * FROM Items WHERE id = @id'); // Reemplaza 'Items' con tu tabla
        return result.recordset[0];
    } catch (error) {
        console.error('Error al obtener ítem por ID:', error);
        throw error;
    }
};

// Crear un nuevo ítem (Create)
const createItem = async (newItem) => {
    try {
        const { name, description } = newItem; // Ajusta esto según los campos de tu tabla
        const pool = await getConnection();
        const result = await pool.request()
            .input('name', name)
            .input('description', description)
            .query('INSERT INTO Items (name, description) VALUES (@name, @description)'); // Ajusta la consulta
        return result;
    } catch (error) {
        console.error('Error al crear ítem:', error);
        throw error;
    }
};

// Actualizar un ítem (Update)
const updateItem = async (id, updatedItem) => {
    try {
        const { name, description } = updatedItem; // Ajusta esto según los campos de tu tabla
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', id)
            .input('name', name)
            .input('description', description)
            .query('UPDATE Items SET name = @name, description = @description WHERE id = @id'); // Ajusta la consulta
        return result;
    } catch (error) {
        console.error('Error al actualizar ítem:', error);
        throw error;
    }
};

// Eliminar un ítem (Delete)
const deleteItem = async (id) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', id)
            .query('DELETE FROM Items WHERE id = @id'); // Ajusta la consulta
        return result;
    } catch (error) {
        console.error('Error al eliminar ítem:', error);
        throw error;
    }
};

// Exportar las funciones
module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};
