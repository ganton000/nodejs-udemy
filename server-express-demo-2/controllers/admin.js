const { validationResult } = require("express-validator");

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        validationErrors: [],
        errorMessage: null,
        action: "add-product",
        title: "",
        imageUrl: "",
        price: "",
        description: "",
        buttonAction: "Add",
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, price, description } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(422).render("admin/edit-product", {
            docTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            validationErrors: [],
            errorMessage: "Attached file is not an image.",
            buttonAction: "Add",
            action: "edit-product",
            title,
            price,
            description,
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.user._id,
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            docTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            validationErrors: errors.array(),
            errorMessage: errors.array()[0].msg,
            buttonAction: "Add",
            action: "edit-product",
            title,
            price,
            description,
        });
    }

    product
        .save()
        .then((result) => {
            console.log("Product Created");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            //return res.status(500).render("admin/edit-product", {
            //    docTitle: "Add Product",
            //    path: "/admin/add-product",
            //    editing: false,
            //    validationErrors: "Database operation failed, please try again",
            //    errorMessage: errors.array()[0].msg,
            //    buttonAction: "Add",
            //    action: "edit-product",
            //    title,
            //    price,
            //    imageUrl,
            //    description,
            //});

            //res.redirect("/500");

            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
                errorMessage: null,
                validationErrors: [],
                buttonAction: edit ? "Update" : "Delete",
                action: edit ? "edit-product" : "delete-product",
                title: edit ? product.title : "",
                imageUrl: edit ? product.imageUrl : "",
                price: edit ? product.price : "",
                description: edit ? product.description : "",
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const {
        productId,
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
    } = req.body;

    const image = req.file;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            docTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            validationErrors: errors.array(),
            errorMessage: errors.array()[0].msg,
            product: { _id: productId.toString() },
            buttonAction: "Update",
            action: "edit-product",
            title: updatedTitle,
            price: updatedPrice,
            description: updatedDesc,
        });
    }

    Product.findById(productId)
        .then((product) => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/");
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;

            if (image) {
                product.imageUrl = image.path
            }
            return product.save().then((result) => {
                console.log("Updated Product");
                res.redirect("/admin/products");
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        //.select('-title')
        //.populate("userId")
        .then((products) => {
            console.log(products);
            res.render("admin/products", {
                products,
                path: "/admin/products",
                docTitle: "My Products",
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.deleteOne({ _id: productId, userId: req.user._id })
        .then(() => {
            return req.user.deleteItemFromCart(id);
        })
        .then(() => {
            console.log("Product Removed");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
