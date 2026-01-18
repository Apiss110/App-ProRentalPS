import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCustomers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = () => {
        axios.get('http://localhost:3000/customers')
            .then(res => {
                if(res.data.Error) {
                    alert(res.data.Error);
                } else {
                    setCustomers(res.data);
                }
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if(window.confirm("Yakin ingin menghapus pelanggan ini?")) {
            axios.delete('http://localhost:3000/customers/' + id)
                .then(res => {
                    if(res.data.Status === "Success") {
                        loadCustomers();
                    } else {
                        alert("Gagal: " + res.data.Error);
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div style={{color: 'white'}}>
            <h2 style={{marginBottom:'20px', color:'black'}}>Data Pelanggan</h2>

            <div style={{overflowX:'auto'}}>
                <table style={{width:'100%', borderCollapse:'collapse', background:'#1e1e1e', color:'white', borderRadius:'8px', overflow:'hidden'}}>
                    <thead>
                        <tr style={{background:'#cc0000', color:'white'}}>
                            <th style={{padding:'15px', textAlign:'left'}}>ID</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Nama Pelanggan</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Email / Kontak</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Room Aktif</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c, index) => (
                            <tr key={index} style={{borderBottom:'1px solid #333'}}>
                                <td style={{padding:'15px'}}>{c.id}</td>
                                <td style={{padding:'15px', fontWeight:'bold'}}>{c.username}</td>
                                <td style={{padding:'15px'}}>
                                    {c.email}<br/>
                                    <small style={{color:'#aaa'}}>{c.phone}</small>
                                </td>
                                <td style={{padding:'15px'}}>
                                    {c.active_room ? (
                                        <span style={{background:'green', padding:'5px 10px', borderRadius:'5px', fontSize:'12px'}}>
                                            {c.active_room}
                                        </span>
                                    ) : (
                                        <span style={{color:'#777'}}>-</span>
                                    )}
                                </td>
                                <td style={{padding:'15px'}}>
                                    <button onClick={() => handleDelete(c.id)} style={{background:'#dc3545', color:'white', border:'none', padding:'8px 15px', cursor:'pointer', borderRadius:'4px'}}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{padding:'20px', textAlign:'center', color:'#aaa'}}>
                                    Belum ada data pelanggan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminCustomers;