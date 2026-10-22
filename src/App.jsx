import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const [caption, setCaption] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [activeTop, setActiveTop] = useState("For You");

  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", likes: 45, shares: 8, fire: 12, history: 120, isFollowing: false, verified: true },
    { id: 2, user: "Kayima baker", likes: 32, shares: 5, fire: 7, history: 85, isFollowing: false, verified: false },
  ]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(()=>{});
        else e.target.pause();
      });
    }, { threshold: 0.7 });
    Object.values(videoRefs.current).forEach(v => v && obs.observe(v));
    return () => obs.disconnect();
  }, [videos]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideos([{ id: Date.now(), user: "Katongole Rashid", likes: 0, shares: 0, fire: 0, history: 0, isFollowing: false, verified: true, videoUrl: url }, ...videos]);
    setShowUpload(false);
    setCaption("");
  };

  const toggleFollow = (id) => {
    setVideos(videos.map(v => v.id===id ? { ...v, isFollowing: !v.isFollowing } : v));
  };

  return (
    <div style={{ background: "black", width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, fontFamily: "Arial", overflow: "hidden" }}>
      
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{overflow:hidden!important;position:fixed!important;width:100%;height:100%}
        .feed::-webkit-scrollbar{display:none}
      `}</style>

      {/* TOP - For You Muzika Following Live */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
        <div style={{ background: "white", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>KB</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ color: activeTop==="For You" ? "white" : "#aaa", fontWeight: "bold", fontSize: 15, borderBottom: activeTop==="For You" ? "2px solid white" : "none", paddingBottom: 3 }}>For You</div>
          <div style={{ color: "#aaa", fontSize: 15 }}>Muzika</div>
          <div style={{ color: "#aaa", fontSize: 14 }}>Following</div>
          <div style={{ color: "#aaa", fontSize: 14 }}>Live</div>
        </div>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="feed" style={{ width: "100vw", height: "100vh", overflowY: "auto", scrollSnapType: "y mandatory" }}>
        {videos.map((video) => (
          <div key={video.id} style={{ width: "100vw", height: "100vh", scrollSnapAlign: "start", position: "relative", background: "black" }}>
            {video.videoUrl ? (
              <video ref={el => videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#111" }} />
            )}

            <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 48, height: 48, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 18 }}>K</div>
                <div onClick={() => toggleFollow(video.id)} style={{ width: 20, height: 20, background: video.isFollowing ? "#666" : "#FE2C55", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, marginTop: -9, border: "2px solid black" }}>{video.isFollowing ? "X" : "+"}</div>
              </div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 30 }}>❤️</div><div style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>{video.likes}</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>🕒</div><div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.history}</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>💬</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>↗️</div><div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.shares}</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>🔥</div><div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.fire}</div></div>
            </div>

            <div style={{ position: "absolute", left: 12, bottom: 90, right: 80 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: "bold", fontSize: 15, color: "white" }}>Katongole Rashid</span>
                <span style={{ background: "#1DA1F2", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: "bold" }}>✓</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ height: 70, background: "black" }} />
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "10px 0", alignItems: "center", zIndex: 30 }}>
        <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 22 }}>🏠</div><div style={{ fontSize: 9, color: "white", fontWeight: "bold" }}>Home</div></div>
        <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 12, background: "#222", color: "white", padding: "6px 14px", borderRadius: 6, display: "inline-block", fontWeight: "bold" }}>Live</div></div>
        <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 42, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 22, fontWeight: "bold" }}>+</div>
        <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>💬</div><div style={{ fontSize: 9, color: "white" }}>Chat</div></div>
        <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>👤</div><div style={{ fontSize: 9, color: "white" }}>You</div></div>
      </div>

      {showUpload && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
          <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", fontWeight: "bold", width: "90%", maxWidth: 300 }}>Choose Video</button>
          <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
