import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/admin.css';

function AdminCustomers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = () => {
        axios.get('http://localhost:3000/auth/users')
            .then(res => {
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
                        loadCustomers();
                    } else {
                        alert("Gagal: " + res.data.Error);
                    }
                })
                .catch(err => alert("Error Server: " + err.message));
        }
    };

    return (
        <div className="admin-wrapper">
            <h2 className="admin-title">DATA PELANGGAN</h2>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Pelanggan</th>
                            <th>Email / Kontak</th>
                            <th>Role</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c, index) => (
                            <tr key={index}>
                                <td>{c.id}</td>
                                <td className="bold">{c.username}</td>
                                <td>
                                    {c.email}
                                    <br />
                                    <span className="sub-text">{c.phone}</span>
                                </td>
                                <td>{c.role}</td>
                                <td>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        NONAKTIFKAN
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {customers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="empty">
                                    Tidak ada data pelanggan aktif.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminCustomers;
