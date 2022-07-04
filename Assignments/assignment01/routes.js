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
            console.log(usernameInput);
            res.setHeader("Content-Type", "text/html");
            res.writeHead(302, { Location: "/users" });
            return res.end();
        });
    }

    if (url === "/users") {
        console.log(req.body);
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>User Page</title></head>");
        res.write("<body>");
        res.write(
            `<h2>Username ${body[0]} has been successfully created!</h2>`
        );
        res.write("<ul>");
        for (let username of body) {
            res.write(`<li>${username}</li>`);
        }
        res.write("</ul>");
        res.write("</body>");
        res.write("</html>");
    }
};

module.exports = routeHandler;
