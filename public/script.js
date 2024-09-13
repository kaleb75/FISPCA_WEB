document.getElementById('consultaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const serialNumber = document.getElementById('serialNumber').value;

    try {
        const response = await fetch(`/api/consulta?serialNumber=${serialNumber}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        const data = await response.json();

        // Llena la tabla con los datos obtenidos de la primera consulta
        const tableBody = document.querySelector('#resultTable tbody');
        tableBody.innerHTML = ''; // Limpiar el contenido anterior

        data[0].forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.Id}</td>
                <td>${row.Internal_SN}</td>
                <td>${row.Customer_SN}</td>
                <td>${row.Rev}</td>
                <td>${row.WorkOrder}</td>
                <td>${row.Model}</td>
                <td>${row.Line}</td>
                <td>${row.WC}</td>
                <td>${row.Current_Station}</td>
                <td>${row.NWC}</td>
                <td>${row.Next_Station}</td>
            `;
            tableBody.appendChild(tr);
        });

        // Llena la tabla con los datos obtenidos de la segunda consulta
        const additionalTableBody = document.querySelector('#additionalResultTable tbody');
        additionalTableBody.innerHTML = ''; // Limpiar el contenido anterior

        data[1].forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.InputType}</td>
                <td>${row.IsPass}</td>
                <td>${row.Editor}</td>
                <td>${row.SN}</td>
                <td>${row.Line}</td>
                <td>${row.Creation_Date}</td>
                <td>${row.WC}</td>
                <td>${row.STATION}</td>
            `;
            additionalTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al manejar la solicitud:', error);
        document.getElementById('resultContainer').innerHTML = 'Error al obtener los datos.';
    }
});