require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 
const app = express();
const path = require('path'); 
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Agar foto yang diunggah bisa dilihat di frontend (misal: <img src="/uploads/foto.jpg" />),
// kita perlu mengkonfigurasi Express untuk melayani folder tersebut secara statis.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ----------------------------------------------

// Route utama
app.get('/', (req, res) => {
  res.send('Home Page for API');
});

// Import semua router yang dibutuhkan
const bookRoutes = require('./routes/books');
const presensiRoutes = require("./routes/presensi"); 
const reportRoutes = require("./routes/reports");   

const authRoutes = require('./routes/auth'); // <-- Impor rute auth

// Daftarkan semua router
app.use('/api/books', bookRoutes);
app.use("/api/presensi", presensiRoutes); 
app.use("/api/reports", reportRoutes); 

app.use('/api/auth', authRoutes); // <-- Daftarkan rute /api/auth

// Middleware 404 (Not Found) 
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});

const iotRoutes = require("./routes/iot");
app.use("/api/iot", iotRoutes);