import { useState, useEffect } from "react";
import { db } from "./lib/firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("feed");
  const [activeTab, setActiveTab] = useState("For You");
  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formPass, setFormPass] = useState("");
  const [following, setFollowing] = useState({});
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [fireActive, setFireActive] = useState({});

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleAuth = () => {
    if(!formContact || !formPass || (authMode==='signup' && !formName)) { alert("Fill all"); return; }
    setCurrentUser({ name: authMode==='signup' ? formName : "User", contact: formContact });
    setView("account"); setAuthMode(null);
    setFormName(""); setFormContact(""); setFormPass("");
  };
  const handlePost = async () => { if(!title.trim()) return; await addDoc(collection(db, "posts"), { title, createdAt: new Date(), author: currentUser?.name || "Katongole Rashid", likes: 0 }); setTitle(""); setShowUpload(false); };
  const handleLike = async (id) => { await updateDoc(doc(db, "posts", id), { likes: increment(1) }); setHistory(prev=> [id, ...prev.filter(x=>x!==id)].slice(0,20)); };
  const toggleFollow = (id) => { setFollowing(prev=>({...prev, [id]: !prev[id]})); };
  const toggleFire = (id) => { setFireActive(prev=>({...prev, [id]: !prev[id]})); setHistory(prev=> [id, ...prev.filter(x=>x!==id)].slice(0,20)); };

  if(view === "account" && currentUser) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", color: "white", fontFamily: "system-ui", width: "100%", overflowX: "hidden" }}>
        <style>{`html,body{margin:0;padding:0;background:#000;overflow-x:hidden;width:100%;}::-webkit-scrollbar{display:none;} *{box-sizing:border-box;}`}</style>
        <div style={{ background: "#0f0f0f", padding: "10px 12px", borderBottom: "1px solid #222", width: "100%" }}>
          <div style={{ width: "30px", height: "30px", background: "white", borderRadius: "50%", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" }}>KB</div>
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", background: "white", borderRadius: "50%", margin: "20px auto", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: "30px", fontWeight: "bold" }}>{currentUser.name[0]}</div>
          <h2 style={{ margin: 0 }}>{currentUser.name}</h2>
          <button onClick={()=>{setCurrentUser(null); setView("feed")}} style={{ marginTop: "20px", background: "#222", color: "#ff4444", border: "1px solid #333", width: "100%", padding: "12px", borderRadius: "10px" }}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white", paddingBottom: "70px", fontFamily: "system-ui", width: "100%", overflowX: "hidden", position: "relative" }}>
      <style>{`html,body{margin:0;padding:0;background:#000;overflow-x:hidden;width:100%;max-width:100%;}::-webkit-scrollbar{display:none; width:0; height:0;} *{box-sizing:border-box; scrollbar-width:none; -ms-overflow-style:none;} body{overflow-x:hidden !important;}`}</style>
      
      <div style={{ background: "#0f0f0f", padding: "10px 12px", borderBottom: "1px solid #1a1a1a", width: "100%" }}>
        <div style={{ width: "30px", height: "30px", background: "white", borderRadius: "50%", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" }}>KB</div>
      </div>

      <div style={{ display: "flex", gap: "6px", padding: "10px 12px", overflowX: "auto", width: "100%" }}>
        {["For You", "Live", "Following", "Music", "Movies", "History"].map(tab => (
          <div key={tab} onClick={()=>{ setActiveTab(tab); if(tab==="History") setShowHistory(true); else setShowHistory(false); }} style={{ background: activeTab===tab ? "white" : "#1c1c1c", color: activeTab===tab ? "black" : "#888", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: activeTab===tab ? "700" : "400", whiteSpace: "nowrap", flexShrink: 0 }}>{tab}</div>
        ))}
      </div>

      {showHistory && (
        <div style={{ background: "#121212", margin: "8px 12px", padding: "14px", borderRadius: "12px", border: "1px solid #333", width: "calc(100% - 24px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "14px" }}>📜 History</h3>
            <button onClick={()=>setShowHistory(false)} style={{ background: "#222", color: "white", border: "1px solid #333", padding: "4px 10px", borderRadius: "10px", fontSize: "10px" }}>Close</button>
          </div>
          <div style={{ marginTop: "10px", color: "#888", fontSize: "12px" }}>
            {history.length===0 ? "No history yet!" : history.map(id => { const post = posts.find(p=>p.id===id); return post ? <div key={id} style={{ background: "#1a1a1a", padding: "8px", borderRadius: "8px", marginBottom: "6px" }}>{post.title}</div> : null })}
          </div>
        </div>
      )}

      {authMode && !currentUser && (
        <div style={{ background: "#121212", margin: "8px 12px", padding: "14px", borderRadius: "12px", border: "1px solid #222", width: "calc(100% - 24px)" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>{authMode==='login'?'Login':'Sign Up'}</h3>
          {authMode==='signup' && <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="Full Name" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />}
          <input value={formContact} onChange={e=>setFormContact(e.target.value)} placeholder="Phone or Email" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
          <input value={formPass} onChange={e=>setFormPass(e.target.value)} type="password" placeholder="Password" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "10px" }} />
          <button onClick={handleAuth} style={{ width: "100%", background: "#fff", color: "#000", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold" }}>{authMode==='login'?'Login':'Create & Go to Account'}</button>
        </div>
      )}

      {showUpload && (
        <div style={{ background: "#121212", margin: "0 12px 10px", padding: "10px", borderRadius: "12px", border: "1px solid #222", width: "calc(100% - 24px)" }}>
          <textarea value={title} onChange={e=>setTitle(e.target.value)} placeholder="What's happening?" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", minHeight: "60px" }} />
          <button onClick={handlePost} style={{ marginTop: "8px", background: "#1877f2", color: "white", border: "none", padding: "9px", borderRadius: "8px", fontWeight: "bold", width: "100%" }}>Post</button>
        </div>
      )}

      {/* POSTS - NEW LAYOUT: CONTENT CENTER, ALL ICONS AT BOTTOM WHERE YOU ARROWED */}
      <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: "#121212", borderRadius: "14px", padding: "12px", border: "1px solid #1c1c1c", width: "100%", minHeight: "160px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontSize: "16px", textAlign: "center", paddingTop: "20px", wordBreak: "break-word" }}>{p.title || "hi"}</div>
            
            {/* BOTTOM AREA - WHERE YOUR ARROWS POINT - ICONS AT BOTTOM */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "30px" }}>
              
              {/* BOTTOM LEFT CORNER - KATONGOLE RASHID + KR */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "11px", border: "2px solid #333" }}>KR</div>
                  <div onClick={()=>toggleFollow(p.id)} style={{ position: "absolute", bottom: "-4px", right: "-4px", background: following[p.id] ? "#333" : "#1877f2", color: "white", width: "14px", height: "14px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "bold", border: "1px solid #121212", cursor: "pointer" }}>{following[p.id] ? "✓" : "+"}</div>
                </div>
                <div style={{ fontWeight: "800", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                  {p.author} <span style={{ background: "#1d9bf0", width: "10px", height: "10px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "6px" }}>✓</span>
                </div>
              </div>

              {/* BOTTOM RIGHT CORNER - ALL ACTION ICONS HORIZONTAL - WHERE YOUR ARROWS POINT */}
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div onClick={()=>handleLike(p.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", cursor: "pointer" }}>
                  <div style={{ fontSize: "18px" }}>❤️</div>
                  <div style={{ fontSize: "8px", color: "#aaa" }}>{p.likes||1}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                  <div style={{ fontSize: "18px" }}>💬</div>
                  <div style={{ fontSize: "8px", color: "#aaa" }}>0</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                  <div style={{ fontSize: "18px" }}>↗️</div>
                  <div style={{ fontSize: "8px", color: "#aaa" }}>Share</div>
                </div>
                <div onClick={()=>toggleFire(p.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", cursor: "pointer", background: fireActive[p.id] ? "#ff450022" : "transparent", padding: "2px 5px", borderRadius: "8px", border: fireActive[p.id] ? "1px solid #ff4500" : "1px solid transparent" }}>
                  <div style={{ fontSize: "18px", filter: fireActive[p.id] ? "drop-shadow(0 0 4px #ff4500)" : "none" }}>🔥</div>
                  <div style={{ fontSize: "8px", color: fireActive[p.id] ? "#ff6a00" : "#aaa" }}>Fire</div>
                </div>
                <div onClick={()=>setShowHistory(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", cursor: "pointer" }}>
                  <div style={{ fontSize: "18px" }}>🕒</div>
                  <div style={{ fontSize: "8px", color: "#aaa" }}>History</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN BOTTOM NAV - STABLE */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0a0a0a", borderTop: "1px solid #222", display: "flex", justifyContent: "space-between", padding: "6px 12px", zIndex: 20, alignItems: "center", width: "100%", overflow: "hidden" }}>
        <div onClick={()=>{setView("feed"); setActiveTab("For You"); window.scrollTo(0,0)}} style={{ textAlign: "center", color: "white", cursor: "pointer", flexShrink: 0 }}>
          <div style={{ fontSize: "20px" }}>🏠</div>
          <div style={{ fontSize: "9px", fontWeight: "bold" }}>Home</div>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <div style={{ textAlign: "center", color: "#ff3333" }}>
            <div style={{ fontSize: "20px" }}>🔴</div>
            <div style={{ fontSize: "9px", fontWeight: "bold", color: "white" }}>Live</div>
          </div>
          <div onClick={()=>setShowUpload(!showUpload)} style={{ textAlign: "center" }}>
            <div style={{ background: "white", color: "black", width: "40px", height: "26px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold" }}>+</div>
            <div style={{ fontSize: "9px", color: "white", marginTop: "2px" }}>Post</div>
          </div>
          <div style={{ textAlign: "center", color: "#777" }}>
            <div style={{ fontSize: "20px" }}>💬</div>
            <div style={{ fontSize: "9px" }}>Chat</div>
          </div>
        </div>
        <div onClick={()=>currentUser ? setView("account") : setAuthMode('login')} style={{ background: currentUser ? "white" : "#1c1c1c", color: currentUser ? "black" : "white", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", border: "1px solid #333", flexShrink: 0 }}>
          {currentUser ? currentUser.name.split(" ")[0] : "User"}
        </div>
      </div>
    </div>
  );
}
