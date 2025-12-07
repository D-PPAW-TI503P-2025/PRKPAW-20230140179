// 1. Ganti sumber data dari array ke model Sequelize
const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
    
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pastikan folder 'uploads/' ada di root server Express Anda
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // --- Debugging Log ---
        // Log ini akan memberitahu kita apakah req.user tersedia. Hapus setelah testing!
        // console.log("User ID Diterima di Multer:", req.user ? req.user.id : "USER UNDEFINED"); 
        // --- End Debugging ---

        // Format nama file: userId-timestamp.jpg. Membutuhkan req.user.id
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

// Middleware Multer untuk diekspor ke router
exports.upload = multer({ storage: storage, fileFilter: fileFilter });


exports.CheckIn = async (req, res) => {
    // 2. Gunakan try...catch untuk error handling
    try {
        const { id: userId, nama: userName } = req.user;
        const waktuSekarang = new Date();
        const { latitude, longitude } = req.body
        
        // req.file hanya akan ada jika Multer berhasil menyimpan file
        const buktiFoto = req.file ? req.file.path : null; 
    
        // 3. Ubah cara mencari data menggunakan 'findOne' dari Sequelize
        const existingRecord = await Presensi.findOne({
            where: { userId: userId, checkOut: null },
        });
    
        if (existingRecord) {
            return res
                .status(400)
                .json({ message: "Anda sudah melakukan check-in hari ini." });
        }
    
        // 4. Ubah cara membuat data baru menggunakan 'create' dari Sequelize
        const newRecord = await Presensi.create({
            userId: userId,
            checkIn: waktuSekarang,
            latitude: latitude || null,
            longitude: longitude || null,
            buktiFoto: buktiFoto // Simpan path foto
        });
        
        const formattedData = {
            userId: newRecord.userId,
            nama: userName, // Mengambil nama dari req.user yang disediakan oleh otentikasi
            checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
            checkOut: null
        };
    
        res.status(201).json({
            message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
                waktuSekarang,
                "HH:mm:ss",
                { timeZone }
            )} WIB`,
            data: formattedData,
        });
    } catch (error) {
        // Ini adalah error yang ditangkap dan dikirim ke frontend
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};
    
exports.CheckOut = async (req, res) => {
    // Gunakan try...catch
    try {
        const { id: userId, nama: userName } = req.user;
        const waktuSekarang = new Date();
    
        // Cari data di database
        const recordToUpdate = await Presensi.findOne({
            where: { userId: userId, checkOut: null },
        });
    
        if (!recordToUpdate) {
            return res.status(404).json({
                message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
            });
        }
    
        // 5. Update dan simpan perubahan ke database
        recordToUpdate.checkOut = waktuSekarang;
        await recordToUpdate.save();
    
        const formattedData = {
            userId: recordToUpdate.userId,
            checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
            checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        };
    
        res.json({
            message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
                waktuSekarang,
                "HH:mm:ss",
                { timeZone }
            )} WIB`,
            data: formattedData,
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

exports.deletePresensi = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const presensiId = req.params.id;
        const recordToDelete = await Presensi.findByPk(presensiId);

        if (!recordToDelete) {
            return res
                .status(404)
                .json({ message: "Catatan presensi tidak ditemukan." });
        }
        if (recordToDelete.userId !== userId) {
            return res
                .status(403)
                .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
        }
        await recordToDelete.destroy();
        res.status(204).send();
    } catch (error) {
        res
            .status(500)
            .json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

exports.updatePresensi = async (req, res) => {
    try {
        const presensiId = req.params.id;
        const { checkIn, checkOut } = req.body;
        if (checkIn === undefined && checkOut === undefined) {
            return res.status(400).json({
                message:
                    "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
            });
        }
        const recordToUpdate = await Presensi.findByPk(presensiId);
        if (!recordToUpdate) {
            return res
                .status(404)
                .json({ message: "Catatan presensi tidak ditemukan." });
        }

        recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
        recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
        await recordToUpdate.save();

        res.json({
            message: "Data presensi berhasil diperbarui.",
            data: recordToUpdate,
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};