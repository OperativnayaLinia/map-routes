const API_URL = "https://ТВОЙ-ПРОЕКТ.up.railway.app";

// Загружаем маршруты с сервера
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

// Сохраняем маршруты на сервере
async function saveRoutes() {
  const token = sessionStorage.getItem("admin_token");

  const res = await fetch(`${API_URL}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: token,
      newRoute: activeRoute,
    }),
  });

  if (!res.ok) {
    alert("Ошибка при сохранении маршрута!");
  }
}

// Логика добавления маршрутов (аналогично тому, что ты писал раньше)
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
    await saveRoutes(); // Отправляем маршрут на сервер
  }

  if (currentMode === "edit" && activeRoute) {
    activeRoute.path.push(p);
    activeRoute.polyline.setLatLngs(activeRoute.path);
    await saveRoutes(); // Отправляем обновление на сервер
  }
});
