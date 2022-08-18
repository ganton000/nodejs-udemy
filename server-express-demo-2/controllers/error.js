exports.get404Page = (req, res, next) => {
    res.status(404).render("404", {
        path: "/404",
        docTitle: "Page Not Found",
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.get500Page = (req, res, next) => {
    res.status(500).render("500", {
        path: "/500",
        docTitle: "Error!",
        isAuthenticated: req.session.isLoggedIn
    });
};
