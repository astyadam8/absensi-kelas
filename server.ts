import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "attendance.db");
console.log(`Database path: ${dbPath}`);
const db = new Database(dbPath);

// Initialize database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      class TEXT NOT NULL,
      parent_phone TEXT
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      subject TEXT
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      nama TEXT NOT NULL,
      kelas TEXT NOT NULL,
      status TEXT NOT NULL,
      keterangan TEXT
    );
  `);
  console.log("Database tables initialized successfully");
} catch (error) {
  console.error("Failed to initialize database tables:", error);
}

// Migration: Add role column to attendance if it doesn't exist
try {
  const tableInfo = db.prepare("PRAGMA table_info(attendance)").all() as any[];
  const hasRole = tableInfo.some(col => col.name === 'role');
  
  if (!hasRole) {
    console.log("Migrating database: Adding role column to attendance table");
    db.exec("ALTER TABLE attendance ADD COLUMN role TEXT DEFAULT 'siswa'");
  }
} catch (e) {
  console.error("Migration failed:", e);
}

// Seed initial data if empty
const seedData = () => {
  const studentCount = db.prepare("SELECT COUNT(*) as count FROM students").get() as any;
  if (studentCount.count === 0) {
    const students = [
      { name: "Agresia A. Cika", class: "XII C2", phone: "6281234567890" },
      { name: "Yohana A. Adam", class: "XII C2", phone: "6281234567891" },
      { name: "Maria Y.T. Dangur", class: "XII C2", phone: "6281234567892" },
      { name: "Oswaldus A.Jelahu", class: "XII C2", phone: "6281234567893" },
      { name: "Agustinus G. Nggeal", class: "XII C2", phone: "6281234567894" },
      { name: "Yorimus O. Adu", class: "XII C2", phone: "6281234567895" },
      { name: "Aleksius Hugo", class: "XII C2", phone: "6281234567896" },
      { name: "Almira P.E. Syamlan", class: "XII C2", phone: "6281234567897" },
      { name: "Amelia Celsi Anul", class: "XII C2", phone: "6281234567898" },
      { name: "Maria K.M.Batumali", class: "XII C2", phone: "6281234567899" },
      { name: "Efrasia F.Latar", class: "XII C2", phone: "6281234567900" },
      { name: "Gregorius R.Jerni", class: "XII C2", phone: "6281234567901" },
      { name: "Maria S.Jehambur", class: "XII C2", phone: "6281234567902" },
      { name: "Marsela V.Indriani", class: "XII C2", phone: "6281234567903" },
      { name: "Michela M. Lioran", class: "XII C2", phone: "6281234567904" },
      { name: "Modestus M. Jemadi", class: "XII C2", phone: "6281234567905" },
      { name: "Monika Y.Stiani", class: "XII C2", phone: "6281234567906" },
      { name: "Natalia Nabit", class: "XII C2", phone: "6281234567907" },
      { name: "Oktavianus Kasu", class: "XII C2", phone: "6281234567908" },
      { name: "Reinaldus Jorsen", class: "XII C2", phone: "6281234567909" },
      { name: "Sevrianus Areh", class: "XII C2", phone: "6281234567910" },
      { name: "Simfronianus D. Agol", class: "XII C2", phone: "6281234567911" },
      { name: "Vinsensius V.Jalar", class: "XII C2", phone: "6281234567912" },
      { name: "Yoalita A.D. Jeneo", class: "XII C2", phone: "6281234567913" },
      { name: "Yohanes Florentino", class: "XII C2", phone: "6281234567914" },
      { name: "Yonesius Balsano", class: "XII C2", phone: "6281234567915" }
    ];
    const insert = db.prepare("INSERT INTO students (name, class, parent_phone) VALUES (?, ?, ?)");
    students.forEach(s => insert.run(s.name, s.class, s.phone));
  }

  const teacherCount = db.prepare("SELECT COUNT(*) as count FROM teachers").get() as any;
  if (teacherCount.count === 0) {
    const teachers = [
      { name: "Bpk. Yohanes", subject: "Matematika" },
      { name: "Ibu Maria", subject: "Bahasa Indonesia" },
      { name: "Bpk. Petrus", subject: "Fisika" }
    ];
    const insert = db.prepare("INSERT INTO teachers (name, subject) VALUES (?, ?)");
    teachers.forEach(t => insert.run(t.name, t.subject));
  }
};

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.get("/api/students", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM students ORDER BY name ASC").all();
      res.json(rows);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Gagal mengambil data siswa" });
    }
  });

  app.get("/api/teachers", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM teachers ORDER BY name ASC").all();
      res.json(rows);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ error: "Gagal mengambil data guru" });
    }
  });

  app.post("/api/students", (req, res) => {
    const { name, className, parentPhone } = req.body;

    if (!name || !className) {
      return res.status(400).json({ error: "Nama dan Kelas wajib diisi" });
    }

    try {
      const stmt = db.prepare(
        "INSERT INTO students (name, class, parent_phone) VALUES (?, ?, ?)"
      );
      stmt.run(name, className, parentPhone || "");
      res.json({ message: "Data siswa berhasil ditambahkan!" });
    } catch (error) {
      console.error("Database error:", error);
      if (error.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Nama siswa sudah ada dalam sistem" });
      }
      res.status(500).json({ error: "Gagal menyimpan data siswa" });
    }
  });

  app.post("/api/attendance", (req, res) => {
    const { nama, status, keterangan, role } = req.body;
    const kelas = "XII C2";

    if (!nama || !status) {
      return res.status(400).json({ error: "Nama dan status wajib diisi" });
    }

    try {
      // Check for duplicate today
      const existing = db.prepare(
        "SELECT id FROM attendance WHERE nama = ? AND date(timestamp) = date(?)"
      ).get(nama, 'now');

      if (existing) {
        return res.status(400).json({ error: `Absensi untuk ${nama} sudah dikirim hari ini.` });
      }

      const stmt = db.prepare(
        "INSERT INTO attendance (nama, kelas, status, keterangan, role) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run(nama, kelas, status, keterangan || "", role || 'siswa');
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
      console.error("Error fetching attendance:", error);
      res.status(500).json({ error: "Gagal mengambil data riwayat" });
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan internal pada server." });
  });
}

startServer();
