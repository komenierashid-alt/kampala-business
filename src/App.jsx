import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("For You");
  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", caption: "Correa raper", views: "75 views", likes: 1, verified: true, color: "#0a2d0a" },
    { id: 2, user: "Katongole Rashid", caption: "Abantu mwenna amwami ano asaba...", views: "68 views", likes: 3, verified: true, color: "#222" },
    { id: 3, user: "Kayima baker", caption: "My video", views: "67 views", likes: 11, verified: false, color: "#111" },
  ]);

  const hasBlueTick = (name, verified) => {
    if (!verified) return false;
    if (name.toLowerCase().includes("kayima")) return false;
    return true;
  };

  const handleLike = (id) => {
    setVideos(videos.map(v => v.id === id ? { ...v, likes: v.likes + 1 } : v));
  };

  let lastTap = 0;
  const handleTap = (id) => {
    const now = Date.now();
    if (now - lastTap < 400) handleLike(id);
    lastTap = now;
  };

  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative", fontFamily: "Arial" }}>
      
      {/* TOP BAR */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <div style={{ background: "white", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>KB</div>
        <div style={{ display: "flex", gap: 5 }}>
          {["For You", "Following", "Live", "Music"].map(t => (
            <div key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? "white" : "rgba(255,255,255,0.25)", color: activeTab === t ? "black" : "white", padding: "5px 10px", borderRadius: 20, fontSize: 11, fontWeight: activeTab === t ? "bold" : "400", cursor: "pointer" }}>{t}</div>
          ))}
        </div>
        <div style={{ background: "white", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>K</div>
      </div>

      {/* VIDEO FEED - NO FLOWERS NOW */}
      <div style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
        {videos.map(video => (
          <div key={video.id} onClick={() => handleTap(video.id)} style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", background: video.color }}>
            
            {/* RIGHT ACTIONS */}
            <div style={{ position: "absolute", right: 8, bottom: 85, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 10 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 44, height: 44, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{video.user[0]}</div>
                <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", background: "red", width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white" }}>+</div>
              </div>
              <div onClick={(e) => { e.stopPropagation(); handleLike(video.id); }} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>❤️</div>
                <div style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>{video.likes}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>💬</div>
                <div style={{ fontSize: 12, color: "white" }}>0</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>↗️</div>
                <div style={{ fontSize: 9, color: "white" }}>Share</div>
                <div style={{ fontSize: 11, color: "white" }}>0</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>🔥</div>
                <div style={{ fontSize: 11, color: "white" }}>0</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 26, height: 26, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>🕒</div>
                <div style={{ fontSize: 9, color: "white", marginTop: 2 }}>History</div>
              </div>
            </div>

            {/* BOTTOM LEFT CORNER - Katongole Rashid LEFT */}
            <div style={{ position: "absolute", left: 12, bottom: 70, right: 80, textAlign: "left" }}>
              <div style={{ fontWeight: "bold", fontSize: 15, color: "white", textAlign: "left" }}>
                {video.user} {hasBlueTick(video.user, video.verified) && <span style={{ background: "#1DA1F2", borderRadius: "50%", padding: "1px 5px", fontSize: 10, marginLeft: 4 }}>✓</span>}
              </div>
              <div style={{ fontSize: 13, color: "white", marginTop: 3, textAlign: "left" }}>{video.caption}</div>
              <div style={{ fontSize: 11, color: "#bbb", marginTop: 4, textAlign: "left" }}>👁️ {video.views}</div>
            </div>

          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "7px 0", zIndex: 30 }}>
        <div onClick={() => setActiveTab("For You")} style={{ textAlign: "center" }}><div style={{ fontSize: 18 }}>🏠</div><div style={{ fontSize: 9, color: "white" }}>Home</div></div>
        <div onClick={() => setActiveTab("Live")} style={{ textAlign: "center" }}><div style={{ background: "#333", color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: "bold" }}>Live</div><div style={{ fontSize: 9, color: "white", marginTop: 2 }}>Live</div></div>
        <div style={{ background: "white", width: 38, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 20, fontWeight: "bold" }}>+</div>
        <div onClick={() => setActiveTab("Chat")} style={{ textAlign: "center" }}><div style={{ fontSize: 18 }}>💬</div><div style={{ fontSize: 9, color: "white", fontWeight: "bold" }}>Chat</div></div>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 18 }}>👤</div><div style={{ fontSize: 9, color: "white" }}>Katongole</div></div>
      </div>

      {activeTab === "Live" && (
        <div style={{ position: "absolute", inset: 0, background: "black", zIndex: 25, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 60 }}>🔴</div>
          <h2 style={{ color: "white" }}>Live Now</h2>
          <button onClick={() => setActiveTab("For You")} style={{ background: "white", color: "black", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 10 }}>Back</button>
        </div>
      )}
      {activeTab === "Chat" && (
        <div style={{ position: "absolute", inset: 0, background: "black", zIndex: 25, padding: 20 }}>
          <h3 style={{ color: "white" }}>💬 Chat</h3>
          <button onClick={() => setActiveTab("For You")} style={{ background: "#1DA1F2", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Back</button>
        </div>
      )}
    </div>
  );
}
