// Importar la función getConnection desde el archivo de base de datos
const { getConnection } = require('./db');
const sql = require('mssql'); // Importar el módulo mssql para manejar consultas SQL

// Función para obtener todos los tasks
const getTasks = async (request, response) => {
    try {
        const pool = await getConnection(); // Establecer conexión con la base de datos
        const result = await pool.request().query('SELECT * FROM tasks ORDER BY id ASC'); // Ejecutar la consulta para obtener todos los tasks
        response.status(200).json(result.recordset); // Enviar el conjunto de resultados como respuesta en formato JSON
    } catch (error) {
        console.error('Error al obtener tasks:', error); // Registrar el error en la consola
        response.status(500).send('Error al obtener tasks'); // Enviar un mensaje de error al cliente
    }
};

// Función para obtener un task por ID
const getTaskById = async (request, response) => {
    const id = parseInt(request.params.id); // Obtener el ID de los parámetros de la solicitud y convertirlo a entero
    try {
        const pool = await getConnection(); // Establecer conexión con la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id) // Definir el parámetro de entrada 'id'
            .query('SELECT * FROM tasks WHERE id = @id'); // Ejecutar la consulta para obtener el task con el ID especificado
        response.status(200).json(result.recordset[0]); // Enviar el task encontrado como respuesta en formato JSON
    } catch (error) {
        console.error('Error al obtener task:', error); // Registrar el error en la consola
        response.status(500).send('Error al obtener task'); // Enviar un mensaje de error al cliente
    }
};

// Función para crear un nuevo task
const createTask = async (request, response) => {
    // Extraer los campos del body de la solicitud
    const { title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status } = request.body;
    try {
        const pool = await getConnection(); // Establecer conexión con la base de datos
        const result = await pool.request()
            .input('title', sql.VarChar, title)
            .input('desc_s', sql.Text, desc_s)
            .input('desc_l', sql.Text, desc_l)
            .input('priority', sql.Int, priority)
            .input('owner', sql.VarChar, owner)
            .input('dept', sql.VarChar, dept)
            .input('customer', sql.VarChar, customer)
            .input('requester', sql.VarChar, requester)
            .input('area', sql.VarChar, area)
            .input('url', sql.Text, url)
            .input('attachment', sql.Text, attachment)
            .input('status', sql.VarChar, status)
            .query('INSERT INTO tasks (title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status) VALUES (@title, @desc_s, @desc_l, @priority, @owner, @dept, @customer, @requester, @area, @url, @attachment, @status); SELECT SCOPE_IDENTITY() AS id'); // Ejecutar la consulta de inserción y obtener el ID generado
        response.status(201).json({ id: result.recordset[0].id }); // Enviar el ID del nuevo task como respuesta
    } catch (error) {
        console.error('Error al crear task:', error); // Registrar el error en la consola
        response.status(500).send('Error al crear task'); // Enviar un mensaje de error al cliente
    }
};

// Función para actualizar un task existente
const updateTask = async (request, response) => {
    const id = parseInt(request.params.id); // Obtener el ID de los parámetros de la solicitud y convertirlo a entero
    // Extraer los campos del body de la solicitud
    const { title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status } = request.body;
    try {
        const pool = await getConnection(); // Establecer conexión con la base de datos
        await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.VarChar, title)
            .input('desc_s', sql.Text, desc_s)
            .input('desc_l', sql.Text, desc_l)
            .input('priority', sql.Int, priority)
            .input('owner', sql.VarChar, owner)
            .input('dept', sql.VarChar, dept)
            .input('customer', sql.VarChar, customer)
            .input('requester', sql.VarChar, requester)
            .input('area', sql.VarChar, area)
            .input('url', sql.Text, url)
            .input('attachment', sql.Text, attachment)
            .input('status', sql.VarChar, status)
            .query('UPDATE tasks SET title = @title, desc_s = @desc_s, desc_l = @desc_l, priority = @priority, owner = @owner, dept = @dept, customer = @customer, requester = @requester, area = @area, url = @url, attachment = @attachment, status = @status WHERE id = @id'); // Ejecutar la consulta de actualización
        response.status(200).send(`Task updated with ID: ${id}`); // Enviar un mensaje de éxito al cliente
    } catch (error) {
        console.error('Error al actualizar task:', error); // Registrar el error en la consola
        response.status(500).send('Error al actualizar task'); // Enviar un mensaje de error al cliente
    }
};

// Función para eliminar un task
const deleteTask = async (request, response) => {
    const id = parseInt(request.params.id); // Obtener el ID de los parámetros de la solicitud y convertirlo a entero
    try {
        const pool = await getConnection(); // Establecer conexión con la base de datos
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tasks WHERE id = @id'); // Ejecutar la consulta para eliminar el task con el ID especificado
        response.status(200).send(`Task deleted with ID: ${id}`); // Enviar un mensaje de éxito al cliente
    } catch (error) {
        console.error('Error al eliminar task:', error); // Registrar el error en la consola
        response.status(500).send('Error al eliminar task'); // Enviar un mensaje de error al cliente
    }
};

const markTaskAsCompleted = async (taskId) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('taskId', taskId)
            .query('UPDATE tasks SET completed_at = GETDATE() WHERE id = @taskId');
        console.log(`Task ${taskId} marcada como completada.`);
    } catch (error) {
        console.error('Error al marcar task como completada:', error);
    }
};
const archiveCompletedTasks = async () => {
    try {
        const pool = await getConnection();
        // Mover las tasks completadas a la tabla de archivo
        await pool.request().query(`
            INSERT INTO tasks_archive
            SELECT * FROM tasks WHERE completed_at IS NOT NULL;

            DELETE FROM tasks WHERE completed_at IS NOT NULL;
        `);
        console.log('Tareas completadas archivadas con éxito.');
    } catch (error) {
        console.error('Error al archivar tareas completadas:', error);
    }
};


// Exportar las funciones para que estén disponibles en otros módulos
module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};
