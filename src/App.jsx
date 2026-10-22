import { useState, useEffect } from "react";
import { db } from "./lib/firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'signup'

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handlePost = async () => {
    if(!title.trim()) return;
    await addDoc(collection(db, "posts"), {
      title, createdAt: new Date(), author: "Katongole Rashid", verified: true, likes: 0
    });
    setTitle(""); setShowUpload(false);
  };

  const handleLike = async (id) => {
    await updateDoc(doc(db, "posts", id), { likes: increment(1) });
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white", paddingBottom: "80px", fontFamily: "system-ui" }}>
      
      {/* HEADER - LOGIN + SIGN UP */}
      <div style={{ background: "#0f0f0f", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20, borderBottom: "1px solid #222" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black" }}>KB</div>
          <span style={{ fontSize: "13px", fontWeight: "800", letterSpacing: "1px" }}>KAMPALA BUSINESS</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={()=>setAuthMode(authMode === 'login' ? null : 'login')} style={{ background: authMode==='login' ? "#333" : "#222", color: "white", border: "1px solid #333", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>Login</button>
          <button onClick={()=>setAuthMode(authMode === 'signup' ? null : 'signup')} style={{ background: "#1877f2", color: "white", border: "none", padding: "7px 18px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>Sign Up</button>
        </div>
      </div>

      {/* AUTH BOX - LOGIN & SIGN UP */}
      {authMode && (
        <div style={{ background: "#121212", margin: "12px", padding: "16px", borderRadius: "12px", border: "1px solid #222" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold" }}>{authMode === 'login' ? 'Welcome Back' : 'Join Kampala Business'}</h3>
          <input placeholder="Phone or Email" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "12px", borderRadius: "8px", color: "white", marginBottom: "10px", boxSizing: "border-box" }} />
          <input type="password" placeholder="Password" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "12px", borderRadius: "8px", color: "white", marginBottom: "12px", boxSizing: "border-box" }} />
          {authMode === 'signup' && <input placeholder="Full Name" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "12px", borderRadius: "8px", color: "white", marginBottom: "12px", boxSizing: "border-box" }} />}
          <button style={{ width: "100%", background: authMode==='login' ? "white" : "#1877f2", color: authMode==='login' ? "black" : "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px" }}>{authMode === 'login' ? 'Login' : 'Create Account'}</button>
          <div style={{ textAlign: "center", marginTop: "10px", fontSize: "12px", color: "#888" }} onClick={()=>setAuthMode(authMode==='login' ? 'signup' : 'login')}>{authMode === 'login' ? "No account? Sign Up" : "Have account? Login"}</div>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: "flex", gap: "8px", padding: "12px", overflowX: "auto" }}>
        <div style={{ background: "white", color: "black", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>For You</div>
        <div style={{ background: "#1e1e1e", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", color: "#aaa" }}>Music</div>
        <div style={{ background: "#1e1e1e", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", color: "#aaa" }}>Movies</div>
        <div style={{ background: "#1e1e1e", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", color: "#aaa" }}>Live</div>
      </div>

      {/* UPLOAD */}
      {showUpload && (
        <div style={{ background: "#121212", margin: "0 12px 12px", padding: "12px", borderRadius: "12px", border: "1px solid #222" }}>
          <textarea value={title} onChange={e=>setTitle(e.target.value)} placeholder="What's happening in Kampala?" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "12px", borderRadius: "10px", color: "white", minHeight: "70px", boxSizing: "border-box" }} />
          <button onClick={handlePost} style={{ marginTop: "10px", background: "#1877f2", color: "white", border: "none", padding: "11px", borderRadius: "10px", fontWeight: "bold", width: "100%" }}>Post</button>
        </div>
      )}

      {/* REAL FEED - NO FAKE VIEWS, NO BLOCK, NO HIDE */}
      <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {posts.length === 0 && <div style={{ textAlign: "center", color: "#666", padding: "30px", fontSize: "14px" }}>No posts yet. Be first to post!</div>}
        {posts.map(p => (
          <div key={p.id} style={{ background: "#121212", borderRadius: "14px", padding: "14px", border: "1px solid #1e1e1e" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>KR</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "14px", fontWeight: "bold" }}>{p.author} <span style={{ background: "#1d9bf0", width: "16px", height: "16px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</span></div>
                <div style={{ fontSize: "11px", color: "#777" }}>Founder • Kampala Business</div>
              </div>
            </div>
            <div style={{ margin: "14px 0", fontSize: "15px", lineHeight: "21px", whiteSpace: "pre-wrap" }}>{p.title}</div>
            <div style={{ display: "flex", gap: "22px", borderTop: "1px solid #222", paddingTop: "12px" }}>
              <button onClick={()=>handleLike(p.id)} style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px", display: "flex", gap: "6px" }}>❤️ {p.likes || 0} Like</button>
              <button style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px" }}>💬 Comment</button>
              <button style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px" }}>↗️ Share</button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0f0f0f", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 20 }}>
        <div style={{ textAlign: "center", fontSize: "10px", color: "white" }}><div style={{ fontSize: "18px" }}>🏠</div>For You</div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#888" }}><div style={{ fontSize: "18px" }}>🔴</div>Live</div>
        <div onClick={()=>setShowUpload(!showUpload)} style={{ textAlign: "center" }}><div style={{ background: "white", color: "black", width: "38px", height: "26px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "20px", fontWeight: "bold" }}>+</div><div style={{ fontSize: "10px", marginTop: "2px", color: "white" }}>Post</div></div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#888" }}><div style={{ fontSize: "18px" }}>💬</div>Chat</div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#888" }}><div style={{ fontSize: "18px" }}>👤</div>Account</div>
      </div>
    </div>
  );
}
