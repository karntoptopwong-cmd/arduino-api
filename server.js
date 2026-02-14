const express = require("express");
const app = express();

let scores = {};
// หน้าแรก
app.get("/", (req, res) => {
  res.send("API running");
});
// เพิ่มคะแนน
app.get("/add", (req, res) => {
  const user = req.query.user || "unknown";
  if (!scores[user]) {
    scores[user] = 0;
  }
  scores[user]++;
  res.send("added for user " + user);
});
// ⭐ เพิ่มอันนี้
app.get("/score", (req, res) => {
  res.json(scores);
});
app.get("/reset", (req, res) => {
  scores = {};
  res.send("reset");
});
// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
