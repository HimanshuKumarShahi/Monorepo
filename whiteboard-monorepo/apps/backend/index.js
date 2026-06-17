import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`/-! CODE VERSE: Naya user connect hua -> ${socket.id}`);

  socket.on("draw", (data) => {
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
