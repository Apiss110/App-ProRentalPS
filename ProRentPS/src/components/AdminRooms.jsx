import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    
    // State Form
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');
    
    // State Edit Mode
    const [editId, setEditId] = useState(null); // Jika null = Mode Tambah, Jika ada ID = Mode Edit

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = () => {
        axios.get('http://localhost:3000/ps')
            .then(res => setRooms(res.data))
            .catch(err => alert("Gagal memuat data"));
    };

    // --- FUNGSI SUBMIT (BISA TAMBAH / UPDATE) ---
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const data = { name, price, capacity };

        if (editId) {
            // --- LOGIKA UPDATE ---
            axios.put('http://localhost:3000/ps/update/' + editId, data)
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert("✅ Data Berhasil Diupdate!");
                        resetForm();
                        loadRooms();
                    } else {
                        alert("Gagal Update: " + res.data.Error);
                    }
                })
                .catch(err => console.error(err));
        } else {
            // --- LOGIKA TAMBAH BARU ---
            axios.post('http://localhost:3000/ps/add', data)
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert("✅ Berhasil Menambah Room Baru!");
                        resetForm();
                        loadRooms();
                    } else {
                        alert("Gagal Tambah: " + res.data.Error);
                    }
                })
                .catch(err => console.error(err));
        }
    };

    // --- FUNGSI KLIK TOMBOL EDIT (ISI FORM DENGAN DATA LAMA) ---
    const handleEditClick = (room) => {
        setEditId(room.id); // Masuk mode edit
        setName(room.name);
        setPrice(room.price_per_hour);
        setCapacity(room.capacity);
        
        // Scroll ke atas agar admin melihat formnya
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- FUNGSI RESET FORM / BATAL EDIT ---
    const resetForm = () => {
        setEditId(null); // Kembali ke mode tambah
        setName('');
        setPrice('');
        setCapacity('');
    };

    const handleDelete = (id) => {
        if(window.confirm("Yakin ingin menghapus Room ini?")) {
            axios.delete('http://localhost:3000/ps/delete/' + id)
                .then(res => {
                    loadRooms();
                });
        }
    };

    const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Data Room</h2>

            {/* --- FORM PINTAR (TAMBAH / EDIT) --- */}
            <div style={{ background: '#222', color: 'white', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px' }}>
                    {editId ? `Edit Room (ID: ${editId})` : "Tambah Room Baru"}
                </h3>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display:'block', marginBottom:'8px', fontSize:'14px' }}>Nama Room</label>
                        <input 
                            type="text" 
                            placeholder="Contoh: Room VVIP" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius:'4px', border:'none' }} 
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display:'block', marginBottom:'8px', fontSize:'14px' }}>Harga per Jam (Angka saja)</label>
                        <input 
                            type="number" 
                            placeholder="Contoh: 50000" 
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius:'4px', border:'none' }} 
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display:'block', marginBottom:'8px', fontSize:'14px' }}>Kapasitas (Orang)</label>
                        <input 
                            type="number" 
                            placeholder="Contoh: 4" 
                            value={capacity}
                            onChange={e => setCapacity(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius:'4px', border:'none' }} 
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            type="submit" 
                            style={{ 
                                background: editId ? '#007bff' : '#cc0000', // Biru jika Edit, Merah jika Tambah
                                color: 'white', 
                                padding: '12px 25px', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                fontWeight:'bold',
                                flex: 1
                            }}>
                            {editId ? "Simpan Perubahan" : "Tambah Room"}
                        </button>
                        
                        {/* Tombol Batal hanya muncul saat Edit */}
                        {editId && (
                            <button 
                                type="button"
                                onClick={resetForm}
                                style={{ 
                                    background: '#666', 
                                    color: 'white', 
                                    padding: '12px 25px', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer', 
                                    fontWeight:'bold'
                                }}>
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* --- TABEL DATA --- */}
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#cc0000', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Nama Room</th>
                            <th style={{ padding: '15px' }}>Harga / Jam</th>
                            <th style={{ padding: '15px' }}>Kapasitas</th>
                            <th style={{ padding: '15px' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #eee', background: editId === room.id ? '#f0f8ff' : 'white' }}>
                                <td style={{ padding: '15px', fontWeight:'bold' }}>{room.id}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{room.name}</td>
                                <td style={{ padding: '15px', color: '#28a745', fontWeight:'bold' }}>
                                    {formatRupiah(room.price_per_hour)}
                                </td>
                                <td style={{ padding: '15px' }}>{room.capacity} Orang</td>
                                <td style={{ padding: '15px' }}>
                                    
                                    {/* TOMBOL EDIT */}
                                    <button 
                                        onClick={() => handleEditClick(room)}
                                        style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontWeight:'bold' }}>
                                        Edit
                                    </button>

                                    <button 
                                        onClick={() => handleDelete(room.id)}
                                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight:'bold' }}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminRooms;