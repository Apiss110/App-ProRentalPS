import express from 'express';
import db from '../db.js';

const router = express.Router();

// ============================================
// 1. BUAT TRANSAKSI BARU (Dipakai User di Frontend)
// ============================================
router.post('/', (req, res) => {
    const { ps_id, user_id, duration, rental_type, total_price } = req.body;

    const sqlRent = `
        INSERT INTO rentals (ps_id, user_id, duration, rental_type, total_price, status, start_time, end_time) 
        VALUES (?, ?, ?, ?, ?, 'active', NOW(), DATE_ADD(NOW(), INTERVAL ? HOUR))
    `;

    db.query(sqlRent, [ps_id, user_id, duration, rental_type, total_price, duration], (err, result) => {
        if(err) {
            console.error(err);
            return res.json({Error: "Gagal insert rental"});
        }

        // Update status PS jadi 'in_use'
        const sqlUpdatePS = "UPDATE ps_units SET status = 'in_use' WHERE id = ?";
        db.query(sqlUpdatePS, [ps_id], (err2) => {
            if(err2) console.error("Gagal update status PS");
            return res.json({Status: "Success"});
        });
    });
});

// ============================================
// 2. AMBIL SEMUA DATA (KHUSUS ADMIN)
// ============================================
router.get('/', (req, res) => {
    // Join 3 tabel: rentals, users, dan ps_units
    const sql = `
        SELECT rentals.*, ps_units.name as ps_name, users.username 
        FROM rentals 
        JOIN ps_units ON rentals.ps_id = ps_units.id
        JOIN users ON rentals.user_id = users.id
        ORDER BY rentals.id DESC
    `;
    
    db.query(sql, (err, data) => {
        if(err) return res.json({Error: err.sqlMessage});
        return res.json(data);
    });
});

// ============================================
// 3. TOMBOL STOP / SELESAI (KHUSUS ADMIN)
// ============================================
router.put('/finish/:id', (req, res) => {
    const id = req.params.id;
    const ps_id = req.body.ps_id; // ID PS diperlukan untuk mengubah status jadi 'available'

    // 1. Ubah status sewa jadi 'finished'
    db.query("UPDATE rentals SET status='finished', end_time=NOW() WHERE id=?", [id], (err, result) => {
        if(err) return res.json({Error: "Gagal update rental"});

        // 2. Ubah status PS jadi 'available' kembali
        db.query("UPDATE ps_units SET status='available' WHERE id=?", [ps_id], (err2) => {
            if(err2) return res.json({Error: "Gagal update status PS"});
            return res.json({Status: "Success"});
        });
    });
});

// ============================================
// 4. AMBIL DATA AKTIF SAJA (Untuk User Dashboard)
// ============================================
router.get('/active', (req, res) => {
    const sql = `
        SELECT rentals.*, ps_units.name as ps_name 
        FROM rentals 
        JOIN ps_units ON rentals.ps_id = ps_units.id
        WHERE rentals.status = 'active'
    `;
    db.query(sql, (err, data) => {
        if(err) return res.json({Error: err.sqlMessage});
        return res.json(data);
    });
});

// ============================================
// 5. AMBIL DATA LAPORAN (Hanya yang SELESAI)
// ============================================
router.get('/reports', (req, res) => {
    // Kita ambil data rental yang statusnya 'finished'
    const sql = `
        SELECT rentals.*, ps_units.name as ps_name, users.username 
        FROM rentals 
        JOIN ps_units ON rentals.ps_id = ps_units.id
        JOIN users ON rentals.user_id = users.id
        WHERE rentals.status = 'finished' 
        ORDER BY rentals.end_time DESC
    `;
    
    db.query(sql, (err, data) => {
        if(err) return res.json({Error: err.sqlMessage});
        return res.json(data);
    });
});

export default router;