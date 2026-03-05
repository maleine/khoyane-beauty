const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'passer123',
  database: process.env.DB_NAME || 'nailart_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

const promisePool = pool.promise();

// Test de connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur connexion MySQL:', err.message);
    console.log('💡 Vérifiez vos paramètres dans le fichier .env');
  } else {
    console.log('✅ Connexion MySQL réussie!');
    connection.release();
  }
});

module.exports = promisePool;
