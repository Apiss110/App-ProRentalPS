import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    
    // --- 1. SETUP TANGGAL (DEFAULT HARI INI) ---
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // State untuk filter tanggal
    const [filterDate, setFilterDate] = useState(getTodayString());

    useEffect(() => {
        loadTransactions();

        // Auto refresh setiap 1 detik (sesuai kode Anda sebelumnya)
        const interval = setInterval(() => {
            loadTransactions();
        }, 1000); 

        return () => clearInterval(interval);
    }, []);

    const loadTransactions = () => {
        axios.get('http://localhost:3000/rentals')
            .then(res => setTransactions(res.data))
            .catch(err => console.error(err));
    };

    // --- 2. LOGIKA FILTERING ---
    const filteredTransactions = transactions.filter(item => {
        // Jika filter tanggal kosong, tampilkan semua
        if (!filterDate) return true;
        
        // Cek apakah data memiliki start_time_str (dari backend)
        if (item.start_time_str) {
            // Bandingkan apakah string tanggal di database (YYYY-MM-DD HH:mm:ss) 
            // diawali dengan tanggal yang dipilih (YYYY-MM-DD)
            return item.start_time_str.startsWith(filterDate);
        }
        return false;
    });

    const handleVerify = (id, action) => {
        const confirmMsg = action === 'accept' ? "Yakin ingin MENYETUJUI transaksi ini?" : "Yakin ingin MENOLAK transaksi ini?";
        if(window.confirm(confirmMsg)) {
            axios.put(`http://localhost:3000/rentals/verify/${id}`, { action })
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert(`Berhasil ${action === 'accept' ? 'Disetujui' : 'Ditolak'}!`);
                        loadTransactions(); 
                    } else {
                        alert("Gagal: " + res.data.Error);
                    }
                })
                .catch(err => alert("Error Server"));
        }
    };

    const handleViewProof = (filename) => {
        if(filename) {
            window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
        } else {
            alert("Tidak ada bukti upload.");
        }
    };

    const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '20px', color: '#eee' }}>Data Transaksi & Laporan</h2>

            {/* --- 3. UI FILTER TANGGAL --- */}
            <div style={{ background: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #444' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>Pilih Tanggal:</label>
                    <input 
                        type="date" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        // Tidak ada min/max, jadi bisa pilih tanggal berapapun (sebelum/sesudah)
                        style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', outline: 'none' }}
                    />
                </div>

                <div style={{ marginTop: '18px' }}>
                    <button 
                        onClick={() => setFilterDate('')} // Kosongkan filter untuk lihat semua
                        style={{ background: '#555', color: 'white', border: '1px solid #666', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                    >
                        Tampilkan Semua
                    </button>
                </div>

                <div style={{ marginLeft: 'auto', color: '#ccc', fontSize: '14px' }}>
                    Total Data: <strong>{filteredTransactions.length}</strong>
                </div>
            </div>

            <div style={{ overflowX: 'auto', background: '#222', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', border: '1px solid #444' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ddd' }}>
                    <thead>
                        <tr style={{ background: '#333', textAlign: 'left', borderBottom: '2px solid #555' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Waktu Main</th> {/* Kolom Tambahan agar jelas tanggalnya */}
                            <th style={{ padding: '15px' }}>Pelanggan</th>
                            <th style={{ padding: '15px' }}>Room</th>
                            <th style={{ padding: '15px' }}>Total Harga</th>
                            <th style={{ padding: '15px' }}>Metode</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Bukti</th>
                            <th style={{ padding: '15px' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* GUNAKAN filteredTransactions DI SINI */}
                        {filteredTransactions.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #444' }}>
                                <td style={{ padding: '15px' }}>{item.id}</td>
                                <td style={{ padding: '15px', fontSize: '13px', color:'#aaa' }}>
                                    {item.start_time_str || '-'}
                                </td>
                                <td style={{ padding: '15px' }}>{item.username || <span style={{color:'red'}}>(Dihapus)</span>}</td>
                                <td style={{ padding: '15px' }}>{item.ps_name || <span style={{color:'red'}}>(Dihapus)</span>}</td>
                                <td style={{ padding: '15px' }}>{formatRupiah(item.total_price)}</td>
                                <td style={{ padding: '15px', fontStyle: item.payment_method ? 'normal' : 'italic', color: item.payment_method ? '#fff' : '#888' }}>
                                    {item.payment_method || 'Belum memilih'}
                                </td>
                                
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>
                                    {item.payment_status === 'paid' && <span style={{color: '#28a745'}}>BERHASIL</span>}
                                    {item.payment_status === 'rejected' && <span style={{color: '#dc3545'}}>DITOLAK</span>}
                                    {item.payment_status === 'pending' && <span style={{color: '#ffc107'}}>MENUNGGU</span>}
                                    {item.payment_status === 'unpaid' && <span style={{color: '#6c757d'}}>BELUM BAYAR</span>}
                                </td>

                                <td style={{ padding: '15px' }}>
                                    {item.payment_proof ? (
                                        <button 
                                            onClick={() => handleViewProof(item.payment_proof)}
                                            style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize:'12px' }}
                                        >
                                            Lihat
                                        </button>
                                    ) : (
                                        <span style={{ fontSize:'12px', color:'#888', fontStyle:'italic' }}>Tidak ada</span>
                                    )}
                                </td>

                                <td style={{ padding: '15px' }}>
                                    {item.payment_status === 'paid' ? (
                                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>Selesai</span>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button 
                                                onClick={() => handleVerify(item.id, 'accept')}
                                                style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize:'12px' }}
                                            >
                                                Setujui
                                            </button>
                                            <button 
                                                onClick={() => handleVerify(item.id, 'reject')}
                                                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize:'12px' }}
                                            >
                                                Tolak
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                        Tidak ada data transaksi pada tanggal <strong>{filterDate || 'Semua'}</strong>.
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminTransactions;