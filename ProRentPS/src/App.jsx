import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- IMPORT KOMPONEN ---
import Login from "./components/Login";
import Register from "./components/Register";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import AdminSettings from "./components/AdminSettings";
import AdminRooms from "./components/AdminRooms";
import AdminCustomers from "./components/AdminCustomers";
import AdminTransactions from "./components/AdminTransactions";
import AdminReports from "./components/AdminReports";
import LandingPage from './components/LandingPage';
import UserRental from './components/UserRental';
import UserTransactionDetail from "./components/UserTransactionDetail";

function App() {
  // GANTI localStorage JADI sessionStorage
  const role = sessionStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. HALAMAN PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. JALUR KHUSUS ADMIN */}
        {/* Cek apakah role == 'admin'. Jika ya, render layout admin. */}
        {role === 'admin' && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        )}

        {/* 3. JALUR KHUSUS USER */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Proteksi Halaman Rental: Jika Admin iseng buka rental, boleh saja, tapi logikanya untuk user */}
        <Route 
          path="/rental" 
          element={role ? <UserRental /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/transaction/:id" 
          element={role ? <UserTransactionDetail /> : <Navigate to="/login" />} 
        />

        {/* 4. CATCH ALL - Pengalihan Cerdas */}
        {/* Jika user nyasar ke link mati, kembalikan sesuai role */}
        <Route path="*" element={<Navigate to={role === 'admin' ? "/admin/dashboard" : "/"} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;