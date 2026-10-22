import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("For You");
  const [showUpload, setShowUpload] = useState(false);
  const [showJoinedList, setShowJoinedList] = useState(false);
  const fileRef = useRef(null);
  const liveVideoRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const [profile] = useState({ name: "Katongole Rashid" });

  const [joinedPeople] = useState([
    { id: 1, name: "Kayima baker", avatar: "K" },
    { id: 2, name: "Shifah", avatar: "S" },
    { id: 3, name: "Musa", avatar: "M" },
  ]);

  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", caption: "Correa raper 🔥 Testing fit screen", views: 75, likes: 1, verified: true, videoUrl: null },
    { id: 2, user: "Katongole Rashid", caption: "Second video - screen locked now", views: 32, likes: 3, verified: true, videoUrl: null },
  ]);

  useEffect(() => {
    const handleFirst = () => setHasInteracted(true);
    document.addEventListener('click', handleFirst);
    document.addEventListener('touchstart', handleFirst);
    return () => {
      document.removeEventListener('click', handleFirst);
      document.removeEventListener('touchstart', handleFirst);
    };
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideos([{ id: Date.now(), user: profile.name, caption: caption || "New video", views: 0, likes: 0, verified: true, videoUrl: url }, ...videos]);
    setShowUpload(false);
    setCaption("");
  };

  return (
    <>
      {/* GLOBAL FIX FOR SCREEN MOVING */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          overflow: hidden !important;
          overscroll-behavior: none !important;
          width: 100% !important;
          height: 100% !important;
          position: fixed !important;
          touch-action: pan-y !important;
          -webkit-overflow-scrolling: touch;
        }
        #root {
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
          overflow: hidden !important;
        }
      `}</style>

      <div style={{
        background: "black",
        width: "100vw",
        maxWidth: "100vw",
        height: "100vh",
        height: "100dvh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        fontFamily: "Arial",
        touchAction: "pan-y",
        overscrollBehavior: "none",
      }}>
        
        {/* TOP BAR - FIT INSIDE */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          maxWidth: "100vw",
          zIndex: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 10px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)",
          boxSizing: "border-box",
        }}>
          <div style={{ background: "white", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, flexShrink: 0 }}>KB</div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <div onClick={() => setActiveTab("For You")} style={{ background: activeTab === "For You" ? "white" : "rgba(255,255,255,0.25)", color: activeTab === "For You" ? "black" : "white", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>For You</div>
            <div onClick={() => setActiveTab("Live")} style={{ background: activeTab === "Live" ? "white" : "rgba(255,255,255,0.25)", color: activeTab === "Live" ? "black" : "white", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>Live</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <div onClick={() => setShowJoinedList(true)} style={{ background: "#1DA1F2", color: "white", padding: "6px 10px", borderRadius: 15, fontSize: 11, fontWeight: "bold", whiteSpace: "nowrap" }}>👥 {joinedPeople.length} Joined</div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>🔔</div>
          </div>
        </div>

        {/* VIDEO FEED - NO LEFT/RIGHT MOVE, ONLY UP/DOWN */}
        <div style={{
          width: "100%",
          maxWidth: "100vw",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "y mandatory",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
        }}>
          {videos.map(video => (
            <div key={video.id} style={{
              width: "100%",
              maxWidth: "100vw",
              height: "100vh",
              height: "100dvh",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              position: "relative",
              background: "#000",
              overflow: "hidden",
              flexShrink: 0,
            }}>
              {video.videoUrl ? (
                <video src={video.videoUrl} autoPlay loop playsInline muted={!hasInteracted} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: video.id === 1 ? "#0a2d0a" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 50 }}>▶️</div>
                    <div style={{ fontSize: 12, marginTop: 10 }}>Video {video.id}</div>
                    <div style={{ fontSize: 10, color: "#666", marginTop: 5 }}>Swipe up/down only</div>
                  </div>
                </div>
              )}

              {!hasInteracted && video.videoUrl && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,0.7)", color: "white", padding: "8px 16px", borderRadius: 20, fontSize: 12 }}>Tap for sound 🔊</div>
              )}

              {/* RIGHT ACTIONS - LOCKED INSIDE */}
              <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 10 }}>
                <div style={{ width: 44, height: 44, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{video.user[0]}</div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>❤️</div><div style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>{video.likes}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22 }}>💬</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 20 }}>↗️</div></div>
              </div>

              {/* LEFT BOTTOM - LOCKED INSIDE */}
              <div style={{ position: "absolute", left: 12, bottom: 80, right: 70, textAlign: "left", maxWidth: "calc(100vw - 80px)", overflow: "hidden" }}>
                <div style={{ fontWeight: "bold", fontSize: 14, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{video.user} ✓</div>
                <div style={{ fontSize: 13, color: "white", marginTop: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{video.caption}</div>
                <div style={{ fontSize: 11, color: "#bbb", marginTop: 5 }}>👁️ {video.views} views</div>
              </div>
            </div>
          ))}
          
          {/* EXTRA SPACE FOR BOTTOM NAV */}
          <div style={{ height: 70, width: "100%", background: "black" }} />
        </div>

        {/* BOTTOM NAV - FIXED, NO MOVE */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          maxWidth: "100vw",
          background: "black",
          borderTop: "1px solid #222",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "8px 0",
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
          zIndex: 30,
          boxSizing: "border-box",
        }}>
          <div onClick={() => setActiveTab("For You")} style={{ textAlign: "center", flex: 1 }}><div>🏠</div><div style={{ fontSize: 9, color: "white" }}>Home</div></div>
          <div onClick={() => setActiveTab("Live")} style={{ textAlign: "center", flex: 1 }}><div style={{ background: "#333", color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 11, display: "inline-block" }}>Live</div><div style={{ fontSize: 9, color: "white" }}>Live</div></div>
          <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 40, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 20, fontWeight: "bold", flexShrink: 0 }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div>💬</div><div style={{ fontSize: 9, color: "white" }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div>👤</div><div style={{ fontSize: 9, color: "white" }}>You</div></div>
        </div>

        {activeTab === "Live" && (
          <div style={{ position: "absolute", inset: 0, background: "black", zIndex: 25, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, position: "relative", background: "#111" }}>
              <video ref={liveVideoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)" }}>
                <h3 style={{ color: "white" }}>Go Live</h3>
                <button onClick={async () => { try { const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); liveVideoRef.current.srcObject = s; } catch(e) { alert(e.message) } }} style={{ background: "red", color: "white", padding: "12px 30px", borderRadius: 25, border: "none", fontWeight: "bold", marginTop: 15 }}>🔴 START</button>
                <button onClick={() => setActiveTab("For You")} style={{ background: "#222", color: "white", padding: "8px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Back</button>
              </div>
            </div>
          </div>
        )}

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, width: "100vw", maxWidth: "100vw", boxSizing: "border-box" }}>
            <h2 style={{ color: "white" }}>Upload</h2>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption..." style={{ width: "90%", maxWidth: "300px", padding: 12, borderRadius: 10, marginTop: 15, background: "#222", color: "white", border: "none" }} />
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", marginTop: 15, fontWeight: "bold", width: "90%", maxWidth: "300px" }}>📁 Choose Video</button>
            <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 20 }}>Cancel</button>
          </div>
        )}

        {showJoinedList && (
          <div style={{ position: "absolute", inset: 0, background: "black", zIndex: 40, padding: 20, width: "100vw", maxWidth: "100vw", boxSizing: "border-box", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ color: "white" }}>👥 Joined ({joinedPeople.length})</h2>
              <div onClick={() => setShowJoinedList(false)} style={{ color: "white", fontSize: 22 }}>✕</div>
            </div>
            {joinedPeople.map(p => (
              <div key={p.id} style={{ display: "flex", gap: 12, padding: 12, background: "#111", borderRadius: 10, marginTop: 10 }}>
                <div style={{ width: 40, height: 40, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{p.avatar}</div>
                <div style={{ color: "white" }}>{p.name}</div>
              </div>
            ))}
            <button onClick={() => setShowJoinedList(false)} style={{ width: "100%", background: "white", color: "black", padding: 12, borderRadius: 25, border: "none", fontWeight: "bold", marginTop: 20 }}>Close</button>
          </div>
        )}
      </div>
    </>
  );
}
