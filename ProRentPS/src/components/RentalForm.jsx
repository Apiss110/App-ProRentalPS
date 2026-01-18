import React, { useState, useEffect } from "react";
import axios from "axios";

function RentalForm({ onRent }) {
  const [psUnits, setPsUnits] = useState([]);
  const [selectedPS, setSelectedPS] = useState("");
  const [duration, setDuration] = useState(1);
  const [rentalType, setRentalType] = useState("Per Jam");

  useEffect(() => {
    // Ambil data PS untuk dropdown
    axios.get("http://localhost:3000/ps")
      .then((res) => setPsUnits(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleRent = (e) => {
    e.preventDefault();
    
    // Ambil ID User dari LocalStorage
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
        alert("Sesi habis. Silakan Logout dan Login ulang.");
        return;
    }
    if (!selectedPS) return alert("Pilih PS dulu!");

    const unit = psUnits.find((u) => u.id === parseInt(selectedPS));
    const price = unit ? unit.price_per_hour : 0; 
    const totalPrice = price * duration;

    axios.post("http://localhost:3000/rentals", {
      ps_id: selectedPS,
      user_id: userId, // <--- KIRIM ID USER
      duration: duration,
      rental_type: rentalType,
      total_price: totalPrice
    })
    .then((res) => {
      if(res.data.Status === "Success") {
          alert("Rental Berhasil! Selamat bermain.");
          if (onRent) onRent(); 
      } else {
          alert("Gagal: " + res.data.Error);
      }
    })
    .catch((err) => console.error(err));
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", maxWidth: "400px" }}>
      <h3>Form Rental</h3>
      <form onSubmit={handleRent}>
        <div style={{ marginBottom: "10px" }}>
          <label>PS: </label>
          <select 
            value={selectedPS} 
            onChange={(e) => setSelectedPS(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="">--Pilih PS--</option>
            {psUnits.map((ps) => (
              <option key={ps.id} value={ps.id} disabled={ps.status !== 'available'}>
                {ps.name} ({ps.status}) - Rp {ps.price_per_hour}/jam
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Durasi (jam): </label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ marginLeft: "10px", width: "50px", padding: "5px" }}
          />
        </div>

        <button type="submit" style={{ background: "green", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}>
          Sewa Sekarang
        </button>
      </form>
    </div>
  );
}

export default RentalForm;