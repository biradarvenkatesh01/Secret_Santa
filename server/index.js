const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketHandler = require('./socketHandler');

const path = require('path');

const app = express();
app.use(cors());

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '../client/dist')));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Still allow * for flexibility, but same-origin will be used in prod
        methods: ["GET", "POST"]
    }
});

socketHandler(io);

// Handle any requests that don't match the above
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
