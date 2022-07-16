const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
let _db;

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
            _db = client.db("shop");
            callback();
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });

    //client.connect((err) => {
    //    console.log("Connected!");
    //    const collection = client.db("test").collection("devices");
    //    // perform actions on the collection object

    //    client.close();
    //});
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;