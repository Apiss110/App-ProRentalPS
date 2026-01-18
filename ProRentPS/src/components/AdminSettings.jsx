import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminSettings() {
    const [users, setUsers] = useState([]);
    
    // State Form
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(''); 
    const [password, setPassword] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        // Mengambil semua data user (Backend sudah otomatis memfilter yang 'deleted')
        axios.get('http://localhost:3000/auth/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    };

    const handleAddAdmin = (e) => {
        e.preventDefault();
        
        // Validasi Form
        if(!username || !email || !phone || !password) {
            return alert("Harap isi semua kolom (Username, Email, No HP, Password)!");
        }

        const data = { username, email, phone, password };

        axios.post('http://localhost:3000/auth/create-admin', data)
            .then(res => {
                if(res.data.Status === "Success") {
                    alert("✅ Berhasil Menambahkan Admin Baru!");
                    // Reset Form
                    setUsername('');
                    setEmail('');
                    setPhone('');
                    setPassword('');
                    loadUsers(); // Refresh Tabel
                } else {
                    alert("❌ Gagal: " + res.data.Error);
                }
            })
            .catch(err => {
                console.error(err);
                alert("⚠️ Terjadi Kesalahan Server: " + err.message);
            });
    };

    const handleDelete = (id) => {
        if(window.confirm("Yakin ingin menghapus akses Admin ini?")) {
            axios.delete('http://localhost:3000/auth/delete/' + id)
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert("Admin berhasil dihapus.");
                        loadUsers();
                    } else {
                        alert("Gagal menghapus: " + res.data.Error);
                    }
                });
        }
    };

    // --- FILTER: HANYA TAMPILKAN ROLE 'ADMIN' ---
    // User biasa tidak perlu muncul di sini agar Admin fokus mengelola timnya.
    const adminOnly = users.filter(user => user.role === 'admin');

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Pengaturan Admin</h2>

            {/* FORM TAMBAH ADMIN */}
            <div style={{ background: '#333', color: 'white', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px', marginBottom: '20px' }}>Tambah Admin Baru</h3>
                <form onSubmit={handleAddAdmin}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display:'block', marginBottom:'5px' }}>Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px' }} placeholder="Username Admin" />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display:'block', marginBottom:'5px' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px' }} placeholder="Email Admin" />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display:'block', marginBottom:'5px' }}>No. Telepon</label>
                        <input type="number" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '10px' }} placeholder="08xxxxx" />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display:'block', marginBottom:'5px' }}>Password</label>
                        <input type="text" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px' }} placeholder="Password" />
                    </div>
                    <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight:'bold' }}>
                        + Tambah Admin
                    </button>
                </form>
            </div>

            {/* TABEL LIST ADMIN */}
            <h3 style={{ marginBottom: '15px' }}>Daftar Rekan Admin</h3>
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#007bff', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Username</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>No. HP</th>
                            <th style={{ padding: '12px' }}>Role</th>
                            <th style={{ padding: '12px' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminOnly.length > 0 ? (
                            adminOnly.map((user, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{user.id}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.username}</td>
                                    <td style={{ padding: '12px' }}>{user.email}</td>
                                    <td style={{ padding: '12px' }}>{user.phone || '-'}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: 'white', fontWeight:'bold', background: '#007bff' }}>
                                            ADMIN
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <button onClick={() => handleDelete(user.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Tidak ada data Admin lain.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminSettings;