import express from "express";
import db from "../db.js";

const router = express.Router();

// GET ALL PS
router.get("/", (req, res) => {
  db.query("SELECT * FROM ps_units", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

export default router;
