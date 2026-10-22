import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const [caption, setCaption] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", caption: "For You page 🔥", likes: 12, shares: 3, downloads: 5, history: 75, isFollowing: false, isLiked: false },
    { id: 2, user: "Kayima baker", caption: "Second video", likes: 32, shares: 8, downloads: 12, history: 120, isFollowing: true, isLiked: false },
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
    setVideos([{ id: Date.now(), user: "Katongole Rashid", caption: caption || "New", likes: 0, shares: 0, downloads: 0, history: 0, isFollowing: false, isLiked: false, videoUrl: url }, ...videos]);
    setShowUpload(false);
    setCaption("");
  };

  const toggleLike = (id) => setVideos(videos.map(v => v.id===id ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes-1 : v.likes+1 } : v));
  const toggleFollow = (id) => setVideos(videos.map(v => v.id===id ? { ...v, isFollowing: !v.isFollowing } : v));
  const handleShare = async (v) => {
    if (navigator.share) { try { await navigator.share({ title: v.caption, url: "https://kampala-business-13.vercel.app" }); } catch {} }
    else { navigator.clipboard.writeText("https://kampala-business-13.vercel.app"); alert("Link copied!"); }
    setVideos(videos.map(x => x.id===v.id ? { ...x, shares: x.shares+1 } : x));
  };
  const handleDownload = (v) => {
    if (!v.videoUrl) { alert("No video file"); return; }
    const a = document.createElement("a"); a.href = v.videoUrl; a.download = `${v.user}-video.mp4`; a.click();
    setVideos(videos.map(x => x.id===v.id ? { ...x, downloads: x.downloads+1 } : x));
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

        {/* TOP - For You */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "center", gap: 15, padding: "12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
          <div style={{ color: "white", fontWeight: "bold", fontSize: 16, borderBottom: "2px solid white", paddingBottom: 3 }}>For You</div>
          <div style={{ color: "#aaa", fontSize: 16 }}>Following</div>
          <div style={{ color: "#aaa", fontSize: 16 }}>Live</div>
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

              {/* RIGHT SIDE - ALL BUTTONS YOU ASKED */}
              <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 10 }}>
                
                {/* KB - Profile */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid white", fontSize: 16 }}>KB</div>
                  <div onClick={() => toggleFollow(video.id)} style={{ width: 20, height: 20, background: video.isFollowing ? "#666" : "#FE2C55", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, marginTop: -8, border: "2px solid black" }}>{video.isFollowing ? "✓" : "+"}</div>
                </div>

                {/* Like Button */}
                <div onClick={() => toggleLike(video.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 30 }}>{video.isLiked ? "❤️" : "🤍"}</div>
                  <div style={{ color: "white", fontSize: 12, fontWeight: "bold", marginTop: 2 }}>{video.likes}</div>
                </div>

                {/* History Button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 26 }}>🕒</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.history}</div>
                </div>

                {/* Music Button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 24 }}>🎵</div>
                  <div style={{ color: "white", fontSize: 9 }}>Music</div>
                </div>

                {/* Notifications Button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 26 }}>🔔</div>
                  <div style={{ color: "white", fontSize: 9 }}>Notify</div>
                </div>

                {/* 🔥 Fire Button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 28 }}>🔥</div>
                  <div style={{ color: "white", fontSize: 9 }}>Fire</div>
                </div>

                {/* Share Button */}
                <div onClick={() => handleShare(video)} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 26 }}>↗️</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.shares}</div>
                </div>

                {/* Download Button */}
                <div onClick={() => handleDownload(video)} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 24 }}>⬇️</div>
                  <div style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>{video.downloads}</div>
                </div>

              </div>

              {/* LEFT BOTTOM - Only name + caption */}
              <div style={{ position: "absolute", left: 12, bottom: 85, right: 80 }}>
                <div style={{ fontWeight: "bold", fontSize: 15, color: "white" }}>{video.user} {video.isFollowing && <span style={{ color: "#1DA1F2", fontSize: 12 }}>• Following</span>}</div>
                <div style={{ fontSize: 13, color: "white", marginTop: 4 }}>{video.caption}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                  <div style={{ fontSize: 12 }}>🎵</div>
                  <div style={{ fontSize: 11, color: "white" }}>Original sound • {video.user}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ height: 80, background: "black" }} />
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 30 }}>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 22 }}>🏠</div><div style={{ fontSize: 9, color: "white", fontWeight: "bold" }}>Home</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 14, background: "#222", color: "white", padding: "3px 8px", borderRadius: 4, display: "inline-block" }}>Live</div><div style={{ fontSize: 9, color: "white", marginTop: 2 }}>Live</div></div>
          <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 42, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 22, fontWeight: "bold" }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>💬</div><div style={{ fontSize: 9, color: "white" }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>👤</div><div style={{ fontSize: 9, color: "white" }}>You</div></div>
        </div>

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption..." style={{ width: "90%", maxWidth: 300, padding: 12, borderRadius: 10, background: "#222", color: "white", border: "none" }} />
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", marginTop: 15, fontWeight: "bold", width: "90%", maxWidth: 300 }}>Choose Video</button>
            <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 20 }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
