const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
    //res.sendFile(path.join(rootDir, "views", "shop.html"));
    //mysql2 version
    //Product.fetchAll()
    //    .then(([rows, fieldData]) => {
    //        res.render("shop/product-list", {
    //            products: rows,
    //            docTitle: "All Products",
    //            path: "/products",
    //        });
    //    })
    //    .catch((err) => {
    //        console.log(err);
    //    });
    //sequelize
    Product.findAll()
        .then((products) => {
            res.render("shop/product-list", {
                products,
                docTitle: "All Products",
                path: "/products",
            });
        }).catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findByPk(productId)
        .then(product => {
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
    Product.findAll()
        .then((products) => {
            res.render("shop/index", {
                products,
                docTitle: "Shop",
                path: "/",
            });
        }).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(
                    (prod) => prod.id === product.id
                );

                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty,
                    });
                }
            }
            res.render("shop/cart", {
                path: "/cart",
                docTitle: "You Cart",
                products: cartProducts,
                isCartEmpty: cartProducts.length > 0 ? true : false,
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, (product) => {
        Cart.deleteProduct(productId, product.price);
    });
    res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", { path: "/checkout", docTitle: "Checkout" });
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", { path: "/orders", docTitle: "Your Orders" });
};
