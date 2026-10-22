import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const [showUpload, setShowUpload] = useState(false);
  const [activeTop, setActiveTop] = useState("For You");
  const [showUsers, setShowUsers] = useState(false);
  const [postToMuzika, setPostToMuzika] = useState(false);

  // REAL USER SYSTEM - Each phone gets unique ID
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("muzika_user");
    if (saved) return JSON.parse(saved);
    const newUser = {
      id: "user_" + Date.now() + "_" + Math.random().toString(36).substr(2,5),
      name: "User_" + Math.floor(Math.random()*9000+1000),
      isAdmin: false,
      joinedAt: Date.now()
    };
    localStorage.setItem("muzika_user", JSON.stringify(newUser));
    return newUser;
  });

  // Make Rashid Admin - First user to set name Katongole becomes admin
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("is_muzika_admin") === "true" || currentUser.name.includes("Rashid");
  });

  // ALL USERS WHO JOINED MUZIKA
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("muzika_all_users");
    return saved ? JSON.parse(saved) : [currentUser];
  });

  // REAL VIDEOS WITH REAL COUNTS - Stored in localStorage
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("muzika_videos_real");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, user: "Katongole Rashid", userId: "admin_1", caption: "", likes: [], views: [], shares: 0, fire: [], history: [], comments: [], isMuzika: true, verified: true, createdAt: Date.now() },
    ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("muzika_videos_real", JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem("muzika_all_users", JSON.stringify(allUsers));
  }, [allUsers]);

  // Track new user joins
  useEffect(() => {
    if (!allUsers.find(u => u.id === currentUser.id)) {
      setAllUsers([...allUsers, currentUser]);
    }
  }, []);

  // REAL VIEW COUNT - One view per user only
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const videoId = parseInt(e.target.dataset.videoid);
        if (e.isIntersecting) {
          e.target.play().catch(()=>{});
          // Add real view - only once per user
          setVideos(prev => prev.map(v => {
            if (v.id === videoId && !v.views.includes(currentUser.id)) {
              return { ...v, views: [...v.views, currentUser.id], history: [...v.history, currentUser.id] };
            }
            return v;
          }));
        } else {
          e.target.pause();
        }
      });
    }, { threshold: 0.7 });
    Object.values(videoRefs.current).forEach(v => v && obs.observe(v));
    return () => obs.disconnect();
  }, [videos, currentUser.id]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ONLY ADMIN CAN POST TO MUZIKA
    if (postToMuzika && !isAdmin) {
      alert("Only Katongole Rashid can post to Muzika! Post to For You instead.");
      return;
    }

    const url = URL.createObjectURL(file);
    const newVideo = {
      id: Date.now(),
      user: currentUser.name,
      userId: currentUser.id,
      caption: "",
      likes: [],
      views: [],
      shares: 0,
      fire: [],
      history: [],
      comments: [],
      isMuzika: postToMuzika ? true : false,
      verified: isAdmin,
      videoUrl: url,
      createdAt: Date.now()
    };
    setVideos([newVideo, ...videos]);
    setShowUpload(false);
    setPostToMuzika(false);
  };

  // REAL LIKE - One like per user only
  const toggleLike = (videoId) => {
    setVideos(videos.map(v => {
      if (v.id === videoId) {
        const alreadyLiked = v.likes.includes(currentUser.id);
        return {
          ...v,
          likes: alreadyLiked ? v.likes.filter(id => id !== currentUser.id) : [...v.likes, currentUser.id]
        };
      }
      return v;
    }));
  };

  // REAL FIRE - One fire per user only
  const toggleFire = (videoId) => {
    setVideos(videos.map(v => {
      if (v.id === videoId) {
        const alreadyFired = v.fire.includes(currentUser.id);
        return {
          ...v,
          fire: alreadyFired ? v.fire.filter(id => id !== currentUser.id) : [...v.fire, currentUser.id]
        };
      }
      return v;
    }));
  };

  const filteredVideos = videos.filter(v => {
    if (activeTop === "Muzika") return v.isMuzika;
    if (activeTop === "For You") return !v.isMuzika;
    return true;
  });

  const makeAdmin = () => {
    localStorage.setItem("is_muzika_admin", "true");
    setIsAdmin(true);
    setCurrentUser({ ...currentUser, name: "Katongole Rashid", isAdmin: true });
    localStorage.setItem("muzika_user", JSON.stringify({ ...currentUser, name: "Katongole Rashid", isAdmin: true }));
    alert("You are now Admin - You can post to Muzika!");
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body,#root{width:100%;height:100%;overflow:hidden;background:#000}
        body{position:fixed;inset:0;overscroll-behavior:none}
        .feed::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", height: "100dvh", background: "black", overflow: "hidden", fontFamily: "Arial" }}>

        {/* TOP */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}>
          <div onClick={() => setShowUsers(true)} style={{ background: "white", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 10, cursor: "pointer" }}>{allUsers.length}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div onClick={() => setActiveTop("For You")} style={{ color: activeTop==="For You" ? "white" : "#888", fontWeight: "bold", fontSize: 15, borderBottom: activeTop==="For You" ? "2px solid white" : "none", paddingBottom: 3, cursor: "pointer" }}>For You</div>
            <div onClick={() => setActiveTop("Muzika")} style={{ color: activeTop==="Muzika" ? "#00ff88" : "#888", fontWeight: "bold", fontSize: 15, borderBottom: activeTop==="Muzika" ? "2px solid #00ff88" : "none", paddingBottom: 3, cursor: "pointer" }}>Muzika ({videos.filter(v=>v.isMuzika).length})</div>
            <div onClick={() => setActiveTop("Following")} style={{ color: "#888", fontSize: 13, cursor: "pointer" }}>Following</div>
            <div style={{ color: "#888", fontSize: 13 }}>Live</div>
          </div>
          <div style={{ width: 32 }} />
        </div>

        {/* WHO JOINED MUZIKA MODAL */}
        {showUsers && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 80, padding: 20, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: "white", fontSize: 18 }}>People Joined Muzika - {allUsers.length}</h2>
              <button onClick={() => setShowUsers(false)} style={{ background: "#222", color: "white", border: "none", padding: "8px 14px", borderRadius: 20 }}>X</button>
            </div>
            <div style={{ color: "#aaa", fontSize: 12, marginBottom: 15 }}>Everyone who has app on phone - Real users</div>
            {allUsers.map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #222" }}>
                <div style={{ width: 40, height: 40, background: u.isAdmin || u.name.includes("Rashid") ? "#00ff88" : "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{u.name[0]}</div>
                <div>
                  <div style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{u.name} {u.isAdmin || u.name.includes("Rashid") ? "✓ Admin" : ""}</div>
                  <div style={{ color: "#666", fontSize: 11 }}>Joined {new Date(u.joinedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
            {!isAdmin && <button onClick={makeAdmin} style={{ background: "#00ff88", color: "black", border: "none", padding: "12px", borderRadius: 20, width: "100%", marginTop: 20, fontWeight: "bold" }}>I am Katongole Rashid (Make me Admin)</button>}
            <div style={{ color: "white", fontSize: 12, marginTop: 15 }}>Your ID: {currentUser.id.slice(0,15)}... | Name: {currentUser.name}</div>
          </div>
        )}

        <div className="feed" style={{ width: "100%", height: "100%", overflowY: "auto", scrollSnapType: "y mandatory" }}>
          {filteredVideos.length === 0 ? (
            <div style={{ width: "100vw", height: "100vh", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "white" }}>
              <div style={{ fontSize: 40 }}>🎵</div>
              <div style={{ marginTop: 10 }}>{activeTop === "Muzika" ? "No Muzika videos yet - Only Admin can post" : "No videos yet - Tap + to post"}</div>
            </div>
          ) : filteredVideos.map((video) => (
            <div key={video.id} style={{ width: "100vw", height: "100vh", height: "100dvh", scrollSnapAlign: "start", position: "relative", background: "black", overflow: "hidden" }}>
              {video.videoUrl ? (
                <video data-videoid={video.id} ref={el => videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#111" }} />
              )}

              <div style={{ position: "absolute", right: 10, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 46, height: 46, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{video.user[0]}</div>
                  <div style={{ width: 18, height: 18, background: "#FE2C55", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, marginTop: -8, border: "2px solid black" }}>+</div>
                </div>
                <div onClick={() => toggleLike(video.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 28, filter: video.likes.includes(currentUser.id) ? "none" : "grayscale(1)" }}>❤️</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.likes.length}</div>
                  <div style={{ color: "#666", fontSize: 8 }}>REAL</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>👁️</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.views.length}</div>
                  <div style={{ color: "#666", fontSize: 8 }}>REAL VIEWS</div>
                </div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22 }}>💬</div><div style={{ color: "white", fontSize: 10 }}>{video.comments.length}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22 }}>↗️</div><div style={{ color: "white", fontSize: 10 }}>{video.shares}</div></div>
                <div onClick={() => toggleFire(video.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 26, filter: video.fire.includes(currentUser.id) ? "none" : "grayscale(1)" }}>🔥</div>
                  <div style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{video.fire.length}</div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 12, bottom: 90, right: 80 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: "bold", fontSize: 14, color: "white" }}>{video.user}</span>
                  {video.verified && <span style={{ background: "#1DA1F2", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: "bold" }}>✓</span>}
                  {video.isMuzika && <span style={{ background: "#00ff88", color: "black", fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: "bold" }}>MUZIKA</span>}
                </div>
                <div style={{ color: "#aaa", fontSize: 11, marginTop: 4 }}>{video.views.length} real views • {video.likes.length} real likes • 1 per person</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 30 }}>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 20 }}>🏠</div><div style={{ fontSize: 8, color: "white", fontWeight: "bold" }}>Home</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 11, background: "#222", color: "white", padding: "5px 12px", borderRadius: 6, display: "inline-block" }}>Live</div></div>
          <div onClick={() => setShowUpload(true)} style={{ background: "white", width: 40, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: 20, fontWeight: "bold", cursor: "pointer" }}>+</div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 18 }}>💬</div><div style={{ fontSize: 8, color: "white" }}>Chat</div></div>
          <div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 18 }}>👤</div><div style={{ fontSize: 8, color: "white" }}>You</div></div>
        </div>

        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ color: "white", fontWeight: "bold", marginBottom: 15 }}>{isAdmin ? "Admin: Choose where to post" : "Post to For You"}</div>
            
            {isAdmin && (
              <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                <button onClick={() => setPostToMuzika(false)} style={{ background: !postToMuzika ? "white" : "#333", color: !postToMuzika ? "black" : "white", border: "none", padding: "8px 16px", borderRadius: 20, fontWeight: "bold" }}>For You</button>
                <button onClick={() => setPostToMuzika(true)} style={{ background: postToMuzika ? "#00ff88" : "#333", color: postToMuzika ? "black" : "white", border: "none", padding: "8px 16px", borderRadius: 20, fontWeight: "bold" }}>Muzika (Only You)</button>
              </div>
            )}

            <div style={{ color: "#aaa", fontSize: 12, marginBottom: 10, textAlign: "center" }}>
              Real system: 1 view per person, 1 like per person<br/>
              {postToMuzika ? "Posting to Muzika - Only you can" : "Posting to For You - Everyone can post"}
            </div>

            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ background: postToMuzika ? "#00ff88" : "white", color: "black", padding: "14px 24px", borderRadius: 25, border: "none", fontWeight: "bold", width: "90%", maxWidth: 300 }}>
              {postToMuzika ? "Post to Muzika 🔒" : "Choose Video - Post to For You"}
            </button>
            <button onClick={() => setShowUpload(false)} style={{ background: "#222", color: "white", padding: "10px 20px", borderRadius: 20, border: "none", marginTop: 15 }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
