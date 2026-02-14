const express = require("express");
const app = express();

let score = 0;

// หน้าแรก
app.get("/", (req, res) => {
  res.send("API running");
});

// เพิ่มคะแนน
app.get("/add", (req, res) => {
  score++;
  res.send("added " + score);
});
// ⭐ เพิ่มอันนี้
app.get("/score", (req, res) => {
  res.json({ score: score });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
