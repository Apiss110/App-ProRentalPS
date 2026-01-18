import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/admin.css';

function AdminReports() {
    const [reports, setReports] = useState([]);

    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [selectedDate, setSelectedDate] = useState(getTodayString());

    useEffect(() => {
        loadReports();
        const interval = setInterval(loadReports, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadReports = () => {
        axios.get('http://localhost:3000/rentals/reports')
            .then(res => setReports(res.data))
            .catch(err => console.error(err));
    };

    const filteredData = reports.filter(item => {
        if (!selectedDate) return true;
        const itemDate = item.rental_date || (item.start_time_str ? item.start_time_str.split(' ')[0] : '');
        return itemDate === selectedDate;
    });

    const totalRevenue = filteredData.reduce((acc, curr) => acc + (curr.total_price || 0), 0);

    const formatRupiah = (num) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(num);

    return (
        <div className="admin-page">

            {/* HEADER */}
            <div className="report-header">
                <h2>Laporan Keuangan</h2>

                <div className="report-filter">
                    <label>Pilih Tanggal:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button onClick={() => setSelectedDate('')}>
                        Semua
                    </button>
                </div>
            </div>

            {/* TOTAL CARD */}
            <div className="report-total-card">
                <div>
                    <h4>
                        {selectedDate
                            ? `Pendapatan Tanggal ${selectedDate}`
                            : 'Total Pendapatan Seumur Hidup'}
                    </h4>
                    <p>{filteredData.length} Transaksi Lunas</p>
                </div>
                <h1>{formatRupiah(totalRevenue)}</h1>
            </div>

            {/* TABLE */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Jam</th>
                            <th>Pelanggan</th>
                            <th>Room</th>
                            <th>Durasi</th>
                            <th>Metode</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.start_time_str ? item.start_time_str.split(' ')[1] : '-'}</td>
                                    <td className="bold">{item.username}</td>
                                    <td>{item.ps_name}</td>
                                    <td>{item.duration} Jam</td>
                                    <td>{item.payment_method}</td>
                                    <td className="price">{formatRupiah(item.total_price)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-table">
                                    Tidak ada transaksi lunas.
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
