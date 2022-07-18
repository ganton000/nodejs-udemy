exports.getLogin = (req, res, next) => {
    let isLoggedIn = "false";
    if (req.get("Cookie")) {
        isLoggedIn = req.get("Cookie").split("=")[1].trim() === "true";
    }

    res.render("auth/login", {
        path: "/login",
        docTitle: "Login",
        isAuthenticated: req.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
    res.redirect("/");
};
