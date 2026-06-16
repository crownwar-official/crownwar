const express = require("express");
const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const kings = JSON.parse(fs.readFileSync("./cards/kings.json", "utf8"));
const royalCards = JSON.parse(fs.readFileSync("./cards/royal.json", "utf8"));
const neutralCards = JSON.parse(fs.readFileSync("./cards/neutral.json", "utf8"));

app.get("/api/kings", (req, res) => {
  res.json(kings);
});

app.get("/api/royal", (req, res) => {
  res.json(royalCards);
});

app.get("/api/cards", (req, res) => {
  res.json([...royalCards, ...neutralCards]);
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomName) => {
    if (!roomName) return;

    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }

    if (rooms[roomName].length >= 2) {
      socket.emit("roomError", "このルームは満員です。");
      return;
    }

    rooms[roomName].push(socket.id);
    socket.join(roomName);

    socket.emit("playerNumber", rooms[roomName].length - 1);

    io.to(roomName).emit("roomInfo", {
      roomName: roomName,
      playerCount: rooms[roomName].length
    });

    if (rooms[roomName].length === 2) {
      const firstPlayer = Math.floor(Math.random() * 2);

      io.to(roomName).emit("startBattle", {
        firstPlayer: firstPlayer,
        startingHand: 5
      });
    }
  });

  socket.on("disconnect", () => {
    for (const roomName in rooms) {
      rooms[roomName] = rooms[roomName].filter(
        (id) => id !== socket.id
      );
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});