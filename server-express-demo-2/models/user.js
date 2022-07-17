const mongodb = require("mongodb");
const { getProducts } = require("../controllers/shop");

const getDb = require("../utils/database").getDb;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(
            (cartProduct) =>
                cartProduct.productId.toString() === product._id.toString()
        );

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;

            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: mongodb.ObjectId(product._id),
                quantity: newQuantity,
            });
        }

        const updatedCart = { items: updatedCartItems };
        const db = getDb();

        return db.collection("users").updateOne(
            {
                _id: mongodb.ObjectId(this._id),
            },
            { $set: { cart: updatedCart } }
        );
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection("users")
            .findOne({ _id: mongodb.ObjectId(userId.trim()) });
    }
}

module.exports = User;
