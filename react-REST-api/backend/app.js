const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

require("dotenv").config();

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const PORT = 8080;
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//secure header options to send in response
app.use(helmet());

//compresses size of assets being loaded on client
app.use(compression());

//logging library into stream
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    {
        flags: "a",
    }
);
app.use(
    morgan("combined", {
        stream: accessLogStream,
    })
);

app.use(bodyParser.json()); //application/json
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
    }).single("image")
);
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
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message,
        data,
    });
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then((result) => {
        const server = app.listen(PORT, () => {
            console.log(
                `Server is connected and listening in on PORT: ${PORT}`
            );
        });

        //set up socket.io (builds upon http)
        const io = require("./socket").init(server);
        io.on("connection", (socket) => {
            console.log("Client connected");
        });
    })
    .catch((err) => {
        console.log(err);
    });
