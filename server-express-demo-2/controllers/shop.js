const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    //res.sendFile(path.join(rootDir, "views", "shop.html"));
    Product.fetchAll((products) =>
        res.render("shop/product-list", {
            products,
            docTitle: "All Products",
            path: "/products",
        })
    );
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId, (product) => {
        res.render("shop/product-detail", {
            product: product,
            docTitle: product.title,
            path: "/products",
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) =>
        res.render("shop/index", {
            products,
            docTitle: "Shop",
            path: "/",
        })
    );
};

exports.getCart = (req, res, next) => {
    res.render("shop/cart", { path: "/cart", docTitle: "You Cart" });
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    console.log(req.body);
    res.redirect("/cart");
};
exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", { path: "/checkout", docTitle: "Checkout" });
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", { path: "/orders", docTitle: "Your Orders" });
};
