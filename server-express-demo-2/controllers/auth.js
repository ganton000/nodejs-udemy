exports.getLogin = (req, res, next) => {
    let isLoggedIn = "false";
    if (req.get("Cookie")) {
        isLoggedIn = req.get("Cookie").split("=")[1].trim() === "true";
    }
    console.log(req.session.isLoggedIn)
    res.render("auth/login", {
        path: "/login",
        docTitle: "Login",
        isAuthenticated: req.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    //res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
    res.redirect("/");
};
