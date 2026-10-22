import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

// YOUR FIREBASE CONFIG - KEEP YOURS
const firebaseConfig = {
  apiKey: "AIzaSyYOUR_KEY",
  authDomain: "kampala-bornoz.firebaseapp.com",
  projectId: "kampala-bornoz",
  storageBucket: "kampala-bornoz.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);

  // Auth
  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Fetch videos - ASC = oldest top, newest bottom
  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const vids = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setVideos(vids);
    });
    return () => unsub();
  }, []);

  // Auto scroll to bottom (newest video) when new video added
  useEffect(() => {
    if (containerRef.current && videos.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [videos]);

  // Auto play visible video
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(()=>{});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.7 });

    const vids = document.querySelectorAll("video");
    vids.forEach(v => observer.observe(v));
    return () => observer.disconnect();
  }, [videos]);

  return (
    <div className="bg-black min-h-screen text-white">
      <div 
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {videos.map((video) => (
          <div key={video.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
            <video
              src={video.url}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="auto"
              className="w-full h-full object-contain"
              onClick={(e) => {
                const v = e.target;
                if (v.paused) v.play();
                else v.pause();
              }}
            />
            <div className="absolute bottom-20 left-4">
              <p className="font-bold">@{video.username || 'Kampala'}</p>
              <p className="text-sm">{video.caption}</p>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="h-screen flex items-center justify-center">
            <p>No videos yet - Upload one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
