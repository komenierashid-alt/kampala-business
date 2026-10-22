import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const [caption, setCaption] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showMusicFolder, setShowMusicFolder] = useState(false);

  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", caption: "My music video 🔥", likes: 45, verified: true },
    { id: 2, user: "Kayima baker", caption: "Another video", likes: 32, verified: false },
  ]);

  const musicFolder = [
    { id: 1, title: "Amapiano Mix", count: "12 videos", icon: "🎹" },
    { id: 2, title: "Afrobeat Fire", count: "8 videos", icon: "🔥" },
    { id: 3, title: "Ugandan Drill", count: "15 videos", icon: "🥁" },
    { id: 4, title: "My Music Videos", count: `${videos.filter(v=>v.user==="Katongole Rashid").length} videos`, icon: "🎵" },
  ];

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
    setVideos([{ id: Date.now(), user: "Katongole Rashid", caption: caption || "New music video 🎵", likes: 0, verified: true, videoUrl: url }, ...videos]);
    setShowUpload(false);
    setCaption("");
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{overflow:hidden!important;position:fixed!important;width:100%;height:100%}
        #root{width:100vw;height:100vh;height:100dvh;overflow:hidden}
        .feed::-webkit-scrollbar{display:none}
        .feed{scrollbar-width:none}
      `}</style>

      <div style={{ background: "black", width: "100vw", height: "100vh", height: "100dvh", position: "fixed", top: 0, left: 0, fontFamily: "Arial", overflow: "hidden" }}>

        {/* TOP BAR - EXACT AS YOUR ARROWS */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
          
          {/* LEFT ARROW - KB LOGO */}
          <div style={{ background: "white", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, border: "2px solid white" }}>KB</div>
          
          {/* MIDDLE GREEN ARROW - For You Following Live */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div onClick={() => setShowMusicFolder(true)} style={{ color: "white", fontWeight: "bold", fontSize: 16, borderBottom: "2px solid white", paddingBottom: 3, cursor: "pointer" }}>For You</div>
            <div style={{ color: "#aaa", fontSize: 15 }}>Following</div>
            <div style={{ color: "#aaa", fontSize: 15 }}>Live</div>
          </div>

          {/* Right empty */}
          <div style={{ width: 32 }}></div>
        </div>

        {/* FEED */}
        <div className="feed" style={{ width: "100vw", height: "100vh", height: "100dvh", overflowY: "auto", scrollSnapType: "y mandatory" }}>
          {videos.map((video) => (
            <div key={video.id} style={{ width: "100vw", height: "100vh", height: "100dvh", scrollSnapAlign: "start", scrollSnapStop: "always", position: "relative", background: "black", overflow: "hidden" }}>
              {video.videoUrl ? (
                <video ref={el => videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#111" }} />
              )}

              {/* RIGHT BUTTONS */}
              <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <div style={{ width: 48, height: 48, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{video.user[0]}</div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 30 }}>❤️</div><div style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>{video.likes}</div></div>
                <div style={{ fontSize: 26 }}>💬</div>
                <div style={{ fontSize: 26 }}>↗️</div>
              </div>

              {/* LEFT DOWN CORNER - Katongole Rashid + BLUE TICK */}
              <div style={{ position: "absolute", left: 12, bottom: 85, right: 80 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: "bold", fontSize: 15, color: "white" }}>Katongole Rashid</span>
                  {video.verified && (
                    <span style={{ background: "#1DA1F2", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: "bold" }}>✓</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "white", marginTop: 4 }}>{video.caption}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>🎵</span> <span>Original sound • Music Video Folder</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ height: 70, background: "black" }} />
        </div>

        {/* MUSIC VIDEO FOLDER - MIDDLE GREEN ARROW */}
        {showMusicFolder && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 50, padding: 20, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "white" }}>📁 Music Video Folder</h2>
              <div onClick={() => setShowMusicFolder(false)} style={{ color: "white", fontSize: 20, background: "#222", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</div>
            </div>
            <p style={{ color: "#aaa", fontSize: 12, marginTop: 5 }}>Tap For You to open folder - middle arrow</p>
            
            {musicFolder.map(f => (
              <div key={f.id} onClick={() => setShowMusicFolder(false)} style={{ display: "flex", gap: 12, padding: 14, background: "#111", borderRadius: 12, marginTop: 12, alignItems: "center", border: "1px solid #222" }}>
                <div style={{ width: 50, height: 50, background: "#222", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{f.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{f.title}</div>
                  <div style={{ color: "#888", fontSize: 11 }}>{f.count}</div>
                </div>
                <div style={{ color: "white" }}>▶️</div>
              </div>
            ))}

            <button onClick={() => setShowMusicFolder(false)} style={{ width: "100%", background: "white", color: "black", padding: 14, borderRadius: 25, border: "none", fontWeight: "bold", marginTop: 25 }}>Close Folder</button>
          </div>
        )}

        {/* BOTTOM NAV */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 30 }}>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 22 }}>🏠</div><div style={{ fontSize: 9, color: "white", fontWeight: "bold" }}>Home</div></div>
          <div onClick={() => setShowMusicFolder(true)} style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>📁</div><div style={{ fontSize: 9, color: "#00ff88" }}>Music Folder</div></div>
          <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 42, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 22, fontWeight: "bold" }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>💬</div><div style={{ fontSize: 9, color: "white" }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>👤</div><div style={{ fontSize: 9, color: "white" }}>You</div></div>
        </div>

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption..." style={{ width: "90%", maxWidth: 300, padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none" }} />
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", marginTop: 15, fontWeight: "bold", width: "90%", maxWidth: 300 }}>Choose Music Video</button>
            <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
