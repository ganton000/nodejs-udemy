const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
    static addProduct(id, productPrice) {
        //Fetch previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!fileContent) return;
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex(
                (product) => product.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {
                    ...existingProduct,
                    qty: existingProduct.qty + 1,
                };
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };

            const product = updatedCart.products.find((prod) => prod.id === id);
            if (!product) return;
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(
                (prod) => prod.id !== id
            );
            updatedCart.totalPrice =
                parseFloat((updatedCart.totalPrice - productQty * productPrice).toFixed(2));

            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (!fileContent) {
                return;
            }
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
};
