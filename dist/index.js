import * as http from "http";
const PORT = process.env.PORT || 4000;
const a = 10;
const users = [{ name: "Valera", age: 35 }, { name: "Katya", age: 12 }];
const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/users': {
            if (req.method === 'GET') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(users));
            }
            break;
        }
        default: {
            res.statusCode = 404;
            res.end();
        }
    }
});
server.listen(PORT, () => {
    console.log(`Server start on ${PORT} PORT`);
});
