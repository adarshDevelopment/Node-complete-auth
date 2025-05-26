const http = require('http');
const app = require('./src/config/express.config');
require('dotenv').config();

const PORT = process.env.PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server is being hoseted on http://localhost:${PORT} `)
})