const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
    //res.sendFile(path.join(rootDir, "views", "add-product.html"));
    res.render("add-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true,
    });
});

router.post("/add-product", (req, res, next) => {
    const { title } = req.body;
    products.push({ title });
    res.redirect("/");
});

exports.routes = router;
exports.products = products;
