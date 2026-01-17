import express from "express";
import db from "../db.js";

const router = express.Router();

// ========================
// GET semua rental
// ========================
router.get("/", (req, res) => {
  db.query(
    `SELECT r.*, p.name AS ps_name 
     FROM rentals r 
     JOIN ps_units p ON r.ps_id = p.id`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// ========================
// GET rental aktif
// ========================
router.get("/active", (req, res) => {
  db.query(
    `SELECT r.*, p.name AS ps_name
     FROM rentals r
     JOIN ps_units p ON r.ps_id = p.id
     WHERE r.status = 'active'`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// ========================
// POST rental baru
// ========================
router.post("/", (req, res) => {
  const { ps_id, rental_type, duration_hours, package_id } = req.body;

  db.query(
    "SELECT * FROM ps_units WHERE id = ? AND status = 'available'",
    [ps_id],
    (err, psResult) => {
      if (err) return res.status(500).json(err);
      if (psResult.length === 0)
        return res.status(400).json({ message: "PS tidak tersedia" });

      const startTime = new Date();
      let endTime;
      let totalPrice;

      if (rental_type === "hourly") {
        endTime = new Date(startTime.getTime() + duration_hours * 60 * 60 * 1000);
        totalPrice = duration_hours * psResult[0].hourly_price;
        insertRental(ps_id, null, rental_type, startTime, endTime, totalPrice, res);
      } else if (rental_type === "package") {
        db.query(
          "SELECT * FROM packages WHERE id = ?",
          [package_id],
          (err, pkgResult) => {
            if (err) return res.status(500).json(err);
            if (pkgResult.length === 0)
              return res.status(400).json({ message: "Paket tidak ditemukan" });

            endTime = new Date(
              startTime.getTime() + pkgResult[0].duration_hours * 60 * 60 * 1000
            );
            totalPrice = pkgResult[0].price;

            insertRental(ps_id, package_id, rental_type, startTime, endTime, totalPrice, res);
          }
        );
      }
    }
  );
});

// ========================
// Fungsi bantu insert rental
// ========================
function insertRental(ps_id, package_id, type, start, end, price, res) {
  const startSQL = start.toISOString().slice(0, 19).replace("T", " ");
  const endSQL = end.toISOString().slice(0, 19).replace("T", " ");

  db.query(
    `INSERT INTO rentals 
     (ps_id, package_id, rental_type, start_time, end_time, total_price)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [ps_id, package_id, type, startSQL, endSQL, price],
    (err) => {
      if (err) return res.status(500).json(err);

      db.query(
        "UPDATE ps_units SET status = 'rented' WHERE id = ?",
        [ps_id],
        (err) => { if(err) console.error(err); }
      );

      res.json({ message: "Rental berhasil dimulai" });
    }
  );
}

export default router;
