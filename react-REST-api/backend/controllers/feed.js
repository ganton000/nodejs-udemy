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
    const { title, content } = req.body;

    res.status(201).json({});
};
