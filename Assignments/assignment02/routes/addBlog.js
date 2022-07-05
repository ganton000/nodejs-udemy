const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const router = express.Router();

router.get("/add-blog", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "add-blog.html"));
});

router.post("/add-blog", (req, res, next) => {
    res.redirect("/");
});

module.exports = router;
