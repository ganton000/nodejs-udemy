const mysql = require("mysql2");
require("dotenv").config();

//manages multiple connections to maintain multiple queries
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

module.exports = pool.promise();
