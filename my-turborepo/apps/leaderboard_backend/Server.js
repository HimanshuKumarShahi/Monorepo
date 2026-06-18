import express from "express";
import cors from "cors";
import { Redis } from "ioredis";


const app = express();
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
  res.send('Leaderboard API is running');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`/-! Backend running on http://localhost:${PORT}`);
});