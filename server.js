const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ room, username }) => {
    socket.join(room);
    socket.room = room;
    socket.username = username;

    io.to(room).emit("chatMessage", `🔔 ${username} entrou na sala`);
  });

  socket.on("chatMessage", ({ room, message, username }) => {
    io.to(room).emit("chatMessage", `💬 ${username}: ${message}`);
  });

  socket.on("disconnect", () => {
    if (socket.room && socket.username) {
      io.to(socket.room).emit(
        "chatMessage",
        `🚪 ${socket.username} saiu da sala`
      );
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
