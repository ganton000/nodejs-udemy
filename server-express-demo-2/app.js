const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

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
    })
);

//register new middleware to retrieve User
app.use((req, res, next) => {
    User.findById("62d49e22b166f91e0d342e77")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
        });
});

//to serve static files: pass in folder to grant read-access to
app.use(express.static(path.join(__dirname, "public")));

//set up routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//catch all to return page not found for unmatched paths
app.use(errorController.get404Page);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: "Harry",
                    email: "Harry@gmail.com",
                    cart: {
                        items: [],
                    },
                });
                user.save();
            }
        });
        app.listen(PORT);
    })
    .catch((err) => console.log(err));
