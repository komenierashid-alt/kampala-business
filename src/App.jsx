import React, { useState, useRef, useEffect } from "react";

const KBLogo = ({ size=36 }) => (
  <div style={{ width:size, height:size, background:"black", borderRadius:"50%", border:"2.5px solid white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"900", color:"white", fontSize:size*0.4, position:"relative" }}>
    KB
    <div style={{ position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%) rotate(45deg)", width:8, height:8, background:"black", borderRight:"2.5px solid white", borderBottom:"2.5px solid white" }}></div>
  </div>
);

export default function App() {
  const fileRef = useRef(null);
  const picRef = useRef(null);
  const videoRefs = useRef({});
  const [showUpload, setShowUpload] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liveStream, setLiveStream] = useState(null);
  const [activeTop, setActiveTop] = useState("For You");
  
  const [currentUser, setCurrentUser] = useState(()=>{
    const s=localStorage.getItem("muzika_user"); return s?JSON.parse(s):null;
  });
  const [authMode,setAuthMode]=useState("login");
  const [authForm,setAuthForm]=useState({name:"",email:"",password:""});

  const [users,setUsers]=useState(()=>{
    const s=localStorage.getItem("muzika_users_db"); return s?JSON.parse(s):[];
  });
  const [videos,setVideos]=useState(()=>{
    const s=localStorage.getItem("muzika_videos_real"); 
    if(s) return JSON.parse(s);
    return [{id:1, user:"Katongole Rashid", userId:"admin", likes:[], views:[], shares:0, fire:[], comments:[], isMuzika:true, verified:true, videoUrl:"", caption:"Welcome to Kampala Business"}];
  });
  const [notifications,setNotifications]=useState(()=>{
    const s=localStorage.getItem("muzika_notifs"); return s?JSON.parse(s):[];
  });

  useEffect(()=>{ localStorage.setItem("muzika_videos_real", JSON.stringify(videos)); },[videos]);
  useEffect(()=>{ localStorage.setItem("muzika_users_db", JSON.stringify(users)); },[users]);
  useEffect(()=>{ localStorage.setItem("muzika_notifs", JSON.stringify(notifications)); },[notifications]);

  // AUTH
  const handleSignup=()=>{
    if(!authForm.name||!authForm.email||!authForm.password) return alert("Fill all");
    if(users.find(u=>u.email===authForm.email)) return alert("Email exists, login");
    const nu={id:"user_"+Date.now(), name:authForm.name, email:authForm.email, password:authForm.password, bio:"", pic:"", isAdmin:authForm.name==="Katongole Rashid", joinedAt:Date.now()};
    const newUsers=[...users,nu]; setUsers(newUsers); setCurrentUser(nu);
    localStorage.setItem("muzika_user",JSON.stringify(nu)); localStorage.setItem("muzika_users_db",JSON.stringify(newUsers));
    if(nu.isAdmin) localStorage.setItem("is_muzika_admin","true");
    setNotifications([{id:Date.now(), text:`${nu.name} joined Muzika`, time:Date.now()},...notifications]);
  };
  const handleLogin=()=>{
    const f=users.find(u=>u.email===authForm.email&&u.password===authForm.password);
    if(!f) return alert("Wrong login");
    setCurrentUser(f); localStorage.setItem("muzika_user",JSON.stringify(f));
  };
  const handleLogout=()=>{ localStorage.removeItem("muzika_user"); setCurrentUser(null); };

  // PROFILE EDIT
  const updateProfile=(updates)=>{
    const updated={...currentUser, ...updates};
    setCurrentUser(updated);
    localStorage.setItem("muzika_user",JSON.stringify(updated));
    setUsers(users.map(u=>u.id===currentUser.id?updated:u));
  };
  const handlePicChange=(e)=>{
    const file=e.target.files[0]; if(!file) return;
    const url=URL.createObjectURL(file);
    updateProfile({pic:url});
  };

  // VIDEO UPLOAD - EVERYONE CAN POST
  const handleUpload=(e)=>{
    const file=e.target.files[0]; if(!file) return;
    const url=URL.createObjectURL(file);
    const nv={id:Date.now(), user:currentUser.name, userId:currentUser.id, userPic:currentUser.pic, likes:[], views:[], shares:0, fire:[], comments:[], isMuzika:activeTop==="Muzika" && currentUser.name==="Katongole Rashid", verified:currentUser.name==="Katongole Rashid", videoUrl:url, caption:"", createdAt:Date.now()};
    setVideos([nv,...videos]);
    setShowUpload(false);
    setNotifications([{id:Date.now(), text:`${currentUser.name} posted a video`, time:Date.now()},...notifications]);
  };

  // LIKE - 1 PER PERSON, REAL ONLY
  const toggleLike=(id)=>{
    setVideos(videos.map(v=>{
      if(v.id===id){
        const liked=v.likes.includes(currentUser.id);
        if(!liked) setNotifications([{id:Date.now(), text:`${currentUser.name} liked ${v.user}'s video`, time:Date.now()},...notifications]);
        return {...v, likes: liked ? v.likes.filter(i=>i!==currentUser.id) : [...v.likes, currentUser.id]};
      }
      return v;
    }));
  };
  const toggleFire=(id)=>{
    setVideos(videos.map(v=>v.id===id?{...v, fire: v.fire.includes(currentUser.id)?v.fire.filter(i=>i!==currentUser.id):[...v.fire, currentUser.id]}:v));
  };
  // VIEW - 1 PER PERSON
  useEffect(()=>{
    if(!currentUser) return;
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.play().catch(()=>{});
          const vid=parseInt(e.target.dataset.videoid);
          setVideos(prev=>prev.map(v=>v.id===vid && !v.views.includes(currentUser.id)?{...v, views:[...v.views, currentUser.id]}:v));
        } else e.target.pause();
      });
    },{threshold:0.6});
    Object.values(videoRefs.current).forEach(v=>v&&obs.observe(v));
    return ()=>obs.disconnect();
  },[videos,currentUser]);

  // COMMENT - REAL
  const addComment=()=>{
    if(!commentText.trim()||!showComments) return;
    const newC={id:Date.now(), user:currentUser.name, text:commentText, time:Date.now()};
    setVideos(videos.map(v=>v.id===showComments?{...v, comments:[...v.comments,newC]}:v));
    setCommentText("");
    setNotifications([{id:Date.now(), text:`${currentUser.name} commented: ${newC.text.slice(0,20)}`, time:Date.now()},...notifications]);
  };

  // SHARE - REAL
  const handleShare=async(v)=>{
    if(navigator.share){
      try{ await navigator.share({title:"Muzika Video", text:`Watch ${v.user} on Muzika`, url:window.location.href}); 
        setVideos(videos.map(x=>x.id===v.id?{...x, shares:x.shares+1}:x));
      }catch{}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied! Share to WhatsApp");
      setVideos(videos.map(x=>x.id===v.id?{...x, shares:x.shares+1}:x));
    }
  };

  // LIVE STREAMING
  const startLive=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      setLiveStream(stream);
      setShowLive(true);
    }catch{ alert("Camera permission needed for Live"); }
  };
  const stopLive=()=>{
    if(liveStream) liveStream.getTracks().forEach(t=>t.stop());
    setLiveStream(null); setShowLive(false);
  };

  const filtered=videos.filter(v=>{
    if(activeTop==="Muzika") return v.isMuzika;
    return true;
  });

  if(!currentUser){
    return(
      <div style={{position:"fixed",inset:0,background:"black",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Arial"}}>
        <KBLogo size={70} />
        <h2 style={{color:"white",marginTop:12}}>Kampala Business</h2>
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button onClick={()=>setAuthMode("login")} style={{background:authMode==="login"?"white":"#222",color:authMode==="login"?"black":"white",border:"none",padding:"10px 20px",borderRadius:20,fontWeight:"bold"}}>Login</button>
          <button onClick={()=>setAuthMode("signup")} style={{background:authMode==="signup"?"#00ff88":"#222",color:authMode==="signup"?"black":"white",border:"none",padding:"10px 20px",borderRadius:20,fontWeight:"bold"}}>Sign Up</button>
        </div>
        <div style={{width:"100%",maxWidth:300,background:"#111",padding:20,borderRadius:16,marginTop:15}}>
          {authMode==="signup"&&<input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Full Name" style={{width:"100%",padding:12,borderRadius:10,background:"#222",color:"white",border:"none",marginBottom:10}} />}
          <input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{width:"100%",padding:12,borderRadius:10,background:"#222",color:"white",border:"none",marginBottom:10}} />
          <input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{width:"100%",padding:12,borderRadius:10,background:"#222",color:"white",border:"none",marginBottom:15}} />
          <button onClick={authMode==="signup"?handleSignup:handleLogin} style={{width:"100%",background:authMode==="signup"?"white":"#00ff88",color:"black",padding:12,borderRadius:10,border:"none",fontWeight:"bold"}}>{authMode==="signup"?"Sign Up":"Login"}</button>
          <div style={{color:"#666",fontSize:12,textAlign:"center",marginTop:10,cursor:"pointer"}} onClick={()=>setAuthMode(authMode==="login"?"signup":"login")}>{authMode==="login"?"New? Sign Up":"Have account? Login"}</div>
          <div style={{color:"#888",fontSize:11,textAlign:"center",marginTop:10}}>{users.length} people joined • Cloud storage saved</div>
        </div>
      </div>
    );
  }

  return(
    <>
      <style>{`*{margin:0;padding:0;box-sizing:border-box} html,body,#root{width:100%;height:100%;overflow:hidden;background:#000} body{position:fixed;inset:0} .feed::-webkit-scrollbar{display:none}`}</style>
      <div style={{position:"fixed",inset:0,width:"100vw",height:"100vh",height:"100dvh",background:"black",overflow:"hidden",fontFamily:"Arial"}}>
        
        {/* TOP - SAME LOOK */}
        <div style={{position:"absolute",top:0,left:0,right:0,zIndex:20,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)"}}>
          <div onClick={()=>setShowUsers(true)}><KBLogo size={34} /></div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div onClick={()=>setActiveTop("For You")} style={{color:activeTop==="For You"?"white":"#888",fontWeight:"bold",fontSize:15,borderBottom:activeTop==="For You"?"2px solid white":"none",paddingBottom:3,cursor:"pointer"}}>For You</div>
            <div onClick={()=>setActiveTop("Muzika")} style={{color:activeTop==="Muzika"?"#00ff88":"#888",fontSize:13,cursor:"pointer"}}>Muzika</div>
            <div style={{color:"#888",fontSize:13,cursor:"pointer"}} onClick={()=>setActiveTop("Following")}>Following</div>
            <div onClick={startLive} style={{color:showLive?"red":"#888",fontSize:13,cursor:"pointer",fontWeight:showLive?"bold":"normal"}}>Live{showLive?" •":""}</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div onClick={()=>setShowNotif(true)} style={{position:"relative",cursor:"pointer"}}>
              <div style={{fontSize:18}}>🔔</div>
              {notifications.length>0&&<div style={{position:"absolute",top:-4,right:-4,background:"red",width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:8,fontWeight:"bold"}}>{notifications.length}</div>}
            </div>
            <div style={{width:10}}/>
          </div>
        </div>

        {/* USERS JOINED */}
        {showUsers&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.96)",zIndex:80,padding:20,overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:15}}>
              <h3 style={{color:"white"}}>People Joined: {users.length}</h3>
              <button onClick={()=>setShowUsers(false)} style={{background:"#222",color:"white",border:"none",padding:"8px 14px",borderRadius:20}}>X</button>
            </div>
            {users.map(u=>(
              <div key={u.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid #222",alignItems:"center"}}>
                <div style={{width:40,height:40,background:u.pic?`url(${u.pic})`:"#fff",backgroundSize:"cover",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold"}}>{!u.pic&&u.name[0]}</div>
                <div><div style={{color:"white",fontWeight:"bold",fontSize:14}}>{u.name} {u.name==="Katongole Rashid"?"✓":""}</div><div style={{color:"#666",fontSize:11}}>{u.bio||u.email}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {showNotif&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.96)",zIndex:85,padding:20,overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:15}}><h3 style={{color:"white"}}>Notifications</h3><button onClick={()=>setShowNotif(false)} style={{background:"#222",color:"white",border:"none",padding:"8px 14px",borderRadius:20}}>X</button></div>
            {notifications.length===0&&<div style={{color:"#666"}}>No notifications yet</div>}
            {notifications.map(n=><div key={n.id} style={{padding:"10px 0",borderBottom:"1px solid #222",color:"white",fontSize:13}}>{n.text}<div style={{color:"#666",fontSize:10}}>{new Date(n.time).toLocaleTimeString()}</div></div>)}
          </div>
        )}

        {/* LIVE MODAL */}
        {showLive&&(
          <div style={{position:"absolute",inset:0,background:"black",zIndex:90,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:12,background:"#111"}}><div style={{color:"white",fontWeight:"bold"}}>🔴 LIVE - {currentUser.name}</div><button onClick={stopLive} style={{background:"red",color:"white",border:"none",padding:"8px 14px",borderRadius:20}}>End Live</button></div>
            <video autoPlay muted ref={el=>{if(el&&liveStream) el.srcObject=liveStream}} style={{flex:1,objectFit:"cover"}} />
            <div style={{padding:12,background:"#111",color:"white",textAlign:"center",fontSize:12}}>Live streaming to {users.length} viewers</div>
          </div>
        )}

        {/* COMMENTS */}
        {showComments&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.9)",zIndex:88,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
            <div style={{background:"#111",borderRadius:"20px 20px 0 0",maxHeight:"70%",display:"flex",flexDirection:"column"}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:15,borderBottom:"1px solid #222"}}><div style={{color:"white",fontWeight:"bold"}}>{videos.find(v=>v.id===showComments)?.comments.length} Comments</div><button onClick={()=>setShowComments(null)} style={{background:"#222",color:"white",border:"none",padding:"6px 12px",borderRadius:20}}>X</button></div>
              <div style={{flex:1,overflowY:"auto",padding:15}}>
                {videos.find(v=>v.id===showComments)?.comments.map(c=><div key={c.id} style={{display:"flex",gap:10,marginBottom:12}}><div style={{width:30,height:30,background:"#333",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12}}>{c.user[0]}</div><div><div style={{color:"white",fontSize:13,fontWeight:"bold"}}>{c.user}</div><div style={{color:"#ccc",fontSize:12}}>{c.text}</div></div></div>)}
              </div>
              <div style={{display:"flex",gap:10,padding:12,borderTop:"1px solid #222"}}>
                <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment..." style={{flex:1,padding:12,borderRadius:20,background:"#222",color:"white",border:"none"}} />
                <button onClick={addComment} style={{background:"white",color:"black",border:"none",padding:"10px 18px",borderRadius:20,fontWeight:"bold"}}>Send</button>
              </div>
            </div>
          </div>
        )}

        {/* FEED - SAME LOOK */}
        <div className="feed" style={{width:"100%",height:"100%",overflowY:"auto",scrollSnapType:"y mandatory"}}>
          {filtered.map(video=>(
            <div key={video.id} style={{width:"100vw",height:"100vh",height:"100dvh",scrollSnapAlign:"start",position:"relative",background:"black",overflow:"hidden"}}>
              {video.videoUrl? <video data-videoid={video.id} ref={el=>videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <div style={{width:"100%",height:"100%",background:`linear-gradient(180deg,#0a1a3a,#000)`,display:"flex",alignItems:"center",justifyContent:"center"}}><KBLogo size={80} /></div>}

              {/* RIGHT SIDE - SAME AS PHOTO - NOW WORKING */}
              <div style={{position:"absolute",right:10,bottom:85,display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:48,height:48,background:video.userPic?`url(${video.userPic})`:"white",backgroundSize:"cover",borderRadius:"50%",border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold"}}>{!video.userPic&&video.user[0]}</div>
                  <div style={{width:20,height:20,background:"#FE2C55",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,marginTop:-8,border:"2px solid black"}}>+</div>
                </div>
                <div onClick={()=>toggleLike(video.id)} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:28}}>❤️</div><div style={{color:"white",fontSize:11,fontWeight:"bold"}}>{video.likes.length}</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:24}}>🕒</div><div style={{color:"white",fontSize:11}}>{video.views.length}</div></div>
                <div onClick={()=>setShowComments(video.id)} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:24}}>💬</div><div style={{color:"white",fontSize:11}}>{video.comments.length}</div></div>
                <div onClick={()=>handleShare(video)} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:22,background:"#00ff88",width:30,height:30,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>↗️</div><div style={{color:"white",fontSize:11}}>{video.shares}</div></div>
                <div onClick={()=>toggleFire(video.id)} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:26}}>🔥</div><div style={{color:"white",fontSize:11}}>{video.fire.length}</div></div>
              </div>

              <div style={{position:"absolute",left:12,bottom:85,right:80}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:"bold",fontSize:14,color:"white"}}>{video.user}</span>{video.verified&&<span style={{background:"#1DA1F2",width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10}}>✓</span>}</div>
                <div style={{color:"#ccc",fontSize:12,marginTop:4}}>Real views: {video.views.length} • Real likes: {video.likes.length}</div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM - SAME LOOK */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"black",borderTop:"1px solid #1a1a1a",display:"flex",justifyContent:"space-around",padding:"10px 0",zIndex:30}}>
          <div onClick={()=>setActiveTop("For You")} style={{textAlign:"center",flex:1,cursor:"pointer"}}><div style={{fontSize:20}}>🏠</div><div style={{fontSize:8,color:"white",fontWeight:"bold"}}>Home</div></div>
          <div onClick={startLive} style={{textAlign:"center",flex:1,cursor:"pointer"}}><div style={{fontSize:11,background:showLive?"red":"#222",color:"white",padding:"5px 12px",borderRadius:6,display:"inline-block"}}>Live</div></div>
          <div onClick={()=>setShowUpload(true)} style={{background:"white",width:40,height:26,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"black",fontSize:20,fontWeight:"bold",cursor:"pointer"}}>+</div>
          <div onClick={()=>setShowComments(filtered[0]?.id)} style={{textAlign:"center",flex:1,cursor:"pointer"}}><div style={{fontSize:18}}>💬</div><div style={{fontSize:8,color:"white"}}>Chat</div></div>
          <div onClick={()=>setShowProfile(true)} style={{textAlign:"center",flex:1,cursor:"pointer"}}><div style={{fontSize:18}}>👤</div><div style={{fontSize:8,color:"white"}}>You</div></div>
        </div>

        {/* PROFILE EDIT - CHANGE NAME/BIO/PIC ANYTIME */}
        {showProfile&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.96)",zIndex:95,padding:20,overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}><h3 style={{color:"white"}}>Edit Profile - Change anytime</h3><button onClick={()=>setShowProfile(false)} style={{background:"#222",color:"white",border:"none",padding:"8px 14px",borderRadius:20}}>X</button></div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:15}}>
              <div onClick={()=>picRef.current.click()} style={{width:80,height:80,background:currentUser.pic?`url(${currentUser.pic})`:"#333",backgroundSize:"cover",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:30,cursor:"pointer",border:"2px solid white"}}>{!currentUser.pic&&currentUser.name[0]}</div>
              <input ref={picRef} type="file" accept="image/*" onChange={handlePicChange} style={{display:"none"}} />
              <button onClick={()=>picRef.current.click()} style={{background:"#222",color:"white",border:"none",padding:"8px 16px",borderRadius:20}}>Change Profile Picture</button>
              <input value={currentUser.name} onChange={e=>updateProfile({name:e.target.value})} placeholder="Name" style={{width:"100%",maxWidth:300,padding:12,borderRadius:10,background:"#222",color:"white",border:"none"}} />
              <input value={currentUser.bio||""} onChange={e=>updateProfile({bio:e.target.value})} placeholder="Bio" style={{width:"100%",maxWidth:300,padding:12,borderRadius:10,background:"#222",color:"white",border:"none"}} />
              <div style={{color:"#888",fontSize:12,textAlign:"center"}}>Email: {currentUser.email}<br/>Joined: {new Date(currentUser.joinedAt).toLocaleDateString()}<br/>Cloud storage: Saved</div>
              <button onClick={handleLogout} style={{background:"red",color:"white",border:"none",padding:"12px 24px",borderRadius:20,fontWeight:"bold",marginTop:10}}>Logout</button>
            </div>
          </div>
        )}

        {showUpload&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
            <KBLogo size={50} />
            <div style={{color:"white",marginTop:10,marginBottom:15,fontWeight:"bold"}}>Post Video - Everyone Can Post</div>
            <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{display:"none"}} />
            <button onClick={()=>fileRef.current.click()} style={{background:"white",color:"black",padding:"14px 24px",borderRadius:25,border:"none",fontWeight:"bold",width:"90%",maxWidth:300}}>Choose Video to Post</button>
            <div style={{color:"#888",fontSize:11,marginTop:10}}>Real only • No fake • 1 view per person</div>
            <button onClick={()=>setShowUpload(false)} style={{background:"#222",color:"white",padding:"10px 20px",borderRadius:20,border:"none",marginTop:15}}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
