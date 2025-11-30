import { state } from "./state.js";

export function initAuth() {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      state.user = { email, role: "student" }; // mock
      alert("Connexion réussie !");
      location.hash = "#/dashboard";
    } else {
      alert("Erreur: " + data.error);
    }
  });
}
// public/javascripts/auth.js

// On récupère le formulaire par son id
const form = document.getElementById("loginForm");

form.onsubmit = async (e) => {
  e.preventDefault(); // empêche le rechargement de la page

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rgpd = document.getElementById("rgpd").checked;

  if (!rgpd) {
    alert("Tu dois accepter la politique de confidentialité (RGPD) pour te connecter.");
    return;
  }

  try {
    // 👉 Appel API vers ton back-end Node.js
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Stocke le token JWT dans le navigateur
      localStorage.setItem("token", data.token);

      // Affiche un message
      alert("Connexion réussie ✅");

      // 👉 Redirige vers ton dashboard
      window.location.hash = "#/dashboard";
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (err) {
    console.error("Erreur login:", err);
    alert("Impossible de se connecter au serveur.");
  }
};
// public/javascripts/auth.js

// Gestion du login
document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Connexion réussie ✅");
      window.location.hash = "#/dashboard";
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (err) {
    console.error("Erreur login:", err);
  }
};

// Gestion du signup
document.getElementById("signupBtn").onclick = async () => {
  const email = prompt("Entre ton email :");
  const password = prompt("Choisis un mot de passe :");

  if (!email || !password) return;

  try {
    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Compte créé ✅, tu peux maintenant te connecter !");
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (err) {
    console.error("Erreur signup:", err);
  }
};
document.getElementById("signupBtn").onclick = async () => {
  const email = prompt("Entre ton email :");
  const password = prompt("Choisis un mot de passe :");

  if (!email || !password) return;

  try {
    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Compte créé ✅, tu peux maintenant te connecter !");
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (err) {
    console.error("Erreur signup:", err);
    alert("Impossible de créer le compte.");
  }
};
