import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const [showUpload, setShowUpload] = useState(false);
  const [activeTop, setActiveTop] = useState("For You");
  const [showUsers, setShowUsers] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login or signup
  const [postToMuzika, setPostToMuzika] = useState(false);
  
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

  // AUTH SYSTEM
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("muzika_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("muzika_all_users");
    return saved ? JSON.parse(saved) : [];
  });

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("muzika_videos_real");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, user: "Katongole Rashid", userId: "admin_1", likes: [], views: [], shares: 0, fire: [], comments: [], isMuzika: true, verified: true, createdAt: Date.now() },
    ];
  });

  const isAdmin = currentUser?.name === "Katongole Rashid" || currentUser?.isAdmin || localStorage.getItem("is_muzika_admin")==="true";

  useEffect(() => {
    localStorage.setItem("muzika_videos_real", JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("muzika_user", JSON.stringify(currentUser));
      if (!allUsers.find(u => u.id === currentUser.id)) {
        const newAll = [...allUsers, currentUser];
        setAllUsers(newAll);
        localStorage.setItem("muzika_all_users", JSON.stringify(newAll));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("muzika_all_users", JSON.stringify(allUsers));
  }, [allUsers]);

  const handleSignup = () => {
    if (!authForm.name || !authForm.email || !authForm.password) {
      alert("Fill all fields");
      return;
    }
    const usersDB = JSON.parse(localStorage.getItem("muzika_users_db") || "[]");
    if (usersDB.find(u => u.email === authForm.email)) {
      alert("Email already exists - Login instead");
      setAuthMode("login");
      return;
    }
    const newUser = {
      id: "user_" + Date.now(),
      name: authForm.name,
      email: authForm.email,
      password: authForm.password,
      isAdmin: authForm.name === "Katongole Rashid",
      joinedAt: Date.now()
    };
    usersDB.push(newUser);
    localStorage.setItem("muzika_users_db", JSON.stringify(usersDB));
    setCurrentUser(newUser);
    if (newUser.isAdmin) localStorage.setItem("is_muzika_admin", "true");
    setShowAuth(false);
    setAuthForm({ name: "", email: "", password: "" });
    alert("Welcome " + newUser.name + "! Account created");
  };

  const handleLogin = () => {
    if (!authForm.email || !authForm.password) {
      alert("Fill email and password");
      return;
    }
    const usersDB = JSON.parse(localStorage.getItem("muzika_users_db") || "[]");
    const found = usersDB.find(u => u.email === authForm.email && u.password === authForm.password);
    if (!found) {
      alert("Wrong email or password - Sign up if new");
      return;
    }
    setCurrentUser(found);
    if (found.isAdmin || found.name === "Katongole Rashid") localStorage.setItem("is_muzika_admin", "true");
    setShowAuth(false);
    setAuthForm({ name: "", email: "", password: "" });
    alert("Welcome back " + found.name + "!");
  };

  const handleLogout = () => {
    localStorage.removeItem("muzika_user");
    setCurrentUser(null);
    setShowAuth(true);
    setAuthMode("login");
  };

  // REAL VIEW - One per user
  useEffect(() => {
    if (!currentUser) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const videoId = parseInt(e.target.dataset.videoid);
        if (e.isIntersecting) {
          e.target.play().catch(()=>{});
          setVideos(prev => prev.map(v => {
            if (v.id === videoId && !v.views.includes(currentUser.id)) {
              return { ...v, views: [...v.views, currentUser.id] };
            }
            return v;
          }));
        } else e.target.pause();
      });
    }, { threshold: 0.7 });
    Object.values(videoRefs.current).forEach(v => v && obs.observe(v));
    return () => obs.disconnect();
  }, [videos, currentUser]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (postToMuzika && !isAdmin) {
      alert("Only Katongole Rashid can post to Muzika!");
      return;
    }
    const url = URL.createObjectURL(file);
    const newVideo = {
      id: Date.now(), user: currentUser.name, userId: currentUser.id,
      likes: [], views: [], shares: 0, fire: [], comments: [],
      isMuzika: postToMuzika, verified: isAdmin, videoUrl: url, createdAt: Date.now()
    };
    setVideos([newVideo, ...videos]);
    setShowUpload(false);
  };

  const toggleLike = (id) => {
    if (!currentUser) { setShowAuth(true); return; }
    setVideos(videos.map(v => {
      if (v.id === id) {
        const liked = v.likes.includes(currentUser.id);
        return { ...v, likes: liked ? v.likes.filter(i=>i!==currentUser.id) : [...v.likes, currentUser.id] };
      }
      return v;
    }));
  };

  const toggleFire = (id) => {
    if (!currentUser) { setShowAuth(true); return; }
    setVideos(videos.map(v => {
      if (v.id === id) {
        const fired = v.fire.includes(currentUser.id);
        return { ...v, fire: fired ? v.fire.filter(i=>i!==currentUser.id) : [...v.fire, currentUser.id] };
      }
      return v;
    }));
  };

  const filteredVideos = videos.filter(v => {
    if (activeTop === "Muzika") return v.isMuzika;
    if (activeTop === "For You") return !v.isMuzika;
    return true;
  });

  // If not logged in, show auth screen
  if (!currentUser) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "black", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Arial" }}>
        <style>{`* {margin:0;padding:0;box-sizing:border-box} html,body{overflow:hidden;background:#000}`}</style>
        <div style={{ background: "white", width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>KB</div>
        <h1 style={{ color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>Muzika App</h1>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 30, textAlign: "center" }}>Real views, real likes - 1 per person<br/>{allUsers.length} people joined</p>
        
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button onClick={() => { setAuthMode("login"); setShowAuth(true); }} style={{ background: authMode==="login" ? "white" : "#222", color: authMode==="login" ? "black" : "white", border: "none", padding: "10px 24px", borderRadius: 20, fontWeight: "bold" }}>Login</button>
          <button onClick={() => { setAuthMode("signup"); setShowAuth(true); }} style={{ background: authMode==="signup" ? "#00ff88" : "#222", color: authMode==="signup" ? "black" : "white", border: "none", padding: "10px 24px", borderRadius: 20, fontWeight: "bold" }}>Sign Up</button>
        </div>

        {showAuth || true ? (
          <div style={{ width: "100%", maxWidth: 300, background: "#111", padding: 20, borderRadius: 16 }}>
            {authMode === "signup" && (
              <input value={authForm.name} onChange={e=>setAuthForm({...authForm, name: e.target.value})} placeholder="Full Name (Katongole Rashid for admin)" style={{ width: "100%", padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none", marginBottom: 10 }} />
            )}
            <input value={authForm.email} onChange={e=>setAuthForm({...authForm, email: e.target.value})} placeholder="Email" style={{ width: "100%", padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none", marginBottom: 10 }} />
            <input value={authForm.password} onChange={e=>setAuthForm({...authForm, password: e.target.value})} type="password" placeholder="Password" style={{ width: "100%", padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none", marginBottom: 15 }} />
            
            {authMode === "signup" ? (
              <button onClick={handleSignup} style={{ width: "100%", background: "white", color: "black", padding: 12, borderRadius: 10, border: "none", fontWeight: "bold" }}>Sign Up - Create Account</button>
            ) : (
              <button onClick={handleLogin} style={{ width: "100%", background: "#00ff88", color: "black", padding: 12, borderRadius: 10, border: "none", fontWeight: "bold" }}>Login</button>
            )}
            
            <div style={{ color: "#666", fontSize: 12, textAlign: "center", marginTop: 12, cursor: "pointer" }} onClick={() => setAuthMode(authMode==="login" ? "signup" : "login")}>
              {authMode==="login" ? "New? Tap to Sign Up" : "Have account? Tap to Login"}
            </div>

            <div style={{ background: "#00ff88", color: "black", padding: 10, borderRadius: 10, marginTop: 15, fontSize: 12, fontWeight: "bold", textAlign: "center" }}>
              Rashid Login: Use Name = Katongole Rashid<br/>Then you get Admin + Muzika access
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <style>{`*{margin:0;padding:0;box-sizing:border-box} html,body,#root{width:100%;height:100%;overflow:hidden;background:#000} body{position:fixed;inset:0} .feed::-webkit-scrollbar{display:none}`}</style>
      <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", height: "100dvh", background: "black", overflow: "hidden", fontFamily: "Arial" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
          <div onClick={() => setShowUsers(true)} style={{ background: "white", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 10 }}>{allUsers.length}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div onClick={() => setActiveTop("For You")} style={{ color: activeTop==="For You" ? "white" : "#888", fontWeight: "bold", fontSize: 15, borderBottom: activeTop==="For You" ? "2px solid white" : "none", paddingBottom: 3 }}>For You</div>
            <div onClick={() => setActiveTop("Muzika")} style={{ color: activeTop==="Muzika" ? "#00ff88" : "#888", fontWeight: "bold", fontSize: 14, borderBottom: activeTop==="Muzika" ? "2px solid #00ff88" : "none", paddingBottom: 3 }}>Muzika</div>
            <div style={{ color: "#888", fontSize: 13 }}>Following</div>
          </div>
          <div onClick={handleLogout} style={{ background: "#222", color: "white", fontSize: 10, padding: "6px 10px", borderRadius: 12, cursor: "pointer" }}>Logout</div>
        </div>

        {showUsers && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 80, padding: 20, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: "white" }}>Joined: {allUsers.length}</h2>
              <button onClick={() => setShowUsers(false)} style={{ background: "#222", color: "white", border: "none", padding: "8px 14px", borderRadius: 20 }}>X</button>
            </div>
            {allUsers.map(u => (
              <div key={u.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #222" }}>
                <div style={{ width: 40, height: 40, background: u.name==="Katongole Rashid" ? "#00ff88" : "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{u.name[0]}</div>
                <div><div style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{u.name} {u.name==="Katongole Rashid" ? "✓ Admin" : ""}</div><div style={{ color: "#666", fontSize: 11 }}>{u.email}</div></div>
              </div>
            ))}
            <div style={{ color: "white", fontSize: 11, marginTop: 15 }}>You: {currentUser.name} | {currentUser.email}</div>
          </div>
        )}

        <div className="feed" style={{ width: "100%", height: "100%", overflowY: "auto", scrollSnapType: "y mandatory" }}>
          {filteredVideos.length===0 ? (
            <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "white" }}><div style={{ fontSize: 40 }}>🎵</div><div>{activeTop==="Muzika" ? "No Muzika videos - Only Rashid can post" : "No videos - Tap + to post"}</div></div>
          ) : filteredVideos.map(video => (
            <div key={video.id} style={{ width: "100vw", height: "100vh", height: "100dvh", scrollSnapAlign: "start", position: "relative", background: "black" }}>
              {video.videoUrl ? <video data-videoid={video.id} ref={el=>videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#111" }} />}
              <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <div style={{ width: 46, height: 46, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{video.user[0]}</div>
                <div onClick={()=>toggleLike(video.id)} style={{ textAlign: "center" }}><div style={{ fontSize: 28, filter: video.likes.includes(currentUser.id) ? "none" : "grayscale(1)" }}>❤️</div><div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.likes.length}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22 }}>👁️</div><div style={{ color: "white", fontSize: 11 }}>{video.views.length}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22 }}>💬</div></div>
                <div onClick={()=>toggleFire(video.id)} style={{ textAlign: "center" }}><div style={{ fontSize: 26, filter: video.fire.includes(currentUser.id) ? "none" : "grayscale(1)" }}>🔥</div><div style={{ color: "white", fontSize: 11 }}>{video.fire.length}</div></div>
              </div>
              <div style={{ position: "absolute", left: 12, bottom: 90, right: 80 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: "bold", fontSize: 14, color: "white" }}>{video.user}</span>{video.verified && <span style={{ background: "#1DA1F2", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10 }}>✓</span>}{video.isMuzika && <span style={{ background: "#00ff88", color: "black", fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: "bold" }}>MUZIKA</span>}</div>
                <div style={{ color: "#aaa", fontSize: 11, marginTop: 4 }}>{video.views.length} real views • {video.likes.length} real likes</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 30 }}>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>🏠</div><div style={{ fontSize: 8, color: "white", fontWeight: "bold" }}>Home</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 11, background: "#222", color: "white", padding: "5px 12px", borderRadius: 6, display: "inline-block" }}>Live</div></div>
          <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 40, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 20, fontWeight: "bold" }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 18 }}>💬</div><div style={{ fontSize: 8, color: "white" }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 18 }}>👤</div><div style={{ fontSize: 8, color: "white" }}>{currentUser.name.split(" ")[0]}</div></div>
        </div>

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            {isAdmin && (
              <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                <button onClick={()=>setPostToMuzika(false)} style={{ background: !postToMuzika ? "white" : "#333", color: !postToMuzika ? "black" : "white", border: "none", padding: "8px 16px", borderRadius: 20, fontWeight: "bold" }}>For You</button>
                <button onClick={()=>setPostToMuzika(true)} style={{ background: postToMuzika ? "#00ff88" : "#333", color: postToMuzika ? "black" : "white", border: "none", padding: "8px 16px", borderRadius: 20, fontWeight: "bold" }}>Muzika 🔒</button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={()=>fileRef.current.click()} style={{ background: postToMuzika ? "#00ff88" : "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", fontWeight: "bold", width: "90%", maxWidth: 300 }}>{postToMuzika ? "Post to Muzika (Admin only)" : "Post to For You"}</button>
            <button onClick={()=>setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
