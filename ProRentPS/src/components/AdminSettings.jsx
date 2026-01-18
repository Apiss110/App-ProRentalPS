import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminSettings() {
    const [users, setUsers] = useState([]);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        axios.get('http://localhost:3000/auth/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    };

    const handleAddAdmin = (e) => {
        e.preventDefault();

        if (!username || !email || !phone || !password) {
            return alert("Harap isi semua kolom!");
        }

        axios.post('http://localhost:3000/auth/create-admin', {
            username, email, phone, password
        })
        .then(res => {
            if (res.data.Status === "Success") {
                alert("✅ Admin baru berhasil ditambahkan");
                setUsername('');
                setEmail('');
                setPhone('');
                setPassword('');
                loadUsers();
            } else {
                alert("❌ " + res.data.Error);
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Yakin ingin menghapus admin ini?")) {
            axios.delete('http://localhost:3000/auth/delete/' + id)
                .then(() => loadUsers());
        }
    };

    const adminOnly = users.filter(u => u.role === 'admin');

    return (
        <div className="admin-page">

            {/* HEADER */}
            <div className="admin-header">
                <h2>Pengaturan Admin</h2>
                <p>Kelola akses dan rekan admin sistem</p>
            </div>

            {/* FORM CARD */}
            <div className="admin-card dark">
                <h3>Tambah Admin Baru</h3>

                <form className="admin-form-grid" onSubmit={handleAddAdmin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="No. Telepon"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <div className="form-actions">
                        <button className="btn-primary">
                            + Tambah Admin
                        </button>
                    </div>
                </form>
            </div>

            {/* TABLE */}
            <div className="admin-card">
                <h3>Daftar Rekan Admin</h3>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>No. HP</th>
                            <th>Role</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminOnly.length > 0 ? (
                            adminOnly.map(admin => (
                                <tr key={admin.id}>
                                    <td>#{admin.id}</td>
                                    <td>{admin.username}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.phone || '-'}</td>
                                    <td>
                                        <span className="badge-admin">ADMIN</span>
                                    </td>
                                    <td>
                                        <button
                                            className="danger"
                                            onClick={() => handleDelete(admin.id)}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty">
                                    Tidak ada admin lain.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default AdminSettings;
