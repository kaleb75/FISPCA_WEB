const { getConnection } = require('./db');
const sql = require('mssql'); // Importar sql de mssql

// Obtener todos los tasks
const getTasks = async (request, response) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM tasks ORDER BY id ASC');
        response.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener tasks:', error);
        response.status(500).send('Error al obtener tasks');
    }
};

// Obtener un task por ID
const getTaskById = async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM tasks WHERE id = @id');
        response.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener task:', error);
        response.status(500).send('Error al obtener task');
    }
};

// Crear un nuevo task
const createTask = async (request, response) => {
    const { title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status } = request.body;
    try {
        const pool = await getConnection();
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
            .query('INSERT INTO tasks (title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status) VALUES (@title, @desc_s, @desc_l, @priority, @owner, @dept, @customer, @requester, @area, @url, @attachment, @status); SELECT SCOPE_IDENTITY() AS id');
        response.status(201).json({ id: result.recordset[0].id });
    } catch (error) {
        console.error('Error al crear task:', error);
        response.status(500).send('Error al crear task');
    }
};

// Actualizar un task existente
const updateTask = async (request, response) => {
    const id = parseInt(request.params.id);
    const { title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status } = request.body;
    try {
        const pool = await getConnection();
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
            .query('UPDATE tasks SET title = @title, desc_s = @desc_s, desc_l = @desc_l, priority = @priority, owner = @owner, dept = @dept, customer = @customer, requester = @requester, area = @area, url = @url, attachment = @attachment, status = @status WHERE id = @id');
        response.status(200).send(`Task updated with ID: ${id}`);
    } catch (error) {
        console.error('Error al actualizar task:', error);
        response.status(500).send('Error al actualizar task');
    }
};

// Eliminar un task
const deleteTask = async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tasks WHERE id = @id');
        response.status(200).send(`Task deleted with ID: ${id}`);
    } catch (error) {
        console.error('Error al eliminar task:', error);
        response.status(500).send('Error al eliminar task');
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};