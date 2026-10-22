import React, { useState, useRef, useEffect } from "react";

const KBLogo = ({ size = 36 }) => (
  <div style={{ 
    width: size, height: size, background: "black", borderRadius: "50%", 
    border: "2.5px solid white", display: "flex", alignItems: "center", 
    justifyContent: "center", fontWeight: "900", color: "white", fontSize: size*0.42,
    position: "relative"
  }}>
    <span style={{ letterSpacing: -1 }}>KB</span>
    <div style={{ 
      position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)",
      width: 10, height: 10, background: "black", borderRight: "2.5px solid white", borderBottom: "2.5px solid white"
    }}></div>
  </div>
);

export default function App() {
  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const [showUpload, setShowUpload] = useState(false);
  const [activeTop, setActiveTop] = useState("For You");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("muzika_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("muzika_videos_real");
    if (saved) return JSON.parse(saved);
    return [{ id: 1, user: "Katongole Rashid", userId: "admin_1", likes: [], views: [], shares: 0, fire: [], isMuzika: true, verified: true }];
  });

  const isAdmin = currentUser?.name === "Katongole Rashid" || currentUser?.isAdmin;

  useEffect(() => { localStorage.setItem("muzika_videos_real", JSON.stringify(videos)); }, [videos]);

  const handleSignup = () => {
    if (!authForm.name || !authForm.email || !authForm.password) return alert("Fill all");
    const db = JSON.parse(localStorage.getItem("muzika_users_db") || "[]");
    if (db.find(u=>u.email===authForm.email)) return alert("Exists, login");
    const newUser = { id: "user_"+Date.now(), name: authForm.name, email: authForm.email, password: authForm.password, isAdmin: authForm.name==="Katongole Rashid", joinedAt: Date.now() };
    db.push(newUser); localStorage.setItem("muzika_users_db", JSON.stringify(db));
    setCurrentUser(newUser); if(newUser.isAdmin) localStorage.setItem("is_muzika_admin","true");
    localStorage.setItem("muzika_user", JSON.stringify(newUser));
  };

  const handleLogin = () => {
    const db = JSON.parse(localStorage.getItem("muzika_users_db") || "[]");
    const found = db.find(u=>u.email===authForm.email && u.password===authForm.password);
    if(!found) return alert("Wrong password");
    setCurrentUser(found); localStorage.setItem("muzika_user", JSON.stringify(found));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const url = URL.createObjectURL(file);
    setVideos([{ id: Date.now(), user: currentUser.name, userId: currentUser.id, likes: [], views: [], shares: 0, fire: [], isMuzika: false, verified: isAdmin, videoUrl: url }, ...videos]);
    setShowUpload(false);
  };

  const toggleLike = (id) => {
    setVideos(videos.map(v => v.id===id ? { ...v, likes: v.likes.includes(currentUser.id) ? v.likes.filter(i=>i!==currentUser.id) : [...v.likes, currentUser.id] } : v));
  };
  const toggleFire = (id) => {
    setVideos(videos.map(v => v.id===id ? { ...v, fire: v.fire.includes(currentUser.id) ? v.fire.filter(i=>i!==currentUser.id) : [...v.fire, currentUser.id] } : v));
  };

  if (!currentUser) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "black", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Arial" }}>
        <KBLogo size={70} />
        <h1 style={{ color: "white", marginTop: 15, fontSize: 24 }}>Kampala Business</h1>
        <p style={{ color: "#888", fontSize: 12, marginBottom: 20 }}>KB Pin Logo • Muzika</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button onClick={()=>setAuthMode("login")} style={{ background: authMode==="login"?"white":"#222", color: authMode==="login"?"black":"white", border: "none", padding: "10px 20px", borderRadius: 20, fontWeight: "bold" }}>Login</button>
          <button onClick={()=>setAuthMode("signup")} style={{ background: authMode==="signup"?"#00ff88":"#222", color: authMode==="signup"?"black":"white", border: "none", padding: "10px 20px", borderRadius: 20, fontWeight: "bold" }}>Sign Up</button>
        </div>
        <div style={{ width: "100%", maxWidth: 300, background: "#111", padding: 20, borderRadius: 16 }}>
          {authMode==="signup" && <input value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} placeholder="Name: Katongole Rashid" style={{ width: "100%", padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none", marginBottom: 10 }} />}
          <input value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} placeholder="Email" style={{ width: "100%", padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none", marginBottom: 10 }} />
          <input value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} type="password" placeholder="Password" style={{ width: "100%", padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none", marginBottom: 15 }} />
          {authMode==="signup" ? <button onClick={handleSignup} style={{ width: "100%", background: "white", color: "black", padding: 12, borderRadius: 10, border: "none", fontWeight: "bold" }}>Sign Up</button> : <button onClick={handleLogin} style={{ width: "100%", background: "#00ff88", color: "black", padding: 12, borderRadius: 10, border: "none", fontWeight: "bold" }}>Login</button>}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`*{margin:0;padding:0;box-sizing:border-box} html,body{overflow:hidden;background:#000} .feed::-webkit-scrollbar{display:none}`}</style>
      <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", height: "100dvh", background: "black", overflow: "hidden", fontFamily: "Arial" }}>
        
        {/* TOP WITH KB PIN LOGO */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
          <KBLogo size={36} />
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div onClick={()=>setActiveTop("For You")} style={{ color: activeTop==="For You"?"white":"#aaa", fontWeight: "bold", fontSize: 15, borderBottom: activeTop==="For You"?"2px solid white":"none", paddingBottom: 3 }}>For You</div>
            <div onClick={()=>setActiveTop("Muzika")} style={{ color: activeTop==="Muzika"?"#00ff88":"#aaa", fontSize: 14, fontWeight: "bold" }}>Muzika</div>
            <div style={{ color: "#aaa", fontSize: 13 }}>Following</div>
            <div style={{ color: "#aaa", fontSize: 13 }}>Live</div>
          </div>
          <div style={{ width: 36 }} />
        </div>

        <div className="feed" style={{ width: "100%", height: "100%", overflowY: "auto", scrollSnapType: "y mandatory" }}>
          {videos.map((video) => (
            <div key={video.id} style={{ width: "100vw", height: "100vh", height: "100dvh", scrollSnapAlign: "start", position: "relative", background: "black" }}>
              {video.videoUrl ? <video ref={el=>videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline autoPlay muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#111" }} />}

              {/* RIGHT SIDE - FULL FROM +FOLLOW TO SHARE FIRE LIKE */}
              <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                
                {/* K + FOLLOW */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 16, border: "2px solid white" }}>K</div>
                  <div style={{ width: 20, height: 20, background: "#FE2C55", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, marginTop: -9, border: "2px solid black", fontWeight: "bold" }}>+</div>
                </div>

                {/* LIKE */}
                <div onClick={()=>toggleLike(video.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 30, filter: video.likes.includes(currentUser.id) ? "none" : "grayscale(0.5)" }}>❤️</div>
                  <div style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>{video.likes.length}</div>
                </div>

                {/* HISTORY / VIEWS */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26 }}>🕒</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.views.length}</div>
                </div>

                {/* COMMENT */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26 }}>💬</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>0</div>
                </div>

                {/* SHARE */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26 }}>↗️</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.shares}</div>
                </div>

                {/* FIRE LIKE */}
                <div onClick={()=>toggleFire(video.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 28, filter: video.fire.includes(currentUser.id) ? "none" : "grayscale(0.5)" }}>🔥</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.fire.length}</div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 12, bottom: 90, right: 80 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: "bold", fontSize: 14, color: "white" }}>{video.user}</span>
                  {video.verified && <span style={{ background: "#1DA1F2", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: "bold" }}>✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 30 }}>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 22 }}>🏠</div><div style={{ fontSize: 9, color: "white", fontWeight: "bold" }}>Home</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 12, background: "#222", color: "white", padding: "6px 14px", borderRadius: 6, display: "inline-block", fontWeight: "bold" }}>Live</div></div>
          <div onClick={()=>setShowUpload(true)} style={{ background: "white", width: 42, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 22, fontWeight: "bold" }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>💬</div><div style={{ fontSize: 9, color: "white" }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>👤</div><div style={{ fontSize: 9, color: "white" }}>You</div></div>
        </div>

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <KBLogo size={50} />
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={()=>fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", fontWeight: "bold", marginTop: 20, width: "90%", maxWidth: 300 }}>Choose Video</button>
            <button onClick={()=>setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
