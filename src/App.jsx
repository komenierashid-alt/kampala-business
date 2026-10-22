import { useState, useEffect } from "react";
import { db } from "./lib/firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

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
      title, desc, createdAt: new Date(), author: "Katongole Rashid", verified: true
    });
    setTitle(""); setDesc("");
  };

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", padding: "20px" }}>
      {/* HEADER WITH KB LOGO + BLUE TICK */}
      <div style={{ background: "white", padding: "15px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ width: "50px", height: "50px", background: "#1877f2", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "22px" }}>KB</div>
        <div>
          <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
            Kampala Business 
            <span style={{ background: "#1877f2", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>✓</span>
          </h2>
          <p style={{ margin: 0, color: "#65676b" }}>Katongole Rashid • Kampala, Uganda</p>
        </div>
      </div>

      {/* POST BOX */}
      <div style={{ background: "white", padding: "15px", borderRadius: "12px", marginTop: "15px" }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "8px" }} />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What's happening in Kampala?" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}></textarea>
        <button onClick={handlePost} style={{ marginTop: "10px", background: "#1877f2", color: "white", padding: "10px 20px", border: "none", borderRadius: "8px", fontWeight: "bold" }}>Post</button>
      </div>

      {/* VIDEOS SECTION */}
      <div style={{ background: "white", padding: "15px", borderRadius: "12px", marginTop: "15px" }}>
        <h3>🎥 Featured Videos</h3>
        <div style={{ display: "grid", gap: "10px" }}>
          <video controls style={{ width: "100%", borderRadius: "10px" }} src="https://www.w3schools.com/html/mov_bbb.mp4"></video>
          <p style={{ color: "#65676b" }}>Kampala Business Tour - Katongole Rashid</p>
        </div>
      </div>

      {/* POSTS FROM FIREBASE - REAL DATA */}
      {posts.map(p => (
        <div key={p.id} style={{ background: "white", padding: "15px", borderRadius: "12px", marginTop: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "40px", height: "40px", background: "#1877f2", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>KB</div>
            <div>
              <b>{p.author} <span style={{ color: "#1877f2" }}>✓</span></b>
              <div style={{ fontSize: "12px", color: "#65676b" }}>Kampala Business</div>
            </div>
          </div>
          <h4 style={{ marginTop: "10px" }}>{p.title}</h4>
          <p>{p.desc}</p>
        </div>
      ))}
    </div>
  );
}
