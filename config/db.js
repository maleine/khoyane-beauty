const mysql = require('mysql2');

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur connexion MySQL:', err.message, err.code);
  } else {
    console.log('✅ Connexion MySQL réussie!');
    connection.release();
  }
});

module.exports = promisePool;
