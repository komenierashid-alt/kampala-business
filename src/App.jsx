import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const uSnap = await getDocs(collection(db, 'users'));
        setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        const pSnap = await getDocs(collection(db, 'posts'));
        setPosts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.log(e); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{background:"#000", color:"#fff", padding:50, textAlign:"center"}}>Loading Kampala Business...</div>;

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>KAMPALA BUSINESS 13</h1>
      
      <h2 style={{ color: "#00ff00", textAlign: "center" }}>Everyone Who Joined ✅ {users.length} users</h2>
      {users.map((u) => (
        <div key={u.id} style={{ border: "1px solid #333", margin: "10px auto", padding: "12px", maxWidth: "500px", borderRadius: "10px", background: "#111" }}>
          <b>{u.name || u.displayName || "User"}</b><br/>
          <span style={{color:"#aaa", fontSize:13}}>{u.email}</span><br/>
          <span>{u.bio || u.business || "New user"}</span>
        </div>
      ))}

      <h2 style={{ color: "#00aaff", textAlign: "center", marginTop:30 }}>Posts & Videos ({posts.length})</h2>
      {posts.map((p) => (
        <div key={p.id} style={{ border: "1px solid #222", margin: "15px auto", padding: "12px", maxWidth: "500px", borderRadius: "10px", background: "#0a0a0a" }}>
          <p>{p.text || p.caption || p.content || "Post"}</p>
          {p.videoUrl || p.video ? (
            <video src={p.videoUrl || p.video} controls style={{width:"100%", maxHeight:300, background:"#000", borderRadius:8, marginTop:8}} />
          ) : null}
          {p.imageUrl || p.image ? (
            <img src={p.imageUrl || p.image} alt="post" style={{width:"100%", borderRadius:8, marginTop:8}} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
export default App;
