import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "../states/Player";
import { Room } from "../states/Room";
import { Game } from "../states/Game";
import path from "path";

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
  const games = ["robot", "race"];
  const positions = getRandomRobotPositions();
  const selectedGame: Game = {
    state: "playing",
    type: "robot",
    data: {
      fakePositions: positions,
    },
    answer: positions[positions.length - 1],
  }

  return selectedGame;
}

const getRandomRobotPositions = () => {
  const minx = 0;
  const maxx = 720 - (52 * 6);

  const miny = 120;
  const maxy = 720 - (52 * 6);

  const fakePositions: any[] = []
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(Math.random() * (maxx - minx) + minx);
    const y = Math.floor(Math.random() * (maxy - miny) + miny);
    fakePositions.push({ x, y });
  }

  return fakePositions;

}

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const checkWinner = (room: Room) => {
  let winner: Player | undefined = undefined;
  let winnerDistance = 0;
  const answer = room.game?.answer;
  Object.values(room.players).forEach((player) => {
    const playerPosition = player.gameState.position;
    const distance = getDistance(playerPosition.x, playerPosition.y, answer.x, answer.y);
    if (!winner) {
      winner = player;
      winnerDistance = distance;
    } else
      if (distance < winnerDistance) {
        winner = player;
        winnerDistance = distance;
      }
  })
  return winner;
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
    io.to(player.room).emit("player:update", rooms[player.room].players[socket.id]);

    let finished = true;
    Object.values(rooms[player.room].players).forEach((player: Player) => {
      if (!player.gameState.ready) finished = false;
    });

    if (finished) {
      rooms[player.room].game!.state = "finished";
      rooms[player.room].game!.winner = checkWinner(rooms[player.room]); // CAMBIAR POR EL WINNER
      io.to(player.room).emit("game:finished", rooms[player.room].game);
    }

    io.to(player.room).emit("room:state", rooms[player.room]);
  })
});

console.log(__dirname)
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})
httpServer.listen(3000, () => console.log("Server listening on port 3000"));