const express = require("express");
const app = express();
app.use(express.json());

let scores = {};

app.post("/add", (req, res) => {
  const { user, points } = req.body;

  if (!scores[user]) scores[user] = 0;
  scores[user] += Number(points);

  res.json({ total: scores[user] });
});

app.get("/points/:user", (req, res) => {
  res.json({ points: scores[req.params.user] || 0 });
});

app.listen(3000, () => console.log("Server running"));

