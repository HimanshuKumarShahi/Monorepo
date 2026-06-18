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
    origin: "*", // React frontend ko allow karne ke liye
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

// --- MAIN FUNCTION: Redis se Top Players nikalna ---
const broadcastLeaderboard = async () => {
  try {
    // ZREVRANGE: Highest score se lowest score tak fetch karta hai
    // WITHSCORES: Naam ke sath uska score bhi layega
    const topPlayers = await redis.zrevrange(LEADERBOARD_KEY, 0, 99, 'WITHSCORES');
    
    // Redis data ajeeb array me deta hai: ["Ninja", "150", "ProDev", "100"]
    // Hum isko proper Object [{name: "Ninja", score: 150}] me convert kar rahe hain
    const formattedLeaderboard = [];
    for (let i = 0; i < topPlayers.length; i += 2) {
      formattedLeaderboard.push({
        name: topPlayers[i],
        score: parseInt(topPlayers[i + 1])
      });
    }

    // Sabhi connected browsers ko fresh leaderboard bhej do!
    io.emit('update_leaderboard', formattedLeaderboard);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
  }
};

// --- SOCKET.IO EVENTS ---
io.on('connection', (socket) => {
  console.log(`/-! Player Connected: ${socket.id}`);

  // Jaise hi koi naya tab khole, usko turant purana leaderboard dikha do
  broadcastLeaderboard();

  // 1. Jab naya bacha apna naam daale
  socket.on('player_joined', async (data) => {
    // Redis me user add karo (agar pehle se nahi hai). Score update.
    await redis.zadd(LEADERBOARD_KEY, data.score, data.name);
    broadcastLeaderboard(); // Update sabko bhejo
  });

  // 2. Jab code run ho aur challenge complete ho (Scores badhein)
  socket.on('submit_score', async (data) => {
    console.log(`Score Aaya -> ${data.name}: ${data.score} points`);
    // Redis ZADD apne aap purane score ko naye wale se replace/update kar dega aur sort kar dega
    await redis.zadd(LEADERBOARD_KEY, data.score, data.name);
    broadcastLeaderboard(); // Update sabko bhejo
  });

  socket.on('disconnect', () => {
    console.log(`/-! Player Disconnected: ${socket.id}`);
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`/-! Backend running on http://localhost:${PORT}`);
});
