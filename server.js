const express = require("express");
const app = express();

let scores = {};

// หน้าแรก
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ login จากเว็บ (ใช้แค่ตรวจสอบ)
app.get("/login", (req, res) => {
  const user = req.query.user;

  if (!user) {
    return res.send("no user");
  }

  if (!scores[user]) {
    scores[user] = 0;
  }

  res.send("logged in as " + user);
});

// ✅ เพิ่มคะแนนจาก ESP32
app.get("/add", (req, res) => {
  const user = req.query.user;

  if (!user) {
    return res.send("no user");
  }

  if (!scores[user]) {
    scores[user] = 0;
  }

  scores[user]++;

  res.send("added for " + user);
});

// ✅ ดูคะแนนทั้งหมด
app.get("/score", (req, res) => {
  res.json(scores);
});

// รีเซ็ตคะแนน
app.get("/reset", (req, res) => {
  scores = {};
  res.send("reset");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
