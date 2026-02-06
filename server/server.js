const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const http = require('http');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/socket/socket');

connectDB();

const server = http.createServer(app);
const io = initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
