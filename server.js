
const express = require("express");
const app = express();
const crypto = require("crypto");
let users = {};
let scores = {};
let sessions = {}; // token → user

// หน้าแรก
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ LOGIN → ส่ง token กลับ
// สมัครสมาชิก
app.get("/register", (req, res) => {
  const { user, pass } = req.query;

  if (!user || !pass) {
    return res.json({ error: "missing data" });
  }

  if (users[user]) {
    return res.json({ error: "user exists" });
  }

  users[user] = pass;
  scores[user] = 0;

  res.json({ message: "registered" });
});

app.get("/login", (req, res) => {
  const { user, pass } = req.query;

  if (!users[user] || users[user] !== pass) {
    return res.json({ error: "invalid login" });
  }

  const token = crypto.randomBytes(16).toString("hex");
  sessions[token] = user;

  res.json({
    token,
    user
  });
});

// ✅ เพิ่มคะแนน (ใช้ token)
app.get("/add", (req, res) => {
  const token = req.query.token;

  if (!token || !sessions[token]) {
    return res.send("invalid token");
  }

  const user = sessions[token];
 if (!scores[user]) scores[user] = 0;
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
