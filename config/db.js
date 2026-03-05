const mysql = require('mysql2');

const MYSQL_URL = process.env.MYSQL_URL;

let config;
if (MYSQL_URL) {
  const url = new URL(MYSQL_URL);
  config = {
    host:     url.hostname,
    port:     parseInt(url.port) || 3306,
    user:     url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
  };
} else {
  config = {
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
  };
}

const pool = mysql.createPool(config);
const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur connexion MySQL:', err.message, err.code);
    console.error('Host utilisé:', config.host);
    console.error('Port utilisé:', config.port);
    console.error('User utilisé:', config.user);
    console.error('DB utilisée:', config.database);
  } else {
    console.log('✅ Connexion MySQL réussie!');
    connection.release();
  }
});

module.exports = promisePool;