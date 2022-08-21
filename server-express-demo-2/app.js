const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: "sessions",
});
const csrfProtection = csrf();

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

//global config state management
//compile dynamic templates with pug engine
//and templates are found in views directory.
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const PORT = 3001;

//parses req.body sent through forms as text
app.use(bodyParser.urlencoded({ extended: false }));
//parses req.body sent through forms that are multipart data
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
    }).single("image")
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

//Must be registered after Session
//Middleware to protect against csrf attacks
app.use(csrfProtection);

app.use(flash());

//to serve static files: pass in folder to grant read-access to
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

//loads variables to every res.render() call
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//this middleware executes after postLogIn session is called
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch((err) => {
            next(new Error(err));
        });
});

//set up routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//catch all to return page not found for unmatched paths
app.use(errorController.get404Page);
app.get("/500", errorController.get500Page);

//Error handling middleware; gets called when next() is called with an Error object
app.use((error, req, res, next) => {
    //res.redirect("/500");
    res.status(500).render("500", {
        path: "/500",
        docTitle: "Error!",
        isAuthenticated: req.session.isLoggedIn,
    });
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT);
    })
    .catch((err) => console.log(err));
