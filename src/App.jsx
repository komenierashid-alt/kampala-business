import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const [caption, setCaption] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", caption: "My music video 🔥", likes: 45, shares: 8, downloads: 12, history: 120, isFollowing: false, verified: true },
    { id: 2, user: "Kayima baker", caption: "Second music video", likes: 32, shares: 5, downloads: 7, history: 85, isFollowing: false, verified: false },
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
    setVideos([{ id: Date.now(), user: "Katongole Rashid", caption: caption || "New music video 🔥", likes: 0, shares: 0, downloads: 0, history: 0, isFollowing: false, verified: true, videoUrl: url }, ...videos]);
    setShowUpload(false);
    setCaption("");
  };

  const toggleFollow = (id) => setVideos(videos.map(v => v.id===id ? { ...v, isFollowing: !v.isFollowing } : v));

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

        {/* TOP - Music Videos up there */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
          <div style={{ background: "white", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>KB</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ color: "white", fontWeight: "bold", fontSize: 16, borderBottom: "2px solid white", paddingBottom: 3 }}>Music Videos</div>
            <div style={{ color: "#aaa", fontSize: 15 }}>Following</div>
            <div style={{ color: "#aaa", fontSize: 15 }}>Live</div>
          </div>
          <div style={{ width: 32 }}></div>
        </div>

        <div className="feed" style={{ width: "100vw", height: "100vh", height: "100dvh", overflowY: "auto", scrollSnapType: "y mandatory" }}>
          {videos.map((video) => (
            <div key={video.id} style={{ width: "100vw", height: "100vh", height: "100dvh", scrollSnapAlign: "start", scrollSnapStop: "always", position: "relative", background: "black", overflow: "hidden" }}>
              {video.videoUrl ? (
                <video ref={el => videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#111" }} />
              )}

              {/* RIGHT - +Follow, History, Share, Download */}
              <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>

                {/* KB + Follow button back */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 18, border: "2px solid white" }}>K</div>
                  <div onClick={() => toggleFollow(video.id)} style={{ width: 20, height: 20, background: video.isFollowing ? "#666" : "#FE2C55", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, marginTop: -9, border: "2px solid black", cursor: "pointer" }}>{video.isFollowing ? "✓" : "+"}</div>
                </div>

                {/* Like */}
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 30 }}>❤️</div><div style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>{video.likes}</div></div>

                {/* History Button BACK */}
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>🕒</div><div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.history}</div></div>

                {/* Comment */}
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>💬</div></div>

                {/* Share Button BACK */}
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>↗️</div><div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.shares}</div></div>

                {/* Download Button BACK */}
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 24 }}>⬇️</div><div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.downloads}</div></div>
              </div>

              {/* LEFT DOWN - Katongole Rashid + Blue Tick - NO Original Sound */}
              <div style={{ position: "absolute", left: 12, bottom: 90, right: 80 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: "bold", fontSize: 15, color: "white" }}>Katongole Rashid</span>
                  <span style={{ background: "#1DA1F2", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: "bold" }}>✓</span>
                </div>
                <div style={{ fontSize: 13, color: "white", marginTop: 4 }}>{video.caption}</div>
              </div>
            </div>
          ))}
          <div style={{ height: 70, background: "black" }} />
        </div>

        {/* BOTTOM NAV - No Music Folder */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 30 }}>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 22 }}>🏠</div><div style={{ fontSize: 9, color: "white", fontWeight: "bold" }}>Home</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 12, background: "#222", color: "white", padding: "4px 10px", borderRadius: 4, display: "inline-block" }}>Live</div><div style={{ fontSize: 9, color: "white", marginTop: 2 }}>Live</div></div>
          <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 42, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 22, fontWeight: "bold", cursor: "pointer" }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>💬</div><div style={{ fontSize: 9, color: "white" }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>👤</div><div style={{ fontSize: 9, color: "white" }}>You</div></div>
        </div>

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption for music video..." style={{ width: "90%", maxWidth: 300, padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none" }} />
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", marginTop: 15, fontWeight: "bold", width: "90%", maxWidth: 300 }}>Choose Music Video</button>
            <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
