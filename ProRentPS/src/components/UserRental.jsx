import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserRental() {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const colors = {
    primary: "#4a3523", dark: "#2a1c12", bgSoft: "#f8f6f2", surface: "#ffffff",
    accent: "#e5c07b", accentMuted: "#b89b5e", textDark: "#2a1c12",
    textOnDark: "#f5f2ec", border: "rgba(0,0,0,0.06)",
  };

  const [psList, setPsList] = useState([]);
  const [allRentals, setAllRentals] = useState([]);
  const [selectedPS, setSelectedPS] = useState(null);
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState("08:00");
  const [duration, setDuration] = useState(1);

  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    timeSlots.push(`${hour}:00`);
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      axios.get("http://localhost:3000/rentals")
        .then((res) => setAllRentals(res.data))
        .catch((err) => console.error(err));
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const resPS = await axios.get("http://localhost:3000/ps");
      setPsList(resPS.data || []);
      const resRentals = await axios.get("http://localhost:3000/rentals");
      setAllRentals(resRentals.data || []);
    } catch (error) { console.error("Gagal ambil data:", error); }
  };

  const formatRupiah = (number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);

  // --- LOGIKA CEK KETERSEDIAAN (YANG DIPERBAIKI) ---
  const checkAvailability = (slotTime) => {
    if (!selectedPS) return "Pilih Room";

    const booked = allRentals.filter(
      (r) =>
        r.ps_id === selectedPS &&
        r.payment_status !== 'rejected' && 
        r.status !== 'cancelled' &&
        r.status !== 'finished' && // <-- KUNCI: Status finished tidak dianggap booking
        r.start_time_str &&
        r.start_time_str.startsWith(date)
    );

    const isBooked = booked.some((r) => {
      const rentalStartHour = parseInt(r.start_time_str.split(" ")[1].split(":")[0]);
      const slotHour = parseInt(slotTime.split(":")[0]);
      const rentalEndHour = rentalStartHour + parseInt(r.duration);
      return slotHour >= rentalStartHour && slotHour < rentalEndHour;
    });

    return isBooked ? "Penuh" : "Tersedia";
  };

  // --- AUTO-FIX JAM ---
  useEffect(() => {
      if (!selectedPS) return;
      const currentStatus = checkAvailability(time);
      if (currentStatus === "Penuh") {
          const firstAvailable = timeSlots.find(t => checkAvailability(t) === "Tersedia");
          if (firstAvailable) setTime(firstAvailable);
      }
  }, [selectedPS, date, allRentals]); 

  const handleRent = (e) => {
    e.preventDefault();
    if (!selectedPS) return alert("Pilih Room dulu!");
    const userId = sessionStorage.getItem("id");
    if (!userId) return alert("Silakan login dulu.");

    if (checkAvailability(time) === "Penuh") return alert("Maaf, jam ini sudah terisi.");

    const unit = psList.find((u) => u.id === selectedPS);
    const totalPrice = unit ? unit.price_per_hour * duration : 0;

    axios.post("http://localhost:3000/rentals", {
        ps_id: selectedPS, user_id: userId, duration: duration,
        rental_type: "Per Jam", total_price: totalPrice,
        booking_date: date, start_time: time,
      })
      .then((res) => {
        if (res.data.Status === "Success") navigate(`/transaction/${res.data.rentalId}`);
        else alert("Gagal: " + res.data.Error);
      })
      .catch((err) => console.error(err));
  };

  // Reveal effect
  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const items = root.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, []);

  const selectedUnit = psList.find((p) => p.id === selectedPS) || null;
  const totalPreview = selectedUnit ? selectedUnit.price_per_hour * Number(duration || 0) : 0;

  return (
    <div ref={rootRef} style={{ fontFamily: "system-ui", background: colors.bgSoft, minHeight: "100vh", color: colors.textDark }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        :root{ --retro-accent: ${colors.accent}; --retro-brown: ${colors.dark}; --retro-paper: ${colors.bgSoft}; --surface: ${colors.surface}; }
        
        .r-header { display:flex; justify-content:space-between; align-items:center; padding:20px 40px; background: linear-gradient(90deg,var(--surface), #fffaf0); border-bottom: 4px solid var(--retro-brown); box-shadow: 0 6px 18px rgba(0,0,0,0.04); }
        .r-brand { font-family: 'Press Start 2P', cursive; font-size: 16px; color: var(--retro-brown); }
        .r-container { max-width:1200px; margin:36px auto; padding: 0 20px; display:grid; grid-template-columns: 2fr 1fr; gap: 36px; }
        .r-hero { height:200px; border-radius:14px; display:flex; align-items:center; justify-content:center; color: var(--retro-paper); font-family: 'Press Start 2P', cursive; background: linear-gradient(135deg, ${colors.primary}, ${colors.dark}); box-shadow: 0 18px 40px rgba(0,0,0,0.06); }
        .r-info-card { background: var(--surface); padding:20px; border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        .availability { margin-top: 18px; border-radius:12px; background:var(--surface); box-shadow: 0 6px 20px rgba(0,0,0,0.04); }
        .slot-row { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px dashed #eee; transition: background .14s ease; }
        .slot-row.booked { background: rgba(229,192,123,0.06); }
        .slot-left { display:flex; gap:12px; align-items:center; }
        .slot-time { font-weight:700; color:var(--retro-brown); }
        .slot-next { font-size:12px; color:#888; }
        .badge { display:inline-block; padding:6px 10px; border-radius:999px; font-weight:700; font-size:12px; }
        .badge.ok { background: rgba(74,53,35,0.08); color:var(--retro-brown); }
        .badge.full { background: rgba(220,53,69,0.12); color:#b93a3a; }
        aside.booking { background: linear-gradient(180deg,var(--surface), #fffaf0); border-radius: 16px; padding: 28px; box-shadow: 0 22px 48px rgba(0,0,0,0.07); position: sticky; top: 28px; }
        .input { width:100%; padding:14px 16px; border-radius:12px; border:1px solid #efe6d8; margin:8px 0 14px; background:#fff; min-height:48px; }
        .ps-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; margin-top:10px; }
        .ps-btn { display:flex; flex-direction:column; gap:6px; padding:12px; border-radius:12px; border:1px solid #efe6d8; background:#fff; cursor:pointer; text-align:left; }
        .ps-btn.active { background: linear-gradient(180deg,#fffaf0, #fff8e6); border-color: var(--retro-accent); }
        .summary { margin-top:18px; padding:12px; border-radius:10px; background:linear-gradient(180deg,#fff,#fffaf0); border:1px solid #f0e7d6; display:flex; justify-content:space-between; align-items:center; }
        .btn-cta { margin-top:18px; background: linear-gradient(90deg,var(--retro-accent), #c9a24d); color: #221b12; padding:14px; border-radius:12px; width:100%; font-weight:800; cursor:pointer; border:none; min-height:48px; }
        [data-reveal] { opacity:0; transform: translateY(18px); transition: all .6s; }
        [data-reveal].show { opacity:1; transform: translateY(0); }
      `}</style>

      <header className="r-header" data-reveal>
        <div className="r-brand">RetroPlay</div>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.06)", padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}>Kembali</button>
      </header>

      <main className="r-container" data-reveal>
        <section>
          <div className="r-hero" data-reveal>RETRO PLAY</div>
          <h1 style={{ margin: "16px 0 6px", fontSize: 22 }}>RetroPlay Bandung</h1>
          <p style={{ marginBottom: 14, color: "#6b6b6b" }}>📍 Jl. Merdeka No. 123 · 0812-3456-7890</p>
          <div className="r-info-card" data-reveal>
            <h3 style={{ marginTop: 0 }}>Sorotan / Aturan</h3>
            <ul style={{ paddingLeft: 18, lineHeight: 1.8, color: "#444", margin: 0 }}>
              <li>Dilarang merokok (Vape diperbolehkan)</li>
              <li>Dilarang membuang sampah sembarangan</li>
            </ul>
          </div>

          <h3 style={{ margin: "22px 0 12px" }}>Cek Ketersediaan ({date})</h3>
          <div className="availability" data-reveal>
            {timeSlots.map((slot) => {
              const status = checkAvailability(slot);
              const nextHour = parseInt(slot.split(":")[0]) + 1;
              const nextSlot = `${nextHour === 24 ? "00" : nextHour < 10 ? "0"+nextHour : nextHour}:00`;
              const booked = status === "Penuh";
              return (
                <div key={slot} className={`slot-row ${booked ? "booked" : ""}`}>
                  <div className="slot-left">
                    <div style={{ minWidth: 72 }}>
                      <div className="slot-time">{slot}</div>
                      <div className="slot-next">{nextSlot}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {selectedPS ? (
                      booked ? <span className="badge full">Penuh</span> : 
                      <>
                        <div style={{ fontWeight: 700, marginBottom: 6 }}>{formatRupiah(psList.find((p) => p.id === selectedPS)?.price_per_hour || 0)}</div>
                        <span className="badge ok">Tersedia</span>
                      </>
                    ) : <span style={{ color: "#aaa", fontSize: 13 }}>Pilih Room</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="booking" data-reveal>
          <div className="form-title">Pesan Sekarang</div>
          <form onSubmit={handleRent} style={{ marginTop: 10 }}>
            <label style={{ fontWeight: 700, fontSize: 13 }}>Tanggal</label>
            <input className="input" type="date" value={date} min={getTodayString()} onChange={(e) => setDate(e.target.value)} />
            
            <label style={{ fontWeight: 700, fontSize: 13 }}>Jenis Tiket (Room)</label>
            <div className="ps-grid" style={{ marginBottom: 6 }}>
              {psList.map((ps) => (
                <button key={ps.id} type="button" className={`ps-btn ${selectedPS === ps.id ? "active" : ""}`} onClick={() => setSelectedPS(ps.id)}>
                  <div className="ps-name">{ps.name}</div>
                  <div className="ps-price">{formatRupiah(ps.price_per_hour)}</div>
                </button>
              ))}
            </div>

            <label style={{ fontWeight: 700, fontSize: 13 }}>Jam Mulai</label>
            <select className="input" value={time} onChange={(e) => setTime(e.target.value)}>
              {timeSlots.filter((t) => checkAvailability(t) !== "Penuh").map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <label style={{ fontWeight: 700, fontSize: 13 }}>Durasi (Jam)</label>
            <input className="input" type="number" min="1" max="10" value={duration} onChange={(e) => setDuration(e.target.value)} />

            <div className="summary">
              <div className="left">{selectedUnit ? selectedUnit.name : "Belum pilih"} · {duration} jam</div>
              <div className="right">{formatRupiah(totalPreview)}</div>
            </div>
            <button className="btn-cta" type="submit">Pesan Sekarang</button>
          </form>
        </aside>
      </main>
    </div>
  );
}

export default UserRental;