import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [values, setValues] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    // 1. CEK SESI SAAT HALAMAN DIBUKA
    useEffect(() => {
        // GANTI KE sessionStorage
        const role = sessionStorage.getItem("role"); 
        
        if(role) {
            if(role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [navigate]);

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post('http://localhost:3000/auth/login', values)
            .then(res => {
                if(res.data.Status === "Success") {
                    // 2. GANTI SEMUA KE sessionStorage (Agar beda Tab, beda Akun)
                    sessionStorage.setItem("token", res.data.Token);
                    sessionStorage.setItem("role", res.data.role); 
                    sessionStorage.setItem("id", res.data.id);
                    sessionStorage.setItem("username", res.data.username); 
                    
                    // 3. REFRESH HALAMAN AGAR STATE TER-UPDATE
                    if(res.data.role === 'admin') {
                        window.location.href = '/admin/dashboard'; 
                    } else {
                        window.location.href = '/'; 
                    }
                } else {
                    alert(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily:'Arial' }}>
            <div style={{ padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', backgroundColor: 'white', width: '350px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Login Play&Go</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight:'bold', color: '#555' }}>Username</label>
                        <input type="text" placeholder="Masukkan Username" name='username'
                            onChange={handleInput} 
                            style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight:'bold', color: '#555' }}>Password</label>
                        <input type="password" placeholder="Masukkan Password" name='password'
                            onChange={handleInput} 
                            style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button type='submit' style={{ width: '100%', padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#e5c07b', color: '#2a1c12', fontSize: '16px', fontWeight:'bold', cursor: 'pointer', transition: '0.3s' }}>
                        MASUK
                    </button>
                    
                    <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        Belum punya akun? <a href="/register" style={{ color: '#d35400', textDecoration: 'none', fontWeight:'bold' }}>Daftar Sekarang</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;