const express = require("express");
const router = express.Router();

const { users } = require("./addUser");

router.get("/", (req, res, next) => {
    res.render("main", { docTitle: "Main Page", path: "/", users });
});

module.exports = router;
