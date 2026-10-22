import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkd-f-SR1KKYSxJjV9GkTQuk5-lqSNBQQQ",
  authDomain: "kampala-business.firebaseapp.com",
  projectId: "kampala-business",
  storageBucket: "kampala-business.firebasestorage.app",
  messagingSenderId: "942834725537",
  appId: "1:942834725537:web:4c746311a77dedb267b8e8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [list, setList] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "music"), orderBy("createdAt", "asc"));
    return onSnapshot(q, snap => setList(snap.docs.map(d => d.data())));
  }, []);

  return (
    <div style={{background:"black", height:"100vh", overflowY:"scroll"}}>
      {list.map((v,i) => (
        <div key={i} style={{height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
          <video
            src={v.videoUrl1 || v.videoUrl || v.videoUri || v.uri || v.musicUri || v.url}
            controls
            autoPlay
            muted
            loop
            playsInline
            style={{width:"100%", height:"100%", objectFit:"contain"}}
            onClick={e => e.target.paused ? e.target.play() : e.target.pause()}
          />
        </div>
      ))}
      {list.length==0 && <div style={{color:"white", textAlign:"center", paddingTop:"50%"}}>Loading music videos....</div>}
    </div>
  );
}
