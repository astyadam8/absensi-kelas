import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("attendance.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    nama TEXT NOT NULL,
    kelas TEXT NOT NULL,
    status TEXT NOT NULL,
    keterangan TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Route
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // Simple hardcoded credentials for the class system
    if (username === "absensi" && password === "123") {
      res.json({ success: true, user: { name: "Administrator", role: "admin" } });
    } else if (username === "ortu" && password === "123") {
      res.json({ success: true, user: { name: "Orang Tua", role: "parent" } });
    } else {
      res.status(401).json({ success: false, error: "Username atau password salah" });
    }
  });

  // API Routes
  app.post("/api/attendance", (req, res) => {
    const { nama, status, keterangan } = req.body;
    const kelas = "XII C2";

    if (!nama || !status) {
      return res.status(400).json({ error: "Nama dan status wajib diisi" });
    }

    try {
      const stmt = db.prepare(
        "INSERT INTO attendance (nama, kelas, status, keterangan) VALUES (?, ?, ?, ?)"
      );
      stmt.run(nama, kelas, status, keterangan || "");
      res.json({ message: "Data berhasil disimpan dengan aman!" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Gagal menyimpan data" });
    }
  });

  app.get("/api/attendance", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM attendance ORDER BY timestamp DESC").all();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
