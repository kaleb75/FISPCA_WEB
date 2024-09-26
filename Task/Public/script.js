// Obtener todas las tareas del servidor
function fetchTasks() {
    $.get('/tasks', function(data) {
        let rows = '';
        // Recorre cada tarea y genera filas HTML
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
                    <!-- Botones para editar y eliminar tareas -->
                    <button onclick="editTask(${task.id})">Editar</button>
                    <button onclick="deleteTask(${task.id})">Eliminar</button>
                </td>
            </tr>`;
        });
        // Inserta las filas generadas en el cuerpo de la tabla de tareas
        $('#taskList').html(rows);
    });
}

// Manejar la creación/actualización de tareas cuando se envía el formulario
$('#taskForm').on('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    // Obtener el ID de la tarea (campo oculto), si existe
    const taskId = $('#taskId').val();

    // Recopilar datos de los campos del formulario
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
        // Actualizar una tarea existente utilizando una solicitud PUT
        $.ajax({
            url: `/tasks/${taskId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: fetchTasks // Actualizar la lista de tareas al completar con éxito
        });
    } else {
        // Crear una nueva tarea utilizando una solicitud POST
        $.post('/tasks', taskData, fetchTasks);
    }

    // Restablecer el formulario después de la acción
    $('#taskForm')[0].reset();
    $('#taskId').val('');
});

// Obtener los datos de una tarea y rellenar el formulario para editarla
function editTask(id) {
    $.get(`/tasks/${id}`, function(data) {
        $('#taskId').val(data.id); // Asignar el ID de la tarea para su actualización
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

// Eliminar una tarea por ID
function deleteTask(id) {
    $.ajax({
        url: `/tasks/${id}`,
        method: 'DELETE',
        success: fetchTasks // Actualizar la lista de tareas al eliminar con éxito
    });
}

// Obtener todas las tareas cuando la página haya cargado completamente
$(document).ready(fetchTasks);
