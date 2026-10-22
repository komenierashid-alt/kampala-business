import { useState, useEffect } from "react";
import { db } from "./lib/firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handlePost = async () => {
    if(!title) return;
    await addDoc(collection(db, "posts"), {
      title, createdAt: new Date(), author: "Katongole Rashid", role: "Ceo. Gaben consultancy", verified: true, views: 1, likes: 0, video: "https://www.w3schools.com/html/mov_bbb.mp4"
    });
    setTitle(""); setShowUpload(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white", paddingBottom: "70px", fontFamily: "system-ui" }}>
      
      {/* HEADER - KB LOGO */}
      <div style={{ background: "#111", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #222" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "30px", height: "30px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black" }}>KB</div>
          <div style={{ lineHeight: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", letterSpacing: "0.5px" }}>KAMPALA</div>
            <div style={{ fontSize: "10px", color: "#aaa" }}>BUSINESS</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ background: "#e11d48", padding: "4px 10px", borderRadius: "15px", fontSize: "10px", fontWeight: "bold" }}>CEO VIEW</div>
          <div style={{ width: "28px", height: "28px", background: "#333", borderRadius: "50%" }}></div>
        </div>
      </div>

      {/* TABS - For You / Music / Movies / Live */}
      <div style={{ display: "flex", gap: "10px", padding: "10px 12px", overflowX: "auto", background: "#000", position: "sticky", top: "50px", zIndex: 9 }}>
        <input placeholder="Search" style={{ background: "#1a1a1a", border: "none", padding: "6px 12px", borderRadius: "15px", color: "white", fontSize: "13px", width: "70px" }} />
        <div style={{ background: "white", color: "black", padding: "6px 14px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold", whiteSpace: "nowrap" }}>For You</div>
        <div style={{ background: "#1a1a1a", padding: "6px 14px", borderRadius: "15px", fontSize: "12px", color: "#aaa", whiteSpace: "nowrap" }}>Music</div>
        <div style={{ background: "#1a1a1a", padding: "6px 14px", borderRadius: "15px", fontSize: "12px", color: "#aaa", whiteSpace: "nowrap" }}>Movies</div>
        <div style={{ background: "#1a1a1a", padding: "6px 14px", borderRadius: "15px", fontSize: "12px", color: "#aaa", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>Live <div style={{ width: "6px", height: "6px", background: "red", borderRadius: "50%" }}></div></div>
        <div style={{ background: "#1a1a1a", padding: "6px 14px", borderRadius: "15px", fontSize: "12px", color: "#aaa", whiteSpace: "nowrap" }}>My Account</div>
      </div>

      {/* UPLOAD BOX */}
      {showUpload && (
        <div style={{ background: "#1a1a1a", margin: "10px", padding: "12px", borderRadius: "12px" }}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Hey viewers please follow each other..." style={{ width: "100%", background: "#222", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", boxSizing: "border-box" }} />
          <button onClick={handlePost} style={{ marginTop: "8px", background: "#1877f2", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", fontWeight: "bold", width: "100%" }}>Post Now</button>
        </div>
      )}

      {/* POSTS FEED - Like your screenshot */}
      <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: "#121212", borderRadius: "12px", padding: "12px", border: "1px solid #1e1e1e" }}>
            {/* Delete top */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "12px", color: "#666" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>🗑️ Delete</span>
              <span style={{ color: "#1877f2" }}>●</span>
            </div>

            {/* Author Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1877f2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid #333" }}>KR</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: "bold" }}>
                    {p.author}
                    <span style={{ background: "#1d9bf0", width: "16px", height: "16px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{p.role || "CEO & Owner"}</div>
                </div>
              </div>
              <div style={{ background: "white", color: "black", padding: "5px 12px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>Following</div>
            </div>

            {/* Content */}
            <div style={{ margin: "12px 0", fontSize: "14px" }}>{p.title || "Hey viewers please follow each other"}</div>

            {/* Video if exists */}
            {p.video && (
              <video controls src={p.video} style={{ width: "100%", borderRadius: "10px", maxHeight: "400px", background: "#000" }}></video>
            )}
            {!p.video && p.title?.includes("Founder") && (
              <img src="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg" style={{ width: "100%", borderRadius: "10px" }} />
            )}

            {p.title?.toLowerCase().includes("founder") && <div style={{ textAlign: "center", fontSize: "12px", color: "#888", marginTop: "6px" }}>Founder - Kampala Business</div>}

            {/* Bottom stats */}
            <div style={{ display: "flex", gap: "15px", marginTop: "12px", fontSize: "12px", color: "#888", borderTop: "1px solid #1e1e1e", paddingTop: "10px" }}>
              <span>👁️ {p.views || 1} views</span>
              <span>❤️ {p.likes || 0}</span>
              <span style={{ color: "#1d9bf0" }}>💬 Message</span>
              <span>🚫 Hide from Public</span>
            </div>
          </div>
        ))}

        {/* Demo Post like screenshot */}
        {posts.length === 0 && (
          <>
            <div style={{ background: "#121212", borderRadius: "12px", padding: "12px", border: "1px solid #1e1e1e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "12px", color: "#666" }}><span>🗑️ Delete</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>KR</div>
                  <div><div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: "bold" }}>Katongole Rashid <span style={{ background: "#1d9bf0", width: "16px", height: "16px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</span></div><div style={{ fontSize: "11px", color: "#888" }}>Ceo. Gaban consultancy</div></div>
                </div>
                <div style={{ background: "white", color: "black", padding: "5px 12px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>Following</div>
              </div>
              <div style={{ margin: "12px 0", fontSize: "14px" }}>Hey viewers please follow each other</div>
              <div style={{ display: "flex", gap: "15px", marginTop: "12px", fontSize: "12px", color: "#888", borderTop: "1px solid #1e1e1e", paddingTop: "10px" }}>
                <span>👁️ 1 views</span><span>❤️ 0</span><span style={{ color: "#1d9bf0" }}>💬 Message</span><span>🚫 Hide from Public</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* BOTTOM NAV - Like screenshot */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 20 }}>
        <div style={{ textAlign: "center", fontSize: "10px", color: "white" }}><div style={{ fontSize: "18px" }}>🏠</div>For You</div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#888" }}><div style={{ fontSize: "18px", color: "red" }}>🔴</div>Live</div>
        <div onClick={()=>setShowUpload(!showUpload)} style={{ textAlign: "center", fontSize: "10px", color: "white" }}><div style={{ background: "white", color: "black", width: "32px", height: "22px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "16px", fontWeight: "bold" }}>+</div>Upload</div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#888" }}><div style={{ fontSize: "18px" }}>💬</div>Chat</div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#888" }}><div style={{ fontSize: "18px" }}>👤</div>My Account</div>
      </div>
    </div>
  );
}
