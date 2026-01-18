import React, { useState, useEffect } from 'react'; // <--- JANGAN LUPA IMPORT useEffect
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [values, setValues] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    // --- TAMBAHAN BARU: Pengecekan Otomatis ---
    useEffect(() => {
        // Cek apakah sudah ada yang login sebelumnya?
        const role = localStorage.getItem("userRole");
        
        if(role) {
            // Jika sudah ada, langsung lempar ke halaman yang sesuai
            // Jangan biarkan user melihat form login lagi
            if(role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/';
            }
        }
    }, []);
    // ------------------------------------------

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post('http://localhost:3000/auth/login', values)
            .then(res => {
                if(res.data.Status === "Success") {
                    localStorage.setItem("userRole", res.data.role);
                    localStorage.setItem("userId", res.data.id);
                    localStorage.setItem("username", res.data.username);

                    alert("Login Berhasil! Selamat Datang, " + res.data.username);

                    if(res.data.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/';
                    }
                } else {
                    alert("Login Gagal: Password atau Email salah");
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ padding: '40px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white', width: '300px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>Username</label>
                        <input type="text" placeholder="Masukkan Username" name='username'
                            onChange={handleInput} 
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>Password</label>
                        <input type="password" placeholder="Masukkan Password" name='password'
                            onChange={handleInput} 
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button type='submit' style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', fontSize: '16px', cursor: 'pointer', transition: 'background 0.3s' }}>
                        Masuk
                    </button>
                    
                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                        Belum punya akun? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Daftar</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;