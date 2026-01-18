import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* --- SIDEBAR KIRI --- */}
            <div style={{ width: '250px', background: '#333', color: 'white', padding: '20px' }}>
                <h2 style={{ color: 'red' }}>PlayAndGo Admin</h2>
                
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                    <Link to="/admin/rooms" style={{ color: 'white', textDecoration: 'none' }}>Data Room</Link>
                    <Link to="/admin/customers" style={{ color: 'white', textDecoration: 'none' }}>Pelanggan</Link>
                    <Link to="/admin/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transaksi</Link>
                    <Link to="/admin/reports" style={{ color: 'white', textDecoration: 'none' }}>Laporan</Link>
                    <Link to="/admin/settings" style={{ color: 'white', textDecoration: 'none' }}>Pengaturan</Link>
                </nav>

                <button onClick={handleLogout} style={{ marginTop: '50px', background: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', width: '100%' }}>
                    Logout
                </button>
            </div>

            {/* --- KONTEN KANAN --- */}
            <div style={{ flex: 1, padding: '20px', background: '#f4f4f4' }}>
                {/* Outlet ini akan berubah isinya sesuai menu yang diklik */}
                <Outlet /> 
            </div>
        </div>
    );
}

export default AdminLayout;