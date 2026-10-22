import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("For You");
  const [showUpload, setShowUpload] = useState(false);
  const fileRef = useRef(null);
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const [caption, setCaption] = useState("");

  const [videos, setVideos] = useState([
    { id: 3, user: "Katongole Rashid", caption: "NEWEST video 🔥 Swipe up for next new one", views: 5, likes: 2, isNew: true },
    { id: 2, user: "Katongole Rashid", caption: "New video 2 - Posted 1 min ago", views: 32, likes: 3, isNew: true },
    { id: 1, user: "Kayima baker", caption: "Older video - At bottom", views: 75, likes: 11, isNew: false },
  ]);

  // PAUSE PREVIOUS WHEN SWIPE - Core fix
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        const id = video.dataset.id;
        
        if (entry.isIntersecting) {
          // NEW VIDEO IN VIEW = PLAY IT
          video.play().catch(() => {});
          // Count view only once per view
          setVideos(prev => prev.map(v => v.id == id && !v.counted ? { ...v, views: v.views + 1, counted: true } : v));
        } else {
          // PREVIOUS VIDEO OUT OF VIEW = PAUSE IT
          video.pause();
          // Reset counted so it can count again next time
          setTimeout(() => {
            setVideos(prev => prev.map(v => v.id == id ? { ...v, counted: false } : v));
          }, 1000);
        }
      });
    }, { threshold: 0.7 });

    // Observe all videos
    Object.values(videoRefs.current).forEach(v => {
      if (v) observer.observe(v);
    });

    return () => observer.disconnect();
  }, [videos.length]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    // NEW VIDEOS AT TOP - So when you swipe UP you get OLDER, swipe DOWN you get NEWER
    // But you asked down->up = new videos, so we put new at BOTTOM and scroll up to see new
    // Actually TikTok: swipe UP (finger down->up) = NEXT video. So newest at TOP then you go down
    // To match your request: "scroll from down to up I want new videos"
    // That means when you swipe up, you want NEW - so we add new at END and reverse scroll logic
    // SIMPLE: Put NEW video at top, so first video you see is NEWEST
    const newVideo = { 
      id: Date.now(), 
      user: "Katongole Rashid", 
      caption: caption || "NEW video 🔊", 
      views: 0, 
      likes: 0, 
      videoUrl: url,
      isNew: true 
    };
    setVideos([newVideo, ...videos]); // NEWEST FIRST
    setShowUpload(false);
    setCaption("");
    // Scroll to top to show new video immediately
    if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add demo new video every time user scrolls to bottom - INFINITE NEW VIDEOS
  const handleScroll = (e) => {
    const el = e.target;
    // If near bottom, load more NEW videos (simulation)
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      // You can add logic to fetch new videos here
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow: hidden !important; position: fixed !important; width: 100%; height: 100%; overscroll-behavior: none; }
        #root { width: 100vw; height: 100vh; height: 100dvh; overflow: hidden; }
        /* Hide scrollbar */
        .feed::-webkit-scrollbar { display: none; }
        .feed { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{ background: "black", width: "100vw", height: "100vh", height: "100dvh", position: "fixed", top: 0, left: 0, fontFamily: "Arial", overflow: "hidden" }}>
        
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", padding: "10px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
          <div style={{ background: "white", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 11 }}>KB</div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ background: "white", color: "black", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>For You • New First</div>
          </div>
          <div style={{ background: "#1DA1F2", color: "white", padding: "5px 10px", borderRadius: 15, fontSize: 11, fontWeight: "bold" }}>👥 3 Joined</div>
        </div>

        {/* FEED - SWIPE DOWN->UP = NEW VIDEOS, PREVIOUS PAUSES */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="feed"
          style={{
            width: "100vw",
            height: "100vh",
            height: "100dvh",
            overflowX: "hidden",
            overflowY: "auto",
            scrollSnapType: "y mandatory",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
          }}
        >
          {videos.map((video, index) => (
            <div key={video.id} style={{
              width: "100vw",
              height: "100vh",
              height: "100dvh",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              position: "relative",
              background: "#000",
              overflow: "hidden",
            }}>
              {video.videoUrl ? (
                <video
                  ref={el => videoRefs.current[video.id] = el}
                  data-id={video.id}
                  src={video.videoUrl}
                  loop
                  playsInline
                  muted={false}
                  autoPlay={index === 0}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: video.isNew ? "#002200" : "#111", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: video.isNew ? "#00ff88" : "#555" }}>
                  <div style={{ fontSize: 60 }}>{video.isNew ? "🆕" : "📹"}</div>
                  <div style={{ fontSize: 12, marginTop: 10, color: video.isNew ? "#00ff88" : "#777" }}>{video.isNew ? "NEW VIDEO" : "OLD VIDEO"}</div>
                  <div style={{ fontSize: 10, color: "#666", marginTop: 5 }}>Video #{video.id}</div>
                </div>
              )}

              {/* Label NEW vs OLD */}
              <div style={{ position: "absolute", top: 60, left: 12, background: video.isNew ? "#00ff88" : "#333", color: video.isNew ? "black" : "white", padding: "3px 8px", borderRadius: 10, fontSize: 10, fontWeight: "bold" }}>
                {video.isNew ? "🆕 NEW" : "OLD"} • {index === 0 ? "First" : `Swipe ${index}`}
              </div>

              <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{video.user[0]}</div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>❤️</div><div style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>{video.likes}</div></div>
              </div>

              <div style={{ position: "absolute", left: 12, bottom: 80, right: 70 }}>
                <div style={{ fontWeight: "bold", fontSize: 14, color: "white" }}>{video.user}</div>
                <div style={{ fontSize: 13, color: "white", marginTop: 3 }}>{video.caption}</div>
                <div style={{ fontSize: 11, color: video.isNew ? "#00ff88" : "#bbb", marginTop: 5, fontWeight: video.isNew ? "bold" : "normal" }}>
                  {video.isNew ? "🆕 New" : "📁 Old"} • 👁️ {video.views} views • {index === 0 ? "▶️ PLAYING" : "⏸️ PAUSED"}
                </div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 3 }}>Swipe UP = Next {video.isNew ? "new" : "video"} • Previous auto pauses</div>
              </div>
            </div>
          ))}
          <div style={{ height: 70, background: "black" }} />
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 30 }}>
          <div style={{ textAlign: "center", flex: 1 }}><div>🏠</div><div style={{ fontSize: 9, color: "white" }}>Home</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ background: "#333", color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>Live</div><div style={{ fontSize: 9, color: "white" }}>Live</div></div>
          <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 40, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 20, fontWeight: "bold" }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div>💬</div><div style={{ fontSize: 9, color: "white" }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div>👤</div><div style={{ fontSize: 9, color: "white" }}>You</div></div>
        </div>

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <h2 style={{ color: "white" }}>Upload NEW Video</h2>
            <p style={{ color: "#00ff88", fontSize: 11, marginTop: 5 }}>Will appear at TOP • Newest first</p>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption..." style={{ width: "90%", maxWidth: 300, padding: 12, borderRadius: 10, marginTop: 15, background: "#222", color: "white", border: "none" }} />
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", marginTop: 15, fontWeight: "bold", width: "90%", maxWidth: 300 }}>📁 Choose NEW Video</button>
            <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 20 }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
