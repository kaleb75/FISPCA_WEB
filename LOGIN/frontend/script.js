// LOGIN/public/script.js
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('token', data.token); // Guardar el token
        window.location.href = '/tasks'; // Redirigir a tareas
      } else {
        errorMessage.textContent = data.message;
        errorMessage.style.display = 'block';
      }
    })
    .catch(() => {
      errorMessage.textContent = 'Error al conectar con el servidor.';
      errorMessage.style.display = 'block';
    });
});
