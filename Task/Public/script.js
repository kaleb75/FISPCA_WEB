// Obtener todos los tasks
function fetchTasks() {
    $.get('/tasks', function(data) {
        let rows = '';
        data.forEach(task => {
            rows += `<tr>
                <td>${task.ID}</td>
                <td>${task.Title}</td>
                <td>${task.Desc_s}</td>
                <td>${task.Desc_l}</td>
                <td>${task.Priority}</td>
                <td>${task.Owner}</td>
                <td>${task.Dept}</td>
                <td>${task.Customer}</td>
                <td>${task.Requester}</td>
                <td>${task.Area}</td>
                <td>${task.URL}</td>
                <td>${task.Attachment}</td>
                <td>${task.Status}</td>
                <td>
                    <button onclick="editTask(${task.ID})">Edit</button>
                    <button onclick="deleteTask(${task.ID})">Delete</button>
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
        Title: $('#taskTitle').val(),
        Desc_s: $('#taskDescS').val(),
        Desc_l: $('#taskDescL').val(),
        Priority: $('#taskPriority').val(),
        Owner: $('#taskOwner').val(),
        Dept: $('#taskDept').val(),
        Customer: $('#taskCustomer').val(),
        Requester: $('#taskRequester').val(),
        Area: $('#taskArea').val(),
        URL: $('#taskURL').val(),
        Attachment: $('#taskAttachment').val(),
        Status: $('#taskStatus').val()
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
        $('#taskId').val(data.ID);
        $('#taskTitle').val(data.Title);
        $('#taskDescS').val(data.Desc_s);
        $('#taskDescL').val(data.Desc_l);
        $('#taskPriority').val(data.Priority);
        $('#taskOwner').val(data.Owner);
        $('#taskDept').val(data.Dept);
        $('#taskCustomer').val(data.Customer);
        $('#taskRequester').val(data.Requester);
        $('#taskArea').val(data.Area);
        $('#taskURL').val(data.URL);
        $('#taskAttachment').val(data.Attachment);
        $('#taskStatus').val(data.Status);
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