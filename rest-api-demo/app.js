const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const PORT = 8080;
const app = express();



//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); //application/json

app.use("/feed", feedRoutes);

app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}...`);
});
