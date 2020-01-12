var mysql = require('mysql');
var con   = mysql.createConnection({
   host: 'localhost',
    user: 'root',
    password: 'Dream500$',
    database: 'eventBuddy'
});
module.exports = con;
