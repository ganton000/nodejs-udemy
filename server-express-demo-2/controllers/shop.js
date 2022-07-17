const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render("shop/product-list", {
                products,
                docTitle: "All Products",
                path: "/products",
            });
        })
        .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId)
        .then((product) => {
            res.render("shop/product-detail", {
                product,
                docTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render("shop/index", {
                products,
                docTitle: "Shop",
                path: "/",
            });
        })
        .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((products) => {
            res.render("shop/cart", {
                path: "/cart",
                docTitle: "Your Cart",
                products,
                isCartEmpty: products.length > 0 ? true : false,
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    req.user
        .deleteItemFromCart(productId)
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then((result) => {
            res.redirect("/orders");
        })
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then((orders) => {
            res.render("shop/orders", {
                path: "/orders",
                docTitle: "Your Orders",
                orders: orders,
            });
        })
        .catch((err) => console.log(err));
};
