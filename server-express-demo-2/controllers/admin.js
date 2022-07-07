const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
    const { edit } = req.query;
    const { productId } = req.params;

    if (!edit) {
        return res.redirect("/");
    }

    Product.findById(productId, (product) => {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            docTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: edit,
            product: product,
            buttonAction: edit ? "Update" : "Save",
            action: edit ? "edit-product" : "add-product",
            title: edit ? product.title : "",
            imageUrl: edit ? product.imageUrl : "",
            price: edit ? product.price : "",
            description: edit ? product.description : "",
        });
    });
};

exports.postEditProduct = (req, res, next) => {};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("admin/products", {
            products,
            path: "/admin/products",
            docTitle: "My Products",
        });
    });
};
