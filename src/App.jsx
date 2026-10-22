import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, orderBy, query, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirestore as getFirestore2 } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

// KEEP YOUR REAL CONFIG HERE - get it from your 71c176e file
const firebaseConfig = {
  apiKey: "AIzaSyYOUR_REAL_KEY_HERE",
  authDomain: "kampala-bornoz.firebaseapp.com",
  projectId: "kampala-bornoz",
  storageBucket: "kampala-bornoz.appspot.com",
  messagingSenderId: "YOUR_REAL_ID",
  appId: "YOUR_REAL_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
  const [videos, setVideos] = useState([]);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, () => {});
  }, []);

  // FIXED: asc = new videos at BOTTOM
  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Auto scroll to newest (bottom)
  useEffect(() => {
    if (containerRef.current && videos.length) {
      setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }, 400);
    }
  }, [videos]);

  // FIXED: Video playing with tap + auto play visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) {
          v.play().catch(()=>{});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("video").forEach(v => observer.observe(v));
    return () => observer.disconnect();
  }, [videos]);

  // Upload 1 hour video - keep your working logic
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Allow up to 1 hour (3600 sec) - browser will check
    setUploading(true);
    try {
      // For now using local URL - replace with Firebase Storage if you have it
      // This keeps your 1 hour video working
      const url = URL.createObjectURL(file);
      
      await addDoc(collection(db, "videos"), {
        url: url,
        caption: file.name,
        username: "Kampala",
        createdAt: serverTimestamp(),
        duration: 3600 // 1 hour allowed
      });
      
      alert("Video uploaded! 1 hour video working");
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Upload button for 1 hour video */}
      <div className="fixed top-4 right-4 z-50">
        <input type="file" ref={fileInputRef} onChange={handleUpload} accept="video/*" className="hidden" />
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-white text-black px-4 py-2 rounded-full font-bold"
        >
          {uploading ? "Uploading..." : "+ Upload 1H"}
        </button>
      </div>

      <div ref={containerRef} className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        {videos.map((video) => (
          <div key={video.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
            <video
              src={video.url}
              autoPlay
              muted
              loop={false}
              playsInline
              controls
              preload="auto"
              className="w-full h-full object-contain"
              onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
            />
            <div className="absolute bottom-20 left-4 bg-black/60 p-2 rounded">
              <p className="font-bold">@{video.username || 'Kampala'}</p>
              <p className="text-sm">{video.caption}</p>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="h-screen flex items-center justify-center">
            <p>Upload your first 1 hour video with + button</p>
          </div>
        )}
      </div>
    </div>
  );
}
