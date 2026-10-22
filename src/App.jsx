import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, 'users'));
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.log(e); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{background:"#000", color:"#fff", padding:50, textAlign:"center"}}>Loading...</div>;

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>KAMPALA BUSINESS 13</h1>
      <h2 style={{ color: "#00ff00", textAlign: "center" }}>Everyone Who Joined ✅ {users.length} users</h2>
      {users.map((u) => (
        <div key={u.id} style={{ border: "1px solid #333", margin: "10px auto", padding: "12px", maxWidth: "500px", borderRadius: "10px", background: "#111" }}>
          <b>{u.name || u.displayName || u.email || "User"}</b><br/>
          <span style={{color:"#aaa", fontSize:13}}>{u.email}</span>
        </div>
      ))}
    </div>
  );
}
export default App;
