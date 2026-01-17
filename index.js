const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* 🔴 КРИТИЧНО: без этого пароль НИКОГДА не будет читаться */
app.use(express.json());

/* Раздача фронта */
app.use(express.static('public'));

/* ===== ХРАНЕНИЕ МАРШРУТОВ ===== */
const DATA_FILE = path.join(__dirname, 'routes.json');

function loadRoutes() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveRoutes(routes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(routes, null, 2));
}

/* ===== ADMIN AUTH ===== */
const ADMIN_PASSWORD = 'Bel_admin31';
const adminTokens = new Set();

/* 🔐 LOGIN */
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};

  console.log('LOGIN BODY:', req.body); // можно оставить, не мешает

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'wrong password' });
  }

  const token = 'admin-' + Date.now();
  adminTokens.add(token);

  res.json({ token });
});

/* 🔐 ПРОВЕРКА ТОКЕНА */
function isAdmin(req) {
  const token = req.headers['authorization'];
  return adminTokens.has(token);
}

/* ===== API ===== */

/* Получить маршруты */
app.get('/api/routes', (req, res) => {
  res.json(loadRoutes());
});

/* Сохранить маршруты (только админ) */
app.post('/api/routes', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const routes = req.body;
  saveRoutes(routes);
  res.json({ ok: true });
});

/* Сброс маршрутов (только админ) */
app.delete('/api/routes', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  saveRoutes([]);
  res.json({ ok: true });
});

/* ===== START ===== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
