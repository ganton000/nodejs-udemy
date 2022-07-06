const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        products.push(this);
    }
    //call on class
    static fetchAll() {
        return products;
    }
};
