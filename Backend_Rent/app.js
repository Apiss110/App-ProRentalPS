import express from "express";
import cors from "cors";

// --- ROUTES IMPORTS ---
import psRoutes from "./routes/ps.routes.js";
import packageRoutes from "./routes/package.routes.js";
import rentalRoutes from "./routes/rental.routes.js";
import authRoutes from "./routes/auth.routes.js"; // <--- TAMBAHAN 1: Import Auth
import customerRoutes from './routes/customer.routes.js';

import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// --- USE ROUTES ---
app.use("/ps", psRoutes);
app.use("/packages", packageRoutes);
app.use("/rentals", rentalRoutes);
app.use("/auth", authRoutes); // <--- TAMBAHAN 2: Pasang route auth
app.use('/customers', customerRoutes); // Pasang route

// SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// AUTO-FINISH RENTAL (cek tiap 1 menit)
setInterval(() => {
  db.query(
    `SELECT * FROM rentals 
     WHERE status = 'active' 
     AND end_time <= NOW()`,
    (err, rentals) => {
      if (err) return console.error(err);

      rentals.forEach((rental) => {
        // 1. Selesaikan rental
        db.query(
          "UPDATE rentals SET status = 'finished' WHERE id = ?",
          [rental.id],
          (err) => { if(err) console.error(err); }
        );

        // 2. Kembalikan status PS
        db.query(
          "UPDATE ps_units SET status = 'available' WHERE id = ?",
          [rental.ps_id],
          (err) => { if(err) console.error(err); }
        );

        console.log(`Rental ${rental.id} auto-finished`);
      });
    }
  );
}, 60000);