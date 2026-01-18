import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminReports() {
    const [reports, setReports] = useState([]);
    
    // --- 1. SETUP TANGGAL (HARI INI - LOKAL TIME) ---
    // Fungsi ini memastikan tanggal sesuai jam laptop (bukan jam server UTC)
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Default: Hari ini
    const [selectedDate, setSelectedDate] = useState(getTodayString());

    // --- 2. LOAD DATA & AUTO REFRESH ---
    useEffect(() => {
        loadReports();

        // Refresh data setiap 5 detik agar laporan live
        const interval = setInterval(() => {
            loadReports();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadReports = () => {
        // Mengambil data khusus laporan (biasanya yang status='paid')
        axios.get('http://localhost:3000/rentals/reports')
            .then(res => setReports(res.data))
            .catch(err => console.error(err));
    };

    // --- 3. LOGIKA FILTER ---
    const filteredData = reports.filter(item => {
        // Jika filter tanggal kosong, tampilkan semua (Total Seumur Hidup)
        if (!selectedDate) return true;

        // Backend mengirim 'rental_date' (YYYY-MM-DD). Kita bandingkan langsung.
        // Jika backend tidak mengirim rental_date, kita ambil dari start_time_str
        const itemDate = item.rental_date || (item.start_time_str ? item.start_time_str.split(' ')[0] : '');
        
        return itemDate === selectedDate;
    });

    // Hitung Total Uang
    const totalRevenue = filteredData.reduce((acc, curr) => acc + (curr.total_price || 0), 0);

    const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>Laporan Keuangan</h2>
                
                {/* FILTER TANGGAL */}
                <div style={{ background: 'white', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>Pilih Tanggal:</label>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button 
                        onClick={() => setSelectedDate('')} // Kosongkan untuk lihat semua
                        style={{ background: '#333', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                        Tampilkan Semua
                    </button>
                </div>
            </div>

            {/* KARTU TOTAL */}
            <div style={{ background: '#cc0000', color: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(204,0,0,0.3)' }}>
                <div>
                    <h4 style={{ margin: '0 0 5px 0', opacity: 0.9, fontSize: '16px' }}>
                        {selectedDate ? `Pendapatan Tanggal ${selectedDate}` : 'Total Pendapatan Seumur Hidup'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>
                        {filteredData.length} Transaksi Selesai (Lunas)
                    </p>
                </div>
                <h1 style={{ margin: 0, fontSize: '42px' }}>{formatRupiah(totalRevenue)}</h1>
            </div>

            {/* TABEL DATA */}
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', color: '#666', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '15px' }}>Jam Main</th>
                            <th style={{ padding: '15px' }}>Pelanggan</th>
                            <th style={{ padding: '15px' }}>Room</th>
                            <th style={{ padding: '15px' }}>Durasi</th>
                            <th style={{ padding: '15px' }}>Metode Bayar</th>
                            <th style={{ padding: '15px' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '15px' }}>
                                        {/* Ambil Jam saja dari start_time_str (format: YYYY-MM-DD HH:mm:ss) */}
                                        {item.start_time_str ? item.start_time_str.split(' ')[1] : '-'}
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.username}</td>
                                    <td style={{ padding: '15px' }}>{item.ps_name}</td>
                                    <td style={{ padding: '15px' }}>{item.duration} Jam</td>
                                    <td style={{ padding: '15px' }}>{item.payment_method}</td>
                                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#28a745' }}>
                                        {formatRupiah(item.total_price)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                                    Tidak ada data transaksi lunas pada tanggal ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminReports;