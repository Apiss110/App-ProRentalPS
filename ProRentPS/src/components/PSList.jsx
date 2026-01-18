import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PSList = () => {
  const [psList, setPsList] = useState([]);

  useEffect(() => {
    // Ambil data dari backend
    axios.get('http://localhost:3000/ps')
      .then((response) => {
        setPsList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Fungsi Format Rupiah
  const formatRupiah = (number) => {
      return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0
      }).format(number);
  };

  return (
    <div style={{marginTop: '20px'}}>
      <h3>Daftar PS</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
            <th>ID</th>
            <th>Room</th>
            <th>Status</th>
            <th>Harga / jam</th>
          </tr>
        </thead>
        <tbody>
          {psList.map((val) => {
             // Tentukan warna status
             const statusColor = val.status === 'available' ? 'green' : 'red';
             
             return (
              <tr key={val.id}>
                <td>{val.id}</td>
                <td>{val.name}</td>
                <td style={{ color: statusColor, fontWeight: 'bold' }}>
                    {val.status}
                </td>
                <td>
                    {/* PERBAIKAN DISINI: Menggunakan val.price_per_hour */}
                    {formatRupiah(val.price_per_hour)} 
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PSList;