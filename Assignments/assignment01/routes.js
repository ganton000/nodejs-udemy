const fs = require("fs");

const read = (path, type) =>
    new Promise((resolve, reject) => {
        fs.readFile(path, type, (err, file) => {
            if (err) reject(err);
            resolve(file);
        });
    });

const routeHandler = (req, res) => {
    const { url, method } = req;
    const body = [];

    if (url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Main Page</title></head>");
        res.write("<body>");
        res.write(
            "<h1>Greetings! Welcome to the main page of this app!</h1> <br>"
        );
        res.write("<h3>Please enter a username below:</h3> <br>");
        res.write(
            "<form action='/create-user' method='POST'><input type='text' name='username' placeholder='Enter Username'><button type='submit'>Submit</button> </form>"
        );
        res.write("</body>");
        res.write("</html>");
        return res.end();
    }

    if (url === "/create-user" && method === "POST") {
        req.on("data", (chunk) => {
            body.push(chunk);
        });
        req.on("end", () => {
            const parsedData = Buffer.concat(body).toString();
            const usernameInput = parsedData.split("=")[1];
            fs.appendFile("users.txt", `${usernameInput}\r\n`, (err) => {
                console.log(err);
            });
            res.setHeader("Content-Type", "text/html");
            res.writeHead(302, { Location: "/users" });
            return res.end();
        });
    }

    if (url === "/users") {
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>User Page</title></head>");
        res.write("<body>");
        res.write(`<h2>Username has been successfully created!</h2>`);
        res.write("<ul>");

        read("users.txt", "utf8")
            .then((fileData) =>
                fileData
                    .split(/\r\n/)
                    .forEach((username) =>
                        username.replace(/\r\n/g, " ") === " "
                            ? console.log("end")
                            : res.write(`<li>${username}</li>`)
                    )
            )
            .catch((err) => console.log("error reading file " + err));
        res.write("</ul>");
        res.write("</body>");
        res.write("</html>");
    }
};

module.exports = routeHandler;
