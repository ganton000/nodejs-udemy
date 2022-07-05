const express = require("express");

const router = express.Router();

router.get("/add-product", (req, res, next) => {
    res.send(
        "<html><head><title>Add Product</title></head><body><form action='/product' method='POST'><input type='text' name='title'><button type='submit'>Add Product</button></form></body></html>"
    );
});

router.post("/product", (req, res, next) => {
    const { title } = req.body;
    res.redirect("/");
});

module.exports = router;
