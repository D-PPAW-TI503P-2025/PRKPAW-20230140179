// controllers/reportController.js

// 1. Impor Model Presensi dan Operator Sequelize
const { Presensi, Sequelize } = require("../models");
const { Op } = Sequelize;

// 2. Ubah fungsi menjadi async untuk menunggu query database
exports.getDailyReport = async (req, res) => {
  try {
    // Tentukan rentang waktu untuk "hari ini" (dari jam 00:00 sampai besok jam 00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 3. Lakukan query ke database untuk mencari data hari ini
    const records = await Presensi.findAll({
      where: {
        checkIn: {
          [Op.between]: [today, tomorrow], // Cari 'checkIn' di antara dua waktu ini
        },
      },
      attributes: ['userId', 'nama', 'checkIn', 'checkOut'] // Ambil kolom yang relevan saja
    });

    // 4. Kirim data yang ditemukan dari database sebagai respons
    res.status(200).json({
      reportDate: today.toLocaleDateString('id-ID'), // Format tanggal hari ini
      data: records, // 'records' adalah hasil dari query database
    });

  } catch (error) {
    // Jika terjadi error saat query, kirim pesan error
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};