const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ==========================================
// 1. KONFIGURASI MULTER (Gudang Penyimpanan)
// ==========================================
const storage = multer.diskStorage({
    // Mau disimpan di mana? -> Folder 'uploads'
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    // Namanya apa? -> Kita kasih nama unik pakai tanggal biar gak bentrok
    filename: (req, file, cb) => {
        // Contoh hasil: 17098829923-foto.jpg
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

// Inisialisasi upload (Filter: Cuma boleh file gambar)
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Hanya boleh upload file gambar (jpg/png)!'));
    }
});

// ==========================================
// 2. RUTE UPLOAD (POST /api/scan)
// ==========================================
// 'image' adalah nama key yang harus dikirim dari Frontend/Postman
router.post('/', upload.single('image'), (req, res) => {
    try {
        // Cek ada filenya gak?
        if (!req.file) {
            return res.status(400).json({ error: 'Mana gambarnya? Belum diupload cuy.' });
        }

        // Kalau sukses, kasih tau user
        res.json({
            message: 'Foto berhasil mendarat di server!',
            file_data: {
                original_name: req.file.originalname,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            }
            // NANTI DI SINI KITA PANGGIL AI OPENROUTER
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;