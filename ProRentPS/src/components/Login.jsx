import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/rent.css";

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  /* ================== CEK SESI ================== */
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role) {
      if (role.toLowerCase() === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        values
      );

      if (res.data?.Status === "Success") {
        sessionStorage.setItem("token", res.data.Token);
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("id", res.data.id);
        sessionStorage.setItem("username", res.data.username);

        if (res.data.role.toLowerCase() === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      } else {
        alert(res.data?.Error || "Login gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-panel">
        <h2>Login RentalPlay</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              required
              onChange={handleInput}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleInput}
            />
          </div>

          <button type="submit">MASUK</button>

          <p>
            Belum punya akun? <a href="/register">Daftar Sekarang</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
