const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

const signInValidation = () => {
    return [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            .normalizeEmail()
            .custom((value, { req }) => {
                //if (value === "test@test.com") {
                //    throw new Error("This email address is forbidden.");
                //}
                //return true;
                return User.findOne({ email: value }).then((userDoc) => {
                    if (!userDoc) {
                        return Promise.reject("This E-Mail does not exist.");
                    }
                });
            }),
        body("password")
            .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                "i"
            )
            .withMessage(
                "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8, max 20 char long"
            )
            .trim()
            .custom((value, { req }) => {
                return User.findOne({ password: value }).then((userDoc) => {
                    if (!userDoc) {
                        return Promise.reject("Invalid credentials provided!");
                    }
                });
            }),
    ];
};

const signUpValidation = () => {
    return [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            .custom((value, { req }) => {
                //if (value === "test@test.com") {
                //    throw new Error("This email address is forbidden.");
                //}
                //return true;
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject(
                            "E-Mail exists already, please pick a different one."
                        );
                    }
                });
            })
            .normalizeEmail(),
        body("password")
            .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                "i"
            )
            .withMessage(
                "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8, max 20 char long"
            )
            .trim(),
        body("confirmPassword")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords have to match!");
                }
                return true;
            })
            .trim(),
    ];
};

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", signInValidation(), authController.postLogin);

router.post("/signup", signUpValidation(), authController.postSignup);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
