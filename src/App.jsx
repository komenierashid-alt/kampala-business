import { useState, useEffect, useRef } from "react";
import { db } from "./lib/firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment, deleteDoc, serverTimestamp, setDoc, getDocs, where } from "firebase/firestore";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(()=>{ const s=localStorage.getItem("kb_user_v2"); return s?JSON.parse(s):null });
  const [view, setView] = useState("feed");
  const [viewUser, setViewUser] = useState(null); // viewing other person's account
  const [activeTab, setActiveTab] = useState("For You");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPass, setFormPass] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [following, setFollowing] = useState(()=>{ const s=localStorage.getItem("kb_following"); return s?JSON.parse(s):{} });
  const [notifications, setNotifications] = useState(()=>{ const s=localStorage.getItem("kb_notif"); return s?JSON.parse(s):[] });
  const [showNotif, setShowNotif] = useState(false);
  const [fireActive, setFireActive] = useState({});
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState({});
  const videoRefs = useRef({});
  const tapCounts = useRef({});
  const tapTimers = useRef({});
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);

  // Load posts
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);
  // Load users directory
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  // Auto-play
  useEffect(() => {
    Object.values(videoRefs.current).forEach(v=>{ if(v) v.pause(); });
    const keys = Object.keys(videoRefs.current);
    const id = keys[currentVideoIdx];
    if(id && videoRefs.current[id] && !paused[id]) videoRefs.current[id].play().catch(()=>{});
  }, [currentVideoIdx, paused]);

  const saveUser = (u) => {
    setCurrentUser(u);
    localStorage.setItem("kb_user_v2", JSON.stringify(u));
  };

  const isKatongole = (name) => name?.toLowerCase().includes("katongole") && name?.toLowerCase().includes("rashid");
  
  const handleSignup = async () => {
    if(!formName || !formPass || (!formEmail && !formPhone)){ alert("Name + Email/Phone + Password required"); return; }
    const isKR = isKatongole(formName);
    const newUser = {
      name: formName,
      email: formEmail,
      phone: formPhone,
      password: formPass, // In production use Firebase Auth
      bio: isKR ? "Founder | Kampala Bornoz" : "New user",
      pic: "",
      blueTick: isKR, // Katongole Rashid gets blue tick auto
      followers: 0,
      following: 0,
      createdAt: serverTimestamp(),
      id: Date.now().toString()
    };
    // Save to users collection
    await setDoc(doc(db, "users", newUser.id), newUser);
    saveUser(newUser);
    setView("feed"); setAuthMode(null);
    setFormName(""); setFormEmail(""); setFormPhone(""); setFormPass("");
    addNotification("Welcome! Your login saved. If forgot password use Forgot button.");
  };

  const handleLogin = async () => {
    if(!formPass || (!formEmail && !formPhone)){ alert("Enter Email/Phone + Password"); return; }
    // Check local users
    const q = await getDocs(collection(db, "users"));
    const found = q.docs.map(d=>d.data()).find(u=> (u.email===formEmail || u.phone===formPhone) && u.password===formPass);
    if(found){ saveUser(found); setView("feed"); setAuthMode(null); }
    else { alert("User not found - Check password or Sign Up"); }
  };

  const handleForgot = async () => {
    if(!formEmail && !formPhone){ alert("Enter your Email or Phone"); return; }
    const q = await getDocs(collection(db, "users"));
    const found = q.docs.map(d=>d.data()).find(u=> u.email===formEmail || u.phone===formPhone);
    if(found){
      const newPass = Math.random().toString(36).slice(-6);
      await updateDoc(doc(db, "users", found.id), { password: newPass });
      alert(`New Password for ${found.name}: ${newPass} - Use to login now!`);
      saveUser({...found, password:newPass});
      setShowForgot(false); setAuthMode(null); setView("feed");
    } else { alert("No account with that Email/Phone"); }
  };

  const handlePost = async () => {
    if(!currentUser){ alert("Login first"); setAuthMode('login'); return; }
    if(!title.trim() && !videoFile){ alert("Add video or text"); return; }
    let videoUrl = "";
    if(videoFile) videoUrl = URL.createObjectURL(videoFile);
    await addDoc(collection(db, "posts"), {
      title: title || "My video",
      videoUrl,
      createdAt: serverTimestamp(),
      author: currentUser.name,
      authorId: currentUser.id,
      authorPic: currentUser.pic || "",
      blueTick: currentUser.blueTick || false,
      likes: 0, fire: 0, views: 0, comments: 0, shares: 0
    });
    setTitle(""); setVideoFile(null); setShowUpload(false);
  };

  const handleLike = async (id) => { await updateDoc(doc(db, "posts", id), { likes: increment(1) }); };
  const handleFire = async (id) => { setFireActive(p=>({...p, [id]: !p[id]})); await updateDoc(doc(db, "posts", id), { fire: increment(fireActive[id]?-1:1) }); };
  const handleView = async (id) => { await updateDoc(doc(db, "posts", id), { views: increment(1) }); };
  const handleDelete = async (id) => { if(confirm("Delete your video?")) await deleteDoc(doc(db, "posts", id)); };
  const toggleFollow = (authorId, authorName) => {
    const isFollowing = following[authorId];
    const newFollowing = {...following, [authorId]: !isFollowing};
    setFollowing(newFollowing);
    localStorage.setItem("kb_following", JSON.stringify(newFollowing));
    const notif = {id:Date.now(), text: isFollowing ? `Unfollowed ${authorName}` : `Followed ${authorName} - He gets notification`, time:"now"};
    const newNotifs = [notif, ...notifications].slice(0,30);
    setNotifications(newNotifs); localStorage.setItem("kb_notif", JSON.stringify(newNotifs));
    // Add notification to target user (simulate)
    addNotification(`${currentUser?.name} ${isFollowing ? "unfollowed" : "followed"} you`);
  };
  const addNotification = (text) => {
    const n = {id:Date.now(), text, time:"now"};
    const newNotifs = [n, ...notifications].slice(0,30);
    setNotifications(newNotifs); localStorage.setItem("kb_notif", JSON.stringify(newNotifs));
  };
  const giveBlueTick = async (userId) => {
    if(!currentUser?.blueTick && !isKatongole(currentUser?.name)){ alert("Only blue tick verified can give ticks - Talk to Katongole Rashid"); return; }
    await updateDoc(doc(db, "users", userId), { blueTick: true });
    addNotification(`You gave blue tick to user`);
  };
  const shareAppLink = () => {
    const link = window.location.href;
    if(navigator.share) navigator.share({title:"Join Kampala Bornoz App", url:link});
    else { navigator.clipboard.writeText(link); alert(`Link copied! Share to join: ${link}`); }
  };

  // Tap handling
  const handleVideoTap = (id) => {
    const now = Date.now();
    if(!tapCounts.current[id]) tapCounts.current[id] = {count:0, lastTime:0};
    const tap = tapCounts.current[id];
    if(now - tap.lastTime > 400) tap.count = 1; else tap.count += 1;
    tap.lastTime = now;
    clearTimeout(tapTimers.current[id]);
    tapTimers.current[id] = setTimeout(()=>{
      if(tap.count===2){ handleLike(id); }
      if(tap.count===3){ handleFire(id); }
      if(tap.count===1){ setPaused(prev=>({...prev, [id]: !prev[id]})); }
      tap.count = 0;
    }, 350);
  };

  const onScroll = (e) => {
    const idx = Math.round(e.target.scrollTop / e.target.clientHeight);
    if(idx!==currentVideoIdx){ setCurrentVideoIdx(idx); const p = posts[idx]; if(p) handleView(p.id); }
  };

  const ProfileView = ({ user }) => (
    <div style={{ padding: "70px 12px 80px", background: "#000", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "90px", height: "90px", background: user.pic ? `url(${user.pic})` : "white", borderRadius: "50%", margin: "10px auto", backgroundSize: "cover", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontSize: "30px", fontWeight: "bold", border: user.blueTick ? "3px solid #1d9bf0" : "2px solid #333" }}>{!user.pic && user.name[0]}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: "800", fontSize: "18px" }}>{user.name} {user.blueTick && <span style={{ background: "#1d9bf0", width: "16px", height: "16px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</span>}</div>
        <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>{user.bio}</div>
        <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>{user.email} {user.phone}</div>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "12px", fontSize: "12px" }}>
          <div><b>{posts.filter(p=>p.authorId===user.id).length}</b><br/>Videos</div>
          <div><b>{posts.filter(p=>p.authorId===user.id).reduce((a,b)=>a+(b.views||0),0)}</b><br/>Total Views</div>
          <div><b>{posts.filter(p=>p.authorId===user.id).reduce((a,b)=>a+(b.likes||0),0)}</b><br/>Likes</div>
        </div>
        {currentUser?.id !== user.id && (
          <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
            <button onClick={()=>toggleFollow(user.id, user.name)} style={{ flex: 1, background: following[user.id] ? "#222" : "#ff2d55", color: "white", border: "none", padding: "10px", borderRadius: "10px", fontWeight: "bold" }}>{following[user.id] ? "Following ✓" : "Follow - He gets notification"}</button>
            {currentUser?.blueTick && !user.blueTick && <button onClick={()=>giveBlueTick(user.id)} style={{ background: "#1d9bf0", color: "white", border: "none", padding: "10px 14px", borderRadius: "10px", fontWeight: "bold" }}>Give Blue Tick ✓</button>}
          </div>
        )}
        <button onClick={()=>{ setViewUser(null); setView("feed"); }} style={{ marginTop: "10px", background: "#111", color: "white", border: "1px solid #222", width: "100%", padding: "10px", borderRadius: "10px" }}>Back to For You</button>
      </div>
      <h4 style={{ marginTop: "18px", fontSize: "13px" }}>Videos - Check views for every video</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px" }}>
        {posts.filter(p=>p.authorId===user.id).map(p=>(
          <div key={p.id} style={{ background: "#111", aspectRatio: "9/16", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
            {p.videoUrl ? <video src={p.videoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", padding: "4px" }}>{p.title}</div>}
            <div style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "8px", background: "rgba(0,0,0,0.7)", padding: "2px 4px", borderRadius: "4px" }}>👁️{p.views||0} ❤️{p.likes||0} 🔥{p.fire||0}</div>
            {currentUser?.id===p.authorId && <button onClick={()=>handleDelete(p.id)} style={{ position: "absolute", top: "4px", right: "4px", background: "red", color: "white", border: "none", fontSize: "8px", padding: "3px 6px", borderRadius: "6px" }}>Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: "#000", width: "100%", minHeight: "100vh", color: "white", fontFamily: "system-ui", overflow: "hidden" }}>
      <style>{`html,body{margin:0 !important;padding:0 !important;background:#000 !important;width:100% !important;overflow:hidden !important;} *{box-sizing:border-box;} ::-webkit-scrollbar{display:none;} .feed{scroll-snap-type:y mandatory; overflow-y:scroll; height:100vh; width:100%;}`}</style>

      {/* TOP */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={shareAppLink} style={{ width: "32px", height: "32px", background: "white", borderRadius: "50%", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px", cursor: "pointer" }}>KB</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={shareAppLink} style={{ background: "#1d9bf0", color: "white", border: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" }}>Share Link</button>
          <div onClick={()=>setShowNotif(!showNotif)} style={{ position: "relative", width: "32px", height: "32px", background: "#1c1c1c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>🔔{notifications.length>0 && <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "red", width: "10px", height: "10px", borderRadius: "50%" }}></span>}</div>
          <div onClick={()=>{ if(currentUser){ setViewUser(currentUser); setView("profile"); } else setAuthMode('login'); }} style={{ width: "32px", height: "32px", borderRadius: "50%", background: currentUser?.pic ? `url(${currentUser.pic})` : "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", backgroundSize: "cover", border: currentUser?.blueTick ? "2px solid #1d9bf0" : "none" }}>{currentUser ? currentUser.name[0] : "U"}</div>
        </div>
      </div>

      {showNotif && (
        <div style={{ position: "fixed", top: "50px", right: "10px", zIndex: 40, background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "12px", width: "280px", maxHeight: "350px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><b style={{ fontSize: "13px" }}>Notifications - Your Account</b><span onClick={()=>setShowNotif(false)} style={{ fontSize: "12px", color: "#888" }}>Close</span></div>
          {notifications.length===0 ? <div style={{ fontSize: "12px", color: "#666" }}>No notifications - When you follow someone he gets notification, if he follows you you get it here</div> : notifications.map(n=><div key={n.id} style={{ background: "#1a1a1a", padding: "8px", borderRadius: "8px", marginBottom: "6px", fontSize: "12px" }}>{n.text}</div>)}
        </div>
      )}

      {/* USERS DIRECTORY - When you sign up you see every person */}
      {authMode && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", overflowY: "auto" }}>
          <div style={{ background: "#121212", padding: "16px", borderRadius: "16px", border: "1px solid #222", width: "100%", maxWidth: "360px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>{authMode==='login'?'Login - Forgot Password Available':'Sign Up - Gmail/Phone + Names'}</h3>
            {!showForgot ? (
              <>
                {authMode==='signup' && <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="Full Names - Katongole Rashid gets blue tick auto" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />}
                <input value={formEmail} onChange={e=>setFormEmail(e.target.value)} placeholder="Gmail - e.g. yourname@gmail.com" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
                <input value={formPhone} onChange={e=>setFormPhone(e.target.value)} placeholder="Phone number - +256..." style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
                <input value={formPass} onChange={e=>setFormPass(e.target.value)} type="password" placeholder="Password - Keep personal login" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "10px" }} />
                <button onClick={authMode==='login'?handleLogin:handleSignup} style={{ width: "100%", background: "#fff", color: "#000", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>{authMode==='login'?'Login - See all users after':'Sign Up - Blue tick if Katongole Rashid, else normal'}</button>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "11px", color: "#888" }}>
                  <span onClick={()=>setAuthMode(authMode==='login'?'signup':'login')} style={{ color: "#1d9bf0" }}>{authMode==='login'?'No account? Sign Up':'Have account? Login'}</span>
                  <span onClick={()=>setShowForgot(true)} style={{ color: "#ff6a00" }}>Forgot Password?</span>
                  <span onClick={()=>setAuthMode(null)}>Close</span>
                </div>
              </>
            ) : (
              <>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>Forgot Password - Get new password</h4>
                <input value={formEmail} onChange={e=>setFormEmail(e.target.value)} placeholder="Your Gmail" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
                <input value={formPhone} onChange={e=>setFormPhone(e.target.value)} placeholder="Or Phone" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", marginBottom: "8px" }} />
                <button onClick={handleForgot} style={{ width: "100%", background: "#ff6a00", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>Get New Password</button>
                <div style={{ marginTop: "8px", fontSize: "11px", color: "#888", textAlign: "center" }} onClick={()=>setShowForgot(false)}>Back to Login</div>
              </>
            )}

            {/* SEE EVERY PERSON ON APP */}
            <div style={{ marginTop: "16px", borderTop: "1px solid #222", paddingTop: "12px" }}>
              <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "8px" }}>👥 People Already On App - {users.length} users</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto" }}>
                {users.map(u=>(
                  <div key={u.id} onClick={()=>{ setViewUser(u); setAuthMode(null); setView("profile"); }} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1a1a1a", padding: "6px 8px", borderRadius: "8px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold" }}>{u.name[0]}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>{u.name} {u.blueTick && <span style={{ background: "#1d9bf0", width: "10px", height: "10px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "6px" }}>✓</span>}</div><div style={{ fontSize: "9px", color: "#666" }}>{posts.filter(p=>p.authorId===u.id).length} videos • {posts.filter(p=>p.authorId===u.id).reduce((a,b)=>a+(b.views||0),0)} views</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpload && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "#121212", padding: "16px", borderRadius: "14px", border: "1px solid #222", width: "100%", maxWidth: "340px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Upload - Video goes to your account + For You to everyone</h3>
            <textarea value={title} onChange={e=>setTitle(e.target.value)} placeholder="Caption" style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", minHeight: "60px", marginBottom: "8px" }} />
            <input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files[0])} style={{ width: "100%", marginBottom: "10px", color: "white" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={()=>setShowUpload(false)} style={{ flex: 1, background: "#222", color: "white", border: "1px solid #333", padding: "10px", borderRadius: "8px" }}>Cancel</button>
              <button onClick={handlePost} style={{ flex: 1, background: "#ff2d55", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold" }}>Post</button>
            </div>
          </div>
        </div>
      )}

      {view==="profile" && viewUser && <ProfileView user={viewUser} />}

      {view==="feed" && (
        <div className="feed" onScroll={onScroll} style={{ height: "100vh", overflowY: "scroll" }}>
          {posts.length===0 && <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}><div style={{ color: "#666", fontSize: "14px" }}>No videos - Katongole Rashid posts like normal user</div><button onClick={()=>setShowUpload(true)} style={{ marginTop: "10px", background: "white", color: "black", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold" }}>Upload First Video</button></div>}
          {posts.map((p, idx) => (
            <div key={p.id} style={{ scrollSnapAlign: "start", height: "100vh", width: "100%", position: "relative", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={()=>handleVideoTap(p.id)}>
              {p.videoUrl ? <video ref={el=>{ if(el) videoRefs.current[p.id]=el; }} src={p.videoUrl} loop muted={muted} playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} onLoadedMetadata={()=>handleView(p.id)} /> : <div style={{ width: "100%", height: "100%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", padding: "40px", textAlign: "center" }}>{p.title}</div>}
              {paused[p.id] && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>▶️</div>}

              <div style={{ position: "absolute", bottom: "80px", left: "12px", right: "80px", zIndex: 10 }}>
                <div onClick={(e)=>{ e.stopPropagation(); const u = users.find(u=>u.id===p.authorId) || {id:p.authorId, name:p.author, bio:"Creator", blueTick:p.blueTick}; setViewUser(u); setView("profile"); }} style={{ fontWeight: "800", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>{p.author} {p.blueTick && <span style={{ background: "#1d9bf0", width: "14px", height: "14px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>✓</span>}</div>
                <div style={{ fontSize: "13px", marginTop: "4px", color: "#eee" }}>{p.title}</div>
                <div style={{ fontSize: "11px", color: "#aaa", marginTop: "6px" }}>👁️{p.views||0} views • ❤️{p.likes||0} likes • 🔥{p.fire||0} fire • Click name to see account with all video views</div>
              </div>

              <div style={{ position: "absolute", right: "8px", bottom: "80px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", zIndex: 10 }}>
                <div style={{ position: "relative" }}>
                  <div onClick={(e)=>{ e.stopPropagation(); const u = users.find(u=>u.id===p.authorId) || {id:p.authorId, name:p.author, blueTick:p.blueTick}; setViewUser(u); setView("profile"); }} style={{ width: "48px", height: "48px", borderRadius: "50%", background: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: p.blueTick ? "2px solid #1d9bf0" : "2px solid white", cursor: "pointer" }}>{p.author?.[0]||"K"}</div>
                  <div onClick={(e)=>{ e.stopPropagation(); toggleFollow(p.authorId, p.author); }} style={{ position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)", background: following[p.authorId] ? "#888" : "#ff2d55", color: "white", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", border: "2px solid black" }}>{following[p.authorId] ? "✓" : "+"}</div>
                </div>
                <div onClick={(e)=>{ e.stopPropagation(); handleLike(p.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "28px" }}>❤️</div><div style={{ fontSize: "12px", fontWeight: "600" }}>{p.likes||0}</div></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "26px" }}>💬</div><div style={{ fontSize: "12px" }}>{p.comments||0}</div></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "26px" }}>↗️</div><div style={{ fontSize: "11px" }}>Share</div></div>
                <div onClick={(e)=>{ e.stopPropagation(); handleFire(p.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "28px" }}>🔥</div><div style={{ fontSize: "11px" }}>{p.fire||0}</div></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ fontSize: "22px" }}>🕒</div><div style={{ fontSize: "9px" }}>History</div></div>
                <div onClick={(e)=>{ e.stopPropagation(); const a=document.createElement("a"); a.href=p.videoUrl||""; if(a.href){ a.download=`${p.title}.mp4`; a.click(); } else alert("No video file"); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "rgba(255,255,255,0.15)", padding: "6px", borderRadius: "10px" }}><div style={{ fontSize: "20px" }}>⬇️</div><div style={{ fontSize: "9px" }}>Download</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#000", borderTop: "1px solid #111", display: "flex", justifyContent: "space-between", padding: "6px 12px", zIndex: 30, alignItems: "center", width: "100%" }}>
        <div onClick={()=>{ setView("feed"); setViewUser(null); }} style={{ textAlign: "center", color: "white" }}><div style={{ fontSize: "20px" }}>🏠</div><div style={{ fontSize: "9px", fontWeight: "bold" }}>Home</div></div>
        <div style={{ display: "flex", gap: "28px", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <div style={{ textAlign: "center", color: "#ff2d55" }}><div style={{ fontSize: "18px" }}>🔴</div><div style={{ fontSize: "9px", color: "white" }}>Live</div></div>
          <div onClick={()=>setShowUpload(true)} style={{ textAlign: "center" }}><div style={{ background: "white", color: "black", width: "44px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold" }}>+</div></div>
          <div onClick={()=>setMuted(!muted)} style={{ textAlign: "center", color: "#777" }}><div style={{ fontSize: "18px" }}>{muted ? "🔇" : "🔊"}</div><div style={{ fontSize: "9px" }}>Chat</div></div>
        </div>
        <div onClick={()=>currentUser ? (setViewUser(currentUser), setView("profile")) : setAuthMode('login')} style={{ background: currentUser ? "white" : "#1c1c1c", color: currentUser ? "black" : "white", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", border: currentUser?.blueTick ? "2px solid #1d9bf0" : "1px solid #333" }}>{currentUser ? currentUser.name.split(" ")[0] + (currentUser.blueTick ? " ✓" : "") : "User"}</div>
      </div>
    </div>
  );
}
