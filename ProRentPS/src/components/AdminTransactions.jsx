import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = () => {
        // Ambil data dari route yang baru kita buat
        axios.get('http://localhost:3000/rentals') 
            .then(res => setTransactions(res.data))
            .catch(err => console.error(err));
    };

    // Fungsi untuk memberhentikan sewa secara paksa
    const handleStop = (rentalId, psId) => {
        if(window.confirm("Yakin ingin memberhentikan rental ini? Status PS akan menjadi Available.")) {
            axios.put(`http://localhost:3000/rentals/finish/${rentalId}`, { ps_id: psId })
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert("Rental berhasil dihentikan!");
                        loadTransactions(); // Refresh tabel
                    } else {
                        alert("Gagal update");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    // Helper: Format Rupiah
    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
    };

    // Helper: Format Tanggal
    const formatDate = (dateString) => {
        if(!dateString) return "-";
        return new Date(dateString).toLocaleString('id-ID'); // Format tanggal Indonesia
    };

    return (
        <div style={{color: 'white'}}>
            <h2 style={{marginBottom:'20px', color:'black'}}>Data Transaksi</h2>

            <div style={{overflowX:'auto'}}>
                <table style={{width:'100%', borderCollapse:'collapse', background:'#1e1e1e', color:'white', borderRadius:'8px', overflow:'hidden'}}>
                    <thead>
                        <tr style={{background:'#cc0000', color:'white'}}>
                            <th style={{padding:'12px', textAlign:'left'}}>ID</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Penyewa</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Unit PS</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Durasi</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Total Harga</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Waktu Mulai</th>
                            <th style={{padding:'12px', textAlign:'center'}}>Status</th>
                            <th style={{padding:'12px', textAlign:'center'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t, index) => (
                            <tr key={index} style={{borderBottom:'1px solid #333'}}>
                                <td style={{padding:'12px'}}>{t.id}</td>
                                <td style={{padding:'12px', fontWeight:'bold', color:'#4db8ff'}}>{t.username}</td>
                                <td style={{padding:'12px'}}>{t.ps_name}</td>
                                <td style={{padding:'12px'}}>{t.duration} Jam</td>
                                <td style={{padding:'12px', color:'#00ff00', fontWeight:'bold'}}>{formatRupiah(t.total_price)}</td>
                                <td style={{padding:'12px', fontSize:'13px'}}>{formatDate(t.start_time)}</td>
                                <td style={{padding:'12px', textAlign:'center'}}>
                                    {t.status === 'active' ? 
                                        <span style={{background:'green', padding:'4px 8px', borderRadius:'4px', fontSize:'12px', fontWeight:'bold'}}>AKTIF</span> 
                                        : 
                                        <span style={{background:'#555', padding:'4px 8px', borderRadius:'4px', fontSize:'12px'}}>SELESAI</span>
                                    }
                                </td>
                                <td style={{padding:'12px', textAlign:'center'}}>
                                    {t.status === 'active' && (
                                        <button onClick={() => handleStop(t.id, t.ps_id)} style={{background:'#ff9800', color:'black', border:'none', padding:'6px 12px', cursor:'pointer', borderRadius:'4px', fontWeight:'bold'}}>
                                            STOP
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="8" style={{padding:'20px', textAlign:'center', color:'#aaa'}}>
                                    Belum ada data transaksi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTransactions;