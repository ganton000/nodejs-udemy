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
    const product = new Product(null, title, imageUrl, description, price);
    product.save()
        .then(() => {
            res.redirect("/");
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

    Product.findById(productId, (product) => {
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
    });
};

exports.postEditProduct = (req, res, next) => {
    const {
        productId,
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDesc,
    } = req.body;
    const updatedProduct = new Product(
        productId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.save();
    res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("admin/products", {
            products,
            path: "/admin/products",
            docTitle: "My Products",
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.deleteById(productId);
    res.redirect("/admin/products");
};
