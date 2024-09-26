const sql = require('mssql');

const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true // Change to true for local dev / self-signed certs
  }
};

sql.connect(config, err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to SQL Server');
  }
});

module.exports = sql;