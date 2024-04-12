import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./states/Player";
import { Room } from "./states/Room";

const generateRoomKey = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const players: Record<string, Player> = {};
const rooms: Record<string, Room> = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const player: Player = {
    id: socket.id,
    name: "",
    room: "",
  }

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    const playerRoom = rooms[player.room];
    if (playerRoom) {
      delete playerRoom.players[socket.id];
      if (Object.keys(playerRoom.players).length === 0) {
        delete rooms[player.room];
      }
    }
    console.log("==> current rooms: ", rooms)
  });

  socket.on("join", (data) => {
    player.name = data.name;
    if (!data.room) {
      player.room = generateRoomKey();
      rooms[player.room] = {
        id: player.room,
        players: {
          [socket.id]: player
        },
      }
      console.log(" ==> user " + player.name + "created room: " + player.room);

    } else {
      player.room = data.room;
      rooms[player.room].players[socket.id] = player;
      console.log(" ==> user " + player.name + "joined room: " + player.room);
    }
    socket.join(player.room);
    socket.to(player.room).emit("room:state", rooms[player.room]);
  })
});

app.get("/", (req, res) => {

  res.send("Hola mundo")
});

httpServer.listen(3000, () => console.log("Server listening on port 3000"));