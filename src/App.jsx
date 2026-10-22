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
  const handleLike = async (id) => { await updateDoc(doc(db, "posts", id), { likes: increment(1) }); };
  const toggleFollow = (id) => { setFollowing(prev=>({...prev, [id]: !prev[id]})); };

  if(view === "account" && currentUser) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", color: "white", fontFamily: "system-ui", width: "100%", margin: 0, padding: 0 }}>
        <div style={{ background: "#0f0f0f", padding: "10px 12px", borderBottom: "1px solid #222" }}>
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
    <div style={{ background: "#000", minHeight: "100vh", color: "white", paddingBottom: "65px", fontFamily: "system-ui", width: "100vw", margin: 0, paddingLeft: 0, paddingRight: 0, overflowX: "hidden", boxSizing: "border-box" }}>
      <style>{`body{margin:0;padding:0;background:#000;} *{box-sizing:border-box;}`}</style>
      
      {/* TOP - ONLY KB - FIT SCREEN */}
      <div style={{ background: "#0f0f0f", padding: "10px 12px", borderBottom: "1px solid #1a1a1a", width: "100vw", margin: 0 }}>
        <div style={{ width: "30px", height: "30px", background: "white", borderRadius: "50%", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" }}>KB</div>
      </div>

      <div style={{ display: "flex", gap: "6px", padding: "10px 12px", overflowX: "auto", width: "100vw" }}>
        {["For You", "Live", "Following", "Music", "Movies"].map(tab => (
          <div key={tab} onClick={()=>setActiveTab(tab)} style={{ background: activeTab===tab ? "white" : "#1c1c1c", color: activeTab===tab ? "black" : "#888", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: activeTab===tab ? "700" : "400", whiteSpace: "nowrap" }}>{tab}</div>
        ))}
      </div>

      {authMode && !currentUser && (
        <div style={{ background: "#121212", margin: "8px 12px", padding: "14px", borderRadius: "12px", border: "1px solid #222" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>{authMode==='login'?'Login':'Sign Up'}</h3>
          {authMode==='signup' && <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="Full Name" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px", boxSizing: "border-box" }} />}
          <input value={formContact} onChange={e=>setFormContact(e.target.value)} placeholder="Phone or Email" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
          <input value={formPass} onChange={e=>setFormPass(e.target.value)} type="password" placeholder="Password" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "10px" }} />
          <button onClick={handleAuth} style={{ width: "100%", background: "#fff", color: "#000", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold" }}>{authMode==='login'?'Login':'Create & Go to Account'}</button>
        </div>
      )}

      {showUpload && (
        <div style={{ background: "#121212", margin: "0 12px 10px", padding: "10px", borderRadius: "12px", border: "1px solid #222" }}>
          <textarea value={title} onChange={e=>setTitle(e.target.value)} placeholder="What's happening?" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", minHeight: "60px" }} />
          <button onClick={handlePost} style={{ marginTop: "8px", background: "#1877f2", color: "white", border: "none", padding: "9px", borderRadius: "8px", fontWeight: "bold", width: "100%" }}>Post</button>
        </div>
      )}

      {/* POSTS - NEW LAYOUT - FIT SCREEN, KR RIGHT WITH +, NAME DOWN LEFT */}
      <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: "10px", width: "100vw", boxSizing: "border-box" }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: "#121212", borderRadius: "14px", padding: "12px", border: "1px solid #1c1c1c", width: "100%", boxSizing: "border-box" }}>
            
            {/* TOP OF POST: NAME LEFT DOWN, KR RIGHT WITH + FOLLOW */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              {/* LEFT CORNER - NAME DOWN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "800", fontSize: "14px" }}>
                  {p.author} 
                  <span style={{ background: "#1d9bf0", width: "14px", height: "14px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>✓</span>
                </div>
                <div style={{ fontSize: "11px", color: "#666" }}>Founder • Kampala Business</div>
              </div>

              {/* RIGHT SIDE - KR CIRCLE WITH + FOLLOW BUTTON */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "13px", border: "2px solid #333" }}>KR</div>
                <div onClick={()=>toggleFollow(p.id)} style={{ marginTop: "-8px", background: following[p.id] ? "#333" : "#1877f2", color: "white", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", border: "2px solid #121212", cursor: "pointer" }}>{following[p.id] ? "✓" : "+"}</div>
              </div>
            </div>

            <div style={{ margin: "12px 0", fontSize: "15px", minHeight: "20px" }}>{p.title}</div>
            
            <div style={{ display: "flex", gap: "20px", borderTop: "1px solid #1e1e1e", paddingTop: "10px" }}>
              <span onClick={()=>handleLike(p.id)} style={{ fontSize: "13px", color: "#aaa" }}>❤️ {p.likes||0} Like</span>
              <span style={{ fontSize: "13px", color: "#aaa" }}>💬 Comment</span>
              <span style={{ fontSize: "13px", color: "#aaa" }}>↗️ Share</span>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM - FIT SCREEN - HOME LEFT, USER RIGHT */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0a0a0a", borderTop: "1px solid #222", display: "flex", justifyContent: "space-between", padding: "6px 12px", zIndex: 20, alignItems: "center", width: "100vw", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div onClick={()=>{setView("feed"); setActiveTab("For You"); window.scrollTo(0,0)}} style={{ textAlign: "center", color: "white" }}><div style={{ fontSize: "18px" }}>🏠</div><div style={{ fontSize: "8px", fontWeight: "bold" }}>Home</div></div>
          <div style={{ textAlign: "center", color: "#777" }}><div style={{ fontSize: "16px" }}>🔴</div><div style={{ fontSize: "8px" }}>Live</div></div>
          <div onClick={()=>setShowUpload(!showUpload)} style={{ textAlign: "center" }}><div style={{ background: "white", color: "black", width: "32px", height: "20px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }}>+</div><div style={{ fontSize: "8px", color: "white", marginTop: "2px" }}>Post</div></div>
          <div style={{ textAlign: "center", color: "#777" }}><div style={{ fontSize: "16px" }}>💬</div><div style={{ fontSize: "8px" }}>Chat</div></div>
        </div>
        <div onClick={()=>currentUser ? setView("account") : setAuthMode('login')} style={{ background: currentUser ? "white" : "#1c1c1c", color: currentUser ? "black" : "white", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", border: "1px solid #333" }}>{currentUser ? currentUser.name.split(" ")[0] : "User"}</div>
      </div>
    </div>
  );
}
