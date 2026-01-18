import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [values, setValues] = useState({
        username: '',
        email: '',
        phone: '', // Pastikan nama di database sesuai
        password: ''
    });
    
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // Fungsi saat mengetik
    const handleChange = (e) => {
        // Log ini akan muncul di Console browser setiap anda mengetik
        // console.log("Mengetik:", e.target.name, e.target.value); 
        setValues({...values, [e.target.name]: e.target.value});
    }

    // Fungsi saat tombol diklik
    const handleSubmit = (event) => {
        event.preventDefault();
        
        // 1. Cek apakah data terisi di Console
        console.log("Data yang dikirim:", values);

        axios.post('http://localhost:3000/auth/register', values) 
            .then(res => {
                console.log("Respon Server:", res.data); // Cek respon server
                
                if(res.data.Status === "Success") {
                    alert("Akun berhasil dibuat! Silakan Login.");
                    navigate('/login');
                } else {
                    // Tampilkan error dari backend ke layar
                    setErrorMsg(res.data.Error || "Terjadi kesalahan pada server");
                    alert("Gagal: " + (res.data.Error || "Cek Console"));
                }
            })
            .catch(err => {
                console.error("Error Axios:", err);
                alert("Terjadi Error Sistem (Cek Console Browser)");
            });
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <div style={{ width: '350px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
                <h2 style={{textAlign: 'center'}}>Daftar Akun</h2>
                
                {errorMsg && <div style={{backgroundColor: '#ffcccc', color: 'red', padding: '10px', marginBottom: '10px', textAlign: 'center', borderRadius: '5px'}}>{errorMsg}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '10px'}}>
                        <label><strong>Username</strong></label>
                        <input 
                            type="text" name='username' 
                            className='form-control' // Jika pakai bootstrap
                            style={{width: '100%', padding: '8px', margin: '5px 0'}}
                            onChange={handleChange} required
                        />
                    </div>

                    <div style={{marginBottom: '10px'}}>
                        <label><strong>Email</strong></label>
                        <input 
                            type="email" name='email' 
                            style={{width: '100%', padding: '8px', margin: '5px 0'}}
                            onChange={handleChange} required
                        />
                    </div>

                    <div style={{marginBottom: '10px'}}>
                        <label><strong>No. Telepon</strong></label>
                        <input 
                            type="text" name='phone' 
                            style={{width: '100%', padding: '8px', margin: '5px 0'}}
                            onChange={handleChange} required
                        />
                    </div>

                    <div style={{marginBottom: '20px'}}>
                        <label><strong>Password</strong></label>
                        <input 
                            type="password" name='password'
                            style={{width: '100%', padding: '8px', margin: '5px 0'}} 
                            onChange={handleChange} required
                        />
                    </div>

                    <button type='submit' style={{width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', fontSize: '16px', borderRadius: '5px'}}>
                        Daftar
                    </button>
                    
                    <p style={{marginTop: '15px', textAlign: 'center'}}>
                        Sudah punya akun? <Link to="/login">Login disini</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register;