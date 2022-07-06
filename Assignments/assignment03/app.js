const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: false }));

//to serve static files: pass in folder to grant read-access to
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", "views");

const mainRouter = require("./routes/main");
const { routes: addUserRouter } = require("./routes/addUser");

app.use(addUserRouter);
app.use(mainRouter);

app.use((req, res, next) => {
    res.status(404).render("404", { docTitle: "Page Not Found" });
});

app.listen(PORT, () => {
    console.log(`Server is now listening on port: ${PORT}...`);
});
