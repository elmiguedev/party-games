import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "../states/Player";
import { Room } from "../states/Room";
import { Game } from "../states/Game";

const generateRoomKey = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return "sala" // TODO: descomentar cuando se largue result;
}

const getRandomGame = () => {
  const games = ["pikachu", "race"];

  const selectedGame: Game = {
    state: "playing",
    type: "pikachu",
    answer: {
      x: 200,
      y: 200
    }
  }

  return selectedGame;
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
    state: "lobby",
    gameState: {},
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
    io.emit("player:disconnect", socket.id);
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
        state: "lobby",
      }
      console.log(" ==> user " + player.name + " created room: " + player.room);
      socket.join(player.room);

    } else {
      player.room = data.room;
      rooms[player.room].players[socket.id] = player;
      console.log(" ==> user " + player.name + " joined room: " + player.room);
      socket.join(player.room);
    }

    console.log(" ==> la room es " + player.room)

    io.to(player.room).emit("room:state", rooms[player.room]);
  })

  socket.on("player:ready", () => {
    rooms[player.room].players[socket.id].state = "ready";

    // check if all room players are ready
    let ready = true;
    Object.values(rooms[player.room].players).forEach((player: Player) => {
      if (player.state !== "ready") ready = false;
    })
    if (ready) {
      rooms[player.room].state = "playing";
      rooms[player.room].game = getRandomGame();
      io.to(player.room).emit("room:ready");
    }

    io.to(player.room).emit("room:state", rooms[player.room]);
  })

  socket.on("player:update", (gameState: any) => {
    rooms[player.room].players[socket.id].gameState = gameState;

    let finished = true;
    Object.values(rooms[player.room].players).forEach((player: Player) => {
      if (!player.gameState.ready) finished = false;
    });

    if (finished) {
      rooms[player.room].game!.state = "finished";
      rooms[player.room].game!.winner = rooms[player.room].players[socket.id]; // CAMBIAR POR EL WINNER
      io.to(player.room).emit("game:finished", rooms[player.room].game);
    }

    io.to(player.room).emit("room:state", rooms[player.room]);
  })
});

app.get("/", (req, res) => {

  res.send("Hola mundo")
});

httpServer.listen(3000, () => console.log("Server listening on port 3000"));