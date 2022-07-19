const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: "sessions",
});
const csrfProtection = csrf();

//global config state management
//compile dynamic templates with pug engine
//and templates are found in views directory.
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const PORT = 3001;

//parses req.body sent through forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

//Middleware to protect against csrf attacks
app.use(csrfProtection);

//to serve static files: pass in folder to grant read-access to
app.use(express.static(path.join(__dirname, "public")));

//this middleware executes after postLogIn session is called
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

//set up routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//catch all to return page not found for unmatched paths
app.use(errorController.get404Page);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT);
    })
    .catch((err) => console.log(err));
