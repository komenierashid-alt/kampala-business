import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const [showUpload, setShowUpload] = useState(false);
  const [activeTop, setActiveTop] = useState("For You");

  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", likes: 45, shares: 8, fire: 12, history: 120, isFollowing: false, verified: true },
    { id: 2, user: "Kayima Baker", likes: 32, shares: 5, fire: 7, history: 85, isFollowing: false, verified: false },
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
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body,#root{width:100%;height:100%;overflow:hidden;background:#000;margin:0;padding:0}
        body{position:fixed;top:0;left:0;right:0;bottom:0;overscroll-behavior:none;-webkit-overflow-scrolling:touch}
        .feed{scrollbar-width:none;-ms-overflow-style:none}
        .feed::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{ 
        position: "fixed", inset: 0, 
        width: "100vw", height: "100vh", height: "100dvh", 
        background: "black", overflow: "hidden", fontFamily: "Arial" 
      }}>

        {/* TOP - Fits top safe area */}
        <div style={{ 
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, 
          display: "flex", justifyContent: "space-between", alignItems: "center", 
          padding: "12px 12px", paddingTop: "calc(12px + env(safe-area-inset-top))",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)"
        }}>
          <div style={{ background: "white", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>KB</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ color: activeTop==="For You" ? "white" : "#888", fontWeight: "bold", fontSize: 15, borderBottom: activeTop==="For You" ? "2px solid white" : "none", paddingBottom: 3 }}>For You</div>
            <div style={{ color: "#888", fontSize: 15 }}>Muzika</div>
            <div style={{ color: "#888", fontSize: 14 }}>Following</div>
            <div style={{ color: "#888", fontSize: 14 }}>Live</div>
          </div>
          <div style={{ width: 32 }} />
        </div>

        {/* FEED - 100% FIT */}
        <div className="feed" style={{ 
          width: "100%", height: "100%", 
          overflowY: "auto", overflowX: "hidden",
          scrollSnapType: "y mandatory", scrollSnapStop: "always"
        }}>
          {videos.map((video) => (
            <div key={video.id} style={{ 
              width: "100vw", height: "100vh", height: "100dvh",
              scrollSnapAlign: "start", scrollSnapStop: "always",
              position: "relative", background: "black", overflow: "hidden", flexShrink: 0
            }}>
              {video.videoUrl ? (
                <video ref={el => videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline muted autoPlay style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#0a0a0a" }} />
              )}

              {/* RIGHT BUTTONS - Fits middle */}
              <div style={{ position: "absolute", right: 10, bottom: "calc(85px + env(safe-area-inset-bottom))", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 46, height: 46, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 18, border: "2px solid white" }}>K</div>
                  <div onClick={() => setVideos(videos.map(v => v.id===video.id ? {...v, isFollowing: !v.isFollowing} : v))} style={{ width: 18, height: 18, background: video.isFollowing ? "#666" : "#FE2C55", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, marginTop: -8, border: "2px solid black" }}>{video.isFollowing ? "✓" : "+"}</div>
                </div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>❤️</div><div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.likes}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 24 }}>🕒</div><div style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>{video.history}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 24 }}>💬</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 24 }}>↗️</div><div style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>{video.shares}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>🔥</div><div style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>{video.fire}</div></div>
              </div>

              {/* LEFT DOWN - Fits */}
              <div style={{ position: "absolute", left: 12, bottom: "calc(85px + env(safe-area-inset-bottom))", right: 80 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: "bold", fontSize: 14, color: "white" }}>Katongole Rashid</span>
                  <span style={{ background: "#1DA1F2", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: "bold" }}>✓</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM - Fits bottom safe area */}
        <div style={{ 
          position: "absolute", bottom: 0, left: 0, right: 0, 
          background: "black", borderTop: "1px solid #1a1a1a", 
          display: "flex", justifyContent: "space-around", alignItems: "center",
          padding: "8px 0", paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
          height: "calc(65px + env(safe-area-inset-bottom))",
          zIndex: 30 
        }}>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>🏠</div><div style={{ fontSize: 8, color: "white", fontWeight: "bold", marginTop: 2 }}>Home</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 11, background: "#222", color: "white", padding: "5px 12px", borderRadius: 6, display: "inline-block", fontWeight: "bold" }}>Live</div></div>
          <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 40, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 20, fontWeight: "bold" }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 18 }}>💬</div><div style={{ fontSize: 8, color: "white", marginTop: 2 }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 18 }}>👤</div><div style={{ fontSize: 8, color: "white", marginTop: 2 }}>You</div></div>
        </div>

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", fontWeight: "bold", width: "90%", maxWidth: 300 }}>Choose Video</button>
            <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
