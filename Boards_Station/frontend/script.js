// frontend/script.js
document.getElementById('pcaForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const serialNumbers = document.getElementById('serialNumbers').value;
    try {
        const response = await fetch('http://localhost:3000/executePCA', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serialNumbers })
        });
        const results = await response.json();
        console.log('Response from server:', results);
        if (!Array.isArray(results)) {
            throw new Error('Invalid response format');
        }
        const resultsTableBody = document.getElementById('resultsTableBody');
        resultsTableBody.innerHTML = '';
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.Internal_SN}</td>
                <td>${result.Customer_SN}</td>
                <td>${result.Line}</td>
                <td>${result.Model}</td>
                <td>${result.Current_Station}</td>
                <td>${result.Next_Station}</td>
            `;
            resultsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error executing PCA:', error);
    }
});