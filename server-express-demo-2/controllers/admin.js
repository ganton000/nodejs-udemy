const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        action: "add-product",
        title: "",
        imageUrl: "",
        price: "",
        description: "",
        buttonAction: "Add",
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(
        title,
        price,
        description,
        imageUrl,
        null,
        req.user._id
    );
    product
        .save()
        .then((result) => {
            console.log("Product Created");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const { edit } = req.query;

    if (!edit) {
        return res.redirect("/");
    }

    const { productId } = req.params;
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                docTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: edit,
                product: product,
                buttonAction: edit ? "Update" : "Delete",
                action: edit ? "edit-product" : "delete-product",
                title: edit ? product.title : "",
                imageUrl: edit ? product.imageUrl : "",
                price: edit ? product.price : "",
                description: edit ? product.description : "",
            });
        })
        .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const {
        productId,
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDesc,
    } = req.body;

    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDesc,
        updatedImageUrl,
        productId
    );

    product
        .save()
        .then((result) => {
            console.log("Updated Product");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render("admin/products", {
                products,
                path: "/admin/products",
                docTitle: "My Products",
            });
        })
        .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.deleteById(productId)
        .then(() => {
            return req.user.deleteItemFromCart(id);
        })
        .then(() => {
            console.log("Product Removed");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};
