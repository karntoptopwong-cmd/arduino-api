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

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => console.log("Server running"));
