"use client"
import { useState, useEffect, useRef } from "react"

export default function UptownApp(){
const [splash,setSplash]=useState(true)
const [authMode,setAuthMode]=useState('signup')
const [showAuth,setShowAuth]=useState(false)
const [user,setUser]=useState(null)
const [isOwner,setIsOwner]=useState(false)
const [page,setPage]=useState('foryou')
const [showUpload,setShowUpload]=useState(false)
const [uploadType,setUploadType]=useState('video')
const [uploadCaption,setUploadCaption]=useState('')
const [youtubeLink,setYoutubeLink]=useState('')
const [uploadPreview,setUploadPreview]=useState(null)
const [uploadBase64,setUploadBase64]=useState(null)
const [profilePic,setProfilePic]=useState(null)
const [userName,setUserName]=useState('UPTOWN Official')
const [userBio,setUserBio]=useState('UPTOWN Official ✓ — Blue Tick Verified')
const [isLive,setIsLive]=useState(false)
const [follows,setFollows]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [posts,setPosts]=useState([])
const [pinned,setPinned]=useState({})
const [pausedMap,setPausedMap]=useState({})
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [showShareMenu,setShowShareMenu]=useState(null)
const [notifications,setNotifications]=useState([])
const [blueRequests,setBlueRequests]=useState([])
const [userVerified,setUserVerified]=useState(true)
const [youTab,setYouTab]=useState('videos')
const [showEditName,setShowEditName]=useState(false)
const [showEditBio,setShowEditBio]=useState(false)
const [editNameInput,setEditNameInput]=useState('')
const [editBioInput,setEditBioInput]=useState('')
const videoRefs=useRef({})

const forYouTests=[
{id:101,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ Tap screen pause', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video',views:12400},
{id:102,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ You page = Name, Bio, Live, Views', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video',views:8920},
{id:103,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ Pin videos + Favorites', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', mediaType:'video',views:15600},
]

useEffect(()=>{
const t=setTimeout(()=>{setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sP=localStorage.getItem('uptown_posts_final_v3')
const sFav=localStorage.getItem('uptown_fav_v2')
const sPin=localStorage.getItem('uptown_pinned')
const sPic=localStorage.getItem('uptown_profile_pic')
const sNot=localStorage.getItem('uptown_notifications')
const sName=localStorage.getItem('uptown_name')
const sBio=localStorage.getItem('uptown_bio')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sP) setPosts(JSON.parse(sP))
if(sFav) setFavorites(JSON.parse(sFav))
if(sPin) setPinned(JSON.parse(sPin))
if(sPic) setProfilePic(sPic)
if(sName) setUserName(sName)
if(sBio) setUserBio(sBio)
if(sNot) setNotifications(JSON.parse(sNot))
else{
const init=[{id:1,type:'blue_request',from:'UPTOWN Official',username:'@uptown',verified:true,time:'2m ago',title:'Get Verified ✓',message:'UPTOWN Official asking you want blue tick? Press to request!',read:false}]
setNotifications(init)
}
if(!su) setShowAuth(true)
else{setUser(JSON.parse(su)); if(sO==='true') setIsOwner(true)}
},2200)
return()=>clearTimeout(t)
},[])

useEffect(()=>{
if(page!=='foryou' && page!=='muzika') return
const observer=new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
const id=entry.target.getAttribute('data-video-id')
const video=videoRefs.current[id]
if(!video) return
if(entry.isIntersecting){
// Count view
setPosts(prev=>prev.map(p=>p.id==id?{...p,views:(p.views||0)+1}:p))
Object.keys(videoRefs.current).forEach(k=>{if(k!==id && videoRefs.current[k]) videoRefs.current[k].pause()})
if(!pausedMap[id]) video.play().catch(()=>{})
}else video.pause()
})
},{threshold:0.7})
const els=document.querySelectorAll('[data-video-id]')
els.forEach(el=>observer.observe(el))
return()=>observer.disconnect()
},[page,posts,pausedMap])

