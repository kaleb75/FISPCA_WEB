document.getElementById('consultaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const serialNumber = document.getElementById('serialNumber').value;

  try {
      const response = await fetch(`/api/consulta?serialNumber=${serialNumber}`);
      if (!response.ok) {
          throw new Error('Error en la respuesta de la red');
      }
      const data = await response.json();

      // Llena la tabla con los datos obtenidos
      const tableBody = document.querySelector('#resultTable tbody');
      tableBody.innerHTML = ''; // Limpiar el contenido anterior

      data.forEach(row => {
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
  } catch (error) {
      console.error('Error al manejar la solicitud:', error);
      document.getElementById('resultContainer').innerHTML = 'Error al obtener los datos.';
  }
});
