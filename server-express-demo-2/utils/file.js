const fs = require("fs");

const deleteFile = (filePath) => {
    //deletes file at path
    fs.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
    });
};

exports.deleteFile = deleteFile;
