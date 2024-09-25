// Obtener todos los tasks
function fetchTasks() {
    $.get('/tasks', function(data) {
        let rows = '';
        data.forEach(task => {
            rows += `<tr>
                <td>${task.id}</td>
                <td>${task.title}</td>
                <td>${task.desc_s}</td>
                <td>${task.desc_l}</td>
                <td>${task.priority}</td>
                <td>${task.owner}</td>
                <td>${task.dept}</td>
                <td>${task.customer}</td>
                <td>${task.requester}</td>
                <td>${task.area}</td>
                <td>${task.url}</td>
                <td>${task.attachment}</td>
                <td>${task.status}</td>
                <td>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </td>
            </tr>`;
        });
        $('#taskList').html(rows);
    });
}

// Crear/actualizar task
$('#taskForm').on('submit', function(e) {
    e.preventDefault();
    const taskId = $('#taskId').val();
    const taskData = {
        title: $('#taskTitle').val(),
        desc_s: $('#taskDescS').val(),
        desc_l: $('#taskDescL').val(),
        priority: $('#taskPriority').val(),
        owner: $('#taskOwner').val(),
        dept: $('#taskDept').val(),
        customer: $('#taskCustomer').val(),
        requester: $('#taskRequester').val(),
        area: $('#taskArea').val(),
        url: $('#taskURL').val(),
        attachment: $('#taskAttachment').val(),
        status: $('#taskStatus').val()
    };

    if (taskId) {
        // Actualizar task
        $.ajax({
            url: `/tasks/${taskId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: fetchTasks
        });
    } else {
        // Crear task
        $.post('/tasks', taskData, fetchTasks);
    }

    // Resetear el formulario
    $('#taskForm')[0].reset();
    $('#taskId').val('');
});

// Editar task
function editTask(id) {
    $.get(`/tasks/${id}`, function(data) {
        $('#taskId').val(data.id);
        $('#taskTitle').val(data.title);
        $('#taskDescS').val(data.desc_s);
        $('#taskDescL').val(data.desc_l);
        $('#taskPriority').val(data.priority);
        $('#taskOwner').val(data.owner);
        $('#taskDept').val(data.dept);
        $('#taskCustomer').val(data.customer);
        $('#taskRequester').val(data.requester);
        $('#taskArea').val(data.area);
        $('#taskURL').val(data.url);
        $('#taskAttachment').val(data.attachment);
        $('#taskStatus').val(data.status);
    });
}

// Eliminar task
function deleteTask(id) {
    $.ajax({
        url: `/tasks/${id}`,
        method: 'DELETE',
        success: fetchTasks
    });
}

// Obtener tasks al cargar la página
$(document).ready(fetchTasks);