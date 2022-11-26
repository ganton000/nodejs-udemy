const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const { email, name, password } = req.body;

    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                email,
                name,
                password: hashedPassword,
            });
            return user.save();
        })
        .then((result) => {
            res.status(201).json({
                message: "User created!",
                userId: result._id,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    let loadedUser;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                const error = new Error(
                    "A user with this email could not be found"
                );
                error.statusCode = 401;
                throw error;
            }

            loadedUser = user;

            return bcrypt.compare(password, user.password);
        })
        .then((passwordIsEqual) => {
            if (!passwordIsEqual) {
                const error = new Error("Wrong password");
                error.statusCode = 401;
                throw error;
            }

            //create new signature for jw token
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                "supersecret", //private key/secret for signing
                {
                    expiresIn: "1h", //configuration for token
                }
            );

            res.status(200).json({
                token,
                userId: loadedUser._id.toString(),
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                const error = new Error("User not found.");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                status: user.status,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;

    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                const error = new Error("User not found.");
                error.statusCode = 404;
                throw error;
            }
            user.status = newStatus;
            return user.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "User updated.",
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
