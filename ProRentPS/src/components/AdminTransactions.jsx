import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    
    // Default: Hari ini
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [filterDate, setFilterDate] = useState(getTodayString());

    useEffect(() => {
        loadTransactions();
        const interval = setInterval(loadTransactions, 2000); 
        return () => clearInterval(interval);
    }, []);

    const loadTransactions = () => {
        axios.get('http://localhost:3000/rentals')
            .then(res => setTransactions(res.data))
            .catch(err => console.error(err));
    };

    const filteredTransactions = transactions.filter(item => {
        if (!filterDate) return true;
        if (item.start_time_str) {
            return item.start_time_str.startsWith(filterDate);
        }
        return false;
    });

    // --- FUNGSI STOP MANUAL ---
    const handleManualFinish = (id) => {
        if(window.confirm("Yakin ingin menyelesaikan sewa ini sekarang? Slot akan langsung dibuka.")) {
            axios.put(`http://localhost:3000/rentals/finish/${id}`)
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert("Sewa berhasil dihentikan!");
                        loadTransactions(); 
                    } else {
                        alert("Gagal update");
                    }
                })
                .catch(err => console.error(err));
        }
    };

    const handleVerify = (id, action) => {
        const msg = action === 'accept' ? "Yakin ingin MENYETUJUI?" : "Yakin ingin MENOLAK?";
        if (window.confirm(msg)) {
            axios.put(`http://localhost:3000/rentals/verify/${id}`, { action })
                .then(res => {
                    if (res.data.Status === "Success") {
                        loadTransactions();
                    } else {
                        alert("Gagal: " + res.data.Error);
                    }
                });
        }
    };

    const handleViewProof = (file) => {
        if (file) window.open(`http://localhost:3000/uploads/${file}`, '_blank');
        else alert("Tidak ada bukti upload.");
    };

    const formatRupiah = (num) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

    return (
        <div className="admin-page">
            <style>{`
                .admin-page { padding:30px; font-family:sans-serif; }
                .admin-header { margin-bottom:20px; color:#333; }
                .admin-card { background:white; padding:20px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px; }
                .admin-card.dark { background:#333; color:white; }
                .filter-bar { display:flex; gap:15px; align-items:center; }
                .admin-table { width:100%; border-collapse:collapse; }
                .admin-table th, .admin-table td { padding:12px; border-bottom:1px solid #eee; text-align:left; }

                /* --- BADGE STATUS (KONTRAS TINGGI) --- */
                .status { 
                    padding: 8px 12px; 
                    border-radius: 6px; 
                    font-weight: 900; /* Dibuat sangat tebal agar jelas */
                    font-size: 11px; 
                    display: inline-block; 
                    text-align: center; 
                    min-width: 90px; 
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                /* LUNAS: Latar Hijau, Teks Putih (Kontras Tinggi) */
                .status.success { 
                    background-color: #198754; 
                    color: #ffffff !important; 
                    border: 1px solid #146c43;
                }

                /* MENUNGGU: Latar Kuning, Teks Hitam (Kontras Jauh Lebih Jelas) */
                .status.warning { 
                    background-color: #ffc107; 
                    color: #212529 !important; /* Teks Hitam agar terbaca jelas */
                    border: 1px solid #d3a006;
                }

                .status.danger { background-color: #dc3545; color: #ffffff !important; }
                .status.neutral { background-color: #6c757d; color: #ffffff !important; }

                /* BUTTONS */
                .btn-primary { background:#007bff; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; }
                .btn-success { background:#28a745; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; }
                .btn-danger { background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; }
                .btn-warning { background:#ffc107; color:black; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-weight:bold; }
                .btn-secondary { background:#666; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; }
                .action-group { display:flex; gap:5px; }
            `}</style>

            <div className="admin-header">
                <h2>Transaksi & Laporan</h2>
                <p>Monitoring dan verifikasi transaksi pelanggan</p>
            </div>

            <div className="admin-card dark filter-bar">
                <div className="filter-group">
                    <label style={{marginRight:10}}>Pilih Tanggal</label>
                    <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{padding:5, borderRadius:4}}/>
                </div>
                <button className="btn-secondary" onClick={() => setFilterDate('')}>Tampilkan Semua</button>
                <div style={{marginLeft:'auto'}}>Total: <strong>{filteredTransactions.length}</strong></div>
            </div>

            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Waktu</th><th>User</th><th>Room</th><th>Total</th><th>Metode</th><th>Status</th><th>Bukti</th><th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(item => (
                                <tr key={item.id}>
                                    <td>#{item.id}</td>
                                    <td>{item.start_time_str ? item.start_time_str.split(' ')[1] : '-'}</td>
                                    <td>{item.username}</td>
                                    <td>{item.ps_name}</td>
                                    <td>{formatRupiah(item.total_price)}</td>
                                    <td>{item.payment_method || '-'}</td>
                                    <td>
                                        {/* STATUS BADGES */}
                                        {item.payment_status === 'paid' && <span className="status success">LUNAS</span>}
                                        {item.payment_status === 'pending' && <span className="status warning">MENUNGGU</span>}
                                        {item.payment_status === 'rejected' && <span className="status danger">DITOLAK</span>}
                                        {item.payment_status === 'unpaid' && <span className="status neutral">BELUM</span>}
                                    </td>
                                    <td>
                                        {item.payment_proof ? <button className="btn-primary" onClick={() => handleViewProof(item.payment_proof)}>Lihat</button> : '-'}
                                    </td>
                                    <td>
                                        {item.payment_status === 'paid' ? (
                                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                                {/* TOMBOL STOP MANUAL */}
                                                {item.status !== 'finished' ? (
                                                    <button className="btn-warning" onClick={() => handleManualFinish(item.id)}>Stop</button>
                                                ) : (
                                                    <span style={{color:'#888', fontSize:11}}>(Selesai)</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="action-group">
                                                <button className="btn-success" onClick={() => handleVerify(item.id, 'accept')}>✔</button>
                                                <button className="btn-danger" onClick={() => handleVerify(item.id, 'reject')}>✖</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="9" style={{textAlign:'center', padding:20, color:'#888'}}>Tidak ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTransactions;