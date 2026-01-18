import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/admin.css';

function AdminDashboard() {
    const [rentals, setRentals] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAllData();

        const interval = setInterval(() => {
            loadAllData(true);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const loadAllData = (isSilent = false) => {
        if (!isSilent) setLoading(true);

        Promise.all([
            axios.get('http://localhost:3000/rentals'),
            axios.get('http://localhost:3000/ps'),
            axios.get('http://localhost:3000/customers')
        ])
        .then(([resRentals, resRooms, resUsers]) => {
            setRentals(resRentals.data || []);
            setRooms(resRooms.data || []);
            setUsers(resUsers.data || []);
            setLoading(false);
        })
        .catch(err => {
            console.error("Gagal load dashboard:", err);
            if (!isSilent) {
                setError("Gagal memuat data dashboard.");
                setLoading(false);
            }
        });
    };

    const totalIncome = rentals
        .filter(r => r.payment_status === 'paid')
        .reduce((acc, curr) => acc + (curr.total_price || 0), 0);

    const totalTransactions = rentals.length;
    const pendingCount = rentals.filter(r => r.payment_status === 'pending').length;

    const formatRupiah = (num) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

    if (loading) {
        return <div className="admin-loading">⏳ Sedang memuat Dashboard...</div>;
    }

    if (error) {
        return <div className="admin-error">❌ {error}</div>;
    }

    return (
        <div className="admin-wrapper">
            <h2 className="admin-title">DASHBOARD OVERVIEW</h2>

            {/* === STAT CARDS === */}
            <div className="stat-grid">
                <div className="stat-card income">
                    <span>Total Pendapatan</span>
                    <strong>{formatRupiah(totalIncome)}</strong>
                </div>

                <div className="stat-card transaction">
                    <div className="flex-between">
                        <span>Total Transaksi</span>
                        {pendingCount > 0 && (
                            <span className="badge">{pendingCount} Pending</span>
                        )}
                    </div>
                    <strong>{totalTransactions} <em>Booking</em></strong>
                </div>

                <div className="stat-card room">
                    <span>Unit Room</span>
                    <strong>{rooms.length} <em>Unit</em></strong>
                </div>

                <div className="stat-card user">
                    <span>Pelanggan Terdaftar</span>
                    <strong>{users.length || 0} <em>User</em></strong>
                </div>
            </div>

            {/* === RECENT ACTIVITY === */}
            <div className="panel">
                <h3 className="panel-title">Aktivitas Transaksi Terbaru</h3>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Room</th>
                            <th>Status</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.slice(0, 5).map(item => (
                            <tr key={item.id}>
                                <td>#{item.id}</td>
                                <td className="bold">{item.username || 'User Dihapus'}</td>
                                <td>{item.ps_name || '-'}</td>
                                <td>
                                    <span className={`status ${item.payment_status || 'unpaid'}`}>
                                        {(item.payment_status || 'unpaid').toUpperCase()}
                                    </span>
                                </td>
                                <td className="sub-text">{item.start_time_str || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {rentals.length === 0 && (
                    <p className="empty">Belum ada data transaksi.</p>
                )}

                <div className="panel-footer">
                    <Link to="/admin/transactions" className="panel-link">
                        Lihat Semua →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
