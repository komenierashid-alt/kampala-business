import React, { useState, useRef, useEffect } from "react";
import { db } from "./lib/firebase.js";
import { collection, onSnapshot, query, doc, setDoc, deleteDoc } from "firebase/firestore";

const KBLogo = ({size=34}) => (
  <div style={{width:size,height:size,background:"black",borderRadius:"50%",border:"2.5px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"900",color:"white",fontSize:size*0.4,position:"relative"}}>KB<div style={{position:"absolute",bottom:-5,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:8,height:8,background:"black",borderRight:"2.5px solid white",borderBottom:"2.5px solid white"}}></div></div>
);

export default function App(){
  const fileRef=useRef(null); const videoRefs=useRef({}); const liveVideoRef=useRef(null);
  const [showUpload,setShowUpload]=useState(false); const [showComments,setShowComments]=useState(null); const [showUsers,setShowUsers]=useState(false);
  const [commentText,setCommentText]=useState(""); const [activeTop,setActiveTop]=useState("For You");
  const [followed,setFollowed]=useState(()=>JSON.parse(localStorage.getItem("muzika_followed")||"[]"));
  const [liveRooms,setLiveRooms]=useState([]); const [isHosting,setIsHosting]=useState(false); const [watchingLive,setWatchingLive]=useState(null); const [localStream,setLocalStream]=useState(null);

  const [currentUser,setCurrentUser]=useState(()=>{const s=localStorage.getItem("muzika_user"); return s?JSON.parse(s):null;});
  const [authMode,setAuthMode]=useState("login"); const [authForm,setAuthForm]=useState({name:"",email:"",password:""});
  const [users,setUsers]=useState(()=>{const s=localStorage.getItem("muzika_users_db"); return s?JSON.parse(s):[];});
  const [videos,setVideos]=useState(()=>{const s=localStorage.getItem("muzika_videos_real"); return s?JSON.parse(s):[{id:1,user:"Katongole Rashid",userId:"admin",likes:[],views:[],shares:0,fire:[],comments:[],verified:true,videoUrl:""}];});

  useEffect(()=>localStorage.setItem("muzika_videos_real",JSON.stringify(videos)),[videos]);
  useEffect(()=>localStorage.setItem("muzika_users_db",JSON.stringify(users)),[users]);
  useEffect(()=>localStorage.setItem("muzika_followed",JSON.stringify(followed)),[followed]);

  // FIREBASE LIVE - EVERYONE SEES WHO IS LIVE
  useEffect(()=>{
    const q=query(collection(db,"liveRooms"));
    const unsub=onSnapshot(q,(snap)=>{
      setLiveRooms(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
    return ()=>unsub();
  },[]);

  const handleSignup=()=>{
    if(!authForm.name||!authForm.email||!authForm.password) return alert("Fill all");
    if(users.find(u=>u.email===authForm.email)) return alert("Exists, login");
    const nu={id:"user_"+Date.now(),name:authForm.name,email:authForm.email,password:authForm.password,joinedAt:Date.now(),isAdmin:authForm.name==="Katongole Rashid"};
    const all=[...users,nu]; setUsers(all); setCurrentUser(nu); localStorage.setItem("muzika_user",JSON.stringify(nu)); localStorage.setItem("muzika_users_db",JSON.stringify(all));
  };
  const handleLogin=()=>{
    const f=users.find(u=>u.email===authForm.email&&u.password===authForm.password);
    if(!f) return alert("Wrong login");
    setCurrentUser(f); localStorage.setItem("muzika_user",JSON.stringify(f));
  };

  const handleUpload=(e)=>{
    const file=e.target.files[0]; if(!file) return;
    const url=URL.createObjectURL(file);
    setVideos([{id:Date.now(),user:currentUser.name,userId:currentUser.id,likes:[],views:[],shares:0,fire:[],comments:[],verified:currentUser.name==="Katongole Rashid",videoUrl:url},...videos]);
    setShowUpload(false);
  };

  const toggleFollow=(uid,name)=>{
    if(followed.includes(uid)) setFollowed(followed.filter(id=>id!==uid));
    else { setFollowed([...followed,uid]); alert(`Following ${name} ✓`); }
  };
  const toggleLike=(id)=>{setVideos(videos.map(v=>v.id===id?{...v,likes:v.likes.includes(currentUser.id)?v.likes.filter(i=>i!==currentUser.id):[...v.likes,currentUser.id]}:v));};
  const toggleFire=(id)=>{setVideos(videos.map(v=>v.id===id?{...v,fire:v.fire.includes(currentUser.id)?v.fire.filter(i=>i!==currentUser.id):[...v.fire,currentUser.id]}:v));};
  const addComment=()=>{
    if(!commentText.trim()||!showComments) return;
    const newC={id:Date.now(),user:currentUser.name,text:commentText};
    setVideos(videos.map(v=>v.id===showComments?{...v,comments:[...v.comments,newC]}:v)); setCommentText("");
  };

  const startLive=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      setLocalStream(stream); setIsHosting(true);
      setTimeout(()=>{ if(liveVideoRef.current) liveVideoRef.current.srcObject=stream; },100);
      await setDoc(doc(db,"liveRooms",currentUser.id),{hostId:currentUser.id,hostName:currentUser.name,isLive:true,startedAt:Date.now()});
      alert("🔴 LIVE - Everyone can see you now!");
    }catch{ alert("Allow camera"); }
  };
  const stopLive=async()=>{
    if(localStream) localStream.getTracks().forEach(t=>t.stop());
    setLocalStream(null); setIsHosting(false); setWatchingLive(null);
    try{ await deleteDoc(doc(db,"liveRooms",currentUser.id)); }catch{}
  };

  if(!currentUser){
    return(
      <div style={{position:"fixed",inset:0,background:"black",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Arial"}}>
        <KBLogo size={70}/><h2 style={{color:"white",marginTop:10}}>Kampala Business</h2>
        <div style={{display:"flex",gap:10,marginTop:15}}>
          <button onClick={()=>setAuthMode("login")} style={{background:authMode==="login"?"white":"#222",color:authMode==="login"?"black":"white",border:"none",padding:"10px 20px",borderRadius:20,fontWeight:"bold"}}>Login</button>
          <button onClick={()=>setAuthMode("signup")} style={{background:authMode==="signup"?"#00ff88":"#222",color:authMode==="signup"?"black":"white",border:"none",padding:"10px 20px",borderRadius:20,fontWeight:"bold"}}>Sign Up</button>
        </div>
        <div style={{width:"100%",maxWidth:300,background:"#111",padding:20,borderRadius:16,marginTop:15}}>
          {authMode==="signup"&&<input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Full Name" style={{width:"100%",padding:12,borderRadius:10,background:"#222",color:"white",border:"none",marginBottom:10}}/>}
          <input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{width:"100%",padding:12,borderRadius:10,background:"#222",color:"white",border:"none",marginBottom:10}}/>
          <input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{width:"100%",padding:12,borderRadius:10,background:"#222",color:"white",border:"none",marginBottom:15}}/>
          <button onClick={authMode==="signup"?handleSignup:handleLogin} style={{width:"100%",background:authMode==="signup"?"white":"#00ff88",color:"black",padding:12,borderRadius:10,border:"none",fontWeight:"bold"}}>{authMode==="signup"?"Sign Up":"Login"}</button>
          <div style={{color:"#888",fontSize:11,textAlign:"center",marginTop:10}}>{users.length} joined • Firebase Live</div>
        </div>
      </div>
    );
  }

  return(
    <>
      <style>{`*{margin:0;padding:0;box-sizing:border-box} html,body{overflow:hidden;background:#000} .feed::-webkit-scrollbar{display:none}`}</style>
      <div style={{position:"fixed",inset:0,width:"100vw",height:"100vh",height:"100dvh",background:"black",overflow:"hidden",fontFamily:"Arial"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,zIndex:20,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)"}}>
          <div onClick={()=>setShowUsers(true)} style={{cursor:"pointer"}}><KBLogo size={34}/></div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div onClick={()=>setActiveTop("For You")} style={{color:activeTop==="For You"?"white":"#888",fontWeight:"bold",fontSize:15,borderBottom:activeTop==="For You"?"2px solid white":"none"}}>For You</div>
            <div style={{color:"#888",fontSize:13}}>Muzika</div><div style={{color:"#888",fontSize:13}}>Following</div>
            <div onClick={isHosting?stopLive:startLive} style={{color:isHosting?"red":"#888",fontSize:13,fontWeight:isHosting?"bold":"normal",cursor:"pointer",background:isHosting?"white":"transparent",padding:isHosting?"4px 8px":"",borderRadius:12}}>Live{isHosting?" • ON":""}</div>
          </div>
          <div style={{width:34}}/>
        </div>

        {liveRooms.length>0&&!isHosting&&!watchingLive&&(
          <div style={{position:"absolute",top:50,left:10,right:10,zIndex:25,background:"red",padding:"10px 14px",borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"white",fontWeight:"bold",fontSize:12}}>🔴 {liveRooms[0].hostName} is LIVE NOW</span>
            <button onClick={()=>setWatchingLive(liveRooms[0])} style={{background:"white",color:"red",border:"none",padding:"6px 14px",borderRadius:20,fontWeight:"bold",fontSize:12}}>WATCH</button>
          </div>
        )}

        {isHosting&&(
          <div style={{position:"absolute",inset:0,background:"black",zIndex:90,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:12,background:"#111"}}><div style={{color:"white",fontWeight:"bold"}}>🔴 LIVE: {currentUser.name}</div><button onClick={stopLive} style={{background:"red",color:"white",border:"none",padding:"8px 14px",borderRadius:20}}>End Live</button></div>
            <video ref={liveVideoRef} autoPlay muted playsInline style={{flex:1,objectFit:"cover"}}/>
            <div style={{padding:12,background:"#111",color:"white",textAlign:"center",fontSize:12}}>You are LIVE — Everyone sees you via Firebase</div>
          </div>
        )}

        {watchingLive&&!isHosting&&(
          <div style={{position:"absolute",inset:0,background:"black",zIndex:90,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:12,background:"#111"}}><div style={{color:"white",fontWeight:"bold"}}>🔴 LIVE: {watchingLive.hostName}</div><button onClick={()=>setWatchingLive(null)} style={{background:"#333",color:"white",border:"none",padding:"8px 14px",borderRadius:20}}>Close</button></div>
            <div style={{flex:1,background:"#111",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
              <div style={{width:80,height:80,background:"red",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>🔴</div>
              <div style={{color:"white",fontSize:18,fontWeight:"bold"}}>{watchingLive.hostName} is LIVE</div>
              <div style={{color:"#00ff88",fontSize:12}}>Firebase Connected • LIVE</div>
            </div>
          </div>
        )}

        {showUsers&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.97)",zIndex:80,padding:20,overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:15}}><h3 style={{color:"white"}}>People: {users.length} • LIVE: {liveRooms.length}</h3><button onClick={()=>setShowUsers(false)} style={{background:"#222",color:"white",border:"none",padding:"8px 14px",borderRadius:20}}>X</button></div>
            {liveRooms.map(r=><div key={r.id} style={{background:"red",padding:10,borderRadius:10,marginBottom:10,display:"flex",justifyContent:"space-between"}}><span style={{color:"white",fontWeight:"bold"}}>🔴 LIVE: {r.hostName}</span><button onClick={()=>{setShowUsers(false); setWatchingLive(r)}} style={{background:"white",color:"red",border:"none",padding:"4px 10px",borderRadius:12}}>Join</button></div>)}
            {users.map(u=><div key={u.id} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #222"}}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:40,height:40,background:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold"}}>{u.name[0]}</div><div><div style={{color:"white",fontWeight:"bold",fontSize:14}}>{u.name} {u.isAdmin?"✓":""}</div><div style={{color:"#666",fontSize:11}}>{u.email}</div></div></div>{u.id!==currentUser.id&&<button onClick={()=>toggleFollow(u.id,u.name)} style={{background:followed.includes(u.id)?"#333":"#FE2C55",color:"white",border:"none",padding:"6px 14px",borderRadius:20,fontSize:12}}>{followed.includes(u.id)?"Following":"Follow"}</button>}</div>)}
          </div>
        )}

        {showComments&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.9)",zIndex:88,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
            <div style={{background:"#111",borderRadius:"20px 20px 0 0",maxHeight:"70%",display:"flex",flexDirection:"column"}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:15,borderBottom:"1px solid #222"}}><div style={{color:"white",fontWeight:"bold"}}>{videos.find(v=>v.id===showComments)?.comments.length} Comments</div><button onClick={()=>setShowComments(null)} style={{background:"#222",color:"white",border:"none",padding:"6px 12px",borderRadius:20}}>X</button></div>
              <div style={{flex:1,overflowY:"auto",padding:15}}>{videos.find(v=>v.id===showComments)?.comments.map(c=><div key={c.id} style={{marginBottom:10}}><b style={{color:"white",fontSize:12}}>{c.user}</b> <span style={{color:"#ccc",fontSize:12}}>{c.text}</span></div>)}</div>
              <div style={{display:"flex",gap:10,padding:12,borderTop:"1px solid #222"}}><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment..." style={{flex:1,padding:12,borderRadius:20,background:"#222",color:"white",border:"none"}}/><button onClick={addComment} style={{background:"white",color:"black",border:"none",padding:"10px 18px",borderRadius:20,fontWeight:"bold"}}>Send</button></div>
            </div>
          </div>
        )}

        <div className="feed" style={{width:"100%",height:"100%",overflowY:"auto",scrollSnapType:"y mandatory"}}>
          {videos.map(video=>(
            <div key={video.id} style={{width:"100vw",height:"100vh",height:"100dvh",scrollSnapAlign:"start",position:"relative",background:"black"}}>
              {video.videoUrl? <video data-videoid={video.id} ref={el=>videoRefs.current[video.id]=el} src={video.videoUrl} loop playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{width:"100%",height:"100%",background:"#111"}}/>}
              <div style={{position:"absolute",right:10,bottom:85,display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:48,height:48,background:"white",borderRadius:"50%",border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold"}}>K</div><div onClick={()=>toggleFollow(video.userId,video.user)} style={{width:20,height:20,background:followed.includes(video.userId)?"#333":"#FE2C55",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,marginTop:-8,border:"2px solid black",cursor:"pointer"}}>{followed.includes(video.userId)?"✓":"+"}</div></div>
                <div onClick={()=>toggleLike(video.id)} style={{textAlign:"center"}}><div style={{fontSize:28}}>❤️</div><div style={{color:"white",fontSize:11}}>{video.likes.length}</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:24}}>🕒</div><div style={{color:"white",fontSize:11}}>{video.views.length}</div></div>
                <div onClick={()=>setShowComments(video.id)} style={{textAlign:"center"}}><div style={{fontSize:24}}>💬</div><div style={{color:"white",fontSize:11}}>{video.comments.length}</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:22}}>↗️</div><div style={{color:"white",fontSize:11}}>{video.shares}</div></div>
                <div onClick={()=>toggleFire(video.id)} style={{textAlign:"center"}}><div style={{fontSize:26}}>🔥</div><div style={{color:"white",fontSize:11}}>{video.fire.length}</div></div>
              </div>
              <div style={{position:"absolute",left:12,bottom:85,right:80}}><div style={{display:"flex",gap:6}}><span style={{color:"white",fontWeight:"bold",fontSize:14}}>{video.user}</span>{video.verified&&<span style={{background:"#1DA1F2",width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10}}>✓</span>}</div></div>
            </div>
          ))}
        </div>

        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"black",borderTop:"1px solid #1a1a1a",display:"flex",justifyContent:"space-around",padding:"10px 0",zIndex:30}}>
          <div style={{textAlign:"center",flex:1}}><div style={{fontSize:20}}>🏠</div><div style={{fontSize:8,color:"white",fontWeight:"bold"}}>Home</div></div>
          <div onClick={isHosting?stopLive:startLive} style={{textAlign:"center",flex:1,cursor:"pointer"}}><div style={{fontSize:11,background:isHosting?"red":"#222",color:"white",padding:"5px 12px",borderRadius:6,display:"inline-block"}}>{isHosting?"END LIVE":"Live"}{liveRooms.length>0?` (${liveRooms.length})`:""}</div></div>
          <div onClick={()=>setShowUpload(true)} style={{background:"white",width:40,height:26,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"black",fontSize:20,fontWeight:"bold",cursor:"pointer"}}>+</div>
          <div onClick={()=>setShowComments(videos[0]?.id)} style={{textAlign:"center",flex:1}}><div style={{fontSize:18}}>💬</div><div style={{fontSize:8,color:"white"}}>Chat</div></div>
          <div onClick={()=>setShowUsers(true)} style={{textAlign:"center",flex:1}}><div style={{fontSize:18}}>👤</div><div style={{fontSize:8,color:"white"}}>You</div></div>
        </div>

        {showUpload&&(<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}><KBLogo size={50}/><input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} style={{display:"none"}}/><button onClick={()=>fileRef.current.click()} style={{background:"white",color:"black",padding:"14px 24px",borderRadius:25,border:"none",fontWeight:"bold",marginTop:15,width:"90%",maxWidth:300}}>Choose Video</button><button onClick={()=>setShowUpload(false)} style={{background:"#222",color:"white",padding:"10px 20px",borderRadius:20,border:"none",marginTop:15}}>Cancel</button></div>)}
      </div>
    </>
  );
}
