import express from 'express';
import db from '../db.js';

const router = express.Router();

// ==========================================
// 1. LOGIN (Tidak Berubah)
// ==========================================
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, data) => {
        if (err) return res.status(500).json({ Error: "Error Server" });
        if (data.length > 0) {
            if(password === data[0].password) {
                // KIRIM JUGA ID DAN USERNAME
                return res.json({ 
                    Status: "Success", 
                    role: data[0].role,
                    id: data[0].id,          // <--- Tambahan
                    username: data[0].username // <--- Tambahan
                });
            } else {
                return res.json({ Error: "Password salah" });
            }
        } else {
            return res.json({ Error: "Username tidak ditemukan" });
        }
    });
});

// ==========================================
// 2. REGISTER PUBLIK (Otomatis jadi USER)
// ==========================================
router.post('/register', (req, res) => {
    const { username, email, phone, password } = req.body;
    
    // HARDCODE role sebagai 'user'
    const sql = "INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, 'user')";
    
    db.query(sql, [username, email, phone, password], (err, result) => {
        if (err) {
            if(err.code === 'ER_DUP_ENTRY') return res.json({ Error: "Username/Email sudah ada." });
            return res.json({ Error: "Gagal daftar" });
        }
        return res.json({ Status: "Success" });
    });
});

// ==========================================
// 3. TAMBAH ADMIN (Khusus Halaman Pengaturan)
// ==========================================
router.post('/create-admin', (req, res) => {
    // Admin juga butuh email & phone karena di database kolom itu NOT NULL
    const { username, email, phone, password } = req.body;

    // HARDCODE role sebagai 'admin'
    const sql = "INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, 'admin')";

    db.query(sql, [username, email, phone, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ Error: "Gagal membuat admin" });
        }
        return res.json({ Status: "Success" });
    });
});

// ==========================================
// 4. GET ALL ADMINS (Untuk List di Pengaturan)
// ==========================================
router.get('/admins', (req, res) => {
    const sql = "SELECT * FROM users WHERE role = 'admin'";
    db.query(sql, (err, data) => {
        if(err) return res.json({Error: "Error ambil data"});
        return res.json(data);
    });
});

// ==========================================
// 5. HAPUS ADMIN
// ==========================================
router.delete('/delete-admin/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Gagal hapus"});
        return res.json({Status: "Success"});
    });
});

export default router;