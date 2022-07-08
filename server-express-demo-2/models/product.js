//const fs = require("fs");
//const path = require("path");
const db = require("../utils/database");
const Cart = require("./cart");

//const rootDir = path.dirname(require.main.filename);
//const p = path.join(rootDir, "data", "products.json");

//const getProductsFromFile = (cb) => {
//    fs.readFile(p, (err, fileContent) => {
//        if (err) {
//            return cb([]);
//        } else {
//            return cb(JSON.parse(fileContent));
//        }
//    });
//};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute(
            "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {}
    //call on class
    static fetchAll() {
        return db.execute("SELECT * FROM products");
    }

    static findById(id) {
        return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
    }
};
