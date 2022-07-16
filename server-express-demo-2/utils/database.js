const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const mongoConnect = (callback) => {
    client
        .connect()
        .then((result) => {
            console.log("Connected!");
        })
        .catch((err) => {
            console.log(err);
        });

    //client.connect((err) => {
    //    console.log("Connected!");
    //    const collection = client.db("test").collection("devices");
    //    // perform actions on the collection object

    //    client.close();
    //});
};

module.exports = mongoConnect;

//const Sequelize = require("sequelize").Sequelize;

//const sequelize = new Sequelize(
//    process.env.DB_NAME,
//    process.env.USERNAME,
//    process.env.DB_PASSWORD,
//    { dialect: "mysql", host: process.env.HOST }
//);

//module.exports = sequelize;

////manages multiple connections to maintain multiple queries
//const pool = mysql.createPool({
//    host: process.env.HOST,
//    user: process.env.USERNAME,
//    database: process.env.DB_NAME,
//    password: process.env.DB_PASSWORD,
//});
//module.exports = pool.promise();
