// Manejador del formulario de login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
  
    // Validar los campos antes de enviarlos
    if (!username || !password) {
      errorMessage.textContent = 'Please enter both username and password.';
      errorMessage.style.display = 'block';
      return;
    }
  
    // Enviar las credenciales al servidor (simulación con fetch)
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Redireccionar si el login es exitoso
          window.location.href = '/dashboard';
        } else {
          // Mostrar error si el login falla
          errorMessage.textContent = 'Invalid username or password.';
          errorMessage.style.display = 'block';
        }
      })
      .catch(err => {
        errorMessage.textContent = 'Error connecting to the server.';
        errorMessage.style.display = 'block';
      });
  });
  