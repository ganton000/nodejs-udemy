const mongodb = require("mongodb");

const getDb = require("../utils/database").getDb;

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this);
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection("users")
            .findOne({ _id: mongodb.ObjectId(userId.trim()) });
    }
}

module.exports = User;
