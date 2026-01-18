import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function UserTransactionDetail() {
    const { id } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [file, setFile] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/rentals/detail/' + id)
            .then(res => {
                setTransaction(res.data);
                if(res.data && res.data.payment_method) {
                    setPaymentMethod(res.data.payment_method);
                }
            })
            .catch(err => console.log(err));
    }, [id]);

    useEffect(() => {
    // ... load awal ...

    const interval = setInterval(() => {
        axios.get('http://localhost:3000/rentals/detail/' + id)
            .then(res => {
                // Update status pembayaran real-time jika admin baru saja menyetujui
                if(res.data) {
                    setTransaction(prev => ({...prev, payment_status: res.data.payment_status}));
                }
            });
    }, 1000); // Cek status tiap 10 detik

    return () => clearInterval(interval);
}, [id]);

    const handlePayment = () => {
        if(!paymentMethod) return alert("Pilih metode pembayaran dulu!");
        
        const formData = new FormData();
        formData.append('payment_method', paymentMethod);
        if(file) {
            formData.append('proof', file);
        }

        axios.put('http://localhost:3000/rentals/pay/' + id, formData)
            .then(res => {
                if(res.data.Status === "Success") {
                    alert("Pembayaran berhasil dikirim! Mohon tunggu verifikasi Admin.");
                    window.location.reload();
                } else {
                    alert("Gagal upload");
                }
            })
            .catch(err => console.log(err));
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num || 0);
    };

    if (!transaction) return <div style={{padding:'50px', textAlign:'center'}}>Loading data...</div>;

    return (
        <div style={{ padding: '40px', background: '#fff5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
            
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px', border: '2px solid #cc0000', maxWidth: '1000px', width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                
                <h2 style={{ textAlign: 'center', color: '#cc0000', marginBottom: '30px', fontWeight: 'bold' }}>Detail Transaksi</h2>

                {/* TABEL DATA */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', border: '1px solid #cc0000' }}>
                        <thead>
                            <tr style={{ background: '#cc0000', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '12px', border: '1px solid #cc0000' }}>ROOM</th>
                                <th style={{ padding: '12px', border: '1px solid #cc0000' }}>JAM MULAI</th>
                                <th style={{ padding: '12px', border: '1px solid #cc0000' }}>JAM SELESAI</th>
                                <th style={{ padding: '12px', border: '1px solid #cc0000' }}>LAMA SEWA</th>
                                <th style={{ padding: '12px', border: '1px solid #cc0000' }}>HARGA / JAM</th>
                                <th style={{ padding: '12px', border: '1px solid #cc0000' }}>TOTAL HARGA</th>
                                <th style={{ padding: '12px', border: '1px solid #cc0000' }}>TANGGAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ background: 'white', color: '#333' }}>
                                <td style={{ padding: '12px', border: '1px solid #cc0000', fontWeight:'bold' }}>{transaction.ps_name}</td>
                                <td style={{ padding: '12px', border: '1px solid #cc0000' }}>{transaction.jam_mulai || '-'}</td>
                                <td style={{ padding: '12px', border: '1px solid #cc0000' }}>{transaction.jam_selesai || '-'}</td>
                                <td style={{ padding: '12px', border: '1px solid #cc0000' }}>{transaction.duration} jam</td>
                                <td style={{ padding: '12px', border: '1px solid #cc0000' }}>{formatRupiah(transaction.price_per_hour)}</td>
                                <td style={{ padding: '12px', border: '1px solid #cc0000', fontWeight:'bold' }}>{formatRupiah(transaction.total_price)}</td>
                                <td style={{ padding: '12px', border: '1px solid #cc0000' }}>{transaction.tanggal_sewa || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* STATUS PEMBAYARAN */}
                <h3 style={{ color: '#cc0000', marginBottom: '10px' }}>
                    Status Pembayaran: <span style={{ fontWeight: 'bold' }}>
                        {transaction.payment_status === 'paid' ? 'LUNAS (Verified)' : 
                         transaction.payment_status === 'pending' ? 'Menunggu Konfirmasi' : 'Belum Bayar'}
                    </span>
                </h3>

                {/* --- FORM PEMBAYARAN (JIKA BELUM LUNAS) --- */}
                {transaction.payment_status !== 'paid' && (
                    <div style={{ marginTop: '20px', padding: '20px', border: '1px dashed #cc0000', borderRadius: '10px', background: '#fffafa' }}>
                        
                        {/* PILIHAN METODE */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Pilih Metode Pembayaran:</label>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight:'bold', color:'#cc0000', padding:'10px', border:'1px solid #ddd', borderRadius:'5px', background:'white' }}>
                                    <input type="radio" name="method" value="QRIS" checked={paymentMethod === 'QRIS'} onChange={(e) => setPaymentMethod(e.target.value)} /> 
                                    QRIS (Scan)
                                </label>
                                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight:'bold', color:'#cc0000', padding:'10px', border:'1px solid #ddd', borderRadius:'5px', background:'white' }}>
                                    <input type="radio" name="method" value="Transfer Bank" checked={paymentMethod === 'Transfer Bank'} onChange={(e) => setPaymentMethod(e.target.value)} /> 
                                    Transfer Bank
                                </label>
                            </div>
                        </div>

                        {/* --- LOGIKA TAMPILAN DINAMIS --- */}
                        
                        {/* 1. JIKA PILIH QRIS */}
                        {paymentMethod === 'QRIS' && (
                            <div style={{ marginBottom: '20px', textAlign: 'center', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Scan QRIS di bawah ini:</p>
                                {/* Ganti src dengan file QRIS asli Anda nanti */}
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                                    alt="QRIS Code" 
                                    style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                                />
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Play&Go Official</p>
                            </div>
                        )}

                        {/* 2. JIKA PILIH TRANSFER BANK */}
                        {paymentMethod === 'Transfer Bank' && (
                            <div style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #cc0000', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#555' }}>Silakan transfer ke rekening berikut:</p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Bank BCA</p>
                                        <p style={{ margin: '5px 0', fontSize: '24px', fontWeight: 'bold', color: '#333', letterSpacing: '1px' }}>
                                            123-456-7890
                                        </p>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#cc0000' }}>a.n Play&Go Rental</p>
                                    </div>
                                    
                                    <div>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Bank Mandiri</p>
                                        <p style={{ margin: '5px 0', fontSize: '24px', fontWeight: 'bold', color: '#333', letterSpacing: '1px' }}>
                                            987-654-3210
                                        </p>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#cc0000' }}>a.n Play&Go Rental</p>
                                    </div>
                                </div>
                                
                                <p style={{ marginTop: '15px', fontSize: '12px', color: '#cc0000', fontStyle: 'italic' }}>
                                    *Harap transfer sesuai nominal: <strong>{formatRupiah(transaction.total_price)}</strong> (Hingga 3 digit terakhir)
                                </p>
                            </div>
                        )}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Upload Bukti Pembayaran:</label>
                            <input 
                                type="file" 
                                onChange={e => setFile(e.target.files[0])} 
                                style={{ width: '100%', padding: '10px', background:'white', border: '1px solid #ccc', borderRadius:'5px' }} 
                            />
                        </div>

                        <button 
                            onClick={handlePayment}
                            style={{ padding: '12px 30px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', width: '100%' }}
                        >
                            Kirim Bukti Pembayaran
                        </button>
                    </div>
                )}

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: '#cc0000', textDecoration: 'none', fontWeight:'bold' }}>&larr; Kembali ke Dashboard</Link>
                </div>

            </div>
        </div>
    );
}

export default UserTransactionDetail;