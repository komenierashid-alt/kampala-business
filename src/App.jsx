import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./lib/firebase";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  if (url.includes("youtube.com/embed")) return url;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return url;
}

export default function App() {
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "music"));
        setMusic(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1 style={{color:"red"}}>Error: {error}</h1>;

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:20}}>
      <h1>Kampala Business - Music ({music.length})</h1>
      {music.map((item) => {
        const rawUrl = item.videoUrl || item.videoUri || item.url;
        const embed = getYouTubeEmbedUrl(rawUrl);
        const isYT = embed && embed.includes("youtube.com/embed");
        return (
          <div key={item.id} style={{border:"1px solid #333", margin:"20px 0", padding:10}}>
            <h3>{item.title || item.author || "No title"}</h3>
            {embed ? (
              isYT ? (
                <iframe src={embed} style={{width:"100%", height:400}} allowFullScreen frameBorder="0" />
              ) : (
                <video src={embed} controls style={{width:"100%", maxWidth:500}} />
              )
            ) : (
              <p style={{color:"orange"}}>No videoUrl in this document</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
