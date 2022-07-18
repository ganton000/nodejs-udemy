const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    let isLoggedIn = "false";
    if (req.get("Cookie")) {
        isLoggedIn = req.get("Cookie").split("=")[1].trim() === "true";
    }

    console.log(req.session.isLoggedIn);
    res.render("auth/login", {
        path: "/login",
        docTitle: "Login",
        isAuthenticated: req.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("62d49e22b166f91e0d342e77")
        .then((user) => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect("/");
        })
        .catch((err) => console.log(err));

    //res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
};
