const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    const { nama_lengkap, email, password } = req.body;
    db.query('INSERT INTO tbl_user (nama_lengkap, email, password) VALUES (?, ?, ?)', 
    [nama_lengkap, email, password], (err, result) => {
        if (err) return res.status(500).json({ error: 'Email sudah terdaftar!' });
        res.json({ message: 'Register Berhasil!' });
    });
});

// LOGIN (Penting: Kirim Role & API Key)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM tbl_user WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Email/Password Salah!' });

        const user = results[0];
        const token = jwt.sign({ id: user.user_id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login Berhasil!',
            token: token,
            user: {
                id: user.user_id,
                nama: user.nama_lengkap,
                email: user.email,
                role: user.role,       // Penting buat Admin Panel
                api_key: user.api_key  // Penting buat Dashboard User
            }
        });
    });
});

// BELI PAKET
router.post('/buy-plan', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Token hilang' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token tidak valid' });

        const newApiKey = 'toy-sk-' + Math.random().toString(36).substr(2, 12);
        db.query('UPDATE tbl_user SET api_key = ?, credits = 1000 WHERE user_id = ?', [newApiKey, decoded.id], (err) => {
            if (err) return res.status(500).json({ error: 'Gagal update DB' });
            res.json({ message: 'Upgrade Berhasil!', api_key: newApiKey, credits: 1000 });
        });
    });
});

module.exports = router;