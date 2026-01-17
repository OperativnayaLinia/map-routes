const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== STATIC FILES ===== */
app.use(express.static(path.join(__dirname, "public")));

/* ===== ADMIN LOGIN ===== */
const ADMIN_PASSWORD = "Bel_admin31";

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }

  res.status(401).json({ ok: false, message: "Wrong password" });
});

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
