document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  if (!username || !password) {
    errorMessage.textContent = 'Please enter both username and password.';
    errorMessage.style.display = 'block';
    return;
  }

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
        window.location.href = '/dashboard';
      } else {
        errorMessage.textContent = 'Invalid username or password.';
        errorMessage.style.display = 'block';
      }
    })
    .catch(err => {
      errorMessage.textContent = 'Error connecting to the server.';
      errorMessage.style.display = 'block';
    });
});