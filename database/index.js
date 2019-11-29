const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'Nur',
    password: '1234abcd',
    database: 'Oteshopping',
    port: 3306
});

conn.connect()

module.exports = conn