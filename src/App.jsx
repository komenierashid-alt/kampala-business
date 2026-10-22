import { useState, useEffect, useRef } from "react";
import { db } from "./lib/firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(()=>{ const s=localStorage.getItem("kb_user"); return s?JSON.parse(s):null });
  const [view, setView] = useState("feed");
  const [activeTab, setActiveTab] = useState("For You");
  const [formName, setFormName] = useState("");
  const [formBio, setFormBio] = useState("Katongole Rashid | Content Creator");
  const [formContact, setFormContact] = useState("");
  const [formPass, setFormPass] = useState("");
  const [following, setFollowing] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [fireActive, setFireActive] = useState({});
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState({});
  const videoRefs = useRef({});
  const tapCounts = useRef({});
  const tapTimers = useRef({});
  const feedRef = useRef(null);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(data);
    });
    return () => unsub();
  }, []);

  // Auto-play current video, pause others
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((id, idx) => {
      const v = videoRefs.current[id];
      if(!v) return;
      if(idx === currentVideoIdx && !paused[id]) v.play().catch(()=>{});
      else v.pause();
    });
  }, [currentVideoIdx, paused, posts]);

  const handleAuth = () => {
    if(!formContact || !formPass || (authMode==='signup' && !formName)) { alert("Fill all"); return; }
    const user = { name: formName || "User", bio: formBio, contact: formContact, pic: "", id: Date.now().toString() };
    setCurrentUser(user);
    localStorage.setItem("kb_user", JSON.stringify(user));
    setView("feed"); setAuthMode(null);
    setFormName(""); setFormContact(""); setFormPass("");
  };

  const handlePost = async () => {
    if(!title.trim() && !videoFile) { alert("Add text or video"); return; }
    let videoUrl = "";
    if(videoFile){
      // For demo: create blob URL. In production use Firebase Storage
      videoUrl = URL.createObjectURL(videoFile);
    }
    await addDoc(collection(db, "posts"), {
      title: title || "New video",
      videoUrl,
      createdAt: serverTimestamp(),
      author: currentUser?.name || "Katongole Rashid",
      authorId: currentUser?.id || "katongole",
      authorBio: currentUser?.bio || "Creator",
      likes: 0,
      fire: 0,
      views: 0,
      comments: 0,
      shares: 0
    });
    setTitle(""); setVideoFile(null); setShowUpload(false);
  };

  const handleLike = async (id) => {
    await updateDoc(doc(db, "posts", id), { likes: increment(1) });
    if(!following[id]) addNotification("liked your video");
  };
  const handleFire = async (id) => {
    setFireActive(prev=>({...prev, [id]: !prev[id]}));
    await updateDoc(doc(db, "posts", id), { fire: increment(fireActive[id] ? -1 : 1) });
    addNotification("fired your video 🔥");
  };
  const handleView = async (id) => {
    await updateDoc(doc(db, "posts", id), { views: increment(1) });
  };
  const toggleFollow = (id, author) => {
    const isFollowing = following[id];
    setFollowing(prev=>({...prev, [id]: !prev[id]}));
    if(!isFollowing) addNotification(`You followed ${author}`, true, author);
    else addNotification(`You unfollowed ${author}`, true, author);
    if(!isFollowing) setNotifications(prev=>[{id:Date.now(), text:`${currentUser?.name || "Someone"} followed you`, time:"now"}, ...prev]);
  };
  const addNotification = (text, isOwn=false, target="") => {
    if(!isOwn) setNotifications(prev=>[{id:Date.now(), text, time:"now"}, ...prev].slice(0,20));
  };
  const handleDownload = (videoUrl, title) => {
    if(!videoUrl) { alert("No video to download"); return; }
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `${title || "video"}.mp4`;
    a.click();
    addNotification("Video downloaded");
  };

  // Double tap Like, Triple tap Fire
  const handleVideoTap = (id) => {
    const now = Date.now();
    if(!tapCounts.current[id]) tapCounts.current[id] = { count:0, lastTime:0 };
    const tap = tapCounts.current[id];
    
    if(now - tap.lastTime > 400){ tap.count = 1; }
    else { tap.count += 1; }

    tap.lastTime = now;

    clearTimeout(tapTimers.current[id]);
    tapTimers.current[id] = setTimeout(()=>{
      if(tap.count === 2){ handleLike(id); // Double tap Like
        const el = document.getElementById(`heart-${id}`);
        if(el){ el.style.transform="scale(1.5)"; setTimeout(()=>el.style.transform="scale(1)", 300); }
      }
      if(tap.count === 3){ handleFire(id); // Triple tap Fire
        const el = document.getElementById(`fire-${id}`);
        if(el){ el.style.transform="scale(1.6)"; setTimeout(()=>el.style.transform="scale(1)", 300); }
      }
      if(tap.count === 1){
        // Single tap pause/play
        setPaused(prev=>({...prev, [id]: !prev[id]}));
      }
      tap.count = 0;
    }, 350);
  };

  const onScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const height = e.target.clientHeight;
    const idx = Math.round(scrollTop / height);
    if(idx !== currentVideoIdx){
      setCurrentVideoIdx(idx);
      const post = posts[idx];
      if(post) handleView(post.id);
    }
  };

  // Filter for tabs
  const filteredPosts = posts.filter(p => {
    if(activeTab==="Following") return following[p.id];
    if(activeTab==="History") return false; // handled separate
    return true;
  });

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white", width: "100%", margin: 0, padding: 0, fontFamily: "system-ui", position: "relative", overflow: "hidden" }}>
      <style>{`
        html,body{margin:0 !important;padding:0 !important;background:#000 !important;width:100% !important;overflow:hidden !important;}
        *{box-sizing:border-box;}
        #root{width:100% !important;margin:0 !important;padding:0 !important;}
        ::-webkit-scrollbar{display:none;}
        .feed{scroll-snap-type:y mandatory; overflow-y:scroll; height:100vh; width:100%;}
        .videoCard{scroll-snap-align:start; height:100vh; width:100%; position:relative; background:#000; display:flex; align-items:center; justify-content:center; overflow:hidden;}
      `}</style>

      {/* TOP BAR */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: "32px", height: "32px", background: "white", borderRadius: "50%", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" }}>KB</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div onClick={()=>setShowNotif(!showNotif)} style={{ position: "relative", width: "32px", height: "32px", background: "#1c1c1c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>🔔{notifications.length>0 && <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "red", width: "10px", height: "10px", borderRadius: "50%" }}></span>}</div>
          <div onClick={()=>currentUser ? setView("account") : setAuthMode('login')} style={{ width: "32px", height: "32px", borderRadius: "50%", background: currentUser?.pic ? `url(${currentUser.pic})` : "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", backgroundSize: "cover" }}>{currentUser ? currentUser.name[0] : "U"}</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ position: "fixed", top: "48px", left: 0, right: 0, zIndex: 29, display: "flex", gap: "6px", padding: "0 12px", overflowX: "auto", background: "transparent" }}>
        {["For You", "Following", "Live", "Music"].map(tab => (
          <div key={tab} onClick={()=>setActiveTab(tab)} style={{ background: activeTab===tab ? "white" : "rgba(255,255,255,0.15)", color: activeTab===tab ? "black" : "white", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: activeTab===tab ? "700" : "400", whiteSpace: "nowrap", backdropFilter: "blur(10px)" }}>{tab}</div>
        ))}
      </div>

      {/* NOTIFICATIONS PANEL */}
      {showNotif && (
        <div style={{ position: "fixed", top: "50px", right: "10px", zIndex: 40, background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "12px", width: "260px", maxHeight: "300px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><b style={{ fontSize: "13px" }}>Notifications</b><span onClick={()=>setShowNotif(false)} style={{ fontSize: "12px", color: "#888" }}>Close</span></div>
          {notifications.length===0 ? <div style={{ fontSize: "12px", color: "#666" }}>No notifications</div> : notifications.map(n=><div key={n.id} style={{ background: "#1a1a1a", padding: "8px", borderRadius: "8px", marginBottom: "6px", fontSize: "12px" }}>{n.text} • {n.time}</div>)}
        </div>
      )}

      {/* ACCOUNT VIEW - EDIT PROFILE */}
      {view==="account" && currentUser && (
        <div style={{ padding: "70px 16px 80px", background: "#000", minHeight: "100vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "90px", height: "90px", background: currentUser.pic ? `url(${currentUser.pic})` : "white", borderRadius: "50%", margin: "20px auto", backgroundSize: "cover", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: "36px", fontWeight: "bold" }}>{!currentUser.pic && currentUser.name[0]}</div>
            <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files[0]; if(f){ const url=URL.createObjectURL(f); const u={...currentUser, pic:url}; setCurrentUser(u); localStorage.setItem("kb_user", JSON.stringify(u)); }}} style={{ marginTop: "8px" }} />
            <div style={{ marginTop: "16px" }}>
              <input value={currentUser.name} onChange={e=>{ const u={...currentUser, name:e.target.value}; setCurrentUser(u); localStorage.setItem("kb_user", JSON.stringify(u)); }} style={{ background: "#1a1a1a", border: "1px solid #333", color: "white", padding: "10px", borderRadius: "10px", width: "100%", textAlign: "center", fontWeight: "bold", fontSize: "16px" }} />
              <textarea value={currentUser.bio} onChange={e=>{ const u={...currentUser, bio:e.target.value}; setCurrentUser(u); localStorage.setItem("kb_user", JSON.stringify(u)); }} style={{ background: "#1a1a1a", border: "1px solid #333", color: "#aaa", padding: "8px", borderRadius: "10px", width: "100%", marginTop: "8px", fontSize: "12px" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px", fontSize: "12px" }}>
              <div><b>{posts.filter(p=>p.authorId===currentUser.id).length}</b><br/>Videos</div>
              <div><b>{notifications.length}</b><br/>Followers</div>
              <div><b>{Object.keys(following).length}</b><br/>Following</div>
            </div>
            <button onClick={()=>{ localStorage.removeItem("kb_user"); setCurrentUser(null); setView("feed"); }} style={{ marginTop: "20px", background: "#222", color: "#ff4444", border: "1px solid #333", width: "100%", padding: "12px", borderRadius: "10px" }}>Logout</button>
            <button onClick={()=>setView("feed")} style={{ marginTop: "10px", background: "white", color: "black", width: "100%", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>Back to Feed</button>
          </div>
          <h4 style={{ marginTop: "20px" }}>Your Videos - For You Page & Your Account</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px" }}>
            {posts.filter(p=>p.authorId===currentUser.id).map(p=>(
              <div key={p.id} style={{ background: "#111", aspectRatio: "9/16", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", position: "relative", overflow: "hidden" }}>
                {p.videoUrl ? <video src={p.videoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.title}
                <div style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "8px", background: "rgba(0,0,0,0.6)", padding: "2px 4px", borderRadius: "4px" }}>👁️{p.views||0}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUTH */}
      {authMode && !currentUser && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "#121212", padding: "20px", borderRadius: "16px", border: "1px solid #222", width: "100%", maxWidth: "320px" }}>
            <h3 style={{ margin: "0 0 12px 0" }}>{authMode==='login'?'Login':'Sign Up - Kampala Bornoz'}</h3>
            {authMode==='signup' && <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="Full Name - Changeable later" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />}
            <input value={formContact} onChange={e=>setFormContact(e.target.value)} placeholder="Phone or Email" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
            <input value={formPass} onChange={e=>setFormPass(e.target.value)} type="password" placeholder="Password" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "10px" }} />
            <button onClick={handleAuth} style={{ width: "100%", background: "#fff", color: "#000", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>{authMode==='login'?'Login':'Create Account - Bio & Pic Editable'}</button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "11px", color: "#888" }}>
              <span onClick={()=>setAuthMode(authMode==='login'?'signup':'login')}>{authMode==='login'?'No account? Sign Up':'Have account? Login'}</span>
              <span onClick={()=>setAuthMode(null)}>Close</span>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "#121212", padding: "16px", borderRadius: "14px", border: "1px solid #222", width: "100%", maxWidth: "340px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Upload Video - Goes to Your Account & For You</h3>
            <textarea value={title} onChange={e=>setTitle(e.target.value)} placeholder="Caption - What is happening?" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", minHeight: "60px", marginBottom: "8px" }} />
            <input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files[0])} style={{ width: "100%", marginBottom: "10px", color: "white" }} />
            {videoFile && <div style={{ fontSize: "11px", color: "#0f0", marginBottom: "8px" }}>Selected: {videoFile.name} - Will auto-play full screen, scroll up/down</div>}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={()=>setShowUpload(false)} style={{ flex: 1, background: "#222", color: "white", border: "1px solid #333", padding: "10px", borderRadius: "8px" }}>Cancel</button>
              <button onClick={handlePost} style={{ flex: 1, background: "#ff2d55", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold" }}>Post Video</button>
            </div>
            <div style={{ fontSize: "10px", color: "#666", marginTop: "8px" }}>Views, Likes, Fire, Comments, Shares, Following all tracked. Notifications to account.</div>
          </div>
        </div>
      )}

      {/* FULL SCREEN VERTICAL SCROLL FEED */}
      {view==="feed" && (
        <div ref={feedRef} className="feed" onScroll={onScroll} style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
          {filteredPosts.length===0 && <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}><div style={{ fontSize: "14px", color: "#666" }}>No videos yet - Be first to post!</div><button onClick={()=>setShowUpload(true)} style={{ background: "white", color: "black", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold" }}>Upload</button></div>}
          {filteredPosts.map((p, idx) => (
            <div key={p.id} className="videoCard" style={{ position: "relative", background: "#000" }} onClick={()=>handleVideoTap(p.id)}>
              {/* VIDEO - AUTO PLAY */}
              {p.videoUrl ? (
                <video
                  ref={el=>{ if(el) videoRefs.current[p.id]=el; }}
                  src={p.videoUrl}
                  loop
                  muted={muted}
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onLoadedMetadata={()=>handleView(p.id)}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #000)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>{p.title}</div>
              )}

              {/* PAUSE INDICATOR */}
              {paused[p.id] && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>▶️</div>}

              {/* BOTTOM LEFT - AUTHOR */}
              <div style={{ position: "absolute", bottom: "80px", left: "12px", right: "80px", zIndex: 10 }}>
                <div style={{ fontWeight: "800", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>{p.author} <span style={{ background: "#1d9bf0", width: "14px", height: "14px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>✓</span></div>
                <div style={{ fontSize: "13px", marginTop: "4px", color: "#eee", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</div>
                <div style={{ fontSize: "11px", color: "#aaa", marginTop: "6px" }}>👁️ {p.views||0} views • {p.authorBio||""}</div>
              </div>

              {/* RIGHT SIDE - ACTIONS - NO LINES */}
              <div style={{ position: "absolute", right: "8px", bottom: "80px", display: "flex", flexDirection: "column", gap: "18px", alignItems: "center", zIndex: 10 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid white" }}>{p.author?.[0]||"K"}</div>
                  <div onClick={(e)=>{ e.stopPropagation(); toggleFollow(p.id, p.author); }} style={{ position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)", background: following[p.id] ? "#888" : "#ff2d55", color: "white", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", border: "2px solid black" }}>{following[p.id] ? "✓" : "+"}</div>
                </div>
                <div id={`heart-${p.id}`} onClick={(e)=>{ e.stopPropagation(); handleLike(p.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", transition: "transform 0.2s" }}>
                  <div style={{ fontSize: "28px" }}>❤️</div>
                  <div style={{ fontSize: "12px", fontWeight: "600" }}>{p.likes||0}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  <div style={{ fontSize: "26px" }}>💬</div>
                  <div style={{ fontSize: "12px", fontWeight: "600" }}>{p.comments||0}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  <div style={{ fontSize: "26px" }}>↗️</div>
                  <div style={{ fontSize: "11px" }}>Share</div>
                </div>
                <div id={`fire-${p.id}`} onClick={(e)=>{ e.stopPropagation(); handleFire(p.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", transition: "transform 0.2s" }}>
                  <div style={{ fontSize: "28px", filter: fireActive[p.id] ? "drop-shadow(0 0 8px #ff4500)" : "none" }}>🔥</div>
                  <div style={{ fontSize: "11px", fontWeight: fireActive[p.id] ? "800" : "400", color: fireActive[p.id] ? "#ff4500" : "white" }}>{p.fire||0}</div>
                </div>
                <div onClick={(e)=>{ e.stopPropagation(); setShowHistory(true); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  <div style={{ fontSize: "24px" }}>🕒</div>
                  <div style={{ fontSize: "10px" }}>History</div>
                </div>
                {/* DOWNLOAD BUTTON AFTER HISTORY - YOUR REQUEST */}
                <div onClick={(e)=>{ e.stopPropagation(); handleDownload(p.videoUrl, p.title); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "rgba(255,255,255,0.1)", padding: "6px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "22px" }}>⬇️</div>
                  <div style={{ fontSize: "9px" }}>Download</div>
                </div>
              </div>

              {/* MUTE/PAUSE CONTROLS */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 5, pointerEvents: "none", display: "flex", gap: "40px", opacity: 0.7 }}>
                <span style={{ fontSize: "10px", color: "#fff", background: "rgba(0,0,0,0.5)", padding: "4px 6px", borderRadius: "10px" }}>Double tap ❤️ Like</span>
                <span style={{ fontSize: "10px", color: "#fff", background: "rgba(0,0,0,0.5)", padding: "4px 6px", borderRadius: "10px" }}>Triple tap 🔥 Fire</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM NAV - FIXED - NO LINES */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#000", borderTop: "1px solid #111", display: "flex", justifyContent: "space-between", padding: "6px 12px", zIndex: 30, alignItems: "center", width: "100%" }}>
        <div onClick={()=>{ setView("feed"); setActiveTab("For You"); }} style={{ textAlign: "center", color: "white", flexShrink: 0 }}>
          <div style={{ fontSize: "20px" }}>🏠</div>
          <div style={{ fontSize: "9px", fontWeight: "bold" }}>Home</div>
        </div>
        <div style={{ display: "flex", gap: "28px", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <div onClick={()=>setActiveTab("Live")} style={{ textAlign: "center", color: activeTab==="Live" ? "white" : "#777" }}>
            <div style={{ fontSize: "18px", background: activeTab==="Live" ? "#ff2d55" : "transparent", padding: "2px 6px", borderRadius: "6px" }}>🔴</div>
            <div style={{ fontSize: "9px", fontWeight: activeTab==="Live" ? "bold" : "400", color: "white" }}>Live</div>
          </div>
          <div onClick={()=>setShowUpload(true)} style={{ textAlign: "center" }}>
            <div style={{ background: "white", color: "black", width: "44px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold" }}>+</div>
          </div>
         <div onClick={()=>setActiveTab("Chat")} style={{ textAlign: "center", color: activeTab==="Chat" ? "white" : "#777" }}>
  <div style={{ fontSize: "18px" }}>💬</div>
  <div style={{ fontSize: "9px", fontWeight: "bold", color: "white" }}>Chat</div>
</div>
        </div>
        <div onClick={()=>currentUser ? setView("account") : setAuthMode('login')} style={{ background: currentUser ? "white" : "#1c1c1c", color: currentUser ? "black" : "white", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", border: "1px solid #333", flexShrink: 0 }}>
          {currentUser ? currentUser.name.split(" ")[0] : "User"}
        </div>
      </div>
    </div>
  );
}
