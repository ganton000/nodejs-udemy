const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const feedRoutes = require("./routes/feed");

const PORT = 8080;
const app = express();

app.use(bodyParser.json()); //application/json
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({
        message: message,
    });
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then((result) => {
        app.listen(PORT, () => {
            console.log(
                `Server is connected and listening in on PORT: ${PORT}`
            );
        });
    })
    .catch((err) => {
        console.log(err);
    });
