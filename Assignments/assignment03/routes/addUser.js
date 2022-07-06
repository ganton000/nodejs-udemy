const express = require("express");
const router = express.Router();

const users = [];

router.get("/add-user", (req, res, next) => {
    res.render("addUser", { docTitle: "Add New User", path: '/add-user' });
});

router.post("/add-user", (req, res, next) => {
	const { username } = req.body;
	users.push(username);
	res.redirect('/');
});

exports.routes = router;
exports.users = users;
