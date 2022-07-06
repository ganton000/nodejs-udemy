const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true,
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title } = req.body;
    const product = new Product(title);
    product.save();
    res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    //res.sendFile(path.join(rootDir, "views", "shop.html"));
    const products = Product.fetchAll((products) =>
        res.render("shop/product-list", {
            products,
            docTitle: "Shop",
            path: "/",
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true,
        })
    );
};
