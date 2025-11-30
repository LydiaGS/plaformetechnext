export const state = {
  user: null,
  notifications: [
    { id: 1, text: "Évaluation reçue pour 'Libft' (+92/100)" },
    { id: 2, text: "Nouvelle annonce: Hackathon dimanche" },
  ],
  blackholeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  level: 4,
  xpPercent: 37,
  skills: ["Unix", "Git", "Algorithms", "C", "Teamwork"],
  projects: [
    { id: 1, name: "Libft", deadline: "2026-01-12", status: "En cours", grade: null },
    { id: 2, name: "Get Next Line", deadline: "2025-12-20", status: "À évaluer", grade: 85 },
    { id: 3, name: "Push Swap", deadline: "2026-02-05", status: "Assigné", grade: null },
  ],
  cluster: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    status: ["free", "busy", "down"][Math.floor(Math.random() * 3)],
  })),
  events: [
    { title: "Workshop Git", date: "2025-12-01" },
    { title: "Peer-eval night", date: "2025-12-05" },
  ],
  announcements: [
    { id: 1, title: "Ouverture campus dimanche", author: "Staff", date: "2025-11-29", body: "Le campus sera ouvert 10h–18h." },
    { id: 2, title: "Maintenance cluster B", author: "Infra", date: "2025-11-30", body: "Interruption 08h–09h." },
  ],
};
