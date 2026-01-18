import express from 'express';
import db from '../db.js';

const router = express.Router();

// 1. AMBIL SEMUA DATA ROOM
router.get('/', (req, res) => {
    const sql = "SELECT * FROM ps_units ORDER BY id ASC";
    db.query(sql, (err, data) => {
        if(err) {
            console.error("Error GET Room:", err);
            return res.json({Error: err.sqlMessage});
        }
        return res.json(data);
    });
});

// 2. TAMBAH ROOM BARU
router.post('/', (req, res) => {
    const { name, price_per_hour, capacity } = req.body;
    
    // Pastikan query insert sesuai dengan nama kolom di database Anda
    const sql = "INSERT INTO ps_units (name, price_per_hour, capacity, status) VALUES (?, ?, ?, 'available')";
    
    db.query(sql, [name, price_per_hour, capacity], (err, result) => {
        if(err) {
            console.error("Error INSERT Room:", err); // Cek terminal jika error
            return res.json({Error: err.sqlMessage || "Gagal menambah room"}); // Kirim pesan asli ke frontend
        }
        return res.json({Status: "Success"});
    });
});

// 3. EDIT ROOM
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name, price_per_hour, capacity } = req.body;
    const sql = "UPDATE ps_units SET name=?, price_per_hour=?, capacity=? WHERE id=?";
    
    db.query(sql, [name, price_per_hour, capacity, id], (err, result) => {
        if(err) {
            console.error("Error UPDATE Room:", err);
            return res.json({Error: err.sqlMessage});
        }
        return res.json({Status: "Success"});
    });
});

// 4. HAPUS ROOM
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM ps_units WHERE id=?";
    
    db.query(sql, [id], (err, result) => {
        if(err) {
            console.error("Error DELETE Room:", err);
            return res.json({Error: err.sqlMessage});
        }
        return res.json({Status: "Success"});
    });
});

export default router;