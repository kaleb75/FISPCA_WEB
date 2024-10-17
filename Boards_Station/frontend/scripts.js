document.getElementById('pcaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const serialNumbers = document.getElementById('serialNumbers').value.trim();
    if (!serialNumbers) {
        alert('Please enter at least one serial number.');
        return;
    }

    // Mostrar spinner de carga
    document.getElementById('loadingSpinner').style.display = 'block';

    fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialNumbers })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loadingSpinner').style.display = 'none';
            const tableBody = document.getElementById('resultsTableBody');
            tableBody.innerHTML = ''; // Limpiar tabla

            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.Internal_SN}</td>
                    <td>${row.Customer_SN}</td>
                    <td>${row.Line}</td>
                    <td>${row.Model}</td>
                    <td>${row.Current_Station}</td>
                    <td>${row.Next_Station}</td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(() => {
            document.getElementById('loadingSpinner').style.display = 'none';
            alert('Error executing PCA. Please try again.');
        });
});
