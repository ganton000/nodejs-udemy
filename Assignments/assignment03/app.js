const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", "views");

const mainRouter = require("./routes/main");
const addUserRouter = require("./routes/addUser");

app.use(addUserRouter);
app.use(mainRouter);

app.use((req, res, next) => {
    res.status(404).render("404");
});

app.listen(PORT, () => {
    console.log(`Server is now listening on port: ${PORT}...`);
});
