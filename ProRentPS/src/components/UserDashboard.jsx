import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Gamer';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. NAVBAR MERAH */}
            <nav style={{ 
                background: '#cc0000', 
                padding: '15px 40px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                color: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 'bold' }}>
                    <span>🎮</span> {/* Ikon Controller */}
                    <span>Play&Go</span>
                </div>
                <button 
                    onClick={handleLogout}
                    style={{
                        background: 'transparent',
                        border: '1px solid white',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Logout
                </button>
            </nav>

            {/* 2. HERO SECTION (BANNER UTAMA) */}
            <header style={{ 
                background: '#cc0000', 
                color: 'white', 
                textAlign: 'center', 
                padding: '80px 20px',
                flex: 1, // Agar mengisi ruang kosong
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '48px', marginBottom: '15px' }}>
                    Selamat Datang di Play&Go, {username}!
                </h1>
                <p style={{ fontSize: '18px', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.5' }}>
                    Tempat rental PlayStation terbaik dengan berbagai jenis ruangan dan harga terjangkau. Rasakan pengalaman bermain tanpa lag.
                </p>
                <button 
                    onClick={() => navigate('/rental')}
                    style={{
                        background: 'white',
                        color: '#cc0000',
                        border: 'none',
                        padding: '15px 40px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        transition: '0.3s'
                    }}
                >
                    Sewa Sekarang
                </button>
            </header>

            {/* 3. CONTACT SECTION (PUTIH KEMERAHAN) */}
            <section style={{ background: '#fff5f5', padding: '50px 20px', textAlign: 'center', color: '#333' }}>
                <h2 style={{ color: '#cc0000', fontFamily: 'Cursive, sans-serif', fontSize: '30px', marginBottom: '20px' }}>
                    Hubungi Kami
                </h2>
                <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
                    <p>📍 Alamat: Jl. Merdeka No. 123, Bandung</p>
                    <p>📞 Telepon: 0812-3456-7890</p>
                    <p>✉️ Email: playandgo@gmail.com</p>
                </div>
            </section>

            {/* 4. FOOTER */}
            <footer style={{ background: '#990000', color: 'white', textAlign: 'center', padding: '20px', fontSize: '14px' }}>
                &copy; 2025 Play&Go. All Rights Reserved.
            </footer>
        </div>
    );
}

export default UserDashboard;