const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // služi index.html i ostale fajlove

const DB_FILE = "./db.json";

// Pomoćna funkcija da čita bazu
function readDB() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}

// Pomoćna funkcija da upiše bazu
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- LOGIN ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username && u.password === password);
  if (user) res.json(user);
  else res.status(401).json({ error: "Pogrešno ime ili lozinka" });
});

// --- ADD USER ---
app.post("/addUser", (req, res) => {
  const { username, password, admin } = req.body;
  const db = readDB();
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: "Korisnik već postoji" });
  }
  db.users.push({ username, password, admin: admin || false });
  writeDB(db);
  res.json({ success: true });
});

// --- ANNOUNCEMENTS ---
app.get("/announcements", (req, res) => {
  const db = readDB();
  res.json(db.announcements);
});

app.post("/announcement", (req, res) => {
  const db = readDB();
  db.announcements.push({ text: req.body.text, time: new Date().toLocaleString() });
  writeDB(db);
  res.json({ success: true });
});

// --- MEETINGS ---
app.get("/meetings", (req, res) => {
  const db = readDB();
  res.json(db.meetings);
});

app.post("/meeting", (req, res) => {
  const db = readDB();
  db.meetings.push({ text: req.body.text, time: new Date().toLocaleString() });
  writeDB(db);
  res.json({ success: true });
});

// --- GRADES ---
app.get("/grades", (req, res) => {
  const db = readDB();
  res.json(db.grades);
});

app.post("/grade", (req, res) => {
  const db = readDB();
  db.grades.push({ username: req.body.username, subject: req.body.subject, grade: req.body.grade });
  writeDB(db);
  res.json({ success: true });
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`Server radi na http://localhost:${PORT}`));
