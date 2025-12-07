const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');


const validatePresensiUpdate = [
    // Aturan 1: checkIn (optional) harus ISO 8601
    body('checkIn')
        .optional()
        .isISO8601()
        .withMessage('Format checkIn harus berupa tanggal/waktu yang valid (ISO 8601).'),
    
    // Aturan 2: checkOut (optional) harus ISO 8601
    body('checkOut')
        .optional()
        .isISO8601()
        .withMessage('Format checkOut harus berupa tanggal/waktu yang valid (ISO 8601).'),

    // Handler Error: Mengecek hasil validasi
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Jika gagal, kirim status 400 Bad Request
            return res.status(400).json({ 
                message: 'Validasi input gagal.', 
                errors: errors.array() 
            });
        }
        next(); // Jika sukses, lanjutkan
    }
];

// --- Rute Presensi ---

// POST /api/presensi/check-in: Membutuhkan Otentikasi DAN File Upload (Multer)
// Inilah perbaikan utama untuk error 500: memastikan Multer dipanggil setelah Otentikasi
router.post(
    '/check-in', 
    [authenticateToken, presensiController.upload.single('image')], 
    presensiController.CheckIn
);

// POST /api/presensi/check-out: Membutuhkan Otentikasi saja
router.post('/check-out', authenticateToken, presensiController.CheckOut);

// PUT /api/presensi/:id: Membutuhkan Otentikasi dan Validasi
router.put('/:id', [authenticateToken, validatePresensiUpdate], presensiController.updatePresensi);

// DELETE /api/presensi/:id: Membutuhkan Otentikasi
router.delete("/:id", authenticateToken, presensiController.deletePresensi);

module.exports = router;