const mysql = require('mysql2');
require('dotenv').config(); // 1. Panggil library dotenv buat baca file .env

// 2. Bikin koneksi ambil data dari process.env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// 3. Cek koneksi
db.connect((err) => {
    if (err) {
        console.error('❌ Gawat! Gagal nyambung ke Database:', err);
    } else {
        console.log('✅ Mantap! Terhubung ke Database MySQL:', process.env.DB_NAME);
    }
});

module.exports = db;