const getYoutubeId=(url)=>{
if(!url) return null
const reg=/(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/)|youtu\.be\/)([^"&?\/\s]{11})/
const m=url.match(reg)
return m?m[1]:null
}

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const ownerCheck=email==='komenierashid@gmail.com'
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const nu={id:Date.now(),name:authForm.name,username:'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:false}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:authForm.name,username:'@'+authForm.username.replace('@',''),email,verified:false}; localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setUserName(authForm.name); setIsOwner(ownerCheck); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!ownerCheck){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const lu={name:found?found.name:'UPTOWN Official',username:found?found.username:'@uptown',email,verified:true}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setUserName(lu.name); setIsOwner(ownerCheck); setShowAuth(false)
}
}

const handleFollow=(username)=>{const nf={...follows,[username]:follows[username]==='following'?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v2',JSON.stringify(nf)); setBlockedMsg(nf[id]?'Added to Favorites ★ — See in You → Favorites':'Removed from Favorites'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)}
const handlePin=(id)=>{const np={...pinned,[id]:!pinned[id]}; setPinned(np); localStorage.setItem('uptown_pinned',JSON.stringify(np)); setBlockedMsg(np[id]?'Pinned to top 📌 — See in You → Pinned':'Unpinned'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)}

const handleTapVideo=(id)=>{
const video=videoRefs.current[id]
if(!video) return
if(video.paused){video.play(); setPausedMap({...pausedMap,[id]:false})}
else{video.pause(); setPausedMap({...pausedMap,[id]:true})}
}

const handleFileChange=(e)=>{
const file=e.target.files?.[0]; if(!file) return
const url=URL.createObjectURL(file)
setUploadPreview({url,type:file.type})
const reader=new FileReader()
reader.onload=(ev)=>setUploadBase64(ev.target.result)
reader.readAsDataURL(file)
}
const handleProfilePicChange=(e)=>{
const file=e.target.files?.[0]; if(!file) return
const reader=new FileReader()
reader.onload=(ev)=>{setProfilePic(ev.target.result); localStorage.setItem('uptown_profile_pic',ev.target.result); setBlockedMsg('Profile picture changed ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)}
reader.readAsDataURL(file)
}

const handlePostNow=()=>{
let mediaUrl=null; let mediaType='video'
if(youtubeLink){const ytId=getYoutubeId(youtubeLink); if(!ytId){setBlockedMsg('Invalid YouTube'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return} mediaUrl=youtubeLink; mediaType='youtube'}
else if(uploadBase64){mediaUrl=uploadBase64; mediaType=uploadType==='picture'?'image':'video'}
else{setBlockedMsg('Choose file'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const np={id:Date.now(),user:userName,username:'@uptown',verified:userVerified,caption:uploadCaption||`${userName} ✓`,mediaUrl,mediaType,isMuzika:page==='muzika',views:0}
const newPosts=[np,...posts]; setPosts(newPosts); localStorage.setItem('uptown_posts_final_v3',JSON.stringify(newPosts))
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setYoutubeLink(''); setShowUpload(false)
// SHOW THAT VIDEO IS POSTED
setBlockedMsg(`✓ Video posted! Your video is now live at For You page! ${np.views} views`); setShowBlocked(true)
setTimeout(()=>{
setBlockedMsg(''); setShowBlocked(false)
setPage('foryou')
},2000)
}

const handleSaveName=()=>{
if(editNameInput.trim()){
setUserName(editNameInput.trim())
localStorage.setItem('uptown_name',editNameInput.trim())
setBlockedMsg('Name changed ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}
setShowEditName(false)
}
const handleSaveBio=()=>{
if(editBioInput.trim()){
setUserBio(editBioInput.trim())
localStorage.setItem('uptown_bio',editBioInput.trim())
setBlockedMsg('Bio changed ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}
setShowEditBio(false)
}

if(splash){
return(
<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<style>{`@keyframes pulse {0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}`}</style>
<svg width="160" height="190" viewBox="0 0 200 230" style={{animation:'pulse 1.2s infinite'}}><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
<div style={{marginTop:'20px',fontWeight:'700',fontSize:'12px',color:'#888'}}>UPTOWN CHAT — LOADING...</div>
</div>
)
}

const forYouFeed=[...posts.filter(p=>!p.isMuzika),...forYouTests].sort((a,b)=> (pinned[b.id]?1:0) - (pinned[a.id]?1:0))
const myVideos=posts
const favVideos=[...forYouTests,...posts].filter(v=>favorites[v.id])
const pinnedVideos=[...posts,...forYouTests].filter(v=>pinned[v.id])

const renderVideo=(v)=>{
const ytId=getYoutubeId(v.mediaUrl)
if(v.mediaType==='youtube' || ytId){
return <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}?autoplay=0&controls=1&playsinline=1`} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%'}}/>
}
if(v.mediaType==='image' || v.mediaUrl?.startsWith('data:image')){
return <img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
}
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'cover'}}/>
}

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',fontFamily:'Inter'}}>
{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'24px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'28px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'16px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'12px',borderRadius:'16px',fontWeight:'800'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'12px',borderRadius:'16px',fontWeight:'800'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'16px',borderRadius:'12px',fontWeight:'900'}}>{authMode==='signup'?'Sign Up':'Login'}</button>
</div>
</div>
)}

<div style={{display:'flex',padding:'12px 16px',gap:'12px',borderBottom:'1px solid #1a1a1a',overflowX:'auto'}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'},{label:'🔴 Live',key:'live'}].map(t=>{
const active=page===t.key
return <button key={t.key} onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage(t.key)}} style={{background:active?'#fff':'#1a1a1a', color:active?'#000':'#888', border:'none', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'700', flexShrink:0}}>{t.label}</button>
})}
</div>

<div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
{page==='foryou'&&(
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
const isPaused=pausedMap[v.id]
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{width:'100%',height:'100%'}}>{renderVideo(v)}</div>
{isPaused&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',width:'70px',height:'70px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',zIndex:5,pointerEvents:'none'}}>▶</div>}
{pinned[v.id]&&<div style={{position:'absolute',top:'12px',left:'12px',background:'#FFD700',color:'#000',padding:'4px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'800',zIndex:2}}>📌 Pinned</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,maxWidth:'62%',pointerEvents:'none'}}>
<div style={{fontWeight:'700',display:'flex',gap:'6px'}}>{v.user} <span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span></div>
<div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div>
<div style={{fontSize:'11px',color:'#00D632',marginTop:'4px'}}>👁 {v.views||0} views — Tap screen pause/play</div>
</div>
<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:3,display:'flex',flexDirection:'column',gap:'15px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<button onClick={()=>handleFollow(v.username)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',border:isFollowing?'2px solid #00D632':'2px solid #fff'}}><span style={{fontWeight:'900',fontSize:'10px',color:'#000'}}>UP</span></div><span style={{fontSize:'9px',color:'#fff',fontWeight:'700',marginTop:'4px'}}>{isFollowing?'Following':'Follow'}</span></button>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:likes[v.id]?'#FF0024':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>{likes[v.id]?'♥':'♡'}</span><span style={{fontSize:'10px'}}>Like</span></button>
<button onClick={()=>handleFire(v.id)} style={{background:'none',border:'none',color:likes['fire_'+v.id]?'#FF6A00':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>🔥</span><span style={{fontSize:'10px'}}>Fire</span></button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',color:favorites[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>{favorites[v.id]?'★':'☆'}</span><span style={{fontSize:'10px'}}>Fav</span></button>
<button onClick={()=>handlePin(v.id)} style={{background:'none',border:'none',color:pinned[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'18px'}}>📌</span><span style={{fontSize:'9px'}}>{pinned[v.id]?'Pinned':'Pin'}</span></button>
</div>
</div>
)})}
</div>
)}

{page==='you'&&(
<div style={{flex:1,overflowY:'auto',padding:'16px'}}>
{/* PROFILE HEADER */}
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<label style={{width:'72px',height:'72px',borderRadius:'50%',background:profilePic?`url(${profilePic})`:'#fff',backgroundSize:'cover',backgroundPosition:'center',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',color:'#000',position:'relative',cursor:'pointer',border:'2px solid #1D9BF0'}}>
{!profilePic&&'UP'}
<input type="file" accept="image/*" onChange={handleProfilePicChange} style={{display:'none'}}/>
<div style={{position:'absolute',bottom:'-4px',right:'-4px',background:'#FF0024',width:'24px',height:'24px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:'#fff',border:'2px solid #000'}}>📷</div>
</label>
<div style={{flex:1}}>
<div style={{fontWeight:'800',display:'flex',gap:'6px',alignItems:'center',fontSize:'15px'}}>{userName} {userVerified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'12px',color:'#888'}}>@uptown</div>
<div style={{fontSize:'12px',color:'#aaa',marginTop:'4px'}}>{userBio}</div>
</div>
</div>

{/* YOU BUTTON FEATURES - CHANGE NAME, BIO, LIVE, PIC, VIEWS, PIN, FAV */}
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginTop:'16px'}}>
<button onClick={()=>{setEditNameInput(userName); setShowEditName(true)}} style={{background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'12px',borderRadius:'12px',fontSize:'12px',fontWeight:'700'}}>✏️ Change Name</button>
<button onClick={()=>{setEditBioInput(userBio); setShowEditBio(true)}} style={{background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'12px',borderRadius:'12px',fontSize:'12px',fontWeight:'700'}}>📝 Change Bio</button>
<button onClick={()=>handleProfilePicChange({target:{files:[]}})} style={{background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'12px',borderRadius:'12px',fontSize:'12px',fontWeight:'700'}}><label style={{width:'100%',cursor:'pointer'}}>📷 Change Profile Picture<input type="file" accept="image/*" onChange={handleProfilePicChange} style={{display:'none'}}/></label></button>
<button onClick={()=>{setIsLive(!isLive); setBlockedMsg(isLive?'Live ended':'🔴 You are Live now at For You!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)}} style={{background:isLive?'#FF0024':'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'12px',borderRadius:'12px',fontSize:'12px',fontWeight:'700'}}>{isLive?'🔴 End Live':'🔴 Go Live'}</button>
</div>

<div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
<button onClick={()=>{setAuthMode('login'); setShowAuth(true)}} style={{flex:1,background:'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'700',fontSize:'12px'}}>Login Button</button>
<button onClick={()=>{setAuthMode('signup'); setShowAuth(true)}} style={{flex:1,background:'#FF0024',color:'#fff',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'700',fontSize:'12px'}}>Sign Up Button</button>
</div>

{/* TABS: VIDEOS / VIEWS / PINNED / FAVORITES */}
<div style={{display:'flex',gap:'6px',marginTop:'16px',background:'#121212',padding:'4px',borderRadius:'20px'}}>
{[
{key:'videos',label:`Videos (${myVideos.length})`},
{key:'views',label:'Views'},
{key:'pinned',label:`Pinned (${pinnedVideos.length})`},
{key:'fav',label:`Favorites (${favVideos.length})`},
].map(t=>(
<button key={t.key} onClick={()=>setYouTab(t.key)} style={{flex:1,background:youTab===t.key?'#fff':'transparent',color:youTab===t.key?'#000':'#888',border:'none',padding:'8px 4px',borderRadius:'16px',fontSize:'10px',fontWeight:'800'}}>{t.label}</button>
))}
</div>

{/* MY VIDEOS + VIEWS PER EACH VIDEO AT FOR YOU PAGE */}
{youTab==='videos'&&(
<div style={{marginTop:'12px'}}>
{myVideos.length===0&&<div style={{textAlign:'center',color:'#666',marginTop:'20px',fontSize:'13px'}}>No videos yet — Post video and it shows "Video Posted" then appears here</div>}
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
{myVideos.map(v=>(
<div key={v.id} style={{position:'relative',background:'#121212',borderRadius:'12px',overflow:'hidden'}}>
<div style={{height:'120px',background:'#000'}}>{v.mediaType==='image'?<img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<video src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>}</div>
<div style={{padding:'6px'}}>
<div style={{fontSize:'10px',fontWeight:'700',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.caption}</div>
<div style={{fontSize:'9px',color:'#00D632',marginTop:'2px'}}>👁 {v.views||0} views</div>
<div style={{display:'flex',gap:'4px',marginTop:'4px'}}>
<button onClick={()=>handlePin(v.id)} style={{background:pinned[v.id]?'#FFD700':'#222',color:pinned[v.id]?'#000':'#fff',border:'none',padding:'4px 6px',borderRadius:'6px',fontSize:'8px',fontWeight:'700'}}>{pinned[v.id]?'📌 Pinned':'📌 Pin'}</button>
<button onClick={()=>handleFavorite(v.id)} style={{background:favorites[v.id]?'#FFD700':'#222',color:'#fff',border:'none',padding:'4px 6px',borderRadius:'6px',fontSize:'8px'}}>★</button>
</div>
</div>
{pinned[v.id]&&<div style={{position:'absolute',top:'4px',left:'4px',background:'#FFD700',color:'#000',fontSize:'7px',padding:'2px 6px',borderRadius:'10px',fontWeight:'800'}}>📌</div>}
</div>
))}
</div>
</div>
)}

{youTab==='views'&&(
<div style={{marginTop:'12px'}}>
<div style={{fontWeight:'700',fontSize:'13px',marginBottom:'8px'}}>Your Views Per Each Video at For You Page</div>
{myVideos.map(v=>(
<div key={v.id} style={{background:'#121212',padding:'12px',borderRadius:'12px',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div style={{display:'flex',gap:'10px',alignItems:'center'}}>
<div style={{width:'50px',height:'70px',background:'#000',borderRadius:'8px',overflow:'hidden'}}>{v.mediaType==='image'?<img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<video src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>}</div>
<div><div style={{fontSize:'12px',fontWeight:'700'}}>{v.caption.slice(0,20)}</div><div style={{fontSize:'11px',color:'#00D632'}}>👁 {v.views||0} views at For You</div><div style={{fontSize:'10px',color:'#666'}}>{new Date(v.id).toLocaleDateString()}</div></div>
</div>
<div style={{fontSize:'18px',fontWeight:'800',color:'#00D632'}}>{v.views||0}</div>
</div>
))}
{myVideos.length===0&&<div style={{color:'#666',fontSize:'12px',textAlign:'center',marginTop:'20px'}}>Post videos — views will show here per each video</div>}
</div>
)}

{youTab==='pinned'&&(
<div style={{marginTop:'12px'}}>
<div style={{fontWeight:'700',fontSize:'13px',marginBottom:'8px'}}>📌 Pinned Videos — Shows at top of For You</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
{pinnedVideos.map(v=>(
<div key={v.id} style={{background:'#121212',borderRadius:'12px',overflow:'hidden',border:'1px solid #FFD700'}}>
<div style={{height:'120px'}}>{v.mediaUrl?.includes('.mp4')||v.mediaUrl?.startsWith('data:video')?<video src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>}</div>
<div style={{padding:'6px',fontSize:'10px'}}>👁 {v.views||0} views • Pinned</div>
</div>
))}
</div>
{pinnedVideos.length===0&&<div style={{color:'#666',fontSize:'12px',textAlign:'center',marginTop:'20px'}}>Pin videos from For You — they stay at top</div>}
</div>
)}

{youTab==='fav'&&(
<div style={{marginTop:'12px'}}>
<div style={{fontWeight:'700',fontSize:'13px',marginBottom:'8px'}}>★ Favorite Videos</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
{favVideos.map(v=>(
<div key={v.id} style={{background:'#121212',borderRadius:'12px',overflow:'hidden'}}>
<div style={{height:'120px',background:'#000'}}>{v.mediaUrl?.includes('.mp4')||v.mediaUrl?.startsWith('data:')?<video src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>}</div>
<div style={{padding:'6px',fontSize:'10px'}}>★ Favorite</div>
</div>
))}
</div>
{favVideos.length===0&&<div style={{color:'#666',fontSize:'12px',textAlign:'center',marginTop:'20px'}}>Tap ★ on any video — favorites show here</div>}
</div>
)}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,display:'flex',flexDirection:'column'}}>
<div style={{padding:'12px 16px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:'700',fontSize:'13px'}}>Muzika — UPTOWN Official ✓</div><button onClick={()=>{setUploadType('video'); setShowUpload(true)}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>+ Post</button></div>
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{[...posts.filter(p=>p.isMuzika),...forYouTests].map(v=>{
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{width:'100%',height:'100%'}}>{renderVideo(v)}</div>
{pausedMap[v.id]&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',width:'70px',height:'70px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',zIndex:5,pointerEvents:'none'}}>▶</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,pointerEvents:'none'}}><div style={{fontWeight:'700'}}>{v.user} ✓</div><div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div><div style={{fontSize:'10px',color:'#888',marginTop:'4px'}}>Tap screen pause/play</div></div>
</div>
)})}
</div>
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{padding:'16px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:'800'}}>Inbox</div><div style={{background:'#1D9BF0',padding:'4px 10px',borderRadius:'20px',fontSize:'11px'}}>Verified ✓</div></div>
<div style={{flex:1,overflowY:'auto',padding:'12px'}}>
{notifications.map(n=>(
<div key={n.id} style={{background:'#121212',border:'1px solid #222',borderRadius:'16px',padding:'14px',marginBottom:'10px'}}>
<div style={{fontWeight:'700',fontSize:'12px'}}>{n.title}</div>
<div style={{fontSize:'12px',color:'#aaa',marginTop:'4px'}}>{n.message}</div>
</div>
))}
</div>
</div>
)}

{page==='following'&&<div style={{flex:1,padding:'20px'}}>Following — Tap Follow buttons active</div>}
{page==='live'&&<div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><div style={{width:'80px',height:'80px',background:isLive?'#00D632':'#FF0024',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px'}}>{isLive?'🔴':'⚫'}</div><div style={{fontWeight:'800',marginTop:'16px'}}>{isLive?'You are LIVE at For You 🔴':'Go Live from You page'}</div><div style={{fontSize:'12px',color:'#888',marginTop:'8px'}}>{isLive?'Your live shows in For You':'Tap Go Live in You page'}</div><button onClick={()=>{setIsLive(!isLive); setPage('you')}} style={{marginTop:'16px',background:'#FF0024',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'20px'}}>Go to You → Go Live</button></div>}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'2px solid #00D632',padding:'20px 24px',borderRadius:'16px',zIndex:80,textAlign:'center',maxWidth:'85%'}}><div style={{fontWeight:'800',fontSize:'14px'}}>{blockedMsg}</div><div style={{fontSize:'11px',color:'#888',marginTop:'6px'}}>Video posted successfully ✓</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'24px',borderTopRightRadius:'24px',padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center'}}>Post — UPTOWN Official ✓</div>
<div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
{[{label:'📹 Video',type:'video'},{label:'🖼️ Pictures',type:'picture'},{label:'👥 Duet',type:'duet'}].map(t=>(
<button key={t.type} onClick={()=>setUploadType(t.type)} style={{flex:1,background:uploadType===t.type?'#fff':'#1a1a1a',color:uploadType===t.type?'#000':'#888',border:'none',padding:'12px 6px',borderRadius:'12px',fontSize:'11px',fontWeight:'700'}}>{t.label}</button>
))}
</div>
<div style={{marginTop:'14px',background:'#1a1a1a',borderRadius:'12px',padding:'12px'}}>
<input value={youtubeLink} onChange={e=>setYoutubeLink(e.target.value)} placeholder="YouTube link (auto plays in app)..." style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
</div>
<div style={{textAlign:'center',color:'#666',fontSize:'12px',marginTop:'8px'}}>OR upload</div>
<input type="file" accept={uploadType==='picture'?'image/*':'video/*,image/*'} onChange={handleFileChange} style={{width:'100%',marginTop:'12px',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'12px'}}>{uploadPreview.type.startsWith('video')?<video src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}} autoPlay loop playsInline/>:<img src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}}/>}</div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'12px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
<button onClick={handlePostNow} style={{marginTop:'14px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>POST NOW — Show "Video Posted" ✓</button>
<div style={{fontSize:'10px',color:'#666',marginTop:'8px',textAlign:'center'}}>After post, you will see "Video posted" and video appears at For You</div>
</div>
</div>
)}

{/* EDIT NAME MODAL */}
{showEditName&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',zIndex:60,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={()=>setShowEditName(false)}>
<div style={{background:'#1a1a1a',width:'100%',maxWidth:'360px',borderRadius:'20px',padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center'}}>Change Name</div>
<input value={editNameInput} onChange={e=>setEditNameInput(e.target.value)} placeholder="New name" style={{width:'100%',marginTop:'16px',background:'#000',border:'1px solid #333',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<div style={{display:'flex',gap:'10px',marginTop:'14px'}}>
<button onClick={()=>setShowEditName(false)} style={{flex:1,background:'#222',color:'#fff',border:'none',padding:'12px',borderRadius:'12px'}}>Cancel</button>
<button onClick={handleSaveName} style={{flex:1,background:'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'800'}}>Save Name</button>
</div>
</div>
</div>
)}

{showEditBio&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',zIndex:60,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={()=>setShowEditBio(false)}>
<div style={{background:'#1a1a1a',width:'100%',maxWidth:'360px',borderRadius:'20px',padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center'}}>Change Bio</div>
<textarea value={editBioInput} onChange={e=>setEditBioInput(e.target.value)} placeholder="New bio" style={{width:'100%',marginTop:'16px',background:'#000',border:'1px solid #333',borderRadius:'12px',padding:'14px',color:'#fff',minHeight:'80px'}}/>
<div style={{display:'flex',gap:'10px',marginTop:'14px'}}>
<button onClick={()=>setShowEditBio(false)} style={{flex:1,background:'#222',color:'#fff',border:'none',padding:'12px',borderRadius:'12px'}}>Cancel</button>
<button onClick={handleSaveBio} style={{flex:1,background:'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'800'}}>Save Bio</button>
</div>
</div>
</div>
)}

<div style={{display:'flex',justifyContent:'space-around',padding:'10px 0',borderTop:'1px solid #1a1a1a',background:'#000'}}>
<button onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',fontSize:'10px'}}>⌂<br/>For You</button>
<button onClick={()=>setPage('following')} style={{background:'none',border:'none',color:'#666',fontSize:'10px'}}>👥<br/>People</button>
<button onClick={()=>{setUploadType('video'); setShowUpload(true)}} style={{background:'#FF0024',border:'none',width:'52px',height:'36px',borderRadius:'12px',color:'#fff',fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',fontSize:'10px'}}>✉<br/>Inbox</button>
<button onClick={()=>setPage('you')} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
