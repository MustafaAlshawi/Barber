const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'booking.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});


app.use(cors());
app.use(bodyParser.json());

// إنشاء أو فتح قاعدة البيانات
const db = new sqlite3.Database('./appointments.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database.');
});

// إنشاء جدول المواعيد إذا لم يكن موجودًا
db.run(`CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT,
  lastName TEXT,
  phone TEXT,
  day INTEGER,
  month INTEGER,
  year INTEGER,
  hour TEXT,
  minute TEXT,
  ampm TEXT
)`);

// إضافة موعد جديد
app.post('/api/book', (req, res) => {
  const { firstName, lastName, phone, day, month, year, hour, minute, ampm } = req.body;
  const sql = `INSERT INTO appointments 
    (firstName, lastName, phone, day, month, year, hour, minute, ampm)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [firstName, lastName, phone, day, month, year, hour, minute, ampm], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Appointment booked', id: this.lastID });
  });
});

// جلب جميع المواعيد
app.get('/api/appointments', (req, res) => {
  const sql = `SELECT * FROM appointments ORDER BY year, month, day, hour, minute`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// حذف موعد
app.delete('/api/appointments/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM appointments WHERE id = ?`;
  db.run(sql, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Appointment deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
