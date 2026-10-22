import { useState, useEffect } from "react";
import { db } from "./lib/firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [authMode, setAuthMode] = useState(null); // login | signup
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("feed"); // feed | account

  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formPass, setFormPass] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAuth = () => {
    if(!formContact || !formPass || (authMode==='signup' && !formName)) { alert("Fill all fields"); return; }
    // REAL SAVE - For now save to local, later Firebase Auth
    const user = { name: authMode==='signup' ? formName : "User", contact: formContact, joined: new Date().toLocaleDateString() };
    setCurrentUser(user);
    setView("account"); // GO TO ACCOUNT, NOT DASHBOARD!
    setAuthMode(null);
    setFormName(""); setFormContact(""); setFormPass("");
  };

  const handlePost = async () => {
    if(!title.trim()) return;
    await addDoc(collection(db, "posts"), { title, createdAt: new Date(), author: currentUser?.name || "Katongole Rashid", verified: true, likes: 0 });
    setTitle(""); setShowUpload(false);
  };

  const handleLike = async (id) => { await updateDoc(doc(db, "posts", id), { likes: increment(1) }); };

  // ACCOUNT VIEW - AFTER LOGIN
  if(view === "account" && currentUser) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", color: "white", fontFamily: "system-ui" }}>
        <div style={{ background: "#0f0f0f", padding: "12px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><div style={{ width: "32px", height: "32px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: "bold" }}>KB</div><span style={{ fontWeight: "800", fontSize: "13px" }}>KAMPALA BUSINESS</span></div>
          <button onClick={()=>setView("feed")} style={{ background: "#222", color: "white", border: "1px solid #333", padding: "7px 14px", borderRadius: "20px", fontSize: "12px" }}>Back to Feed</button>
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", background: "white", borderRadius: "50%", margin: "20px auto", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: "30px", fontWeight: "bold" }}>{currentUser.name[0]}</div>
          <h2 style={{ margin: "0" }}>{currentUser.name}</h2>
          <p style={{ color: "#888", fontSize: "13px", margin: "5px 0" }}>{currentUser.contact}</p>
          <p style={{ color: "#555", fontSize: "12px" }}>Joined {currentUser.joined} • Kampala, UG</p>
          <div style={{ background: "#121212", borderRadius: "12px", padding: "14px", marginTop: "20px", textAlign: "left", border: "1px solid #222" }}>
            <div style={{ fontWeight: "bold", marginBottom: "10px" }}>My Account</div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #222", fontSize: "14px" }}><span>Posts</span><span>{posts.filter(p=>p.author===currentUser.name).length}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "14px" }}><span>Verified</span><span style={{ color: "#1d9bf0" }}>✓ Pending</span></div>
          </div>
          <button onClick={()=>{setCurrentUser(null); setView("feed")}} style={{ marginTop: "20px", background: "#222", color: "#ff4444", border: "1px solid #333", width: "100%", padding: "12px", borderRadius: "10px" }}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white", paddingBottom: "80px", fontFamily: "system-ui" }}>
      <div style={{ background: "#0f0f0f", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20, borderBottom: "1px solid #222" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "32px", height: "32px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black" }}>KB</div><span style={{ fontSize: "13px", fontWeight: "800" }}>KAMPALA BUSINESS</span></div>
        <div style={{ display: "flex", gap: "8px" }}>
          {currentUser ? <button onClick={()=>setView("account")} style={{ background: "white", color: "black", border: "none", padding: "7px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>{currentUser.name}</button> :
          <>
            <button onClick={()=>setAuthMode(authMode==='login'?null:'login')} style={{ background: "#222", color: "white", border: "1px solid #333", padding: "7px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>Login</button>
            <button onClick={()=>setAuthMode(authMode==='signup'?null:'signup')} style={{ background: "#1877f2", color: "white", border: "none", padding: "7px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>Sign Up</button>
          </>}
        </div>
      </div>

      {authMode && !currentUser && (
        <div style={{ background: "#121212", margin: "12px", padding: "16px", borderRadius: "12px", border: "1px solid #222" }}>
          <h3 style={{ margin: "0 0 12px 0" }}>{authMode==='login'?'Login':'Sign Up'}</h3>
          {authMode==='signup' && <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="Full Name" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "12px", borderRadius: "8px", color: "white", marginBottom: "10px", boxSizing: "border-box" }} />}
          <input value={formContact} onChange={e=>setFormContact(e.target.value)} placeholder="Phone or Email" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "12px", borderRadius: "8px", color: "white", marginBottom: "10px", boxSizing: "border-box" }} />
          <input value={formPass} onChange={e=>setFormPass(e.target.value)} type="password" placeholder="Password" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "12px", borderRadius: "8px", color: "white", marginBottom: "12px", boxSizing: "border-box" }} />
          <button onClick={handleAuth} style={{ width: "100%", background: authMode==='login'?"white":"#1877f2", color: authMode==='login'?"black":"white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold" }}>{authMode==='login'?'Login to Account':'Create & Go to Account'}</button>
          <div style={{ textAlign: "center", marginTop: "10px", fontSize: "12px", color: "#888" }} onClick={()=>setAuthMode(authMode==='login'?'signup':'login')}>{authMode==='login'?"No account? Sign Up":"Have account? Login"}</div>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", padding: "12px" }}>
        <div style={{ background: "white", color: "black", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>For You</div>
        <div style={{ background: "#1e1e1e", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", color: "#aaa" }}>Music</div>
        <div style={{ background: "#1e1e1e", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", color: "#aaa" }}>Movies</div>
      </div>

      {showUpload && (
        <div style={{ background: "#121212", margin: "0 12px 12px", padding: "12px", borderRadius: "12px", border: "1px solid #222" }}>
          <textarea value={title} onChange={e=>setTitle(e.target.value)} placeholder="What's happening?" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "12px", borderRadius: "10px", color: "white", minHeight: "70px", boxSizing: "border-box" }} />
          <button onClick={handlePost} style={{ marginTop: "10px", background: "#1877f2", color: "white", border: "none", padding: "11px", borderRadius: "10px", fontWeight: "bold", width: "100%" }}>Post</button>
        </div>
      )}

      <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: "#121212", borderRadius: "14px", padding: "14px", border: "1px solid #1e1e1e" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>KR</div><div><div style={{ display: "flex", gap: "5px", fontWeight: "bold", fontSize: "14px" }}>{p.author} <span style={{ background: "#1d9bf0", width: "16px", height: "16px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</span></div><div style={{ fontSize: "11px", color: "#777" }}>Founder</div></div></div>
            <div style={{ margin: "14px 0", fontSize: "15px" }}>{p.title}</div>
            <div style={{ display: "flex", gap: "22px", borderTop: "1px solid #222", paddingTop: "12px" }}>
              <button onClick={()=>handleLike(p.id)} style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px" }}>❤️ {p.likes||0} Like</button>
              <button style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px" }}>💬 Comment</button>
              <button style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px" }}>↗️ Share</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0f0f0f", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 20 }}>
        <div onClick={()=>setView("feed")} style={{ textAlign: "center", fontSize: "10px", color: "white" }}><div style={{ fontSize: "18px" }}>🏠</div>For You</div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#888" }}><div style={{ fontSize: "18px" }}>🔴</div>Live</div>
        <div onClick={()=>setShowUpload(!showUpload)} style={{ textAlign: "center" }}><div style={{ background: "white", color: "black", width: "38px", height: "26px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "20px", fontWeight: "bold" }}>+</div><div style={{ fontSize: "10px", color: "white" }}>Post</div></div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#888" }}><div style={{ fontSize: "18px" }}>💬</div>Chat</div>
        <div onClick={()=>currentUser ? setView("account") : setAuthMode('login')} style={{ textAlign: "center", fontSize: "10px", color: currentUser ? "white" : "#888" }}><div style={{ fontSize: "18px" }}>👤</div>{currentUser ? currentUser.name.split(" ")[0] : "Account"}</div>
      </div>
    </div>
  );
}
