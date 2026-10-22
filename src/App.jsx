import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './lib/firebase';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (err) { alert(err.message); }
  };

  if (loading) return <div style={{background:"#000", color:"#fff", padding:50, textAlign:"center"}}>Loading...</div>;

  if (!currentUser) {
    return (
      <div style={{background:"#000", color:"#fff", minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", padding:20}}>
        <h1>KAMPALA BUSINESS 13</h1>
        <h3 style={{color:"#00ff00"}}>Login to Continue</h3>
        <form onSubmit={handleLogin} style={{display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:350, background:"#111", padding:20, borderRadius:10}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:12, borderRadius:6, border:"1px solid #333", background:"#000", color:"#fff"}} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:12, borderRadius:6, border:"1px solid #333", background:"#000", color:"#fff"}} />
          <button type="submit" style={{padding:12, background:"#00ff00", color:"#000", fontWeight:"bold", border:"none", borderRadius:6, cursor:"pointer"}}>LOGIN</button>
        </form>
        <p style={{marginTop:20, color:"#aaa"}}>Logged out - please login</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:600, margin:"0 auto"}}>
        <h2>KAMPALA BUSINESS 13</h2>
        <button onClick={()=>signOut(auth)} style={{padding:"6px 12px", background:"#222", color:"#fff", border:"1px solid #444", borderRadius:6}}>Logout</button>
      </div>
      
      <h2 style={{ color: "#00ff00", textAlign: "center" }}>Everyone Who Joined ✅ {users.length} users</h2>
      <p style={{textAlign:"center", color:"#aaa"}}>Logged in as: {currentUser.email}</p>
      
      {users.map((u) => (
        <div key={u.id} style={{ border: "1px solid #333", margin: "10px auto", padding: "12px", maxWidth: "500px", borderRadius: "10px", background: "#111" }}>
          <b>{u.name || u.displayName || "User"}</b><br/>
          <span style={{color:"#aaa", fontSize:13}}>{u.email}</span><br/>
          <span>{u.bio || u.business || "New user"}</span>
        </div>
      ))}

      <h2 style={{ color: "#00aaff", textAlign: "center", marginTop:30 }}>Posts ({posts.length})</h2>
      {posts.map((p) => (
        <div key={p.id} style={{ border: "1px solid #222", margin: "15px auto", padding: "12px", maxWidth: "500px", borderRadius: "10px", background: "#0a0a0a" }}>
          <p>{p.text || p.caption || p.content || "Post"}</p>
          {(p.videoUrl || p.video) ? (
            <video src={p.videoUrl || p.video} controls style={{width:"100%", maxHeight:300, background:"#000", borderRadius:8, marginTop:8}} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
export default App;
