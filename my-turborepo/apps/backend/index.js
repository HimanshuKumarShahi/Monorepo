import express from 'express';
import cors from 'cors';

const app = express();

// CORS enable kar rahe hain taki frontend is API ko call kar sake
app.use(cors());

// FreeAPI se data fetch karne ka route
app.get('/api/users', async (req, res) => {
  try {
    const response = await fetch('https://api.freeapi.app/api/v1/public/randomusers?page=2&limit=30');
    const data = await response.json();
    
    // Frontend ko data bhej rahe hain
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});