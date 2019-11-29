const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'tuy8t6uuvh43khkk.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'o2qjz0pzmtfb2obr',
    password: 'u03wf08k6xd47gzd',
    database: 'bdncn9tjt8bg8tdm',
    port: 3306
});

conn.connect()

module.exports = conn