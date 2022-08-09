const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

require("dotenv").config();

const User = require("../models/user");

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
        },
    })
);

exports.getLogin = (req, res, next) => {
    let isLoggedIn = "false";
    if (req.get("Cookie")) {
        isLoggedIn = req.get("Cookie").split("=")[1].trim() === "true";
    }

    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render("auth/login", {
        path: "/login",
        docTitle: "Login",
        errorMessage: message,
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render("auth/signup", {
        path: "/signup",
        docTitle: "Signup",
        errorMessage: message,
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                req.flash("error", "Invalid credentials!");
                return res.redirect("/signup");
            }

            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (!doMatch) {
                        res.flash("error", "Invalid email or password.");

                        return res.redirect("/login");
                    }
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save((err) => {
                        console.log(err);
                        console.log("signed in!");
                        res.redirect("/");
                    });
                })
                .catch((err) => {
                    res.redirect("/login");
                });
        })
        .catch((err) => console.log(err));

    //res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    User.findOne({ email: email })
        .then((userDoc) => {
            if (userDoc) {
                res.flash(
                    "error",
                    "Email already exists! Please choose a different one."
                );
                return res.redirect("/login");
            }

            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        cart: { items: [] },
                    });
                    return user.save();
                })
                .then((result) => {
                    res.redirect("/");
                    return transporter.sendMail({
                        to: email,
                        from: process.env.SENDGRID_VERIFIED_SENDER,
                        subject: "Signup succeeded!",
                        html: "<h1>You successfully signed up!</h1>",
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render("auth/reset", {
        path: "/reset",
        docTitle: "Reset Password",
        errorMessage: message,
    });
};
