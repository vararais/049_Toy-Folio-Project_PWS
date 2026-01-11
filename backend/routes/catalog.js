const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(403).json({ error: 'Access Denied: Missing API Key' });

    db.query('SELECT * FROM tbl_user WHERE api_key = ?', [apiKey], (err, users) => {
        if (err || users.length === 0) return res.status(403).json({ error: 'Invalid API Key' });
        const user = users[0];
        if (user.credits <= 0) return res.status(403).json({ error: 'Quota Exceeded' });

        db.query('SELECT * FROM tbl_items', (err, items) => {
            if (err) return res.status(500).json({ error: 'Server Error' });

            // Format JSON Bersih (Hapus kolom image_path yang isinya "-")
            const cleanData = items.map(item => ({
                id: item.item_id,
                name: item.item_name,
                price: item.estimated_value,
                year: item.production_year,
                condition: item.condition_grade,
                description: item.description
            }));

            // Kurangi Kuota
            db.query('UPDATE tbl_user SET credits = credits - 1 WHERE user_id = ?', [user.user_id]);

            res.json({
                status: 'success',
                message: 'Data retrieved successfully',
                remaining_credits: user.credits - 1,
                data: cleanData
            });
        });
    });
});

module.exports = router;