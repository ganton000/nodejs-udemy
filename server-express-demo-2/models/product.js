const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const rootDir = path.dirname(require.main.filename);
const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        } else {
            return cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    (product) => product.id === this.id
                );

                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;

                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find((prod) => prod.id === id);
            const updatedProducts = products.filter((prod) => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }
    //call on class
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((product) => product.id === id);
            cb(product);
        });
    }
};
