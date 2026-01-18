import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserRental() {
    const navigate = useNavigate();
    
    // State Data
    const [psList, setPsList] = useState([]);
    
    // State Form
    const [selectedPS, setSelectedPS] = useState("");
    const [duration, setDuration] = useState(1);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default hari ini
    const [time, setTime] = useState("08:00"); // Default jam 8 pagi

    // MEMBUAT LIST JAM (00.00, 01.00, dst)
    const timeOptions = [];
    for (let i = 0; i < 24; i++) {
        // Format angka jadi 2 digit (misal 9 jadi 09)
        const hour = i < 10 ? `0${i}` : i;
        
        const value = `${hour}:00`; // Nilai untuk sistem (08:00)
        const label = `${hour}.00`; // Teks untuk tampilan (08.00)
        
        timeOptions.push({ value, label });
    }

    // Ambil Data Room (PS) saat halaman dibuka
    useEffect(() => {
        axios.get('http://localhost:3000/ps')
            .then(res => setPsList(res.data))
            .catch(err => console.error(err));
    }, []);

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    // Handle Submit Sewa
    const handleRent = (e) => {
        e.preventDefault();

        // Validasi
        if (!selectedPS) return alert("Harap pilih Room terlebih dahulu!");
        
        const userId = localStorage.getItem("userId");
        if (!userId) return alert("Sesi habis, silakan login ulang.");

        // Hitung Total Harga
        const unit = psList.find((u) => u.id === parseInt(selectedPS));
        const price = unit ? unit.price_per_hour : 0;
        const totalPrice = price * duration;

        // Kirim ke Backend
        axios.post("http://localhost:3000/rentals", {
            ps_id: selectedPS,
            user_id: userId,
            duration: duration,
            rental_type: "Per Jam",
            total_price: totalPrice,
            booking_date: date, 
            start_time: time    
        })
        .then((res) => {
            if(res.data.Status === "Success") {
                alert(`Berhasil Booking Room ${unit.name}!\nTotal: ${formatRupiah(totalPrice)}`);
                navigate('/'); 
            } else {
                alert("Gagal: " + res.data.Error);
            }
        })
        .catch((err) => console.error(err));
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#f4f4f4', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '40px 20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            
            <div style={{ 
                background: 'white', 
                width: '100%', 
                maxWidth: '800px', 
                borderRadius: '15px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                padding: '40px'
            }}>

                <h2 style={{ textAlign: 'center', color: '#cc0000', marginBottom: '30px', fontWeight: 'bold' }}>
                    Price List & Sewa PS
                </h2>

                {/* TABEL PRICE LIST */}
                <div style={{ overflowX: 'auto', marginBottom: '40px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#cc0000', color: 'white' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Nama Room</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Harga / Jam</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Kapasitas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {psList.map((item, index) => (
                                <tr key={item.id} style={{ background: index % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                                    <td style={{ padding: '12px' }}>{formatRupiah(item.price_per_hour)}</td>
                                    <td style={{ padding: '12px' }}>{item.capacity} Orang</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FORM PEMESANAN */}
                <h3 style={{ color: '#cc0000', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                    Form Pemesanan
                </h3>

                <form onSubmit={handleRent}>
                    {/* Input Tanggal */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tanggal:</label>
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    {/* Input Pilih Room */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Room:</label>
                        <select 
                            value={selectedPS} 
                            onChange={(e) => setSelectedPS(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', background: 'white' }}
                        >
                            <option value="">-- Pilih Room --</option>
                            {psList.map((ps) => (
                                <option key={ps.id} value={ps.id} disabled={ps.status !== 'available'}>
                                    {ps.name} {ps.status !== 'available' ? '(Sedang Dipakai)' : ''} - {formatRupiah(ps.price_per_hour)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* INPUT JAM MULAI (YANG SUDAH DISEDERHANAKAN) */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Jam Mulai:</label>
                        <select 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', background: 'white' }}
                        >
                            {timeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label} {/* Sekarang tampil "08.00" saja */}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Input Lama Sewa */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Lama Sewa (jam):</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    {/* TOMBOL SEWA */}
                    <button 
                        type="submit" 
                        style={{ 
                            width: '100%', 
                            background: '#cc0000', 
                            color: 'white', 
                            padding: '15px', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        Sewa Sekarang
                    </button>
                </form>

                <div style={{ textAlign: 'center' }}>
                    <span 
                        onClick={() => navigate('/')} 
                        style={{ color: '#cc0000', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                        Kembali ke Dashboard
                    </span>
                </div>

            </div>
        </div>
    );
}

export default UserRental;