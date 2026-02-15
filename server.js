const express = require("express");
const app = express();
const crypto = require("crypto");

let scores = {};
let sessions = {}; // token → user

// หน้าแรก
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ LOGIN → ส่ง token กลับ
app.get("/login", (req, res) => {
  const user = req.query.user;

  if (!user) return res.send("no user");

  // สร้าง token
  const token = crypto.randomBytes(16).toString("hex");

  sessions[token] = user;

  if (!scores[user]) scores[user] = 0;

  res.json({
    token: token,
    user: user
  });
});

// ✅ เพิ่มคะแนน (ใช้ token)
app.get("/add", (req, res) => {
  const token = req.query.token;

  if (!token || !sessions[token]) {
    return res.send("invalid token");
  }

  const user = sessions[token];
  scores[user]++;

  res.send("added for " + user);
});

// ✅ ดูคะแนน
app.get("/score", (req, res) => {
  const token = req.query.token;

  if (!token || !sessions[token]) {
    return res.send("invalid token");
  }

  const user = sessions[token];

  res.json({
    user: user,
    score: scores[user] || 0
  });
});

// รีเซ็ต
app.get("/reset", (req, res) => {
  scores = {};
  res.send("reset");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
