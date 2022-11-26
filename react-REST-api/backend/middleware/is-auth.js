const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //middleware to be used in routes to
    //parse token from headers

    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new errorHandler("Not authenticated.");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1];
    try {
        decodedToken = jwt.verify(token, "supersecret");
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
};
