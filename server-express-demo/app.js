const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const PORT = 3001;

//parses req.body sent through forms
app.use(bodyParser.urlencoded({ extended: false }));

//set up routes
app.use(adminRoutes);
app.use(shopRoutes);

//catch all to return page not found for unmatched paths
app.use((req, res, next) => {
    res.status(404).send("<h1>404: Page not found</h1>");
});

app.listen(PORT);
