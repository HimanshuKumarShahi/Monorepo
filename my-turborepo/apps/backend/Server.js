import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Your Server is working fine.😅😅😅😅😅😅");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Your Server is running bro on port http://localhost:${port} `);
});
