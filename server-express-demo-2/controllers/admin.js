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
    const product = new Product(title, price, description, imageUrl);
    product.save()
        .then((result) => {
            console.log("Product Created");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

//exports.getEditProduct = (req, res, next) => {
//    const { edit } = req.query;

//    if (!edit) {
//        return res.redirect("/");
//    }

//    const { productId } = req.params;
//    req.user
//        .getProducts({ where: { id: productId } })
//        .then((products) => {
//            if (!products) {
//                return res.redirect("/");
//            }
//            const product = products[0];
//            res.render("admin/edit-product", {
//                docTitle: "Edit Product",
//                path: "/admin/edit-product",
//                editing: edit,
//                product: product,
//                buttonAction: edit ? "Update" : "Delete",
//                action: edit ? "edit-product" : "delete-product",
//                title: edit ? product.title : "",
//                imageUrl: edit ? product.imageUrl : "",
//                price: edit ? product.price : "",
//                description: edit ? product.description : "",
//            });
//        })
//        .catch((err) => console.log(err));
//};

//exports.postEditProduct = (req, res, next) => {
//    const {
//        productId,
//        title: updatedTitle,
//        price: updatedPrice,
//        imageUrl: updatedImageUrl,
//        description: updatedDesc,
//    } = req.body;
//    Product.findByPk(productId)
//        .then((product) => {
//            product.title = updatedTitle;
//            product.price = updatedPrice;
//            product.description = updatedDesc;
//            product.imageUrl = updatedImageUrl;
//            return product.save();
//        })
//        .then((result) => {
//            console.log("Updated Product");
//            res.redirect("/admin/products");
//        })
//        .catch((err) => console.log(err));
//};

//exports.getProducts = (req, res, next) => {
//    req.user
//        .getProducts()
//        .then((products) => {
//            res.render("admin/products", {
//                products,
//                path: "/admin/products",
//                docTitle: "My Products",
//            });
//        })
//        .catch((err) => console.log(err));
//};

//exports.postDeleteProduct = (req, res, next) => {
//    const { productId } = req.body;
//    Product.findByPk(productId)
//        .then((product) => {
//            return product.destroy();
//        })
//        .then((result) => {
//            console.log("Product Removed");
//            res.redirect("/admin/products");
//        })
//        .catch((err) => console.log(err));
//};
