const express = require("express");
const app = express();
const crypto = require("crypto");
const cors = require("cors");
const fs = require("fs");

app.use(cors());

const USERS_FILE = "users.json";
const SCORES_FILE = "scores.json";

// โหลดไฟล์
function loadJSON(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "{}");
  }
  return JSON.parse(fs.readFileSync(file));
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ========================
// REGISTER
// ========================
app.get("/register", (req, res) => {
  const { user, pass } = req.query;
  if (!user || !pass)
    return res.json({ error: "missing data" });

  let users = loadJSON(USERS_FILE);
  let scores = loadJSON(SCORES_FILE);

  if (users[user])
    return res.json({ error: "user exists" });

  users[user] = pass;
  scores[user] = 0;

  saveJSON(USERS_FILE, users);
  saveJSON(SCORES_FILE, scores);

  res.json({ message: "registered" });
});

// ========================
// LOGIN
// ========================
let sessions = {};

app.get("/login", (req, res) => {
  const { user, pass } = req.query;
  const users = loadJSON(USERS_FILE);

  if (!users[user] || users[user] !== pass)
    return res.json({ error: "invalid login" });

  const token = crypto.randomBytes(16).toString("hex");
  sessions[token] = user;

  res.json({ token, user });
});

// ========================
// SCORE
// ========================
app.get("/score", (req, res) => {
  const token = req.query.token;
  if (!token || !sessions[token])
    return res.json({ error: "invalid token" });

  const user = sessions[token];
  const scores = loadJSON(SCORES_FILE);

  res.json({
    user,
    score: scores[user] || 0
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Server running on " + PORT)
);
