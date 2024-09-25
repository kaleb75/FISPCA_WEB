const pool = require('./db');

const getTasks = (request, response) => {
    pool.query('SELECT * FROM tasks ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getTaskById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM tasks WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows[0]);
    });
};

const createTask = (request, response) => {
    const { Title, Desc_s, Desc_l, Priority, Owner, Dept, Customer, Requester, Area, URL, Attachment, Status } = request.body;

    pool.query('INSERT INTO tasks (Title, Desc_s, Desc_l, Priority, Owner, Dept, Customer, Requester, Area, URL, Attachment, Status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', 
    [Title, Desc_s, Desc_l, Priority, Owner, Dept, Customer, Requester, Area, URL, Attachment, Status], 
    (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).json(results.rows[0]);
    });
};

const updateTask = (request, response) => {
    const id = parseInt(request.params.id);
    const { Title, Desc_s, Desc_l, Priority, Owner, Dept, Customer, Requester, Area, URL, Attachment, Status } = request.body;

    pool.query(
        'UPDATE tasks SET Title = $1, Desc_s = $2, Desc_l = $3, Priority = $4, Owner = $5, Dept = $6, Customer = $7, Requester = $8, Area = $9, URL = $10, Attachment = $11, Status = $12 WHERE id = $13 RETURNING *',
        [Title, Desc_s, Desc_l, Priority, Owner, Dept, Customer, Requester, Area, URL, Attachment, Status, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
};

const deleteTask = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM tasks WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Task deleted with ID: ${id}`);
    });
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};