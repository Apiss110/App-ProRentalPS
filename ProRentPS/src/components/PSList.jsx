import { useEffect, useState } from "react";
import axios from "axios";

export default function PSList() {
  const [psList, setPsList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/ps")
      .then(res => setPsList(res.data))
      .catch(err => console.error(err));
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case "available": return "green";
      case "rented": return "red";
      case "maintenance": return "orange";
      default: return "gray";
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Daftar PS</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#eee" }}>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Status</th>
            <th>Harga / jam</th>
          </tr>
        </thead>
        <tbody>
          {psList.map(ps => (
            <tr key={ps.id}>
              <td>{ps.id}</td>
              <td>{ps.name}</td>
              <td style={{ color: getStatusColor(ps.status), fontWeight: "bold" }}>
                {ps.status}
              </td>
              <td>{ps.hourly_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
