const { SensorLog } = require('../models');

exports.receiveSensorData = async (req, res) => {
  try {
    const { suhu, kelembaban, cahaya, motion } = req.body;

    // Validasi dasar: Suhu dan Kelembaban wajib ada (kompatibilitas kode lama)
    if (suhu === undefined || kelembaban === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Data suhu atau kelembaban tidak valid"
      });
    }

    // Simpan ke database
    await SensorLog.create({
      suhu: parseFloat(suhu),
      kelembaban: parseFloat(kelembaban),
      cahaya: parseInt(cahaya) || 0,
      // ✅ Menangani jika 'motion' tidak dikirim oleh alat lama (default 0)
      motion: motion ? 1 : 0   
    });

    console.log(
      `💾 [SAVED] Suhu: ${suhu} | Lembab: ${kelembaban} | Cahaya: ${cahaya} | Motion: ${motion}`
    );

    res.status(201).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSensorHistory = async (req, res) => {
  try {
    const data = await SensorLog.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']]
    });

    // Reverse agar grafik urut dari kiri (lama) ke kanan (baru)
    res.json({
      status: "success",
      data: data.reverse() 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};