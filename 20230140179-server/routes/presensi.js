const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensicontroller');
const { addUserData } = require('../middleware/permissionMiddleware');
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

    // 2. Handler Error: Mengecek hasil validasi
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

router.use(addUserData);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.put('/:id', validatePresensiUpdate, presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);
module.exports = router;

