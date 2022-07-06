const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
//const expressHbs = require("express-handlebars");

const app = express();

//registers new templating engine
//app.engine(
//    "hbs",
//    expressHbs({
//        layoutsir: "views/layouts/",
//        defaultLayout: "main-layout",
//        extname: "hbs",
//    })
//);

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

//to serve static files: pass in folder to grant read-access to
app.use(express.static(path.join(__dirname, "public")));

//set up routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//catch all to return page not found for unmatched paths
app.use((req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", { docTitle: "Page Not Found" });
});

app.listen(PORT);
