const fs = require("fs");

const deleteFile = (filePath) => {
    //deletes file at path
    fs.unlinkSync(filePath, (err) => {
        if (err) {
            throw err;
        }
    });
};

exports.deleteFile = deleteFile;
