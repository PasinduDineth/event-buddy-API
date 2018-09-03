var mysql = require('mysql');
var con   = mysql.createConnection({
   host: 'localhost',
    user: 'root',
    password: '12101',
    database: 'demoTest'
});
module.exports = con;
