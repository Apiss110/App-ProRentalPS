import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/rent.css";

function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/auth/register", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          alert("Akun berhasil dibuat. Silakan login.");
          navigate("/login");
        } else {
          setErrorMsg(res.data.Error || "Terjadi kesalahan");
        }
      })
      .catch(() => {
        setErrorMsg("Terjadi kesalahan sistem");
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-panel">
        <h2 className="login-title">REGISTER</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>No. Telepon</label>
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            DAFTAR
          </button>
        </form>

        <div className="login-footer">
          <p>Sudah punya akun? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;