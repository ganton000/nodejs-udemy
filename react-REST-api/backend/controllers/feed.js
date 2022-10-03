const { validationResult } = require("express-validator");

const Post = require("../models/post");

const handle500error = (err) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
};

exports.getPosts = (req, res, next) => {
    Post.find()
        .then((posts) => {
            res.status(200).json({
                message: "Fetched posts successfully.",
                posts: posts,
            });
        })
        .catch((err) => handle500error(err));
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    const { title, content } = req.body;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: "images/duck.jpg",
        creator: {
            name: "Anton",
        },
    });
    post.save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: "Post created successfully!",
                post: result,
            });
        })
        .catch((err) => {
            handle500error(err);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error("Could not find post.");
                error.statusCode = 404;
                throw error;
                //throwing errors inside then block puts you into catch block err
            }
            res.status(200).json({
                message: "Post fetched.",
                post: post,
            });
        })
        .catch((err) => {
            handle500error(err);
        });
};
