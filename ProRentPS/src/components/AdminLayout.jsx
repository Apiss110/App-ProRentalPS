import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. HAPUS KUNCI SESI (PENTING!)
        sessionStorage.clear(); 
        
        // 2. Redirect Paksa ke Halaman Login
        window.location.href = '/login'; 
    };

    // Style untuk Link agar rapi
    const linkStyle = {
        color: '#ddd', 
        textDecoration: 'none', 
        display: 'block', 
        padding: '10px', 
        borderRadius: '5px',
        transition: '0.3s'
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            
            {/* --- SIDEBAR --- */}
            <div style={{ width: '250px', background: '#222', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ color: '#ff0000', marginBottom: '40px', textAlign: 'center' }}>PlayAndGo Admin</h2>
                
                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}><Link to="/admin" style={linkStyle}>Dashboard</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/admin/rooms" style={linkStyle}>Data Room</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/admin/customers" style={linkStyle}>Pelanggan</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/admin/transactions" style={linkStyle}>Transaksi</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/admin/reports" style={linkStyle}>Laporan</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/admin/settings" style={linkStyle}>Pengaturan</Link></li>
                    </ul>
                </nav>

                {/* TOMBOL LOGOUT YANG SUDAH DIPERBAIKI */}
                <button 
                    onClick={handleLogout}
                    style={{ 
                        background: '#ff0000', 
                        color: 'white', 
                        border: 'none', 
                        padding: '12px', 
                        borderRadius: '5px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        marginTop: '20px',
                        width: '100%',
                        fontSize: '16px'
                    }}
                >
                    Logout
                </button>
            </div>

            {/* --- KONTEN UTAMA (Tempat Dashboard/Transaksi muncul) --- */}
            <div style={{ flex: 1, background: '#f4f4f4', overflowY: 'auto' }}>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;