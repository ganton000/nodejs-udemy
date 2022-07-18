const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/product-list", {
                products,
                docTitle: "All Products",
                path: "/products",
                isAuthenticated: req.session.isLoggedIn,
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
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                products,
                docTitle: "Shop",
                path: "/",
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.session.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items;
            res.render("shop/cart", {
                path: "/cart",
                docTitle: "Your Cart",
                products,
                isCartEmpty: products.length > 0 ? true : false,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId)
        .then((product) => {
            return req.session.user.addToCart(product);
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
    req.session.user
        .removeFromCart(productId)
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.session.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items.map((item) => {
                return {
                    quantity: item.quantity,
                    product: { ...item.productId._doc },
                };
            });
            const order = new Order({
                user: {
                    name: req.session.user.name,
                    userId: req.session.user,
                },
                products: products,
            });
            return order.save();
        })
        .then((result) => {
            return req.session.user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.session.user._id })
        .then((orders) => {
            res.render("shop/orders", {
                path: "/orders",
                docTitle: "Your Orders",
                orders: orders,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};
