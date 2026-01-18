// UserTransactionDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function UserTransactionDetail() {
  const { id } = useParams();
  const rootRef = useRef(null);

  const [transaction, setTransaction] = useState(null);
  const [file, setFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/rentals/detail/" + id)
      .then((res) => {
        setTransaction(res.data);
        if (res.data?.payment_method) setPaymentMethod(res.data.payment_method);
      })
      .catch(console.log);
  }, [id]);

  // realtime payment status
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://localhost:3000/rentals/detail/" + id)
        .then((res) => {
          if (res.data) {
            setTransaction((prev) => ({ ...prev, payment_status: res.data.payment_status }));
          }
        })
        .catch(() => {});
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  const handlePayment = () => {
    if (!paymentMethod) return alert("Pilih metode pembayaran dulu!");

    const formData = new FormData();
    formData.append("payment_method", paymentMethod);
    if (file) formData.append("proof", file);

    axios
      .put("http://localhost:3000/rentals/pay/" + id, formData)
      .then((res) => {
        if (res.data.Status === "Success") {
          alert("Pembayaran berhasil dikirim. Menunggu verifikasi admin.");
          window.location.reload();
        } else alert("Gagal upload");
      })
      .catch(console.log);
  };

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
      num || 0
    );

  if (!transaction) return <div style={{ padding: 50, textAlign: "center" }}>Loading...</div>;

  const statusLabel =
    transaction.payment_status === "paid"
      ? "LUNAS (Verified)"
      : transaction.payment_status === "pending"
      ? "Menunggu Konfirmasi"
      : "Belum Bayar";

  return (
    <div
      ref={rootRef}
      style={{
        minHeight: "100vh",
        background: "#f8f6f2",
        padding: "36px 20px",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto",
        color: "#2a1c12",
      }}
    >
      <style>{`
        *,*::before,*::after { box-sizing: border-box; }

        .wrap { max-width:1100px; margin:0 auto; }

        .top-summary {
          display:flex;
          gap:20px;
          align-items:center;
          background: linear-gradient(180deg,#fffaf0,#ffffff);
          padding:22px;
          border-radius:16px;
          box-shadow: 0 20px 48px rgba(0,0,0,0.06);
          margin-bottom:26px;
        }

        .left-sum { flex:1 }
        .right-sum { min-width:220px; text-align:center }

        .tx-title { font-size:18px; margin:0 0 6px; font-weight:800; }
        .tx-sub { color:#6b6b6b; margin:0 0 12px; font-size:14px; }

        .tx-big {
          font-size:24px;
          font-weight:900;
          color: #4a3523;
          margin-top:6px;
        }

        .badge {
          display:inline-block;
          padding:6px 12px;
          border-radius:999px;
          font-weight:700;
        }
        .paid { background:#e8f7ee; color:#1e7f4f; }
        .pending { background:#fff3cd; color:#856404; }
        .unpaid { background:#fdecea; color:#b02a37; }

        .grid {
          display:grid;
          grid-template-columns: 2fr 1fr;
          gap:24px;
        }

        .card {
          background:white;
          border-radius:14px;
          padding:18px;
          box-shadow: 0 14px 36px rgba(0,0,0,0.04);
        }

        .table {
          width:100%;
          border-collapse:collapse;
          margin-bottom:12px;
        }
        .table th {
          text-align:left;
          font-size:12px;
          color:#7a7a7a;
          padding:12px 10px;
          border-bottom:1px solid #efefef;
        }
        .table td {
          padding:12px 10px;
          border-bottom:1px solid #f4f4f4;
        }

        .muted { color:#7a7a7a; font-size:13px; }

        .pay-block {
          margin-top:12px;
          border-radius:10px;
          padding:12px;
          background: linear-gradient(180deg,#fff,#fffaf0);
          border:1px solid #efe6d4;
        }

        .radio-row { display:flex; gap:10px; margin-top:10px; }
        .radio-row label {
          flex:1;
          display:flex;
          gap:8px;
          align-items:center;
          padding:10px;
          border-radius:10px;
          border:1px solid #eee;
          cursor:pointer;
          font-weight:700;
        }
        input[type="file"] { margin-top:12px; }

        .btn {
          display:block;
          width:100%;
          margin-top:14px;
          padding:14px;
          border-radius:12px;
          font-weight:800;
          background: linear-gradient(90deg,#e5c07b,#c9a24d);
          border:none;
          cursor:pointer;
        }

        .small { font-size:13px; color:#666 }

        @media (max-width: 880px) {
          .grid { grid-template-columns: 1fr; }
          .right-sum { min-width: auto; text-align:left }
          .top-summary { flex-direction:column; align-items:flex-start }
        }
      `}</style>

      <div className="wrap">
        {/* TOP SUMMARY */}
        <div className="top-summary" data-reveal>
          <div className="left-sum">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
              <div>
                <div className="tx-title">Transaksi #{transaction.id || "-"}</div>
                <div className="tx-sub">{transaction.ps_name || "-"}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className={`badge ${transaction.payment_status === "paid" ? "paid" : transaction.payment_status === "pending" ? "pending" : "unpaid"}`}>
                  {statusLabel}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ minWidth: 160 }}>
                <div className="small">Tanggal</div>
                <div style={{ fontWeight: 700 }}>{transaction.tanggal_sewa || "-"}</div>
              </div>

              <div style={{ minWidth: 160 }}>
                <div className="small">Jam</div>
                <div style={{ fontWeight: 700 }}>{transaction.jam_mulai || "-"} — {transaction.jam_selesai || "-"}</div>
              </div>

              <div style={{ minWidth: 160 }}>
                <div className="small">Durasi</div>
                <div style={{ fontWeight: 700 }}>{transaction.duration} jam</div>
              </div>
            </div>
          </div>

          <div className="right-sum">
            <div className="small">TOTAL BAYAR</div>
            <div className="tx-big">{formatRupiah(transaction.total_price)}</div>
            <div style={{ marginTop: 10 }}>
              <Link to="/" style={{ textDecoration: "none", color: "#4a3523", fontWeight: 700 }}>← Kembali</Link>
            </div>
          </div>
        </div>

        {/* GRID: LEFT = details + history, RIGHT = payment card */}
        <div className="grid">
          {/* LEFT */}
          <div className="card" data-reveal>
            <h3 style={{ marginTop: 0 }}>Rincian Pesanan</h3>

            <table className="table" aria-hidden>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: 180 }}>Room</td>
                  <td>{transaction.ps_name}</td>
                </tr>
                <tr>
                  <td>Jam Mulai</td>
                  <td>{transaction.jam_mulai || "-"}</td>
                </tr>
                <tr>
                  <td>Jam Selesai</td>
                  <td>{transaction.jam_selesai || "-"}</td>
                </tr>
                <tr>
                  <td>Durasi</td>
                  <td>{transaction.duration} jam</td>
                </tr>
                <tr>
                  <td>Harga / jam</td>
                  <td>{formatRupiah(transaction.price_per_hour)}</td>
                </tr>
                <tr>
                  <td>Total Harga</td>
                  <td style={{ fontWeight: 800 }}>{formatRupiah(transaction.total_price)}</td>
                </tr>
                <tr>
                  <td>Tanggal</td>
                  <td>{transaction.tanggal_sewa || "-"}</td>
                </tr>
                <tr>
                  <td>Status Booking</td>
                  <td className="small">{transaction.status || "-"}</td>
                </tr>
              </tbody>
            </table>

            {/* Optional: payment history / notes (if available) */}
            {transaction.notes && (
              <div style={{ marginTop: 12 }}>
                <h4 style={{ margin: "6px 0" }}>Catatan</h4>
                <div className="small">{transaction.notes}</div>
              </div>
            )}
          </div>

          {/* RIGHT - payment */}
          <aside className="card" data-reveal>
            <h3 style={{ marginTop: 0 }}>Pembayaran</h3>

            {transaction.payment_status === "paid" ? (
              <div style={{ padding: 12, borderRadius: 10, background: "#f0fff6", border: "1px solid #e3f3e6" }}>
                <div style={{ fontWeight: 800, color: "#1e7f4f" }}>Pembayaran terverifikasi</div>
                <div className="small" style={{ marginTop: 6 }}>Terima kasih — selamat bermain!</div>
              </div>
            ) : (
              <>
                <div className="pay-block">
                  <div className="small">Pilih Metode</div>

                  <div className="radio-row" role="radiogroup" aria-label="Metode Pembayaran" style={{ marginTop: 8 }}>
                    <label style={{ borderColor: paymentMethod === "QRIS" ? "#d4a017" : undefined }}>
                      <input
                        type="radio"
                        name="method"
                        value="QRIS"
                        checked={paymentMethod === "QRIS"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      QRIS
                    </label>

                    <label style={{ borderColor: paymentMethod === "Transfer Bank" ? "#d4a017" : undefined }}>
                      <input
                        type="radio"
                        name="method"
                        value="Transfer Bank"
                        checked={paymentMethod === "Transfer Bank"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Transfer Bank
                    </label>
                  </div>

                  {/* Dynamic blocks */}
                  {paymentMethod === "QRIS" && (
                    <div style={{ textAlign: "center", marginTop: 14 }}>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                        alt="QR"
                        width={160}
                        style={{ borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                      />
                      <div className="small" style={{ marginTop: 8 }}>Scan QRIS — <strong>Play&Go</strong></div>
                    </div>
                  )}

                  {paymentMethod === "Transfer Bank" && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: "grid", gap: 8 }}>
                        <div>
                          <div className="small">BCA</div>
                          <div style={{ fontWeight: 800 }}>123-456-7890</div>
                          <div className="small" style={{ color: "#b33" }}>a.n Play&Go Rental</div>
                        </div>
                        <div>
                          <div className="small">Mandiri</div>
                          <div style={{ fontWeight: 800 }}>987-654-3210</div>
                          <div className="small" style={{ color: "#b33" }}>a.n Play&Go Rental</div>
                        </div>
                      </div>

                      <div className="small" style={{ marginTop: 10, color: "#b33" }}>
                        *Harap transfer sesuai nominal <strong>{formatRupiah(transaction.total_price)}</strong>
                      </div>
                    </div>
                  )}

                  <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: 12 }} />

                  <button className="btn" onClick={handlePayment} aria-disabled={transaction.payment_status === "pending"}>
                    Kirim Bukti Pembayaran
                  </button>
                </div>

                {/* small hint */}
                <div className="small" style={{ marginTop: 12 }}>
                  Setelah mengirim bukti, status akan berubah ke <strong>Menunggu Konfirmasi</strong>. Admin
                  akan verifikasi dalam beberapa menit.
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default UserTransactionDetail;
