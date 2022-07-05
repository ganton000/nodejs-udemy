const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

//parses req.body sent through forms
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/add-product", (req, res, next) => {
    res.send(
        "<html><head><title>Add Product</title></head><body><form action='/product' method='POST'><input type='text' name='title'><button type='submit'>Add Product</button></form></body></html>"
    );
});

app.post("/product", (req, res, next) => {
    const { title } = req.body;
    res.redirect("/");
});

app.use("/", (req, res, next) => {
    res.send("<h1>Hello from Express</h1>");
});

app.listen(PORT);
