// Obtener todos los ítems
function fetchItems() {
    $.get('/items', function(data) {
        let rows = '';
        data.forEach(item => {
            rows += `<tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>
                    <button onclick="editItem(${item.id})">Edit</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                </td>
            </tr>`;
        });
        $('#itemList').html(rows);
    });
}

// Crear/actualizar ítem
$('#itemForm').on('submit', function(e) {
    e.preventDefault();
    const itemId = $('#itemId').val();
    const itemData = {
        name: $('#itemName').val(),
        description: $('#itemDescription').val()
    };

    if (itemId) {
        // Actualizar ítem
        $.ajax({
            url: `/items/${itemId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(itemData),
            success: fetchItems
        });
    } else {
        // Crear ítem
        $.post('/items', itemData, fetchItems);
    }

    // Resetear el formulario
    $('#itemForm')[0].reset();
    $('#itemId').val('');
});

// Editar ítem
function editItem(id) {
    $.get(`/items/${id}`, function(data) {
        $('#itemId').val(data.id);
        $('#itemName').val(data.name);
        $('#itemDescription').val(data.description);
    });
}

// Eliminar ítem
function deleteItem(id) {
    $.ajax({
        url: `/items/${id}`,
        method: 'DELETE',
        success: fetchItems
    });
}

// Obtener ítems al cargar la página
$(document).ready(fetchItems);
