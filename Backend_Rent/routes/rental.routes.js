import express from 'express';
import db from '../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; 

const router = express.Router();

// ==========================================
// 1. KONFIGURASI UPLOAD (MULTER)
// ==========================================
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
    console.log("Folder 'uploads' berhasil dibuat otomatis!");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        // Format: proof_TIMESTAMP.jpg
        cb(null, 'proof_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// ==========================================
// 2. DAFTAR ROUTES
// ==========================================

// --- ROUTE A: AMBIL SEMUA DATA (Untuk Dashboard Admin) ---
router.get('/', (req, res) => {
    // PENTING: Gunakan LEFT JOIN agar jika User/Room dihapus, transaksi tetap muncul di list
    const sql = `
        SELECT rentals.*, 
               ps_units.name as ps_name, 
               users.username,
               DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s') as start_time_str 
        FROM rentals 
        LEFT JOIN ps_units ON rentals.ps_id = ps_units.id
        LEFT JOIN users ON rentals.user_id = users.id
        ORDER BY rentals.id DESC
    `;
    db.query(sql, (err, data) => {
        if(err) return res.json({Error: err.sqlMessage});
        return res.json(data);
    });
});

// --- ROUTE B: BUAT TRANSAKSI BARU (Booking User) ---
router.post('/', (req, res) => {
    const { ps_id, user_id, duration, rental_type, total_price, booking_date, start_time } = req.body;
    const startDateTime = `${booking_date} ${start_time}:00`; 

    const sqlRent = `
        INSERT INTO rentals (ps_id, user_id, duration, rental_type, total_price, status, start_time, end_time, payment_status) 
        VALUES (?, ?, ?, ?, ?, 'active', ?, DATE_ADD(?, INTERVAL ? HOUR), 'unpaid')
    `;

    db.query(sqlRent, [ps_id, user_id, duration, rental_type, total_price, startDateTime, startDateTime, duration], (err, result) => {
        if(err) {
            console.error(err);
            return res.json({Error: "Gagal insert rental"});
        }
        // Update Status Room jadi 'in_use'
        db.query("UPDATE ps_units SET status = 'in_use' WHERE id = ?", [ps_id]);
        return res.json({Status: "Success", rentalId: result.insertId});
    });
});

// --- ROUTE C: AMBIL DETAIL SATU TRANSAKSI (LENGKAP) ---
router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    // Query ini mengambil data jam, tanggal, dan harga per jam secara terpisah
    const sql = `
        SELECT rentals.*, 
               ps_units.name as ps_name, 
               ps_units.price_per_hour, 
               users.username, users.email, users.phone,
               DATE_FORMAT(rentals.start_time, '%H:%i') as jam_mulai, 
               DATE_FORMAT(rentals.end_time, '%H:%i') as jam_selesai,
               DATE_FORMAT(rentals.start_time, '%Y-%m-%d') as tanggal_sewa
        FROM rentals 
        LEFT JOIN ps_units ON rentals.ps_id = ps_units.id
        LEFT JOIN users ON rentals.user_id = users.id
        WHERE rentals.id = ?
    `;
    db.query(sql, [id], (err, data) => {
        if(err) return res.json({Error: "Error SQL"});
        if(data.length > 0) return res.json(data[0]);
        return res.json(null); 
    });
});

// --- ROUTE D: UPDATE STATUS PEMBAYARAN MANUAL (Dari Halaman Detail) ---
router.put('/update-status/:id', (req, res) => {
    const sql = "UPDATE rentals SET payment_status = ? WHERE id = ?";
    db.query(sql, [req.body.status, req.params.id], (err, result) => {
        if(err) return res.json({Error: err.message});
        return res.json({Status: "Success"});
    });
});

// --- ROUTE E: AMBIL DATA LAPORAN (Filter Tanggal & Paid) ---
router.get('/reports', (req, res) => {
    const sql = `
        SELECT rentals.*, 
               ps_units.name as ps_name, 
               users.username,
               DATE_FORMAT(start_time, '%Y-%m-%d') as rental_date, 
               DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s') as start_time_str 
        FROM rentals 
        LEFT JOIN ps_units ON rentals.ps_id = ps_units.id
        LEFT JOIN users ON rentals.user_id = users.id
        WHERE rentals.payment_status = 'paid' 
        ORDER BY rentals.start_time DESC
    `;
    db.query(sql, (err, data) => {
        if(err) return res.json({Error: err.sqlMessage});
        return res.json(data);
    });
});

// --- ROUTE F: UPLOAD BUKTI BAYAR (User) ---
router.put('/pay/:id', upload.single('proof'), (req, res) => {
    const id = req.params.id;
    const method = req.body.payment_method;
    const filename = req.file ? req.file.filename : null; 

    const sql = "UPDATE rentals SET payment_method = ?, payment_proof = ?, payment_status = 'pending' WHERE id = ?";
    db.query(sql, [method, filename, id], (err, result) => {
        if(err) return res.json({Error: "Gagal upload bukti"});
        return res.json({Status: "Success"});
    });
});

// --- ROUTE G: VERIFIKASI ADMIN (Terima/Tolak) ---
router.put('/verify/:id', (req, res) => {
    const id = req.params.id;
    const action = req.body.action; // 'accept' atau 'reject'
    let newStatus = action === 'accept' ? 'paid' : 'rejected';
    
    const sql = "UPDATE rentals SET payment_status = ? WHERE id = ?";
    db.query(sql, [newStatus, id], (err) => {
        if(err) return res.json({Error: "Gagal verifikasi"});
        return res.json({Status: "Success"});
    });
});

// --- ROUTE H: STOP RENTAL MANUAL (Selesai Main) ---
router.put('/finish/:id', (req, res) => {
    const id = req.params.id;
    const ps_id = req.body.ps_id;
    
    // Set rental finish
    db.query("UPDATE rentals SET status='finished', end_time=NOW() WHERE id=?", [id], (err) => {
        // Set Room available lagi
        db.query("UPDATE ps_units SET status='available' WHERE id=?", [ps_id]);
        return res.json({Status: "Success"});
    });
});

export default router;