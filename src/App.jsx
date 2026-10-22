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
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{background:"#000", color:"#fff", padding:50, textAlign:"center"}}>Loading Kampala Business...</div>;

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>KAMPALA BUSINESS 13</h1>
      <h2 style={{ color: "#00ff00", textAlign: "center" }}>Everyone Who Joined ✅</h2>
      <p style={{ textAlign: "center" }}>{users.length} users found</p>

      {users.map((u, i) => (
        <div key={u.id || i} style={{ border: "1px solid #333", margin: "15px auto", padding: "15px", maxWidth: "500px", borderRadius: "10px", background: "#111" }}>
          <h3>{u.name || u.displayName || u.email || "User"}</h3>
          <p style={{color:"#aaa"}}>{u.email || ""}</p>
          <p>{u.business || u.bio || u.description || ""}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
