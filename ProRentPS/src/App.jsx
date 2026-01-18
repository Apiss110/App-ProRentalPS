import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- IMPORT KOMPONEN AUTH ---
import Login from "./components/Login";
import Register from "./components/Register";

// --- IMPORT KOMPONEN ADMIN ---
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard"; // Pastikan nama file ini benar (AdminDashboard.jsx)
import AdminSettings from "./components/AdminSettings";
import AdminRooms from "./components/AdminRooms";
import AdminCustomers from "./components/AdminCustomers";
import AdminTransactions from "./components/AdminTransactions";
import AdminReports from "./components/AdminReports";

// --- IMPORT KOMPONEN USER (BARU) ---
import UserDashboard from './components/UserDashboard'; // Halaman Sambutan (Landing Page)
import UserRental from './components/UserRental';       // Halaman Form Sewa

function App() {
  // Ambil role dari localStorage untuk penentuan akses
  const role = localStorage.getItem("userRole");

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. HALAMAN PUBLIC (Bisa diakses siapa saja) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. JALUR KHUSUS ADMIN */}
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
        {role === 'user' ? (
            <>
              {/* Halaman Utama: Dashboard Sambutan Merah */}
              <Route path="/" element={<UserDashboard />} />
              
              {/* Halaman Rental: Form Sewa & List PS */}
              <Route path="/rental" element={<UserRental />} />
            </>
        ) : (
            // Jika user belum login (role kosong), dan mencoba akses root '/', lempar ke Login
            // (Kecuali dia admin, yang sudah ditangani blok di atas)
            !role && <Route path="/" element={<Navigate to="/login" />} />
        )}

        {/* 4. CATCH ALL (Jika halaman tidak ditemukan, kembalikan ke Login) */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;