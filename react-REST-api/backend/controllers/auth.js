const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
