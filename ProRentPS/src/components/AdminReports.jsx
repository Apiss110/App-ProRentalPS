import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminReports() {
    const [reports, setReports] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:3000/rentals/reports')
            .then(res => {
                setReports(res.data);
                
                // Hitung Total Pendapatan secara otomatis
                const total = res.data.reduce((acc, curr) => acc + curr.total_price, 0);
                setTotalRevenue(total);
            })
            .catch(err => console.error(err));
    }, []);

    // Helper: Format Rupiah
    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
    };

    // Helper: Format Tanggal (Ambil tanggal selesai)
    const formatDate = (dateString) => {
        if(!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID'); // Tgl & Jam
    };

    return (
        <div style={{color: 'white'}}>
            <h2 style={{marginBottom:'20px', color:'black'}}>Laporan Penyewaan</h2>

            {/* TABEL DATA */}
            <div style={{overflowX:'auto', marginBottom:'20px'}}>
                <table style={{width:'100%', borderCollapse:'collapse', background:'#1e1e1e', color:'white', borderRadius:'8px 8px 0 0', overflow:'hidden'}}>
                    <thead>
                        <tr style={{background:'#cc0000', color:'white'}}>
                            <th style={{padding:'15px', textAlign:'left'}}>Tanggal Selesai</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Nama Pelanggan</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Ruangan / PS</th>
                            <th style={{padding:'15px', textAlign:'center'}}>Durasi</th>
                            <th style={{padding:'15px', textAlign:'right'}}>Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((item, index) => (
                            <tr key={index} style={{borderBottom:'1px solid #333'}}>
                                <td style={{padding:'15px'}}>{formatDate(item.end_time)}</td>
                                <td style={{padding:'15px', fontWeight:'bold'}}>{item.username}</td>
                                <td style={{padding:'15px'}}>{item.ps_name}</td>
                                <td style={{padding:'15px', textAlign:'center'}}>{item.duration} Jam</td>
                                <td style={{padding:'15px', textAlign:'right', color:'#00ff00'}}>
                                    {formatRupiah(item.total_price)}
                                </td>
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{padding:'30px', textAlign:'center', color:'#aaa'}}>
                                    Belum ada transaksi yang selesai.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* TOTAL PENDAPATAN (FOOTER MERAH) */}
            <div style={{
                background: '#cc0000', 
                color: 'white', 
                padding: '20px', 
                borderRadius: '0 0 8px 8px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '18px',
                fontWeight: 'bold'
            }}>
                <span>Total Pendapatan:</span>
                <span style={{fontSize:'24px'}}>{formatRupiah(totalRevenue)}</span>
            </div>
        </div>
    );
}

export default AdminReports;