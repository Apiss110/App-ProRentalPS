import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    
    // State untuk form input
    const [values, setValues] = useState({
        name: '',
        price_per_hour: '',
        capacity: ''
    });
    
    // State untuk mode Edit
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Ambil data saat halaman dibuka
    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = () => {
        axios.get('http://localhost:3000/ps')
            .then(res => {
                setRooms(res.data);
            })
            .catch(err => console.error("Gagal ambil data:", err));
    };

    const handleInput = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validasi
        if(!values.name || !values.price_per_hour || !values.capacity) {
            alert("Semua kolom harus diisi!");
            return;
        }

        const dataToSend = {
            name: values.name,
            price_per_hour: parseInt(values.price_per_hour), // Ubah jadi angka
            capacity: parseInt(values.capacity)              // <--- PENTING: Ubah jadi angka
        };
        
        if (isEditing) {
            // --- MODE UPDATE ---
            axios.put('http://localhost:3000/ps/' + editId, dataToSend)
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert("Room berhasil diupdate!");
                        resetForm();
                        loadRooms();
                    } else {
                        alert("Gagal update room.");
                    }
                })
                .catch(err => console.log(err));
        } else {
            // --- MODE TAMBAH ---
            axios.post('http://localhost:3000/ps', dataToSend)
                .then(res => {
                    if(res.data.Status === "Success") {
                        alert("Room berhasil ditambahkan!");
                        resetForm();
                        loadRooms();
                    } else {
                        alert("Gagal menambah room.");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    const handleEditClick = (room) => {
        setIsEditing(true);
        setEditId(room.id);
        setValues({
            name: room.name,
            price_per_hour: room.price_per_hour,
            capacity: room.capacity
        });
    };

    const handleDelete = (id) => {
        if(window.confirm("Hapus Room ini? Data tidak bisa kembali.")) {
            axios.delete('http://localhost:3000/ps/' + id)
                .then(res => {
                    if(res.data.Status === "Success") {
                        loadRooms();
                    } else {
                        alert("Gagal menghapus");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    const resetForm = () => {
        setValues({ name: '', price_per_hour: '', capacity: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const formatRupiah = (number) => {
        if (!number || isNaN(number)) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <div style={{color: 'black'}}> 
            <h2 style={{marginBottom:'20px', color:'black'}}>Data Room</h2>

            {/* FORM INPUT */}
            <div style={{background:'#2c2c2c', padding:'20px', borderRadius:'8px', marginBottom:'30px', color: 'white'}}>
                <h4 style={{marginBottom:'15px', color:'white'}}>
                    {isEditing ? "Edit Room" : "Tambah Room Baru"}
                </h4>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom:'15px'}}>
                        <label style={{display:'block', marginBottom:'5px', fontSize:'14px'}}>Nama Room</label>
                        <input type="text" name="name" placeholder="Contoh: Room VVIP" 
                               value={values.name} onChange={handleInput} required 
                               style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'4px', border:'none'}} />
                        
                        <label style={{display:'block', marginBottom:'5px', fontSize:'14px'}}>Harga per Jam (Angka saja)</label>
                        <input type="number" name="price_per_hour" placeholder="Contoh: 50000" 
                               value={values.price_per_hour} onChange={handleInput} required 
                               style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'4px', border:'none'}} />
                        
                        <label style={{display:'block', marginBottom:'5px', fontSize:'14px'}}>Kapasitas (Orang)</label>
                        <input type="number" name="capacity" placeholder="Contoh: 4" 
                               value={values.capacity} onChange={handleInput} required
                               style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'4px', border:'none'}} />
                    </div>
                    
                    <button type="submit" style={{background: isEditing ? '#007bff' : '#cc0000', color:'white', border:'none', padding:'10px 20px', cursor:'pointer', fontWeight:'bold', borderRadius:'4px', marginRight:'10px'}}>
                        {isEditing ? "Simpan Perubahan" : "Tambah Room"}
                    </button>
                    
                    {isEditing && (
                        <button type="button" onClick={resetForm} style={{background:'#6c757d', color:'white', border:'none', padding:'10px 20px', cursor:'pointer', fontWeight:'bold', borderRadius:'4px'}}>
                            Batal
                        </button>
                    )}
                </form>
            </div>

            {/* TABEL LIST ROOM */}
            <div style={{overflowX:'auto'}}>
                <table style={{width:'100%', borderCollapse:'collapse', background:'white', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
                    <thead>
                        <tr style={{background:'#cc0000', color:'white'}}>
                            <th style={{padding:'12px', textAlign:'left'}}>ID</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Nama Room</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Harga / Jam</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Kapasitas</th>
                            <th style={{padding:'12px', textAlign:'left'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={index} style={{borderBottom:'1px solid #ddd'}}>
                                <td style={{padding:'12px'}}>{room.id}</td>
                                <td style={{padding:'12px', fontWeight:'bold'}}>{room.name}</td>
                                <td style={{padding:'12px', color:'green', fontWeight:'bold'}}>
                                    {formatRupiah(room.price_per_hour)}
                                </td>
                                <td style={{padding:'12px'}}>{room.capacity} Orang</td>
                                <td style={{padding:'12px'}}>
                                    <button onClick={() => handleEditClick(room)} style={{background:'#007bff', color:'white', border:'none', padding:'6px 12px', cursor:'pointer', borderRadius:'4px', marginRight:'5px'}}>Edit</button>
                                    <button onClick={() => handleDelete(room.id)} style={{background:'#dc3545', color:'white', border:'none', padding:'6px 12px', cursor:'pointer', borderRadius:'4px'}}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {rooms.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{padding:'20px', textAlign:'center', fontStyle:'italic', color:'#666'}}>
                                    Belum ada data room. Silakan tambah data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminRooms;