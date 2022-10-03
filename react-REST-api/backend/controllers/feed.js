const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: "1",
                title: "First Post",
                content: "This is the first post!",
                imageUrl: "/images/duck.jpg",
                creator: {
                    name: "Harry",
                },
                createdAt: new Date(),
            },
        ],
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect",
            errors: errors.array(),
        });
    }
    const { title, content } = req.body;

    res.status(201).json({
        message: "Post created successfully!",
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: {
                name: "Anton",
            },
            createdAt: new Date(),
        },
    });
};
