const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true,
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title } = req.body;
    products.push({ title });
    res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    //res.sendFile(path.join(rootDir, "views", "shop.html"));

    res.render("shop", {
        products,
        docTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
    });
};
