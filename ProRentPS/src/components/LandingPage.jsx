import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import heroPS from "../assets/hero-ps.png";

/* ================== GLOBAL STYLE ================== */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      :root {
        --retro-yellow: #e5c07b;
        --retro-brown: #2a1c12;
        --retro-paper: #f8f6f2;
      }

      body {
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        background: var(--retro-paper);
        color: var(--retro-brown);
      }

      h1, h2 { letter-spacing: 1px; }
      h1 { font-family: 'Press Start 2P', cursive; text-transform: uppercase; }

      .reveal { opacity: 0; transform: translateY(40px); transition: all .9s cubic-bezier(.22,1,.36,1); }
      .reveal.show { opacity: 1; transform: translateY(0); }

      .lift { transition: transform .25s ease, box-shadow .25s ease; box-shadow: 0 6px 0 rgba(0,0,0,.25); }
      .lift:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(0,0,0,.25); }

      a.lift { position: relative; }
      a.lift::after { content: ""; position: absolute; inset: 0; border: 2px solid rgba(0,0,0,.25); border-radius: inherit; pointer-events: none; }

      body::before { content: ""; position: fixed; inset: 0; pointer-events: none; background: repeating-linear-gradient(to bottom, rgba(0,0,0,.03), rgba(0,0,0,.03) 1px, transparent 1px, transparent 3px); z-index: 9999; mix-blend-mode: multiply; }

      img { filter: drop-shadow(0 0 12px rgba(229,192,123,.25)) contrast(1.05) saturate(1.1); }

      .stagger > * { opacity: 0; transform: translateY(20px); transition: all .6s ease; }
      .reveal.show .stagger > * { opacity: 1; transform: translateY(0); }
      .reveal.show .stagger > *:nth-child(1){transition-delay:.1s}
      .reveal.show .stagger > *:nth-child(2){transition-delay:.25s}
      .reveal.show .stagger > *:nth-child(3){transition-delay:.4s}
      .reveal.show .stagger > *:nth-child(4){transition-delay:.55s}

      /* === HERO IMAGE ANIMATION === */
  @keyframes floatPS {
    0% { transform: translateY(0) scale(1.08); }
    50% { transform: translateY(-18px) scale(1.1); }
    100% { transform: translateY(0) scale(1.08); }
  }

  @keyframes glowPulse {
    0% { filter: drop-shadow(0 20px 40px rgba(0,0,0,.5)); }
    50% { filter: drop-shadow(0 35px 55px rgba(229,192,123,.6)); }
    100% { filter: drop-shadow(0 20px 40px rgba(0,0,0,.5)); }
  }

  .hero-ps {
    animation:
      floatPS 6s ease-in-out infinite,
      glowPulse 4.5s ease-in-out infinite;
    transition: transform .4s ease;
    will-change: transform;
  }

  .hero-ps:hover {
    transform: scale(1.14) rotate(-1deg);
  }

}    `}</style>
  );
}

/* ================== NAVBAR BARU (LOGIKA SESSION) ================== */
function Navbar({ colors }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // CEK sessionStorage
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("username");
    
    if (token) {
      setIsLoggedIn(true);
      setUsername(user || "Player");
    }
  }, []);

  const handleLogout = () => {
    // HAPUS sessionStorage
    sessionStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '20px 40px', background: colors.accent, borderBottom: `4px solid ${colors.dark}`
    }}>
      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '18px', color: colors.dark }}>
        RetroPlay
      </div>
      
      <div>
        {isLoggedIn ? (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontWeight: 'bold' }}>
            <span style={{ color: colors.dark }}>Hi, {username}!</span>
            <button 
              onClick={handleLogout}
              className="lift"
              style={{
                background: '#cc0000', color: 'white', border: '2px solid black',
                padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold'
              }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: colors.dark, fontWeight: 'bold' }}>LOGIN</Link>
            <Link to="/register" style={{ textDecoration: 'none', color: colors.dark, fontWeight: 'bold' }}>DAFTAR</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ================== HERO ================== */
function HeroSection({ colors }) {
  // Cek apakah sudah login (untuk link tombol)
  const isLoggedIn = sessionStorage.getItem("token");

  return (
    <section
      className="reveal"
      style={{
        padding: "80px 20px",
        background: `linear-gradient(180deg, ${colors.primary}, ${colors.dark})`,
        color: colors.textOnDark,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "50px",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "36px", lineHeight: 1.3, marginBottom: "18px" }}>
            Rental PlayStation<br />RetroPlay
          </h1>
          <p style={{ maxWidth: "480px", opacity: 0.85, marginBottom: "32px", lineHeight: 1.7 }}>
            Booking rental PlayStation kini lebih mudah. Sistem online yang rapi dan transparan.
          </p>
          <div style={{ display: "flex", gap: "14px" }}>
            {/* Logika Tombol: Jika Login -> Ke Rental, Jika Belum -> Ke Login */}
            <Link
              to={isLoggedIn ? "/rental" : "/login"}
              className="lift"
              style={{
                padding: "14px 32px", background: colors.accent, color: colors.textDark,
                borderRadius: "10px", fontWeight: 600, textDecoration: "none"
              }}
            >
              Mulai Booking
            </Link>
            <a href="#booking" className="lift" style={{ padding: "14px 28px", borderRadius: "10px", border: `1px solid ${colors.borderOnDark}`, color: colors.textOnDark, textDecoration: "none" }}>
              Cara Booking
            </a>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
  style={{
    position: "relative",
    display: "flex",
    justifyContent: "center",
  }}
>
  <img
    src={heroPS}
    alt="PlayStation"
    className="hero-ps"
    style={{
      width: "120%",
      maxWidth: "520px",
      zIndex: 2,
    }}
  />

  {/* backdrop glow */}
  <div
    style={{
      position: "absolute",
      inset: "20% 10%",
      background: "radial-gradient(circle, rgba(229,192,123,.35), transparent 70%)",
      filter: "blur(40px)",
      zIndex: 1,
    }}
  />
</div>

        </div>
      </div>
    </section>
  );
}

/* ================== FEATURES & OTHERS (SAMA) ================== */
function FeaturesSection({ colors }) {
  const features = [
    { title: "Unit Lengkap", desc: "Pilihan unit PlayStation lengkap dengan kondisi terawat." },
    { title: "Booking Online", desc: "Proses pemesanan mudah melalui sistem online." },
    { title: "Game Original", desc: "Koleksi game original untuk pengalaman maksimal." },
    { title: "Harga Transparan", desc: "Harga jelas tanpa biaya tersembunyi." },
  ];
  return (
    <section className="reveal" style={{ padding: "90px 20px", background: colors.bgSoft }}>
      <h2 style={{ textAlign: "center", marginBottom: "48px" }}>Fitur Unggulan</h2>
      <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "22px" }}>
        {features.map((item) => (
          <div key={item.title} className="lift" style={{ background: colors.surface, padding: "26px", borderRadius: "14px" }}>
            <h3 style={{ marginBottom: "8px" }}>{item.title}</h3>
            <p style={{ opacity: 0.75, fontSize: "14px", lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CaraBookingSection({ colors }) {
  const steps = [
    { title: "Pilih Unit", desc: "Pilih unit PlayStation sesuai kebutuhan." },
    { title: "Tentukan Tanggal", desc: "Atur jadwal sewa dan durasi bermain." },
    { title: "Konfirmasi", desc: "Lengkapi data dan konfirmasi pesanan." },
    { title: "Mainkan!", desc: "Unit PlayStation siap digunakan." },
  ];
  return (
    <section id="booking" className="reveal" style={{ padding: "100px 20px", background: "#ffffff" }}>
      <h2 style={{ textAlign: "center", marginBottom: "50px" }}>Cara Booking</h2>
      <div className="stagger" style={{ maxWidth: "900px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "24px" }}>
        {steps.map((step, i) => (
          <div key={step.title} className="lift" style={{ padding: "26px", borderRadius: "14px", background: colors.bgSoft }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: colors.accent, marginBottom: "8px" }}>STEP {String(i + 1).padStart(2, "0")}</div>
            <h3 style={{ marginBottom: "8px" }}>{step.title}</h3>
            <p style={{ opacity: 0.75, fontSize: "14px", lineHeight: 1.6 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyUsSection({ colors }) {
    const reasons = [
      { title: "Unit Terawat", desc: "Setiap unit PlayStation dirawat dan dicek secara rutin agar selalu siap digunakan dengan performa optimal." },
      { title: "Booking Cepat", desc: "Proses booking dibuat ringkas dan jelas, memungkinkan pelanggan melakukan pemesanan tanpa hambatan." },
      { title: "Sistem Transparan", desc: "Informasi harga dan durasi sewa ditampilkan secara terbuka tanpa biaya tambahan tersembunyi." },
      { title: "Nuansa Retro", desc: "Menghadirkan suasana bermain klasik yang membangkitkan nostalgia rental PlayStation." },
    ];
    return (
      <section className="reveal" style={{ padding: "110px 20px", background: "#f8f6f2" }}>
        <div style={{ maxWidth: "1100px", margin: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ marginBottom: "16px", color: colors.dark }}>Kenapa Kami?</h2>
            <p style={{ maxWidth: "620px", margin: "0 auto", lineHeight: 1.7, opacity: 0.85, color: colors.dark }}>
              Kami membangun rental PlayStation dengan sistem yang rapi, unit terawat, dan pengalaman bermain yang benar-benar diperhatikan.
            </p>
          </div>
          <div className="stagger" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
            {reasons.map((item) => (
              <div key={item.title} className="lift" style={{ padding: "30px 26px", background: "#ffffff", borderRadius: "12px", borderLeft: `6px solid ${colors.accent}`, color: colors.dark, textAlign: "center" }}>
                <h4 style={{ marginBottom: "12px", fontSize: "16px" }}>{item.title}</h4>
                <p style={{ fontSize: "14px", lineHeight: 1.6, opacity: 0.75, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

/* ================== MAIN ================== */
export default function LandingPage() {
  const colors = {
    primary: "#4a3523",
    dark: "#2a1c12",
    bgSoft: "#f8f6f2",
    surface: "#ffffff",
    accent: "#e5c07b",
    textDark: "#2a1c12",
    textOnDark: "#f5f2ec",
    borderOnDark: "rgba(255,255,255,.35)",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Navbar colors={colors} /> {/* Tambahkan Navbar di sini */}
      <HeroSection colors={colors} />
      <FeaturesSection colors={colors} />
      <CaraBookingSection colors={colors} />
      <WhyUsSection colors={colors} />

      <footer style={{ padding: "30px", textAlign: "center", background: colors.dark, color: colors.textOnDark, opacity: 0.85 }}>
        © 2026 ProRentPS · Play Retro, Stay Modern
      </footer>
    </>
  );
}