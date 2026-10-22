import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("For You");
  const [showUpload, setShowUpload] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [caption, setCaption] = useState("");
  const fileRef = useRef(null);
  const avatarRef = useRef(null);

  // ACCOUNT - Save name, bio in phone so it stays
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("kampala_profile");
    return saved ? JSON.parse(saved) : {
      name: "Katongole Rashid",
      bio: "Correa raper 🔥 | Kampala Bornoz | DM for business",
      avatar: null,
      followers: 0,
      following: 0,
    };
  });

  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);

  useEffect(() => {
    localStorage.setItem("kampala_profile", JSON.stringify(profile));
  }, [profile]);

  const [videos, setVideos] = useState([
    { id: 1, user: "Katongole Rashid", caption: "Correa raper 🔥", views: "75 views", likes: 1, verified: true, videoUrl: null },
    { id: 2, user: "Katongole Rashid", caption: "Abantu mwenna amwami...", views: "68 views", likes: 3, verified: true, videoUrl: null },
    { id: 3, user: "Kayima baker", caption: "My video", views: "67 views", likes: 11, verified: false, videoUrl: null },
  ]);

  // Filter MY videos for profile page
  const myVideos = videos.filter(v => v.user === profile.name || v.user === "Katongole Rashid");

  const hasBlueTick = (name, verified) => {
    if (!verified) return false;
    if (name.toLowerCase().includes("kayima")) return false;
    return true;
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newVideo = {
      id: Date.now(),
      user: profile.name,
      caption: caption || "My new video 🔥",
      views: "0 views",
      likes: 0,
      verified: true,
      videoUrl: url,
    };
    setVideos([newVideo, ...videos]);
    setShowUpload(false);
    setCaption("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile({ ...profile, avatar: url });
  };

  const saveProfile = () => {
    setProfile({ ...profile, name: editName, bio: editBio });
    setShowEditProfile(false);
  };

  const handleLike = (id) => {
    setVideos(videos.map(v => v.id === id ? { ...v, likes: v.likes + 1 } : v));
  };

  return (
    <div style={{ background: "black", height: "100vh", width: "100vw", overflow: "hidden", position: "relative", fontFamily: "Arial" }}>
      
      {/* TOP BAR - Hide on profile */}
      {activeTab !== "Profile" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
          <div style={{ background: "white", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>KB</div>
          <div style={{ display: "flex", gap: 5 }}>
            {["For You", "Following", "Live", "Music"].map(t => (
              <div key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? "white" : "rgba(255,255,255,0.25)", color: activeTab === t ? "black" : "white", padding: "5px 10px", borderRadius: 20, fontSize: 11, fontWeight: "bold", cursor: "pointer" }}>{t}</div>
            ))}
          </div>
          <div onClick={() => setActiveTab("Profile")} style={{ background: "white", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, cursor: "pointer" }}>
            {profile.avatar ? <img src={profile.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : profile.name[0]}
          </div>
        </div>
      )}

      {/* FOR YOU PAGE */}
      {activeTab !== "Profile" && activeTab !== "Chat" && activeTab !== "Live" && (
        <div style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
          {videos.map(video => (
            <div key={video.id} style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", background: "#000" }}>
              {video.videoUrl ? (
                <video src={video.videoUrl} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: video.id % 2 === 0 ? "#111" : "#222" }} />
              )}
              <div style={{ position: "absolute", right: 8, bottom: 85, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", overflow: "hidden" }}>
                  {video.user === profile.name && profile.avatar ? <img src={profile.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : video.user[0]}
                </div>
                <div onClick={() => handleLike(video.id)} style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>❤️</div><div style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>{video.likes}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 24 }}>💬</div><div style={{ fontSize: 12, color: "white" }}>0</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22 }}>↗️</div><div style={{ fontSize: 9, color: "white" }}>Share</div></div>
              </div>
              <div style={{ position: "absolute", left: 12, bottom: 70, right: 80, textAlign: "left" }}>
                <div style={{ fontWeight: "bold", fontSize: 15, color: "white" }}>{video.user} {hasBlueTick(video.user, video.verified) && <span style={{ background: "#1DA1F2", borderRadius: "50%", padding: "1px 5px", fontSize: 10, marginLeft: 4 }}>✓</span>}</div>
                <div style={{ fontSize: 13, color: "white", marginTop: 3 }}>{video.caption}</div>
                <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>👁️ {video.views}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROFILE PAGE - ACCOUNT WORKING */}
      {activeTab === "Profile" && (
        <div style={{ height: "100vh", overflowY: "auto", background: "black", paddingBottom: 70 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 15px", alignItems: "center", borderBottom: "1px solid #222" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div onClick={() => setActiveTab("For You")} style={{ color: "white", fontSize: 20, cursor: "pointer" }}>←</div>
              <div style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{profile.name}</div>
              <div style={{ background: "#1DA1F2", borderRadius: "50%", padding: "1px 5px", fontSize: 10, color: "white" }}>✓</div>
            </div>
            <div style={{ display: "flex", gap: 15, color: "white", fontSize: 18 }}>
              <span>🔍</span><span>≡</span>
            </div>
          </div>

          {/* Avatar + Stats */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 15px 10px" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "white", overflow: "hidden", border: "2px solid white" }}>
                {profile.avatar ? <img src={profile.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profile.name[0]}
              </div>
              <div onClick={() => avatarRef.current.click()} style={{ position: "absolute", bottom: 0, right: 0, background: "white", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}>✏️</div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />

            <div style={{ color: "white", fontWeight: "bold", fontSize: 16, marginTop: 10 }}>@{profile.name.toLowerCase().replace(/\s/g, "")}</div>
            
            <div style={{ display: "flex", gap: 25, marginTop: 15 }}>
              <div style={{ textAlign: "center" }}><div style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{myVideos.length}</div><div style={{ color: "#777", fontSize: 12 }}>Videos</div></div>
              <div style={{ textAlign: "center" }}><div style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{profile.followers}</div><div style={{ color: "#777", fontSize: 12 }}>Followers</div></div>
              <div style={{ textAlign: "center" }}><div style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{profile.following}</div><div style={{ color: "#777", fontSize: 12 }}>Following</div></div>
              <div style={{ textAlign: "center" }}><div style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{myVideos.reduce((a,b)=>a+b.likes,0)}</div><div style={{ color: "#777", fontSize: 12 }}>Likes</div></div>
            </div>

            <div style={{ color: "#aaa", fontSize: 13, textAlign: "center", marginTop: 12, padding: "0 20px" }}>{profile.bio}</div>

            <div style={{ display: "flex", gap: 10, marginTop: 15, width: "100%" }}>
              <button onClick={() => { setEditName(profile.name); setEditBio(profile.bio); setShowEditProfile(true); }} style={{ flex: 1, background: "#222", color: "white", border: "1px solid #333", padding: "10px", borderRadius: 8, fontWeight: "bold" }}>Edit profile</button>
              <button onClick={() => setShowUpload(true)} style={{ flex: 1, background: "white", color: "black", border: "none", padding: "10px", borderRadius: 8, fontWeight: "bold" }}>+ Add video</button>
            </div>
          </div>

          {/* My Videos Grid */}
          <div style={{ borderTop: "1px solid #222", marginTop: 15 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 30, padding: "10px", borderBottom: "1px solid #222" }}>
              <div style={{ color: "white", borderBottom: "2px solid white", paddingBottom: 5 }}>🎬 Videos {myVideos.length}</div>
              <div style={{ color: "#666" }}>❤️ Liked</div>
              <div style={{ color: "#666" }}>🔒 Private</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
              {myVideos.length === 0 ? (
                <div style={{ gridColumn: "1/4", textAlign: "center", padding: 40, color: "#666" }}>
                  <div style={{ fontSize: 40 }}>📹</div>
                  <div>No videos yet</div>
                  <div style={{ fontSize: 12, marginTop: 5 }}>Upload your first video!</div>
                </div>
              ) : (
                myVideos.map(v => (
                  <div key={v.id} style={{ aspectRatio: "9/16", background: "#111", position: "relative", overflow: "hidden" }}>
                    {v.videoUrl ? <video src={v.videoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#555" }}>{v.caption.slice(0,20)}</div>}
                    <div style={{ position: "absolute", bottom: 3, left: 3, color: "white", fontSize: 10, display: "flex", alignItems: "center", gap: 2 }}>▶️ {v.views}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", padding: "7px 0", zIndex: 30 }}>
        <div onClick={() => setActiveTab("For You")} style={{ textAlign: "center", opacity: activeTab === "For You" ? 1 : 0.5 }}><div>🏠</div><div style={{ fontSize: 9, color: "white" }}>Home</div></div>
        <div onClick={() => setActiveTab("Live")} style={{ textAlign: "center", opacity: activeTab === "Live" ? 1 : 0.5 }}><div style={{ background: "#333", color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>Live</div><div style={{ fontSize: 9, color: "white" }}>Live</div></div>
        <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 38, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 22, fontWeight: "bold" }}>+</div>
        <div onClick={() => setActiveTab("Chat")} style={{ textAlign: "center", opacity: activeTab === "Chat" ? 1 : 0.5 }}><div>💬</div><div style={{ fontSize: 9, color: "white" }}>Chat</div></div>
        <div onClick={() => setActiveTab("Profile")} style={{ textAlign: "center", opacity: activeTab === "Profile" ? 1 : 0.5 }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: profile.avatar ? "transparent" : "white", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: activeTab === "Profile" ? "2px solid white" : "none" }}>{profile.avatar ? <img src={profile.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 12 }}>👤</span>}</div><div style={{ fontSize: 9, color: "white", marginTop: 2, fontWeight: activeTab === "Profile" ? "bold" : "400" }}>{profile.name.split(" ")[0]}</div></div>
      </div>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <h2 style={{ color: "white" }}>Upload to For You</h2>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write caption..." style={{ width: "90%", padding: 12, borderRadius: 10, border: "none", marginTop: 15, background: "#222", color: "white" }} />
          <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
          <button onClick={() => fileRef.current.click()} style={{ background: "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", marginTop: 15, fontWeight: "bold", width: "90%", fontSize: 16 }}>📁 Choose Video</button>
          <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 20 }}>Cancel</button>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfile && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 60, display: "flex", flexDirection: "column", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div onClick={() => setShowEditProfile(false)} style={{ color: "white", fontSize: 20 }}>✕</div>
            <div style={{ color: "white", fontWeight: "bold" }}>Edit profile</div>
            <div onClick={saveProfile} style={{ color: "#1DA1F2", fontWeight: "bold", cursor: "pointer" }}>Save</div>
          </div>
          <div style={{ marginTop: 30 }}>
            <div style={{ color: "#777", fontSize: 12, marginBottom: 5 }}>Name</div>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, background: "#222", border: "1px solid #333", color: "white" }} />
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ color: "#777", fontSize: 12, marginBottom: 5 }}>Bio</div>
            <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={4} style={{ width: "100%", padding: 12, borderRadius: 8, background: "#222", border: "1px solid #333", color: "white" }} />
          </div>
          <div style={{ color: "#666", fontSize: 11, marginTop: 15 }}>✅ Name changes everywhere<br/>✅ Bio shows on profile<br/>✅ Your videos stay linked</div>
        </div>
      )}

      {activeTab === "Live" && <div style={{ position: "absolute", inset: 0, background: "black", zIndex: 25, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 60 }}>🔴</div><h2 style={{ color: "white" }}>Live</h2><button onClick={() => setActiveTab("For You")} style={{ background: "white", color: "black", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 10 }}>Back</button></div>}
      {activeTab === "Chat" && <div style={{ position: "absolute", inset: 0, background: "black", zIndex: 25, padding: 20 }}><h3 style={{ color: "white" }}>💬 Chat</h3><button onClick={() => setActiveTab("For You")} style={{ background: "#1DA1F2", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Back</button></div>}
    </div>
  );
}
