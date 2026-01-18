import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCustomers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = () => {
        axios.get('http://localhost:3000/auth/users')
            .then(res => {
                // Filter di frontend juga untuk keamanan ganda (Hanya tampilkan User, bukan Admin)
                const userOnly = res.data.filter(u => u.role === 'user');
                setCustomers(userOnly);
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if(window.confirm("Yakin ingin menonaktifkan Pelanggan ini? (Riwayat transaksi akan tetap aman)")) {
            axios.delete('http://localhost:3000/auth/delete/' + id)
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert("Pelanggan berhasil dinonaktifkan.");
                        loadCustomers(); // Refresh list
                    } else {
                        alert("Gagal: " + res.data.Error);
                    }
                })
                .catch(err => alert("Error Server: " + err.message));
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial' }}>
            <h2 style={{ marginBottom: '20px' }}>Data Pelanggan</h2>
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#a71d2a', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Nama Pelanggan</th>
                            <th style={{ padding: '15px' }}>Email / Kontak</th>
                            <th style={{ padding: '15px' }}>Role</th>
                            <th style={{ padding: '15px' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>{c.id}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{c.username}</td>
                                <td style={{ padding: '15px' }}>
                                    {c.email}<br/>
                                    <span style={{ fontSize:'12px', color:'#666' }}>{c.phone}</span>
                                </td>
                                <td style={{ padding: '15px' }}>{c.role}</td>
                                <td style={{ padding: '15px' }}>
                                    <button 
                                        onClick={() => handleDelete(c.id)}
                                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {customers.length === 0 && (
                            <tr><td colSpan="5" style={{padding:'20px', textAlign:'center'}}>Tidak ada data pelanggan aktif.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminCustomers;