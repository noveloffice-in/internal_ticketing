const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

// Add middleware before route handlers
app.use(express.json());

app.use((req, res, next) => {
    console.log("📩 Incoming Request:", req.method, req.url, req.body);
    next();
});


app.post("/", (req, res) => {
    const data = req.body;
    const target_users = data?.target_users;
    console.log("checking data", target_users);
    if (data && data.event==="ticket_notification" && data.data && target_users && target_users.length > 0) {
        target_users.forEach(user => {
            const socketId = users[user];
            if (socketId) {
                io.to(socketId).emit(data.event, {
                    ...data.data,
                    target_users: target_users
                });
            }
        });
        res.status(200).send("Event received and emitted");
    }
    else if (data && data.event==="ticket_updated" && data.data ) {
        io.emit(data.event, {
            ...data.data,
        });
        res.status(200).send("Event received and emitted");
    }
    else {
        res.status(400).send("Invalid data format");
    }
});

const users = {};

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("register", (user_id) => {
        socket.user_id = user_id;
        users[user_id] = socket.id;
        console.log("User registered", user_id);
    });
    socket.on("disconnect", () => {
        if (socket.user_id) {
            delete users[socket.user_id]; // Clean up on disconnect
        }
    });
});

server.listen(9001, () => {
    console.log("Server is running on port 9001");
});



