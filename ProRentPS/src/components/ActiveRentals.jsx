import { useEffect, useState } from "react";
import axios from "axios";

export default function ActiveRentals({ refresh }) {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = () => {
      axios.get("http://localhost:3000/rentals/active")
        .then(res => setRentals(res.data))
        .catch(err => console.error(err));
    };

    fetchRentals();
    const interval = setInterval(fetchRentals, 10000); // update tiap 10 detik
    return () => clearInterval(interval);
  }, [refresh]);

  const getCountdownColor = (diff) => {
    if(diff <= 300) return "red";       // < 5 menit → merah
    if(diff <= 900) return "orange";    // < 15 menit → orange
    return "green";                      // lain → hijau
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Rental Aktif</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#eee" }}>
          <tr>
            <th>ID</th>
            <th>PS</th>
            <th>Jenis</th>
            <th>Total Harga</th>
            <th>Sisa Waktu</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map(r => {
            const now = new Date();
            const end = new Date(r.end_time);
            const diff = Math.max(0, Math.floor((end - now) / 1000));
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;

            return (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.ps_name}</td>
                <td>{r.rental_type}</td>
                <td>{r.total_price}</td>
                <td style={{ color: getCountdownColor(diff), fontWeight: "bold" }}>
                  {`${hours}h ${minutes}m ${seconds}s`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
