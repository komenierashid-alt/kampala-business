import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function App() {
  const [musics, setMusics] = useState([]);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    async function fetchMusic() {
      try {
        const q = query(collection(db, 'musics'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setMusics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        const snap = await getDocs(collection(db, 'musics'));
        setMusics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }
    fetchMusic();
  }, []);

  return (
    <div style={{background:'#000', minHeight:'100vh', color:'#fff'}}>
      {musics.map((item) => {
        const rawUrl = item.videoUrl || item.videoUrl1 || item.videoUri || item.videoUri1 || item.url;
        const ytId = getYouTubeId(rawUrl);
        const isDirect = rawUrl && (rawUrl.endsWith('.mp4') || rawUrl.includes('w3schools'));

        return (
          <div key={item.id} style={{borderBottom:'1px solid #333', padding:'20px'}}>
            <h3>{item.title || item.name || 'Untitled'}</h3>
            <p style={{color:'#aaa'}}>by {item.author || 'Unknown'}</p>
            
            <div style={{marginTop:'10px', background:'#111', height:'400px', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {ytId ? (
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={item.title}
                />
              ) : isDirect ? (
                <video src={rawUrl} controls style={{width:'100%', height:'100%'}} />
              ) : (
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'50px'}}>🏔️</div>
                  <div>0:00</div>
                  <div style={{color:'red', fontSize:'12px', marginTop:'10px'}}>No videoUrl found: {String(rawUrl).slice(0,40)}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
