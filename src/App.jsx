import React, { useState, useRef } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("For You");
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const fileRef = useRef(null);

  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", caption: "Correa raper 🔥", views: "75 views", likes: 1, verified: true, videoUrl: null },
    { id: 2, user: "Katongole Rashid", caption: "Abantu mwenna amwami ano asaba...", views: "68 views", likes: 3, verified: true, videoUrl: null },
    { id: 3, user: "Kayima baker", caption: "My video", views: "67 views", likes: 11, verified: false, videoUrl: null },
    { id: 4, user: "Shifah", caption: "Life is short.. enjoy yourselves", views: "57 views", likes: 5, verified: true, videoUrl: null },
  ]);

  const hasBlueTick = (name, verified) => {
    if (!verified) return false;
    if (name.toLowerCase().includes("kayima")) return false;
    return true;
  };

  // UPLOAD - Post to For You for everyone to see
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newVideo = {
      id: Date.now(),
      user: "Katongole Rashid",
      caption: caption || "My new video 🔥",
      views: "0 views",
      likes: 0,
      verified: true,
      videoUrl: url,
    };
    // Add to top - appears on For You page for all
    setVideos([newVideo, ...videos]);
    setShowUpload(false);
    setCaption("");
    alert("Posted to For You! ✅ Everyone will see it!");
  };

  const handleLike = (id) => {
    setVideos(videos.map(v => v.id === id ? { ...v, likes: v.likes + 1 } : v));
  };

  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative", fontFamily: "Arial" }}>
      
      {/* TOP BAR */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
        <div style={{ background: "white", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>KB</div>
        <div style={{ display: "flex", gap: 5 }}>
          {["For You", "Following", "Live", "Music"].map(t => (
            <div key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? "white" : "rgba(255,255,255,0.25)", color: activeTab === t ? "black" : "white", padding: "5px 10px", borderRadius: 20, fontSize: 11, fontWeight: "bold", cursor: "pointer" }}>{t}</div>
          ))}
        </div>
        <div style={{ background: "white", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>K</div>
      </div>

      {/* FOR YOU PAGE - SHOWS ALL VIDEOS FROM ALL PEOPLE */}
      <div style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
        {videos.map(video => (
          <div key={video.id} style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", background: "#000" }}>
            {video.videoUrl ? (
              <video src={video.videoUrl} autoPlay loop muted playsInline controls={false} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: video.id % 2 === 0 ? "#111" : "#222", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: 12 }}>Video {video.id}</div>
            )}

            {/* RIGHT ACTIONS */}
            <div style={{ position: "absolute", right: 8, bottom: 85, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 10 }}>
              <div style={{ width: 44, height: 44, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{video.user[0]}</div>
              <div onClick={() => handleLike(video.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 28 }}>❤️</div>
                <div style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>{video.likes}</div>
              </div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 24 }}>💬</div><div style={{ fontSize: 12, color: "white" }}>0</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 22 }}>↗️</div><div style={{ fontSize: 9, color: "white" }}>Share</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 22 }}>🔥</div><div style={{ fontSize: 11, color: "white" }}>0</div></div>
            </div>

            {/* LEFT DOWN CORNER - Name */}
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
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "7px 0", zIndex: 30 }}>
        <div onClick={() => setActiveTab("For You")} style={{ textAlign: "center" }}><div>🏠</div><div style={{ fontSize: 9, color: "white" }}>Home</div></div>
        <div onClick={() => setActiveTab("Live")} style={{ textAlign: "center" }}><div style={{ background: "#333", color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>Live</div><div style={{ fontSize: 9, color: "white" }}>Live</div></div>
        <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 38, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 22, fontWeight: "bold", cursor: "pointer" }}>+</div>
        <div onClick={() => setActiveTab("Chat")} style={{ textAlign: "center" }}><div>💬</div><div style={{ fontSize: 9, color: "white", fontWeight: "bold" }}>Chat</div></div>
        <div style={{ textAlign: "center" }}><div>👤</div><div style={{ fontSize: 9, color: "white" }}>Katongole</div></div>
      </div>

      {/* UPLOAD MODAL - For You posting */}
      {showUpload && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <h2 style={{ color: "white", marginBottom: 5 }}>Upload to For You</h2>
          <p style={{ color: "#777", fontSize: 12 }}>Everyone will see your video</p>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write caption..." style={{ width: "90%", padding: 12, borderRadius: 10, border: "none", marginTop: 15, background: "#222", color: "white" }} />
          <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
          <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", marginTop: 15, fontWeight: "bold", width: "90%", fontSize: 16 }}>
            📁 Choose Video
          </button>
          <div style={{ background: "#111", padding: 10, borderRadius: 10, marginTop: 15, width: "90%" }}>
            <p style={{ color: "#aaa", fontSize: 11, textAlign: "center" }}>✅ Click + to upload<br/>✅ Video goes to For You page<br/>✅ All other people videos appear for you<br/>✅ No flowers, Name at left corner</p>
          </div>
          <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 20 }}>Cancel</button>
        </div>
      )}

      {activeTab === "Live" && (
        <div style={{ position: "absolute", inset: 0, background: "black", zIndex: 25, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 60 }}>🔴</div>
          <h2 style={{ color: "white" }}>Live</h2>
          <button onClick={() => setActiveTab("For You")} style={{ background: "white", color: "black", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 10 }}>Back to For You</button>
        </div>
      )}
      {activeTab === "Chat" && (
        <div style={{ position: "absolute", inset: 0, background: "black", zIndex: 25, padding: 20 }}>
          <h3 style={{ color: "white" }}>💬 Chat - All Joined People</h3>
          <button onClick={() => setActiveTab("For You")} style={{ background: "#1DA1F2", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Back</button>
        </div>
      )}
    </div>
  );
}
