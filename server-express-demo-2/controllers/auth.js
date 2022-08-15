const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

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
        oldInput: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            path: "/login",
            docTitle: "Login",
            errorMessage: errors.array()[0].msg,
        });
    }

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                req.flash("error", "Invalid credentials!");
                return res.redirect("/login");
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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errorMessage = errors.array()[0].msg;
        return res.status(422).render("auth/signup", {
            path: "/signup",
            docTitle: "Signup",
            errorMessage,
            oldInput: { email, password, confirmPassword },
        });
    }

    bcrypt
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

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset");
        }

        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    req.flash("error", "No account with that email found.");
                    return res.redirect("/reset");
                }
                //stores token into Database
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; //1 hr after now
                return user.save();
            })
            .then((result) => {
                res.redirect("/");
                return transporter.sendMail({
                    to: req.body.email,
                    from: process.env.SENDGRID_VERIFIED_SENDER,
                    subject: "Password reset",
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3001/reset/${token}">link</a> to set a new password.</p>
                    `,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: new Date(),
        },
    })
        .then((user) => {
            let message = req.flash("error");
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }

            res.render("auth/new-password", {
                path: "/new-password",
                docTitle: "New Password",
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postNewPassword = (req, res, next) => {
    const { userId, passwordToken, password: newPassword } = req.body;

    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId,
    })
        .then((user) => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then((hashedPassword) => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then((result) => {
            res.redirect("/login");
            return transporter.sendMail({
                to: resetUser.email,
                from: process.env.SENDGRID_VERIFIED_SENDER,
                subject: "Password reset successful!",
                html: `
                    <h1>Your password has been reset successfully!</h1>
                `,
            });
        })
        .catch((err) => console.log(err));
};
