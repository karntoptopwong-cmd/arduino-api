const express = require("express");
const app = express();
const crypto = require("crypto");
const cors = require("cors");
const fs = require("fs");

app.use(cors());

const USERS_FILE = "users.json";
const SCORES_FILE = "scores.json";

// โหลดข้อมูลจากไฟล์
function loadData(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return {};
  }
}

// บันทึกข้อมูลลงไฟล์
function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let users = loadData(USERS_FILE);
let scores = loadData(SCORES_FILE);
let sessions = {}; // token → user

// หน้าแรก
app.get("/", (req, res) => {
  res.send("API running");
});


// ==========================
// สมัครสมาชิก
// ==========================
app.get("/register", (req, res) => {
  const { user, pass } = req.query;

  if (!user || !pass)
    return res.json({ error: "missing data" });

  if (users[user])
    return res.json({ error: "user exists" });

  users[user] = pass;
  scores[user] = 0;

  saveData(USERS_FILE, users);
  saveData(SCORES_FILE, scores);

  res.json({ message: "registered" });
});


// ==========================
// LOGIN
// ==========================
app.get("/login", (req, res) => {
  const { user, pass } = req.query;

  if (!users[user] || users[user] !== pass)
    return res.json({ error: "invalid login" });

  const token = crypto.randomBytes(16).toString("hex");
  sessions[token] = user;

  res.json({ token, user });
});


// ==========================
// เพิ่มคะแนน
// ==========================
app.get("/add", (req, res) => {
  const token = req.query.token;

  if (!token || !sessions[token])
    return res.send("invalid token");

  const user = sessions[token];

  scores[user] = (scores[user] || 0) + 1;
  saveData(SCORES_FILE, scores);

  res.send("added for " + user);
});


// ==========================
// ดูคะแนน
// ==========================
app.get("/score", (req, res) => {
  const token = req.query.token;

  if (!token || !sessions[token])
    return res.send("invalid token");

  const user = sessions[token];

  res.json({
    user,
    score: scores[user] || 0
  });
});


// ==========================
// รีเซ็ตคะแนน
// ==========================
app.get("/reset", (req, res) => {
  scores = {};
  saveData(SCORES_FILE, scores);
  res.send("reset");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
