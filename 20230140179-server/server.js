const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // <-- Ambil dari kode asdos
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // <-- Ganti console.log manual dengan morgan

// Route utama
app.get('/', (req, res) => {
  res.send('Home Page for API');
});

// Import semua router yang dibutuhkan
const bookRoutes = require('./routes/books');
const presensiRoutes = require("./routes/presensi"); // <-- Tambahkan dari kode asdos
const reportRoutes = require("./routes/reports");   // <-- Tambahkan dari kode asdos

// Daftarkan semua router
app.use('/api/books', bookRoutes);
app.use("/api/presensi", presensiRoutes); // <-- Tambahkan dari kode asdos
app.use("/api/reports", reportRoutes);   // <-- Tambahkan dari kode asdos

// Middleware 404 (Not Found) - Pertahankan dari kodemu!
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler - Pertahankan dari kodemu!
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});