const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROUTES_FILE = path.join(__dirname, "routes.json");

app.use(express.json());

// Твой админский пароль
const ADMIN_PASSWORD = "Bel_admin31";

// Массив маршрутов (будет загружаться и сохраняться в файл)
let routes = [];

// Чтение маршрутов из файла
function loadRoutes() {
  try {
    const data = fs.readFileSync(ROUTES_FILE, "utf8");
    routes = JSON.parse(data);
  } catch (error) {
    console.error("Error reading routes file:", error);
  }
}

// Запись маршрутов в файл
function saveRoutes() {
  fs.writeFileSync(ROUTES_FILE, JSON.stringify(routes, null, 2));
}

// API для получения маршрутов
app.get("/routes", (req, res) => {
  loadRoutes();
  res.json(routes);
});

// API для добавления маршрутов (только для админов)
app.post("/routes", (req, res) => {
  const { token, newRoute } = req.body;
  if (token !== ADMIN_PASSWORD) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  routes.push(newRoute);
  saveRoutes();
  res.status(200).json({ message: "Route added successfully!" });
});

// API для проверки пароля
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
});

// Проверка токена
app.post("/check", (req, res) => {
  const { token } = req.body;
  if (token === ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
