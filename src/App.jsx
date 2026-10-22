import { useState, useEffect, useRef } from "react";
import { db } from "./lib/firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment, deleteDoc, serverTimestamp, setDoc, getDocs } from "firebase/firestore";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [musicPosts, setMusicPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState("video"); // video or music
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(()=>{ const s=localStorage.getItem("kb_user_v2"); return s?JSON.parse(s):null });
  const [view, setView] = useState("feed");
  const [viewUser, setViewUser] = useState(null);
  const [activeTab, setActiveTab] = useState("For You");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPass, setFormPass] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [following, setFollowing] = useState(()=>{ const s=localStorage.getItem("kb_following"); return s?JSON.parse(s):{} });
  const [notifications, setNotifications] = useState(()=>{ const s=localStorage.getItem("kb_notif"); return s?JSON.parse(s):[] });
  const [showNotif, setShowNotif] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [fireActive, setFireActive] = useState({});
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState({});
  const videoRefs = useRef({});
  const tapCounts = useRef({});
  const tapTimers = useRef({});
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);

  useEffect(() => {
    const q1 = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub1 = onSnapshot(q1, (snap) => setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const q2 = query(collection(db, "music"), orderBy("createdAt", "desc"));
    const unsub2 = onSnapshot(q2, (snap) => setMusicPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const q3 = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub3 = onSnapshot(q3, (snap) => setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  useEffect(() => {
    Object.values(videoRefs.current).forEach(v=>{ if(v) v.pause(); });
    const keys = Object.keys(videoRefs.current);
    const id = keys[currentVideoIdx];
    if(id && videoRefs.current[id] && !paused[id]) videoRefs.current[id].play().catch(()=>{});
  }, [currentVideoIdx, paused]);

  const isKatongole = (name) => name?.toLowerCase().includes("katongole") && name?.toLowerCase().includes("rashid");
  const isOwner = currentUser && isKatongole(currentUser.name);

  const saveUser = (u) => { setCurrentUser(u); localStorage.setItem("kb_user_v2", JSON.stringify(u)); };

  const handleSignup = async () => {
    if(!formName || !formPass || (!formEmail && !formPhone)){ alert("Name + Email/Phone + Password required"); return; }
    const isKR = isKatongole(formName);
    const newUser = { name: formName, email: formEmail, phone: formPhone, password: formPass, bio: isKR ? "Founder | Kampala Bornoz - Music Admin" : "New user", pic: "", blueTick: isKR, followers: 0, following: 0, createdAt: serverTimestamp(), id: Date.now().toString() };
    await setDoc(doc(db, "users", newUser.id), newUser);
    saveUser(newUser); setView("feed"); setAuthMode(null); setFormName(""); setFormEmail(""); setFormPhone(""); setFormPass("");
  };
  const handleLogin = async () => {
    if(!formPass || (!formEmail && !formPhone)){ alert("Enter Email/Phone + Password"); return; }
    const q = await getDocs(collection(db, "users"));
    const found = q.docs.map(d=>d.data()).find(u=> (u.email===formEmail || u.phone===formPhone) && u.password===formPass);
    if(found){ saveUser(found); setView("feed"); setAuthMode(null); } else alert("User not found");
  };
  const handleForgot = async () => {
    if(!formEmail && !formPhone){ alert("Enter Email or Phone"); return; }
    const q = await getDocs(collection(db, "users"));
    const found = q.docs.map(d=>d.data()).find(u=> u.email===formEmail || u.phone===formPhone);
    if(found){ const newPass = Math.random().toString(36).slice(-6); await updateDoc(doc(db, "users", found.id), { password: newPass }); alert(`New Password for ${found.name}: ${newPass}`); saveUser({...found, password:newPass}); setShowForgot(false); setAuthMode(null); setView("feed"); } else alert("No account");
  };
  const handlePost = async () => {
    if(!currentUser){ alert("Login first"); setAuthMode('login'); return; }
    if(uploadType==="music" && !isOwner){ alert("Only Katongole Rashid can upload songs to Music folder!"); return; }
    if(!title.trim() && !videoFile){ alert("Add video/song"); return; }
    let videoUrl = ""; if(videoFile) videoUrl = URL.createObjectURL(videoFile);
    const collectionName = uploadType==="music" ? "music" : "posts";
    await addDoc(collection(db, collectionName), { title: title || (uploadType==="music" ? "New Song" : "My video"), videoUrl, createdAt: serverTimestamp(), author: currentUser.name, authorId: currentUser.id, authorPic: currentUser.pic || "", blueTick: currentUser.blueTick || false, likes: 0, fire: 0, views: 0, comments: 0, shares: 0, type: uploadType });
    setTitle(""); setVideoFile(null); setShowUpload(false); setUploadType("video");
  };
  const handleLike = async (id, isMusic=false) => { await updateDoc(doc(db, isMusic ? "music" : "posts", id), { likes: increment(1) }); };
  const handleFire = async (id, isMusic=false) => { setFireActive(p=>({...p, [id]: !p[id]})); await updateDoc(doc(db, isMusic ? "music" : "posts", id), { fire: increment(fireActive[id]?-1:1) }); };
  const handleView = async (id, isMusic=false) => { await updateDoc(doc(db, isMusic ? "music" : "posts", id), { views: increment(1) }); };
  const handleDelete = async (id, isMusic=false) => { if(confirm("Delete?")) await deleteDoc(doc(db, isMusic ? "music" : "posts", id)); };
  const toggleFollow = (authorId, authorName) => { const isFollowing = following[authorId]; const newFollowing = {...following, [authorId]: !isFollowing}; setFollowing(newFollowing); localStorage.setItem("kb_following", JSON.stringify(newFollowing)); const n = {id:Date.now(), text: `${isFollowing ? "Unfollowed" : "Followed"} ${authorName}`, time:"now"}; const newNotifs = [n, ...notifications].slice(0,30); setNotifications(newNotifs); localStorage.setItem("kb_notif", JSON.stringify(newNotifs)); };
  const shareAppLink = () => { const link = window.location.href; if(navigator.share) navigator.share({title:"Join Kampala Bornoz App", url:link}); else { navigator.clipboard.writeText(link); alert(`Link copied: ${link}`); } };
  const handleVideoTap = (id, isMusic=false) => { const now = Date.now(); if(!tapCounts.current[id]) tapCounts.current[id] = {count:0, lastTime:0}; const tap = tapCounts.current[id]; if(now - tap.lastTime > 400) tap.count = 1; else tap.count += 1; tap.lastTime = now; clearTimeout(tapTimers.current[id]); tapTimers.current[id] = setTimeout(()=>{ if(tap.count===2) handleLike(id, isMusic); if(tap.count===3) handleFire(id, isMusic); if(tap.count===1) setPaused(prev=>({...prev, [id]: !prev[id]})); tap.count = 0; }, 350); };
  const onScroll = (e) => { const idx = Math.round(e.target.scrollTop / e.target.clientHeight); if(idx!==currentVideoIdx){ setCurrentVideoIdx(idx); const all = activeTab==="Music" ? musicPosts : posts; const p = all[idx]; if(p) handleView(p.id, activeTab==="Music"); } };

  const ProfileView = ({ user }) => (
    <div style={{ padding: "70px 12px 80px", background: "#000", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "90px", height: "90px", background: user.pic ? `url(${user.pic})` : "white", borderRadius: "50%", margin: "10px auto", backgroundSize: "cover", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: "30px", fontWeight: "bold", border: user.blueTick ? "3px solid #1d9bf0" : "2px solid #333" }}>{!user.pic && user.name[0]}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: "800", fontSize: "18px" }}>{user.name} {user.blueTick && <span style={{ background: "#1d9bf0", width: "16px", height: "16px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</span>}</div>
        <div style={{ fontSize: "12px", color: "#aaa" }}>{user.bio}</div>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "12px", fontSize: "12px" }}><div><b>{posts.filter(p=>p.authorId===user.id).length + musicPosts.filter(p=>p.authorId===user.id).length}</b><br/>Videos</div><div><b>{posts.filter(p=>p.authorId===user.id).reduce((a,b)=>a+(b.views||0),0) + musicPosts.filter(p=>p.authorId===user.id).reduce((a,b)=>a+(b.views||0),0)}</b><br/>Views</div></div>
        {currentUser?.id !== user.id && <button onClick={()=>toggleFollow(user.id, user.name)} style={{ marginTop: "12px", background: following[user.id] ? "#222" : "#ff2d55", color: "white", border: "none", padding: "10px", borderRadius: "10px", fontWeight: "bold", width: "100%" }}>{following[user.id] ? "Following ✓" : "Follow"}</button>}
        <button onClick={()=>{ setViewUser(null); setView("feed"); }} style={{ marginTop: "10px", background: "#111", color: "white", border: "1px solid #222", width: "100%", padding: "10px", borderRadius: "10px" }}>Back</button>
      </div>
      <h4 style={{ marginTop: "18px", fontSize: "13px" }}>Videos posted after joining - Every video with views</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px" }}>
        {[...posts.filter(p=>p.authorId===user.id), ...musicPosts.filter(p=>p.authorId===user.id)].map(p=>(
          <div key={p.id} style={{ background: "#111", aspectRatio: "9/16", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
            {p.videoUrl ? <video src={p.videoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", padding: "4px" }}>{p.title}</div>}
            <div style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "8px", background: "rgba(0,0,0,0.7)", padding: "2px 4px", borderRadius: "4px" }}>👁️{p.views||0} ❤️{p.likes||0} {p.type==="music"?"🎵":""}</div>
            {currentUser?.id===p.authorId && <button onClick={()=>handleDelete(p.id, p.type==="music")} style={{ position: "absolute", top: "4px", right: "4px", background: "red", color: "white", border: "none", fontSize: "8px", padding: "3px 6px", borderRadius: "6px" }}>Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );

  const currentFeed = activeTab==="Music" ? musicPosts : posts;

  return (
    <div style={{ background: "#000", width: "100%", minHeight: "100vh", color: "white", fontFamily: "system-ui", overflow: "hidden" }}>
      <style>{`html,body{margin:0 !important;padding:0 !important;background:#000 !important;width:100% !important;overflow:hidden !important;} *{box-sizing:border-box;} ::-webkit-scrollbar{display:none;} .feed{scroll-snap-type:y mandatory; overflow-y:scroll; height:100vh; width:100%;}`}</style>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={shareAppLink} style={{ width: "32px", height: "32px", background: "white", borderRadius: "50%", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" }}>KB</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={()=>setShowUsers(true)} style={{ background: "#222", color: "white", border: "1px solid #333", padding: "6px 10px", borderRadius: "20px", fontSize: "11px" }}>👥 {users.length} Joined</button>
          <button onClick={shareAppLink} style={{ background: "#1d9bf0", color: "white", border: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" }}>Share</button>
          <div onClick={()=>setShowNotif(!showNotif)} style={{ position: "relative", width: "32px", height: "32px", background: "#1c1c1c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>🔔{notifications.length>0 && <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "red", width: "10px", height: "10px", borderRadius: "50%" }}></span>}</div>
          <div onClick={()=>{ if(currentUser){ setViewUser(currentUser); setView("profile"); } else setAuthMode('login'); }} style={{ width: "32px", height: "32px", borderRadius: "50%", background: currentUser?.pic ? `url(${currentUser.pic})` : "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", backgroundSize: "cover", border: currentUser?.blueTick ? "2px solid #1d9bf0" : "none" }}>{currentUser ? currentUser.name[0] : "U"}</div>
        </div>
      </div>

      {/* TABS - MUSIC IS SPECIAL */}
      <div style={{ position: "fixed", top: "48px", left: 0, right: 0, zIndex: 29, display: "flex", gap: "6px", padding: "0 12px", overflowX: "auto" }}>
        {["For You", "Music", "Following", "Live"].map(tab => (
          <div key={tab} onClick={()=>setActiveTab(tab)} style={{ background: activeTab===tab ? (tab==="Music" ? "#ff2d55" : "white") : "rgba(255,255,255,0.15)", color: activeTab===tab ? (tab==="Music" ? "white" : "black") : "white", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: activeTab===tab ? "700" : "400", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "4px" }}>{tab==="Music" ? "🎵 " : ""}{tab} {tab==="Music" ? `(${musicPosts.length})` : ""} {tab==="Music" && isOwner ? "🔒" : ""}</div>
        ))}
      </div>

      {/* USERS JOINED DIRECTORY */}
      {showUsers && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#000", padding: "60px 12px 80px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>👥 Everyone Who Joined - {users.length} Users</h3>
            <button onClick={()=>setShowUsers(false)} style={{ background: "#222", color: "white", border: "1px solid #333", padding: "6px 12px", borderRadius: "10px" }}>Close</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {users.map(u=> {
              const userVideos = [...posts.filter(p=>p.authorId===u.id), ...musicPosts.filter(p=>p.authorId===u.id)];
              return (
                <div key={u.id} style={{ background: "#121212", borderRadius: "12px", padding: "12px", border: "1px solid #222" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div onClick={()=>{ setViewUser(u); setShowUsers(false); setView("profile"); }} style={{ width: "48px", height: "48px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: u.blueTick ? "2px solid #1d9bf0" : "1px solid #333", cursor: "pointer" }}>{u.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>{u.name} {u.blueTick && <span style={{ background: "#1d9bf0", width: "12px", height: "12px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "7px" }}>✓</span>} {isKatongole(u.name) && <span style={{ background: "#ff2d55", padding: "1px 5px", borderRadius: "6px", fontSize: "8px" }}>FOUNDER</span>}</div>
                      <div style={{ fontSize: "10px", color: "#888" }}>{u.email || u.phone} • Joined</div>
                      <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{userVideos.length} videos • {userVideos.reduce((a,b)=>a+(b.views||0),0)} total views • {userVideos.reduce((a,b)=>a+(b.likes||0),0)} likes</div>
                    </div>
                    <button onClick={()=>{ setViewUser(u); setShowUsers(false); setView("profile"); }} style={{ background: "white", color: "black", border: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" }}>View Videos</button>
                  </div>
                  {/* Show their videos */}
                  {userVideos.length>0 && (
                    <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginTop: "10px", paddingBottom: "4px" }}>
                      {userVideos.slice(0,10).map(v=>(
                        <div key={v.id} style={{ minWidth: "80px", width: "80px", aspectRatio: "9/16", background: "#1a1a1a", borderRadius: "8px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                          {v.videoUrl ? <video src={v.videoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>{v.title?.slice(0,20)}</div>}
                          <div style={{ position: "absolute", bottom: "2px", left: "2px", fontSize: "7px", background: "rgba(0,0,0,0.7)", padding: "1px 3px", borderRadius: "4px" }}>👁️{v.views||0}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showNotif && (
        <div style={{ position: "fixed", top: "50px", right: "10px", zIndex: 40, background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "12px", width: "280px", maxHeight: "350px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><b style={{ fontSize: "13px" }}>Notifications</b><span onClick={()=>setShowNotif(false)} style={{ fontSize: "12px", color: "#888" }}>Close</span></div>
          {notifications.map(n=><div key={n.id} style={{ background: "#1a1a1a", padding: "8px", borderRadius: "8px", marginBottom: "6px", fontSize: "12px" }}>{n.text}</div>)}
        </div>
      )}

      {authMode && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
          <div style={{ background: "#121212", padding: "16px", borderRadius: "16px", border: "1px solid #222", width: "100%", maxWidth: "360px" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>{authMode==='login'?'Login':'Sign Up'}</h3>
            {!showForgot ? (
              <>
                {authMode==='signup' && <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="Full Names" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />}
                <input value={formEmail} onChange={e=>setFormEmail(e.target.value)} placeholder="Gmail" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
                <input value={formPhone} onChange={e=>setFormPhone(e.target.value)} placeholder="Phone +256..." style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
                <input value={formPass} onChange={e=>setFormPass(e.target.value)} type="password" placeholder="Password" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "10px" }} />
                <button onClick={authMode==='login'?handleLogin:handleSignup} style={{ width: "100%", background: "#fff", color: "#000", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>{authMode==='login'?'Login':'Sign Up'}</button>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "11px", color: "#888" }}>
                  <span onClick={()=>setAuthMode(authMode==='login'?'signup':'login')} style={{ color: "#1d9bf0" }}>{authMode==='login'?'No account? Sign Up':'Have account? Login'}</span>
                  <span onClick={()=>setShowForgot(true)} style={{ color: "#ff6a00" }}>Forgot?</span>
                  <span onClick={()=>setAuthMode(null)}>Close</span>
                </div>
              </>
            ) : (
              <>
                <input value={formEmail} onChange={e=>setFormEmail(e.target.value)} placeholder="Your Gmail" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
                <input value={formPhone} onChange={e=>setFormPhone(e.target.value)} placeholder="Or Phone" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
                <button onClick={handleForgot} style={{ width: "100%", background: "#ff6a00", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>Get New Password</button>
                <div style={{ marginTop: "8px", fontSize: "11px", color: "#888", textAlign: "center" }} onClick={()=>setShowForgot(false)}>Back</div>
              </>
            )}
          </div>
        </div>
      )}

      {showUpload && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "#121212", padding: "16px", borderRadius: "14px", border: "1px solid #222", width: "100%", maxWidth: "340px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>{uploadType==="music" ? "🎵 Upload Song - Only Katongole Rashid" : "Upload Video"}</h3>
            {uploadType==="music" && !isOwner && <div style={{ background: "#ff2d5522", border: "1px solid #ff2d55", padding: "8px", borderRadius: "8px", fontSize: "11px", color: "#ff8da1", marginBottom: "8px" }}>Only Katongole Rashid can add songs to Music folder. Others can only watch!</div>}
            <textarea value={title} onChange={e=>setTitle(e.target.value)} placeholder={uploadType==="music" ? "Song name - Artist" : "Caption"} style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", minHeight: "60px", marginBottom: "8px" }} />
            <input type="file" accept={uploadType==="music" ? "audio/*,video/*" : "video/*"} onChange={e=>setVideoFile(e.target.files[0])} style={{ width: "100%", marginBottom: "10px", color: "white" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={()=>setShowUpload(false)} style={{ flex: 1, background: "#222", color: "white", border: "1px solid #333", padding: "10px", borderRadius: "8px" }}>Cancel</button>
              <button onClick={handlePost} disabled={uploadType==="music" && !isOwner} style={{ flex: 1, background: uploadType==="music" && !isOwner ? "#333" : "#ff2d55", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold" }}>Post {uploadType==="music" ? "Song" : "Video"}</button>
            </div>
          </div>
        </div>
      )}

      {view==="profile" && viewUser && <ProfileView user={viewUser} />}

      {view==="feed" && (
        <div className="feed" onScroll={onScroll} style={{ height: "100vh", overflowY: "scroll" }}>
          {currentFeed.length===0 && <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
            <div style={{ color: "#666", fontSize: "14px" }}>{activeTab==="Music" ? "🎵 No songs yet - Only Katongole Rashid can add songs" : "No videos yet"}</div>
            {activeTab==="Music" ? isOwner ? <button onClick={()=>{ setUploadType("music"); setShowUpload(true); }} style={{ background: "#ff2d55", color: "white", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold" }}>Add First Song</button> : <div style={{ fontSize: "11px", color: "#888" }}>Wait for Katongole Rashid to upload songs - You can watch here</div> : <button onClick={()=>{ setUploadType("video"); setShowUpload(true); }} style={{ background: "white", color: "black", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold" }}>Upload Video</button>}
          </div>}
          {currentFeed.map((p) => (
            <div key={p.id} style={{ scrollSnapAlign: "start", height: "100vh", width: "100%", position: "relative", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={()=>handleVideoTap(p.id, activeTab==="Music")}>
              {p.videoUrl ? <video ref={el=>{ if(el) videoRefs.current[p.id]=el; }} src={p.videoUrl} loop muted={muted} playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} onLoadedMetadata={()=>handleView(p.id, activeTab==="Music")} /> : <div style={{ width: "100%", height: "100%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", padding: "40px", textAlign: "center" }}>{p.title}</div>}
              {paused[p.id] && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>▶️</div>}
              <div style={{ position: "absolute", bottom: "80px", left: "12px", right: "80px", zIndex: 10 }}>
                <div onClick={(e)=>{ e.stopPropagation(); const u = users.find(u=>u.id===p.authorId) || {id:p.authorId, name:p.author, bio:"Creator", blueTick:p.blueTick}; setViewUser(u); setView("profile"); }} style={{ fontWeight: "800", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>{p.author} {p.blueTick && <span style={{ background: "#1d9bf0", width: "14px", height: "14px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>✓</span>} {activeTab==="Music" && <span style={{ background: "#ff2d55", padding: "2px 6px", borderRadius: "6px", fontSize: "9px" }}>🎵 MUSIC</span>}</div>
                <div style={{ fontSize: "13px", marginTop: "4px", color: "#eee" }}>{p.title}</div>
                <div style={{ fontSize: "11px", color: "#aaa", marginTop: "6px" }}>👁️{p.views||0} views • ❤️{p.likes||0} • 🔥{p.fire||0} {activeTab==="Music" ? "• Only KR uploads" : ""}</div>
              </div>
              <div style={{ position: "absolute", right: "8px", bottom: "80px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", zIndex: 10 }}>
                <div style={{ position: "relative" }}>
                  <div onClick={(e)=>{ e.stopPropagation(); const u = users.find(u=>u.id===p.authorId) || {id:p.authorId, name:p.author, blueTick:p.blueTick}; setViewUser(u); setView("profile"); }} style={{ width: "48px", height: "48px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: p.blueTick ? "2px solid #1d9bf0" : "2px solid white" }}>{p.author?.[0]||"K"}</div>
                  <div onClick={(e)=>{ e.stopPropagation(); toggleFollow(p.authorId, p.author); }} style={{ position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)", background: following[p.authorId] ? "#888" : "#ff2d55", color: "white", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", border: "2px solid black" }}>{following[p.authorId] ? "✓" : "+"}</div>
                </div>
                <div onClick={(e)=>{ e.stopPropagation(); handleLike(p.id, activeTab==="Music"); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "28px" }}>❤️</div><div style={{ fontSize: "12px", fontWeight: "600" }}>{p.likes||0}</div></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "26px" }}>💬</div><div style={{ fontSize: "12px" }}>{p.comments||0}</div></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "26px" }}>↗️</div><div style={{ fontSize: "11px" }}>Share</div></div>
                <div onClick={(e)=>{ e.stopPropagation(); handleFire(p.id, activeTab==="Music"); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "28px" }}>🔥</div><div style={{ fontSize: "11px" }}>{p.fire||0}</div></div>
                <div onClick={(e)=>{ e.stopPropagation(); const a=document.createElement("a"); a.href=p.videoUrl||""; if(a.href){ a.download=`${p.title}.mp4`; a.click(); } }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "rgba(255,255,255,0.15)", padding: "6px", borderRadius: "10px" }}><div style={{ fontSize: "20px" }}>⬇️</div><div style={{ fontSize: "9px" }}>Download</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#000", borderTop: "1px solid #111", display: "flex", justifyContent: "space-between", padding: "6px 12px", zIndex: 30, alignItems: "center", width: "100%" }}>
        <div onClick={()=>{ setView("feed"); setViewUser(null); }} style={{ textAlign: "center", color: "white" }}><div style={{ fontSize: "20px" }}>🏠</div><div style={{ fontSize: "9px", fontWeight: "bold" }}>Home</div></div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <div onClick={()=>setActiveTab("Live")} style={{ textAlign: "center", color: "#ff2d55" }}><div style={{ fontSize: "18px" }}>🔴</div><div style={{ fontSize: "9px", color: "white" }}>Live</div></div>
          <div onClick={()=>{ if(activeTab==="Music" && !isOwner){ alert("Only Katongole Rashid can upload Music!"); return; } setUploadType(activeTab==="Music" ? "music" : "video"); setShowUpload(true); }} style={{ textAlign: "center" }}>
            <div style={{ background: activeTab==="Music" ? "#ff2d55" : "white", color: activeTab==="Music" ? "white" : "black", width: "44px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>{activeTab==="Music" ? "🎵+" : "+"}</div>
            <div style={{ fontSize: "8px", color: "white", marginTop: "2px" }}>{activeTab==="Music" ? (isOwner ? "Add Song" : "Music") : "Post"}</div>
          </div>
          <div onClick={()=>setMuted(!muted)} style={{ textAlign: "center", color: "#777" }}><div style={{ fontSize: "18px" }}>{muted ? "🔇" : "🔊"}</div><div style={{ fontSize: "9px" }}>Sound</div></div>
        </div>
        <div onClick={()=>currentUser ? (setViewUser(currentUser), setView("profile")) : setAuthMode('login')} style={{ background: currentUser ? "white" : "#1c1c1c", color: currentUser ? "black" : "white", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", border: currentUser?.blueTick ? "2px solid #1d9bf0" : "1px solid #333" }}>{currentUser ? currentUser.name.split(" ")[0] + (currentUser.blueTick ? " ✓" : "") : "User"}</div>
      </div>
    </div>
  );
}
