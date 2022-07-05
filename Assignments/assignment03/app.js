const express = require("express");


const app = express();
const PORT = 3001;

const mainRouter = require("./routes/main");
const addUserRouter = require("./routes/addUser");

app.use(addUserRouter);
app.use(mainRouter);

app.use((req, res, next) => {
    console.log("404");
});

app.listen(PORT, () => {
    console.log(`Server is now listening on port: ${PORT}...`);
});
