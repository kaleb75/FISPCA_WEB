//script.js
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
                    <button onclick="editTask(${task.id})">Edit/Update</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                    <button onclick="markTaskAsCompleted(${task.id})" ${task.status === 'completado' ? 'disabled' : ''}>Done</button>
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

// Función para marcar un task como completado
async function markTaskAsCompleted(taskId) {
    try {
        const response = await $.ajax({
            url: `/tasks/${taskId}/complete`,
            method: 'PUT'
        });
        console.log(`Task ${taskId} marcada como completada.`);
        
        // Actualiza la lista de tareas después de marcarla como completada
        fetchTasks();
    } catch (error) {
        console.error('Error al marcar task como completada:', error);
    }
}


// Llama a fetchTasks cuando la página se haya cargado
$(document).ready(function() {
    fetchTasks();
});
// Task/Public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // Redirigir al login si no hay token
      return;
    }
  
    fetch('/tasks', {
      method: 'GET',
      headers: { 'Authorization': token }
    })
      .then(response => response.json())
      .then(tasks => {
        const taskContainer = document.getElementById('taskContainer');
        tasks.forEach(task => {
          const taskElement = document.createElement('div');
          taskElement.textContent = `${task.titulo}: ${task.descripcion}`;
          taskContainer.appendChild(taskElement);
        });
      })
      .catch(() => {
        alert('Error al cargar las tareas');
      });
  });
  