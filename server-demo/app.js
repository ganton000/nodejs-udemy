const http = require("http");

const routes = require("./routes");

const PORT = 3001;

const server = http.createServer(routes);

server.listen(PORT);
