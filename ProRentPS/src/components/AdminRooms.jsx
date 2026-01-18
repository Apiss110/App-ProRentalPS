import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = () => {
        axios.get('http://localhost:3000/ps')
            .then(res => setRooms(res.data))
            .catch(() => alert("Gagal memuat data"));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { name, price, capacity };

        const request = editId
            ? axios.put(`http://localhost:3000/ps/update/${editId}`, data)
            : axios.post('http://localhost:3000/ps/add', data);

        request.then(() => {
            resetForm();
            loadRooms();
        });
    };

    const handleEditClick = (room) => {
        setEditId(room.id);
        setName(room.name);
        setPrice(room.price_per_hour);
        setCapacity(room.capacity);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditId(null);
        setName('');
        setPrice('');
        setCapacity('');
    };

    const handleDelete = (id) => {
        if (window.confirm("Yakin ingin menghapus Room ini?")) {
            axios.delete(`http://localhost:3000/ps/delete/${id}`)
                .then(() => loadRooms());
        }
    };

    const formatRupiah = (num) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(num);

    return (
        <div className="admin-page">

            {/* HEADER */}
            <div className="admin-header">
                <h2>Manajemen Room</h2>
                <p>Kelola unit PlayStation, harga, dan kapasitas ruangan</p>
            </div>

            {/* FORM CARD */}
            <div className="admin-card dark">
                <h3>{editId ? `Edit Room #${editId}` : "Tambah Room Baru"}</h3>

                <form className="admin-form-grid" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nama Room"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Harga per Jam"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Kapasitas"
                        value={capacity}
                        onChange={e => setCapacity(e.target.value)}
                        required
                    />

                    <div className="form-actions">
                        <button className="btn-primary">
                            {editId ? "Simpan Perubahan" : "Tambah Room"}
                        </button>

                        {editId && (
                            <button type="button" className="btn-secondary" onClick={resetForm}>
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* TABLE */}
            <div className="admin-card">
                <h3>Daftar Room</h3>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Room</th>
                            <th>Harga / Jam</th>
                            <th>Kapasitas</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td>#{room.id}</td>
                                <td>{room.name}</td>
                                <td className="price">{formatRupiah(room.price_per_hour)}</td>
                                <td>{room.capacity} Orang</td>
                                <td>
                                    <button onClick={() => handleEditClick(room)}>Edit</button>
                                    <button className="danger" onClick={() => handleDelete(room.id)}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {rooms.length === 0 && (
                    <p className="empty">Belum ada data room.</p>
                )}
            </div>

        </div>
    );
}

export default AdminRooms;
