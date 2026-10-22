import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "music"));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log("Loaded:", list);
        setMusic(list);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <h1 style={{color:"white", background:"black", padding:20}}>Loading Kampala Business...</h1>;
  }
  if (error) {
    return <h1 style={{color:"red", padding:20}}>Error: {error}</h1>;
  }

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:20}}>
      <h1>Kampala Business - Music ({music.length})</h1>
      {music.length === 0 && <p>No music in Firestore 'music' collection</p>}
      {music.map((m) => (
        <div key={m.id} style={{border:"1px solid #333", margin:"20px 0", padding:10}}>
          <h3>{m.title || m.author || "No title"}</h3>
          <p>ID: {m.id}</p>
          <pre style={{fontSize:10, background:"#111", padding:10, overflow:"auto"}}>
            {JSON.stringify(m, null, 2).slice(0,600)}
          </pre>
          {m.videoUrl ? (
            <video src={m.videoUrl} controls style={{width:"100%", maxWidth:400}} />
          ) : (
            <p style={{color:"orange"}}>No videoUrl field — add it in Firestore</p>
          )}
        </div>
      ))}
    </div>
  );
}
