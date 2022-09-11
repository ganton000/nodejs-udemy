const express = require("express");

const feedRoutes = require("./routes/feed");

const app = express();
const PORT = 8080;

app.use("/feed", feedRoutes);

app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}...`);
});
