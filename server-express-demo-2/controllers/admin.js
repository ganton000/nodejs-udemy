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
    Product.create({
        title,
        description,
        price,
        imageUrl,
    })
        .then((res) => {
            console.log("Product Created");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const { edit } = req.query;
    const { productId } = req.params;

    if (!edit) {
        return res.redirect("/");
    }

    Product.findByPk(productId)
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
    Product.findByPk(productId)
        .then((product) => {
            product.title = updatedTitle
            product.price = updatedPrice
            product.description = updatedDesc
            product.imageUrl = updatedImageUrl
            return product.save();
        })
        .then((result) => {
            console.log("Updated Product");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
    Product.findByPk(productId)
        .then((product) => {
            return product.destroy();
        })
        .then((result) => {
            console.log("Product Removed");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};
