require("dotenv").config();
const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.USERNAME,
    process.env.DB_PASSWORD,
    { dialect: "mysql", host: process.env.HOST }
);

module.exports = sequelize;

////manages multiple connections to maintain multiple queries
//const pool = mysql.createPool({
//    host: process.env.HOST,
//    user: process.env.USERNAME,
//    database: process.env.DB_NAME,
//    password: process.env.DB_PASSWORD,
//});
//module.exports = pool.promise();
