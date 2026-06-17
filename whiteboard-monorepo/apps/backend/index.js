import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);

// Socket.io setup for real-time communication
const io = new Server(server, {
  cors: {
    origin: "*", // Local network pe sabko allow karne ke liye
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`/-! CODE VERSE: Naya user connect hua -> ${socket.id}`);

  // Jab koi user canvas pe draw kare
  socket.on("draw", (data) => {
    // Ye data baaki saare connected users ko bhej do (khud ko chhod kar)
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log(`/-! CODE VERSE: User disconnect ho gaya -> ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`/-! CODE VERSE Backend running on http://localhost:${PORT}`);
});
