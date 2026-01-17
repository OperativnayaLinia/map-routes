const express = require('express');
const app = express();

// Middleware для обработки JSON
app.use(express.json()); // Это важно для парсинга body как JSON

// Роут для логина
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};  // Получаем пароль из тела запроса
  console.log('LOGIN BODY:', req.body); // Логируем тело запроса для отладки

  if (password !== 'Bel_admin31') {  // Проверка пароля
    return res.status(401).json({ error: 'Wrong password' });  // Если пароль неверный, возвращаем ошибку
  }

  // Если пароль верный
  res.json({ ok: true });  // Отправляем успешный ответ
});

// Указываем порт для сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
