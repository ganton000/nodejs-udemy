const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//global config state management
//compile dynamic templates with pug engine
//and templates are found in views directory.
app.set("view engine", "pug");
app.set("views", "views");

const { routes: adminRoutes } = require("./routes/admin");
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
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT);
