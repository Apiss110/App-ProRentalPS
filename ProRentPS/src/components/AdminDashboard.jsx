import React from 'react';

function AdminDashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Kartu 1 */}
        <div style={{ background: 'white', padding: '20px', width: '200px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'red' }}>Total Room</h3>
            <h1>6</h1>
        </div>

        {/* Kartu 2 */}
        <div style={{ background: 'white', padding: '20px', width: '200px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'red' }}>Total Pelanggan</h3>
            <h1>6</h1>
        </div>

        {/* Kartu 3 */}
        <div style={{ background: 'white', padding: '20px', width: '200px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'red' }}>Total Transaksi</h3>
            <h1>9</h1>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;