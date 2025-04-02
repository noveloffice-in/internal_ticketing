// const http = require("http");
// const express = require("express");
// const path = require("path");
// const { Server } = require("socket.io");    

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// io.on("connection", (socket) => {
//     socket.on("user_message", (message) => {
//         io.emit("user_message", message);
//     })
// });

// app.use(express.static(path.resolve("./public")));

// app.get("/", (req, res) => {
//     return res.sendFile(path.resolve("./public/index.html"));
// });

// server.listen(9001, () => {
//     console.log("Server is running on port 9001");
// });



const express = require("express");
const http = require("http");
const path = require("path");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Add middleware before route handlers
app.use(express.json());

app.post("/", (req, res) => {
    const data = req.body;    
    if (data && data.event) {
        io.emit(data.event, data.data);
        res.status(200).send("Event received and emitted");
    } else {
        console.log("Invalid data format received");
        res.status(400).send("Invalid data format");
    }
});

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
});

server.listen(9001, () => {
    console.log("Server is running on port 9001");
});



