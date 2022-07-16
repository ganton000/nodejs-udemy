const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');

const app = express();

//global config state management
//compile dynamic templates with pug engine
//and templates are found in views directory.
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const PORT = 3001;

//parses req.body sent through forms
app.use(bodyParser.urlencoded({ extended: false }));

//register new middleware to retrieve User
app.use((req, res, next) => {
    User.findById("62d33c33a88bd506112eca2c")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
        });
    next();
});

//to serve static files: pass in folder to grant read-access to
app.use(express.static(path.join(__dirname, "public")));

//set up routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//catch all to return page not found for unmatched paths
app.use(errorController.get404Page);

mongoConnect(() => {
    app.listen(PORT);
})