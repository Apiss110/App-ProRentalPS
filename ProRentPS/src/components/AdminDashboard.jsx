import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    // --- STATE DATA ---
    const [rentals, setRentals] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. LOAD DATA & AUTO REFRESH ---
    useEffect(() => {
        loadAllData(); // Load pertama kali

        // Auto Refresh setiap 10 detik
        const interval = setInterval(() => {
            loadAllData(true); // true = silent reload (tanpa loading spinner)
        }, 1000);

        return () => clearInterval(interval); // Bersihkan timer saat pindah halaman
    }, []);

    const loadAllData = (isSilent = false) => {
        if (!isSilent) setLoading(true);

        // Gunakan Promise.all agar semua data diambil bersamaan
        Promise.all([
            axios.get('http://localhost:3000/rentals'),
            axios.get('http://localhost:3000/ps'),
            axios.get('http://localhost:3000/customers') // Pastikan route customers ada
        ])
        .then(([resRentals, resRooms, resUsers]) => {
            setRentals(resRentals.data || []);
            setRooms(resRooms.data || []);
            setUsers(resUsers.data || []);
            setLoading(false);
        })
        .catch(err => {
            console.error("Gagal load dashboard:", err);
            // Jangan set Error jika silent reload, agar tampilan tidak kaget
            if (!isSilent) {
                setError("Gagal memuat data dashboard.");
                setLoading(false);
            }
        });
    };

    // --- 2. HITUNG STATISTIK (Frontend Calculation) ---
    // Hitung Total Pendapatan (Hanya yang status 'paid')
    const totalIncome = rentals
        .filter(r => r.payment_status === 'paid')
        .reduce((acc, curr) => acc + (curr.total_price || 0), 0);

    // Hitung Transaksi Masuk (Semua transaksi aktif)
    const totalTransactions = rentals.length;

    // Hitung Pending (Perlu Verifikasi)
    const pendingCount = rentals.filter(r => r.payment_status === 'pending').length;

    // Format Rupiah
    const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

    // --- 3. RENDER TAMPILAN (ANTI-BLANK) ---
    
    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>⏳ Sedang memuat Dashboard...</div>;
    }

    if (error) {
        return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>❌ {error}</div>;
    }

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '30px', color: '#333' }}>Dashboard Overview</h2>

            {/* --- KARTU STATISTIK --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                
                {/* CARD 1: PENDAPATAN */}
                <div style={{ background: '#28a745', color: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Pendapatan</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>
                        {formatRupiah(totalIncome)}
                    </div>
                </div>

                {/* CARD 2: TRANSAKSI */}
                <div style={{ background: '#dc3545', color: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <span style={{ fontSize: '14px', opacity: 0.9 }}>Total Transaksi</span>
                        {pendingCount > 0 && (
                            <span style={{ background:'white', color:'#dc3545', padding:'2px 8px', borderRadius:'10px', fontSize:'12px', fontWeight:'bold' }}>
                                {pendingCount} Pending
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>
                        {totalTransactions} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>Booking</span>
                    </div>
                </div>

                {/* CARD 3: ROOM */}
                <div style={{ background: '#17a2b8', color: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Unit Room</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>
                        {rooms.length} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>Unit</span>
                    </div>
                </div>

                {/* CARD 4: PELANGGAN */}
                <div style={{ background: '#ffc107', color: '#333', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>Pelanggan Terdaftar</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>
                        {users.length || 0} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>User</span>
                    </div>
                </div>
            </div>

            {/* --- TABEL AKTIVITAS TERBARU --- */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px', color: '#555' }}>Aktivitas Transaksi Terbaru</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#777' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>User</th>
                            <th style={{ padding: '10px' }}>Room</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px' }}>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.slice(0, 5).map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '12px' }}>#{item.id}</td>
                                <td style={{ padding: '12px', fontWeight:'bold' }}>{item.username || 'User Dihapus'}</td>
                                <td style={{ padding: '12px' }}>{item.ps_name || '-'}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold',
                                        color: 'white',
                                        background: item.payment_status === 'paid' ? '#28a745' : item.payment_status === 'pending' ? '#ffc107' : '#6c757d'
                                    }}>
                                        {item.payment_status ? item.payment_status.toUpperCase() : 'UNPAID'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', color:'#888', fontSize:'13px' }}>
                                    {item.start_time_str || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rentals.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Belum ada data transaksi.</p>}
                
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Link to="/admin/transactions" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Lihat Semua &rarr;</Link>
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;