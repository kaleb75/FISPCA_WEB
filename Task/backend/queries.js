//queries.js
const { getConnection } = require('./db');
const sql = require('mssql');

// Obtener todas las tareas
const getTasks = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM tasks WHERE status <> 'DONE' ORDER BY priority, udt ASC");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener tasks:', error);
        res.status(500).send('Error al obtener tasks');
    }
};

// Obtener tarea por ID
const getTaskById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const pool = await getConnection();
        const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM tasks WHERE id = @id');
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener task:', error);
        res.status(500).send('Error al obtener task');
    }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
    const { title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status } = req.body;
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
            .query(`
                INSERT INTO tasks (title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status, cdt, udt) 
                VALUES (@title, @desc_s, @desc_l, @priority, @owner, @dept, @customer, @requester, @area, @url, @attachment, @status, GETDATE(), GETDATE());
                SELECT SCOPE_IDENTITY() AS id
            `);
        res.status(201).json({ id: result.recordset[0].id });
    } catch (error) {
        console.error('Error al crear task:', error);
        res.status(500).send('Error al crear task');
    }
};

// Actualizar tarea existente
const updateTask = async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, desc_s, desc_l, priority, owner, dept, customer, requester, area, url, attachment, status } = req.body;
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
            .query(`
                UPDATE tasks 
                SET title = @title, desc_s = @desc_s, desc_l = @desc_l, priority = @priority, owner = @owner, dept = @dept, customer = @customer, requester = @requester, area = @area, url = @url, attachment = @attachment, status = @status, udt = GETDATE() 
                WHERE id = @id
            `);
        res.status(200).send(`Task updated with ID: ${id}`);
    } catch (error) {
        console.error('Error al actualizar task:', error);
        res.status(500).send('Error al actualizar task');
    }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const pool = await getConnection();
        await pool.request().input('id', sql.Int, id).query('DELETE FROM tasks WHERE id = @id');
        res.status(200).send(`Task deleted with ID: ${id}`);
    } catch (error) {
        console.error('Error al eliminar task:', error);
        res.status(500).send('Error al eliminar task');
    }
};

// Marcar tarea como completada
const markTaskAsCompleted = async (req, res) => {
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) return res.status(400).send('Invalid task ID');
    try {
        const pool = await getConnection();
        await pool.request().input('taskId', sql.Int, taskId).query(`
            UPDATE tasks 
            SET status = 'DONE', completed_at = GETDATE() 
            WHERE id = @taskId
        `);
        res.status(200).send(`Task ${taskId} marcada como completada.`);
    } catch (error) {
        console.error('Error al marcar task como completada:', error);
        res.status(500).send('Error al marcar task como completada');
    }
};

// Archivar tareas completadas
const archiveCompletedTasks = async () => {
    try {
        const pool = await getConnection();
        await pool.request().query(`
            INSERT INTO tasks_archive SELECT * FROM tasks WHERE completed_at IS NOT NULL;
            DELETE FROM tasks WHERE completed_at IS NOT NULL;
        `);
        console.log('Tareas completadas archivadas con éxito.');
    } catch (error) {
        console.error('Error al archivar tareas completadas:', error);
    }
};

// Exportar todas las funciones
module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    markTaskAsCompleted,
    archiveCompletedTasks
};
