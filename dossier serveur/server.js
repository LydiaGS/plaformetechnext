// --- Dépendances ---
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// --- Gestion des utilisateurs avec fichier JSON ---
let users = [
  { id: 1, email: "demo@campus.edu", password: bcrypt.hashSync("1234", 10) }
];

function saveUsers() {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

function loadUsers() {
  if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
  }
}

loadUsers(); // recharge les utilisateurs existants au démarrage

// --- Données en mémoire pour les projets ---
let projects = [
  { id: 1, name: "Libft", deadline: "2026-01-12", status: "En cours", grade: null },
  { id: 2, name: "Get Next Line", deadline: "2025-12-20", status: "À évaluer", grade: 85 },
];

// --- Middleware d’authentification ---
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token manquant" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "secretKey"); // clé secrète à garder privée
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Token invalide" });
  }
}

// --- ROUTES ---
// Page d’accueil : sert ton index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Signup (création de compte)
app.post("/auth/signup", (req, res) => {
  const { email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email déjà utilisé" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: Date.now(), email, password: hashedPassword };
  users.push(newUser);

  saveUsers(); // 🔥 sauvegarde dans users.json

  res.json({ message: "Utilisateur créé", user: { id: newUser.id, email: newUser.email } });
});

// Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.status(401).json({ error: "Utilisateur inconnu" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Mot de passe invalide" });

  const token = jwt.sign({ id: user.id, email: user.email }, "secretKey", { expiresIn: "1h" });
  res.json({ token });
});

// GET projets (protégé)
app.get("/projects", authMiddleware, (req, res) => {
  res.json(projects);
});

// POST projet (protégé)
app.post("/projects", authMiddleware, (req, res) => {
  const newProject = { id: Date.now(), ...req.body };
  projects.push(newProject);
  res.json(newProject);
});

// --- Lancement du serveur ---
app.listen(3000, () => {
  console.log("✅ API running on http://localhost:3000");
});
