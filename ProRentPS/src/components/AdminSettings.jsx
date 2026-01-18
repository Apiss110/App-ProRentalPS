import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminSettings() {
    const [admins, setAdmins] = useState([]);
    
    // State untuk form tambah admin
    const [values, setValues] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''
    });

    // Ambil data admin saat halaman dibuka
    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = () => {
        axios.get('http://localhost:3000/auth/admins')
            .then(res => setAdmins(res.data))
            .catch(err => console.log(err));
    };

    const handleInput = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleAddAdmin = (e) => {
        e.preventDefault();
        // Panggil route khusus create-admin
        axios.post('http://localhost:3000/auth/create-admin', values)
            .then(res => {
                if(res.data.Status === "Success") {
                    alert("Admin berhasil ditambahkan!");
                    loadAdmins(); // Refresh tabel
                    setValues({username:'', email:'', phone:'', password:''}); // Reset form
                } else {
                    alert("Gagal: " + res.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        if(window.confirm("Yakin ingin menghapus admin ini?")) {
            axios.delete('http://localhost:3000/auth/delete-admin/'+id)
            .then(res => {
                if(res.data.Status === "Success") {
                    loadAdmins();
                } else {
                    alert("Gagal menghapus");
                }
            });
        }
    };

    return (
        <div style={{color: 'white'}}>
            <h2 style={{marginBottom:'20px'}}>Pengaturan Admin</h2>

            {/* FORM TAMBAH ADMIN */}
            <div style={{background:'#1e1e1e', padding:'20px', borderRadius:'8px', marginBottom:'30px'}}>
                <h4 style={{marginBottom:'15px', color:'white'}}>Tambah Admin Baru</h4>
                <form onSubmit={handleAddAdmin}>
                    <div style={{marginBottom:'10px'}}>
                        <input type="text" name="username" placeholder="Username" value={values.username} onChange={handleInput} required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
                        <input type="email" name="email" placeholder="Email (Wajib)" value={values.email} onChange={handleInput} required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
                        <input type="text" name="phone" placeholder="No Telepon (Wajib)" value={values.phone} onChange={handleInput} required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
                        <input type="password" name="password" placeholder="Password" value={values.password} onChange={handleInput} required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
                    </div>
                    <button type="submit" style={{background:'#28a745', color:'white', border:'none', padding:'10px 20px', cursor:'pointer', fontWeight:'bold'}}>
                        Tambah
                    </button>
                </form>
            </div>

            {/* TABEL LIST ADMIN */}
            <table className="table-dark" style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                    <tr style={{background:'#cc0000', color:'white'}}>
                        <th style={{padding:'10px'}}>ID</th>
                        <th style={{padding:'10px'}}>Username</th>
                        <th style={{padding:'10px'}}>Email</th>
                        <th style={{padding:'10px'}}>Role</th>
                        <th style={{padding:'10px'}}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin, index) => (
                        <tr key={index} style={{borderBottom:'1px solid #333'}}>
                            <td style={{padding:'10px'}}>{admin.id}</td>
                            <td style={{padding:'10px'}}>{admin.username}</td>
                            <td style={{padding:'10px'}}>{admin.email}</td>
                            <td style={{padding:'10px'}}>{admin.role}</td>
                            <td style={{padding:'10px'}}>
                                <button onClick={() => handleDelete(admin.id)} style={{background:'#dc3545', color:'white', border:'none', padding:'5px 10px', cursor:'pointer'}}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminSettings;