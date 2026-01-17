import { useEffect, useState } from "react";
import axios from "axios";

export default function RentalForm({ onRent }) {
  const [psList, setPsList] = useState([]);
  const [packages, setPackages] = useState([]);
  const [psId, setPsId] = useState("");
  const [rentalType, setRentalType] = useState("hourly");
  const [duration, setDuration] = useState(1);
  const [packageId, setPackageId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/ps").then(res => setPsList(res.data));
    axios.get("http://localhost:3000/packages").then(res => setPackages(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = rentalType === "hourly"
      ? { ps_id: psId, rental_type: "hourly", duration_hours: duration }
      : { ps_id: psId, rental_type: "package", package_id: packageId };

    axios.post("http://localhost:3000/rentals", body)
      .then(() => {
        alert("Rental berhasil dimulai!");
        onRent();
        setPsId("");
        setDuration(1);
        setPackageId("");
      })
      .catch(err => alert(err.response?.data?.message || "Error"));
  };

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Form Rental</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label>PS: </label>
          <select value={psId} onChange={e => setPsId(e.target.value)} required>
            <option value="">--Pilih PS--</option>
            {psList.filter(p => p.status === "available").map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.hourly_price}/jam)</option>
            ))}
          </select>
        </div>

        <div>
          <label>Jenis Sewa: </label>
          <select value={rentalType} onChange={e => setRentalType(e.target.value)}>
            <option value="hourly">Per Jam</option>
            <option value="package">Paket</option>
          </select>
        </div>

        {rentalType === "hourly" && (
          <div>
            <label>Durasi (jam): </label>
            <input type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
        )}

        {rentalType === "package" && (
          <div>
            <label>Paket: </label>
            <select value={packageId} onChange={e => setPackageId(e.target.value)} required>
              <option value="">--Pilih Paket--</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.duration_hours} jam - {p.price})
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" style={{ width: "120px", padding: "5px", borderRadius: "5px", backgroundColor: "#4CAF50", color: "white", fontWeight: "bold" }}>
          Sewa
        </button>
      </form>
    </div>
  );
}
