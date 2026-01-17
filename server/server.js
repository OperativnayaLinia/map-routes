const express = require('express');
const app = express();

// Роут для главной страницы
app.get('/', (req, res) => {
  res.send('Сервер работает 🚀');
});

// ВАЖНО: используем процесс.env.PORT для Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
