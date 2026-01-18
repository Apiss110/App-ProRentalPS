import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);

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
        const interval = setInterval(loadTransactions, 1000);
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

    const handleVerify = (id, action) => {
        const msg = action === 'accept'
            ? "Yakin ingin MENYETUJUI transaksi ini?"
            : "Yakin ingin MENOLAK transaksi ini?";
        if (window.confirm(msg)) {
            axios.put(`http://localhost:3000/rentals/verify/${id}`, { action })
                .then(res => {
                    if (res.data.Status === "Success") {
                        alert("Berhasil!");
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
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(num);

    return (
        <div className="admin-page">

            {/* HEADER */}
            <div className="admin-header">
                <h2>Transaksi & Laporan</h2>
                <p>Monitoring dan verifikasi transaksi pelanggan</p>
            </div>

            {/* FILTER */}
            <div className="admin-card dark filter-bar">
                <div className="filter-group">
                    <label>Pilih Tanggal</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                    />
                </div>

                <button
                    className="btn-secondary"
                    onClick={() => setFilterDate('')}
                >
                    Tampilkan Semua
                </button>

                <div className="filter-info">
                    Total Data: <strong>{filteredTransactions.length}</strong>
                </div>
            </div>

            {/* TABLE */}
            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Waktu Main</th>
                            <th>Pelanggan</th>
                            <th>Room</th>
                            <th>Total</th>
                            <th>Metode</th>
                            <th>Status</th>
                            <th>Bukti</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(item => (
                                <tr key={item.id}>
                                    <td>#{item.id}</td>
                                    <td className="muted">{item.start_time_str || '-'}</td>
                                    <td>{item.username || <span className="deleted">(Dihapus)</span>}</td>
                                    <td>{item.ps_name || <span className="deleted">(Dihapus)</span>}</td>
                                    <td>{formatRupiah(item.total_price)}</td>
                                    <td className={!item.payment_method ? 'muted italic' : ''}>
                                        {item.payment_method || 'Belum memilih'}
                                    </td>
                                    <td>
                                        {item.payment_status === 'paid' && <span className="status success">BERHASIL</span>}
                                        {item.payment_status === 'pending' && <span className="status warning">MENUNGGU</span>}
                                        {item.payment_status === 'rejected' && <span className="status danger">DITOLAK</span>}
                                        {item.payment_status === 'unpaid' && <span className="status neutral">BELUM BAYAR</span>}
                                    </td>
                                    <td>
                                        {item.payment_proof ? (
                                            <button
                                                className="btn-primary small"
                                                onClick={() => handleViewProof(item.payment_proof)}
                                            >
                                                Lihat
                                            </button>
                                        ) : (
                                            <span className="muted italic">Tidak ada</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.payment_status === 'paid' ? (
                                            <span className="status success">Selesai</span>
                                        ) : (
                                            <div className="action-group">
                                                <button
                                                    className="btn-success small"
                                                    onClick={() => handleVerify(item.id, 'accept')}
                                                >
                                                    Setujui
                                                </button>
                                                <button
                                                    className="btn-danger small"
                                                    onClick={() => handleVerify(item.id, 'reject')}
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="empty">
                                    Tidak ada data transaksi.
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
