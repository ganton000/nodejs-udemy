const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const blogsRouter = require("./routes/blogs");
const addBlogRouter = require("./routes/addBlog");

const PORT = 3001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//set up routes
app.use(addBlogRouter);
app.use(blogsRouter);

//catch all
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => {
    console.log(`Server is now listening in on PORT: ${PORT}`);
});
