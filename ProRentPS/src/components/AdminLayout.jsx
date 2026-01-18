import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import '../css/admin.css';

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="admin-layout">
            
            {/* === SIDEBAR === */}
            <aside className="admin-sidebar">
                <h2 className="admin-logo">RetroPlay<br/>ADMIN</h2>

                <nav className="admin-nav">
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/rooms">Data Room</Link>
                    <Link to="/admin/customers">Pelanggan</Link>
                    <Link to="/admin/transactions">Transaksi</Link>
                    <Link to="/admin/reports">Laporan</Link>
                    <Link to="/admin/settings">Pengaturan</Link>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    LOGOUT
                </button>
            </aside>

            {/* === KONTEN UTAMA === */}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
