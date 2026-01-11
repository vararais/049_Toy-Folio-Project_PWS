const express = require('express');
const router = express.Router();
const db = require('../db');

// MONITORING USER
router.get('/users', (req, res) => {
    const sql = `SELECT user_id, nama_lengkap, email, api_key, credits, role FROM tbl_user ORDER BY user_id DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Gagal ambil data user.' });
        res.json(results);
    });
});

// INPUT BARANG (Tanpa Foto)
router.post('/add', (req, res) => {
    const { item_name, price, year, condition, description } = req.body;
    
    // Validasi
    if (!item_name || !price) return res.status(400).json({ error: 'Data tidak lengkap!' });

    // Masukkan "-" ke kolom image_path biar DB gak error
    const sql = `INSERT INTO tbl_items (item_name, estimated_value, production_year, condition_grade, description, image_path) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [item_name, price, year, condition, description, "-"];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ error: 'Database Error' });
        res.json({ message: 'Barang berhasil masuk katalog!' });
    });
});

module.exports = router;