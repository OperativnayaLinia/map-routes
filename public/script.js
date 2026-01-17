// ===== НАСТРОЙКИ =====
const API_URL = "https://otslezhivanie-marshruta.onrender.com";

// ===== ЛОГИН АДМИНА =====
async function adminLogin(password) {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  if (!res.ok) {
    alert("Неверный пароль");
    return;
  }

  const data = await res.json();

  if (data.ok) {
    sessionStorage.setItem("admin", "true");
    alert("Админ-доступ включён");
  }
}

// Кнопка логина
function login() {
  const pass = document.getElementById("adminPass").value;
  adminLogin(pass);
}

// ===== ЗАГРУЗКА МАРШРУТОВ =====
async function loadRoutes() {
  const res = await fetch(`${API_URL}/routes`);
  const data = await res.json();

  data.forEach(route => {
    const poly = L.polyline(route.path, { color: "blue" }).addTo(map);
    const marker = L.marker(route.path[0], { icon: pointIcon }).addTo(map);
    routes.push({ path: route.path, polyline: poly, marker, progress: 0 });
    attachMarkerEvents(marker);
  });
}

// ===== СОХРАНЕНИЕ МАРШРУТОВ =====
async function saveRoutes() {
  if (sessionStorage.getItem("admin") !== "true") return;

  const res = await fetch(`${API_URL}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newRoute: activeRoute
    }),
  });

  if (!res.ok) {
    alert("Ошибка при сохранении маршрута!");
  }
}

// ===== ЛОГИКА КАРТЫ =====
map.on("click", async (e) => {
  if (sessionStorage.getItem("admin") !== "true") return;
  if (!currentMode) return;

  const p = [e.latlng.lat, e.latlng.lng];

  if (currentMode === "add") {
    const poly = L.polyline([p], { color: "blue" }).addTo(map);
    const marker = L.marker(p, { icon: pointIcon }).addTo(map);
    const route = { path: [p], polyline: poly, marker, progress: 0 };
    routes.push(route);
    activeRoute = route;
    attachMarkerEvents(marker);
    await saveRoutes();
  }

  if (currentMode === "edit" && activeRoute) {
    activeRoute.path.push(p);
    activeRoute.polyline.setLatLngs(activeRoute.path);
    await saveRoutes();
  }
});
