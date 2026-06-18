import express from "express";
import cors from "cors";
import { Redis } from "ioredis";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

redis.on("connect", () =>
  console.log("/-! CODE VERSE: Redis Connected Successfully! 🚀"),
);
redis.on("error", (err) => console.log("Redis Error:", err));

app.get("/", (req, res) => {
  res.send("Leaderboard API is running");
});

const LEADERBOARD_KEY = 'global_arena_rank';


const broadcastLeaderboard = async () => {
  try {
 
    const topPlayers = await redis.zrevrange(LEADERBOARD_KEY, 0, 99, 'WITHSCORES');
    
    
    const formattedLeaderboard = [];
    for (let i = 0; i < topPlayers.length; i += 2) {
      formattedLeaderboard.push({
        name: topPlayers[i],
        score: parseInt(topPlayers[i + 1])
      });
    }


    io.emit('update_leaderboard', formattedLeaderboard);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
  }
};

io.on('connection', (socket) => {
  console.log(`/-! Player Connected: ${socket.id}`);

  broadcastLeaderboard();


  socket.on('player_joined', async (data) => {
    
    await redis.zadd(LEADERBOARD_KEY, data.score, data.name);
    broadcastLeaderboard(); 
  });

  socket.on('submit_score', async (data) => {
    console.log(`Score Aaya -> ${data.name}: ${data.score} points`);
    
    await redis.zadd(LEADERBOARD_KEY, data.score, data.name);
    broadcastLeaderboard(); 
  });

  socket.on('disconnect', () => {
    console.log(`/-! Player Disconnected: ${socket.id}`);
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`/-! Backend running on http://localhost:${PORT}`);
});
