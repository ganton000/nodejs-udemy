const fs = require("fs");
const path = require("path");

const products = [];

const rootDir = path.dirname(require.main.filename);
const p = path.join(rootDir, "data", "products.json");

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        //createReadStream is more efficient for larger datasets
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }
    //call on class
    static fetchAll(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return cb([]);
            }
            return cb(JSON.parse(fileContent));
        });
    }
};
