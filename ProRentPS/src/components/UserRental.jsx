import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserRental() {
    const navigate = useNavigate();
    
    // --- FUNGSI HELPER: AMBIL TANGGAL HARI INI ---
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // --- STATE DATA ---
    const [psList, setPsList] = useState([]);
    const [allRentals, setAllRentals] = useState([]); 

    // --- STATE FORM ---
    const [selectedPS, setSelectedPS] = useState(null); 
    const [date, setDate] = useState(getTodayString()); 
    const [time, setTime] = useState("08:00");
    const [duration, setDuration] = useState(1);

    // --- LIST JAM (00:00 - 23:00) ---
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}` : i;
        timeSlots.push(`${hour}:00`);
    }

    // --- 1. AMBIL DATA SAAT LOAD & AUTO REFRESH ---
    useEffect(() => {
        loadData(); 

        const interval = setInterval(() => {
            axios.get('http://localhost:3000/rentals')
                 .then(res => setAllRentals(res.data))
                 .catch(err => console.error(err));
        }, 1000); // Cek update setiap 3 detik

        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const resPS = await axios.get('http://localhost:3000/ps');
            setPsList(resPS.data);

            const resRentals = await axios.get('http://localhost:3000/rentals');
            setAllRentals(resRentals.data);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    // --- LOGIKA CEK KETERSEDIAAN ---
    const checkAvailability = (slotTime) => {
        if (!selectedPS) return "Pilih Room"; // Biarkan tampil jika belum pilih room

        const booked = allRentals.filter(r => 
            r.ps_id === selectedPS && 
            r.status === 'active' && 
            r.start_time_str && 
            r.start_time_str.startsWith(date) 
        );

        const isBooked = booked.some(r => {
            const rentalStartHour = parseInt(r.start_time_str.split(' ')[1].split(':')[0]);
            const slotHour = parseInt(slotTime.split(':')[0]); 
            const rentalEndHour = rentalStartHour + r.duration; 
            
            // Cek bentrok jam
            return slotHour >= rentalStartHour && slotHour < rentalEndHour;
        });

        return isBooked ? "Penuh" : "Tersedia";
    };

    // --- HANDLE SEWA ---
    const handleRent = (e) => {
        e.preventDefault();
        if (!selectedPS) return alert("Harap pilih jenis tiket (Room) terlebih dahulu!");
        
        const userId = sessionStorage.getItem("id"); 
        if (!userId) return alert("Sesi habis, silakan login ulang.");

        // Validasi lagi saat tombol ditekan (Double check)
        if (checkAvailability(time) === "Penuh") {
            return alert("Maaf, jam tersebut baru saja diambil orang lain. Silakan pilih jam lain.");
        }

        const unit = psList.find((u) => u.id === selectedPS);
        const totalPrice = unit ? unit.price_per_hour * duration : 0;

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
                navigate(`/transaction/${res.data.rentalId}`); 
            } else {
                alert("Gagal: " + res.data.Error);
            }
        })
        .catch((err) => console.error(err));
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
            
            {/* HEADER */}
            <div style={{ background: 'white', padding: '20px 50px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h2 style={{ margin: 0, color: '#cc0000' }}>Play&Go Rental</h2>
                <button onClick={() => navigate('/')} style={{ background:'transparent', border:'1px solid #ddd', padding:'8px 15px', borderRadius:'5px', cursor:'pointer' }}>
                    Kembali
                </button>
            </div>

            {/* CONTAINER */}
            <div style={{ maxWidth: '1200px', margin: '30px auto', display: 'flex', gap: '30px', padding: '0 20px', flexWrap: 'wrap' }}>
                
                {/* KOLOM KIRI (INFO) */}
                <div style={{ flex: '1.5', minWidth: '300px' }}>
                    <div style={{ width: '100%', height: '200px', background: 'linear-gradient(45deg, #cc0000, #ff4d4d)', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                        FOTO RENTAL DISINI
                    </div>
                    <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>Play&Go Bandung</h1>
                    <p style={{ color: '#666', marginBottom: '20px' }}>📍 Jl. Merdeka No. 123, Bandung | 📞 0812-3456-7890</p>

                    <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Sorotan / Aturan</h3>
                        <ul style={{ lineHeight: '1.8', color: '#444', paddingLeft: '20px' }}>
                            <li>Dilarang merokok (Vape diperbolehkan)</li>
                            <li>Dilarang membuang sampah sembarangan</li>
                            <li>Wajib menjaga ketertiban dan kenyamanan bersama</li>
                        </ul>
                    </div>

                    {/* TABEL KETERSEDIAAN VISUAL */}
                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Cek Ketersediaan ({date})</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#f1f3f5', borderRadius: '8px 8px 0 0', fontWeight: 'bold', color: '#555' }}>
                            <span>Waktu</span>
                            <span>Status / Harga</span>
                        </div>
                        <div style={{ background: 'white', borderRadius: '0 0 10px 10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                            {timeSlots.map((slot) => {
                                const status = checkAvailability(slot);
                                const currentHour = parseInt(slot.split(':')[0]);
                                let nextHour = currentHour + 1;
                                if(nextHour === 24) nextHour = 0;
                                const nextSlot = `${nextHour < 10 ? '0' + nextHour : nextHour}:00`;

                                return (
                                    <div key={slot} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px dashed #eee', background: status === "Penuh" ? '#fff5f5' : 'white' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>{slot}</span>
                                            <span style={{ fontSize: '13px', color: '#999' }}>{nextSlot}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {selectedPS ? (
                                                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                                                    {status === "Tersedia" && (
                                                        <span style={{ fontWeight: 'bold', color: '#333', fontSize:'14px' }}>
                                                            {formatRupiah(psList.find(p => p.id === selectedPS)?.price_per_hour)}
                                                        </span>
                                                    )}
                                                    <span style={{ color: status === "Penuh" ? '#dc3545' : '#888', fontSize: '13px', marginTop: '2px' }}>
                                                        {status === "Penuh" ? "Tidak Tersedia" : "Tersedia"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#aaa', fontSize: '12px' }}>-</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN (FORM) */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)', position: 'sticky', top: '20px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Pesan Sekarang</h3>

                        <form onSubmit={handleRent}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Tanggal</label>
                                <input 
                                    type="date" 
                                    value={date}
                                    min={getTodayString()}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', background:'#f9f9f9' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Jenis Tiket (Room)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {psList.map((ps) => (
                                        <button
                                            key={ps.id}
                                            type="button"
                                            onClick={() => setSelectedPS(ps.id)}
                                            style={{
                                                padding: '10px 15px',
                                                border: selectedPS === ps.id ? '2px solid #cc0000' : '1px solid #ddd',
                                                background: selectedPS === ps.id ? '#fff5f5' : 'white',
                                                color: selectedPS === ps.id ? '#cc0000' : '#333',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: selectedPS === ps.id ? 'bold' : 'normal',
                                                flex: '1 1 40%', 
                                                fontSize: '13px'
                                            }}
                                        >
                                            {ps.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Jam Mulai</label>
                                    
                                    {/* --- BAGIAN INI TELAH DIUBAH --- */}
                                    <select 
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
                                    >
                                        {timeSlots
                                            // FILTER: Hanya tampilkan jam yang TIDAK "Penuh"
                                            .filter(t => checkAvailability(t) !== "Penuh")
                                            .map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))
                                        }
                                        {/* Jika semua jam penuh, opsi mungkin kosong. Anda bisa tambahkan handling jika mau */}
                                    </select>
                                    {/* ------------------------------- */}

                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Durasi (Jam)</label>
                                    <input 
                                        type="number" min="1" max="10"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                style={{ width: '100%', background: '#cc0000', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(204,0,0,0.3)' }}
                            >
                                Pesan Sekarang
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserRental;