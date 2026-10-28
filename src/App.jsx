"use client"
import { useState, useEffect, useRef } from "react"
export default function UptownApp(){
const OWNER_EMAIL='komenierashid@gmail.com'
const [splash,setSplash]=useState(true)
const [authMode,setAuthMode]=useState('signup')
const [showAuth,setShowAuth]=useState(false)
const [user,setUser]=useState(null)
const [isOwner,setIsOwner]=useState(false)
const [page,setPage]=useState('foryou')
const [showUpload,setShowUpload]=useState(false)
const [uploadCaption,setUploadCaption]=useState('')
const [uploadText,setUploadText]=useState('')
const [uploadBase64,setUploadBase64]=useState(null)
const [uploadPreview,setUploadPreview]=useState(null)
const [follows,setFollows]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [showComments,setShowComments]=useState(null)
const [posts,setPosts]=useState([])
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [searchQuery,setSearchQuery]=useState('')
const [notifications,setNotifications]=useState([])
const [blueTickRequests,setBlueTickRequests]=useState([])
const [inboxTab,setInboxTab]=useState('notifications')
const [showDeleteModal,setShowDeleteModal]=useState(null)
const [longPressTimer,setLongPressTimer]=useState(null)
const [profilePic,setProfilePic]=useState(null)
const [editName,setEditName]=useState('')
const [editBio,setEditBio]=useState('')
const [editUsername,setEditUsername]=useState('')
const [isEditing,setIsEditing]=useState(false)
const [youTab,setYouTab]=useState('videos')
const videoRefs=useRef({})

const AUTO_PAGES=[
{name:'AI Soaps', username:'@aisoaps', caption:'AI Soaps ✓ Trending AI drama', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', category:'AI Soaps'},
{name:'AI Movies', username:'@aimovies', caption:'AI Movies ✓ Best AI movies', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', category:'AI Movies'},
{name:'Drake', username:'@drake', caption:'Drake ✓ America', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', category:'America'},
{name:'Beyoncé', username:'@beyonce', caption:'Beyoncé ✓ America', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', category:'America'},
{name:'Burna Boy', username:'@burnaboy', caption:'Burna Boy ✓ Africa', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', category:'Africa'},
{name:'Diamond Platnumz', username:'@diamondplatnumz', caption:'Diamond Platnumz ✓ Africa', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', category:'Africa'},
{name:'Ed Sheeran', username:'@edsheeran', caption:'Ed Sheeran ✓ Europe', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', category:'Europe'},
{name:'Adele', username:'@adele', caption:'Adele ✓ Europe', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', category:'Europe'},
{name:'Historical Africa', username:'@historyafrica', caption:'Historical Pages ✓ Africa', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', category:'Historical'},
{name:'Historical World', username:'@historyworld', caption:'Historical Pages ✓ World', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', category:'Historical'},
]

const fetchPostsFromDB=async()=>{
try{
const res=await fetch('/api/posts').then(r=>r.json()).catch(()=>({posts:[]}))
if(res.posts && res.posts.length>0){setPosts(res.posts)}
else{
const autoPosts=AUTO_PAGES.map((p,i)=>({id:9000+i,user:'UPTOWN Official',username:p.username,displayName:p.name,verified:true,caption:p.caption,mediaUrl:p.mediaUrl,category:p.category,likes:15601,comments:978,fires:520,views:Math.floor(Math.random()*20000)+5000,postedAt:Date.now()-i*60000,postedBy:OWNER_EMAIL,isAutoPage:true}))
setPosts(autoPosts); savePostsToDB(autoPosts)
}
}catch(e){
const autoPosts=AUTO_PAGES.map((p,i)=>({id:9000+i,user:'UPTOWN Official',username:p.username,displayName:p.name,verified:true,caption:p.caption,mediaUrl:p.mediaUrl,category:p.category,likes:15601,comments:978,fires:520,views:Math.floor(Math.random()*20000)+5000,postedAt:Date.now()-i*60000,isAutoPage:true}))
setPosts(autoPosts)
}
}
const savePostsToDB=async(p)=>{setPosts(p); try{await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({posts:p})})}catch{}}

useEffect(()=>{
const t=setTimeout(()=>{
setSplash(false)
const su=localStorage.getItem('uptown_user')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sFav=localStorage.getItem('uptown_fav_v3')
const sNot=localStorage.getItem('uptown_notifications_final_v5')
const sReq=localStorage.getItem('uptown_blue_requests')
const sPic=localStorage.getItem('uptown_profile_pic')
const sBio=localStorage.getItem('uptown_bio')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
if(sReq) setBlueTickRequests(JSON.parse(sReq))
if(sPic) setProfilePic(sPic)
if(sNot) setNotifications(JSON.parse(sNot))
else setNotifications([{id:1,from:'UPTOWN Official',verified:true,type:'welcome',forEmail:null,title:'Welcome ✓ UPTOWN Official',message:'Welcome ✓ Touch & hold video to Delete / Hide — Edit profile — Favorites',time:'now',read:false}])
fetchPostsFromDB()
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su); setUser(u); setIsOwner(u.email===OWNER_EMAIL); setEditName(u.name||''); setEditUsername(u.username||''); setEditBio(sBio||'')
checkBlueTickPrompt(u)
}
},1000)
return()=>clearTimeout(t)
},[])

const checkBlueTickPrompt=(cu)=>{
if(!cu || cu.verified) return
const today=new Date(); const day=today.getDate()
if(day!==10 && day!==26) return
const key=`blue_prompt_${today.getFullYear()}_${today.getMonth()}_${day}_${cu.email}`
if(localStorage.getItem(key)) return
const notif={id:Date.now(),from:'UPTOWN Official',username:'@uptown',verified:true,type:'blue_tick_prompt',forEmail:cu.email,title:'Get Verified ✓ — Blue Tick?',message:'UPTOWN Official is asking if you want blue tick ✓ — Tap to request',time:'now',read:false,action:'request_blue_tick'}
setNotifications(prev=>{const upd=[notif,...prev]; localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd)); return upd})
localStorage.setItem(key,'sent')
}

const pauseAllVideos=()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()})}
useEffect(()=>{pauseAllVideos()},[page,showUpload,showComments,showDeleteModal])
useEffect(()=>{
const obs=new IntersectionObserver((entries)=>{
entries.forEach(e=>{
const id=e.target.getAttribute('data-video-id')
const v=videoRefs.current[id]
if(!v) return
if(e.isIntersecting){
Object.keys(videoRefs.current).forEach(k=>{if(k!==id && videoRefs.current[k]) videoRefs.current[k].pause()})
setPosts(prev=>prev.map(p=> p.id.toString()===id ? {...p, views:(p.views||0)+1} : p))
v.play().catch(()=>{})
}else v.pause()
})
},{threshold:0.6})
document.querySelectorAll('[data-video-id]').forEach(el=>obs.observe(el))
return()=>obs.disconnect()
},[page,posts,searchQuery])

const handleTouchStart=(videoId)=>{
const timer=setTimeout(()=>{setShowDeleteModal(videoId)}, 700)
setLongPressTimer(timer)
}
const handleTouchEnd=()=>{
if(longPressTimer){clearTimeout(longPressTimer); setLongPressTimer(null)}
}
const handleDeleteVideo=(id)=>{
const filtered=posts.filter(p=>p.id!==id)
savePostsToDB(filtered); setShowDeleteModal(null)
setBlockedMsg('🗑️ Deleted'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)
}
const handleHideVideo=(id)=>{
const updated=posts.map(p=> p.id===id ? {...p, hidden:!p.hidden} : p)
savePostsToDB(updated); setShowDeleteModal(null)
const isHidden=updated.find(p=>p.id===id)?.hidden
setBlockedMsg(isHidden?'🙈 Hidden from public':'👁️ Visible to public'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)
}

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
if((authForm.name.toLowerCase().includes('katongole') || authForm.username.toLowerCase().includes('uptown')) && email!==OWNER_EMAIL){
setBlockedMsg('Only UPTOWN Official'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000); return
}
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill all'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const isOfficial=email===OWNER_EMAIL
const nu={id:Date.now(),name:'UPTOWN Official',username:isOfficial?'@uptown':'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficial,bio:'',profilePic:null}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified,profilePic:null}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found && email!==OWNER_EMAIL){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800); return}
const isOfficial=email===OWNER_EMAIL
const lu=isOfficial?{name:'UPTOWN Official',username:'@uptown',email,verified:true,profilePic:found?.profilePic}:{name:'UPTOWN Official',username:found.username,email,verified:found.verified,profilePic:found.profilePic,bio:found.bio}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false); if(found?.profilePic) setProfilePic(found.profilePic); if(found?.bio) setEditBio(found.bio)
}
}

const handleFollow=(username)=>{const isF=follows[username]==='following'; const nf={...follows,[username]:isF?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf)); setBlockedMsg(isF?'Unfollowed':'✓ Following'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),600)}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf)); setBlockedMsg(nf[id]?'★ Favorited — Check You > Favorites':'★ Removed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),600)}
const handleShare=async(v)=>{try{await navigator.clipboard.writeText(v.mediaUrl||'UPTOWN'); setBlockedMsg('Link copied'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),600)}catch{}}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused) v.play(); else v.pause()}
const handleFileChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setUploadPreview({url:u}); const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f)}
const handleProfilePicChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{setProfilePic(ev.target.result); localStorage.setItem('uptown_profile_pic',ev.target.result); let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]'); db=db.map(u=> u.email===user?.email ? {...u, profilePic:ev.target.result} : u); localStorage.setItem('uptown_users_db',JSON.stringify(db)); setBlockedMsg('✓ Profile picture updated'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}; r.readAsDataURL(f)}
const handleSaveProfile=()=>{
if(!user) return
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
db=db.map(u=> u.email===user.email ? {...u, name:editName, username:editUsername, bio:editBio, profilePic:profilePic} : u)
localStorage.setItem('uptown_users_db',JSON.stringify(db))
const newUser={...user, name:editName, username:editUsername, bio:editBio, profilePic:profilePic}
setUser(newUser); localStorage.setItem('uptown_user',JSON.stringify(newUser)); localStorage.setItem('uptown_bio',editBio)
setIsEditing(false); setBlockedMsg('✓ Profile saved'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)
}
const handleRequestBlueTick=(notif)=>{
const req={id:Date.now(), email:user.email, name:'UPTOWN Official', username:user.username, status:'pending', requestedAt:Date.now()}
const newReqs=[req, ...blueTickRequests]; setBlueTickRequests(newReqs); localStorage.setItem('uptown_blue_requests',JSON.stringify(newReqs))
const ownerNotif={id:Date.now()+1,from:user.username,username:user.username,verified:false,type:'blue_tick_request_received',forEmail:OWNER_EMAIL,title:'Blue Tick Request ✓',message:`${user.username} requested blue tick`,time:'now',read:false,requestId:req.id,requesterEmail:req.email}
const upd=[ownerNotif, ...notifications]; setNotifications(upd); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd))
const updated=notifications.map(n=> n.id===notif.id ? {...n, title:'Request Sent ✓', message:'Request sent to UPTOWN Official', action:null} : n)
setNotifications(updated); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(updated))
}
const handleApproveRequest=(req)=>{
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]'); db=db.map(u=> u.email===req.email ? {...u, verified:true} : u); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const updatedReqs=blueTickRequests.map(r=> r.id===req.id ? {...r, status:'approved'} : r); setBlueTickRequests(updatedReqs); localStorage.setItem('uptown_blue_requests',JSON.stringify(updatedReqs))
const congrats={id:Date.now(),from:'UPTOWN Official',username:'@uptown',verified:true,type:'blue_tick_approved',forEmail:req.email,title:'Congrats! Verified ✓',message:`Congrats! Verified ✓ Blue tick added`,time:'now',read:false}
const upd=[congrats, ...notifications]; setNotifications(upd); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd))
if(user && user.email===req.email){const newUser={...user, verified:true}; setUser(newUser); localStorage.setItem('uptown_user',JSON.stringify(newUser))}
}
const handlePostNow=()=>{
let mu=uploadBase64 || uploadPreview?.url
if(!mu && !uploadText.trim()){setBlockedMsg('Upload video or write text'); setShowBlocked(true); return}
const isTextOnly=uploadText.trim() && !mu
const np={id:Date.now(),user:'UPTOWN Official',username:user?.username||'@user',verified:user?.verified||false,caption:isTextOnly?uploadText:uploadCaption||uploadText||'UPTOWN Official ✓',text:uploadText||null,mediaUrl:mu||null,type:isTextOnly?'text':'video',likes:15601,comments:978,fires:520,views:0,postedAt:Date.now(),postedBy:user?.email,hidden:false,profilePic:profilePic}
const nposts=[np, ...posts]; savePostsToDB(nposts)
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUploadText(''); setShowUpload(false)
setBlockedMsg('✓ Posted'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage('foryou')},500)
}

if(splash){
return(<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="120" height="150" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>)
}

const allVideos=[...posts].filter(p=>!p.hidden || p.postedBy===user?.email || isOwner).sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const searchFiltered=allVideos.filter(v=>{ if(!searchQuery) return false; const q=searchQuery.toLowerCase(); return (v.username?.toLowerCase().includes(q) || v.caption?.toLowerCase().includes(q) || v.category?.toLowerCase().includes(q)) })
const renderMedia=(v)=>{
if(v.type==='text'){return <div style={{width:'100%',height:'100%',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}><div style={{background:'#1a1a1a',borderRadius:'16px',padding:'18px',maxWidth:'85%',fontSize:'15px',textAlign:'center'}}>{v.text||v.caption}</div></div>}
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'cover',background:'#000'}}/>
}
const myNotifications=notifications.filter(n=> !n.forEmail || n.forEmail===user?.email || (isOwner && n.forEmail===OWNER_EMAIL))
const ownerRequests=blueTickRequests.filter(r=> r.status==='pending')
const unread=myNotifications.filter(n=>!n.read).length
const myVideos=posts.filter(p=>p.postedBy===user?.email||isOwner)
const favVideos=allVideos.filter(v=> favorites[v.id])

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',display:'flex',alignItems:'center',padding:'0 10px',gap:'8px',borderBottom:'1px solid #1a1a1a',flexShrink:0}}>
<div style={{display:'flex',gap:'8px',flex:1}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'}].map(t=><button key={t.key} onClick={()=>{pauseAllVideos(); setPage(t.key)}} style={{background:page===t.key?'#fff':'#222',color:page===t.key?'#000':'#888',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'700',height:'34px'}}>{t.label}</button>)}
</div>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:'#1a1a1a',border:'1px solid #FF0024',color:'#FF0024',padding:'6px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'800',height:'34px'}}>● Live</button>
</div>

<div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>
{page==='foryou'&&(
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{allVideos.map(v=>{
const isFollowing=follows[v.username]==='following'
const isLiked=likes[v.id]
const isMine=v.postedBy===user?.email || isOwner
return(
<div key={v.id} data-video-id={v.id} 
onTouchStart={()=>isMine && handleTouchStart(v.id)}
onTouchEnd={handleTouchEnd}
onMouseDown={()=>isMine && handleTouchStart(v.id)}
onMouseUp={handleTouchEnd}
style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderMedia(v)}</div>
{v.hidden && <div style={{position:'absolute',top:'12px',left:'12px',zIndex:4,background:'rgba(255,0,36,0.8)',color:'#fff',padding:'4px 8px',borderRadius:'12px',fontSize:'10px',fontWeight:'700'}}>🙈 Hidden</div>}

<div style={{position:'absolute',right:'12px',bottom:'90px',zIndex:3,display:'flex',flexDirection:'column',gap:'16px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'52px',height:'52px',borderRadius:'50%',background:profilePic?`url(${profilePic})`:'#fff',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #fff',fontWeight:'900',fontSize:'12px'}}>{!profilePic && <><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></>}</div>
<button onClick={()=>handleFollow(v.username)} style={{marginTop:'-10px',width:'22px',height:'22px',borderRadius:'50%',background:isFollowing?'#00D632':'#FF0024',border:'2px solid #000',color:'#fff',fontWeight:'900'}}> {isFollowing?'✓':'+'} </button>
<div style={{fontSize:'12px',fontWeight:'700',marginTop:'4px'}}>Follow</div>
</div>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'30px'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div><div style={{fontSize:'13px',fontWeight:'700'}}>15601</div></button>
<button onClick={()=>{pauseAllVideos(); setShowComments(v.id)}} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{width:'34px',height:'34px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#000'}}>💬</div><div style={{fontSize:'13px',fontWeight:'700'}}>978</div></button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'22px'}}>↗</div><div style={{fontSize:'12px'}}>Share</div></button>
<button onClick={()=>{const nf={...favorites,[v.id]:!favorites[v.id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf))}} style={{background:'none',border:'none',color:favorites[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'22px'}}>★</div><div style={{fontSize:'11px'}}>Fav</div></button>
<button onClick={()=>setBlockedMsg('Duet allowed')} style={{background:'none',border:'1px solid #00D632',width:'42px',height:'32px',borderRadius:'20px',color:'#00D632',fontSize:'11px',fontWeight:'800'}}>Duet</button>
<button onClick={()=>handleLike('fire_'+v.id)} style={{background:'#1a1a1a',border:'1px solid #333',width:'42px',height:'42px',borderRadius:'50%',color:'#fff'}}><span style={{fontSize:'20px'}}>🔥</span><div style={{fontSize:'10px',fontWeight:'700'}}>520</div></button>
</div>

<div style={{position:'absolute',left:'14px',right:'80px',bottom:'20px',zIndex:2,display:'flex',flexDirection:'column',gap:'4px'}}>
<div style={{display:'flex',alignItems:'center',gap:'6px'}}>
<span style={{fontWeight:'900',fontSize:'17px',color:'#fff'}}>UPTOWN Official</span>
<span style={{width:'18px',height:'18px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>
<span style={{fontSize:'13px',color:'#ddd'}}>{v.username}</span>
</div>
<div style={{fontSize:'14px',color:'#fff',lineHeight:'1.3'}}>{v.caption}</div>
</div>
</div>
)})}
</div>
)}

{page==='search'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',alignItems:'center',gap:'8px'}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%'}}>‹</button>
<input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search old videos — AI Soaps, AI Movies, Musicians, Historical" autoFocus style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'10px 14px',color:'#fff',fontSize:'13px'}}/>
</div>
<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{!searchQuery ? (
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
<div style={{fontWeight:'800',fontSize:'13px'}}>Auto Pages — DB — Smart grid</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
{AUTO_PAGES.map(p=><button key={p.username} onClick={()=>setSearchQuery(p.category||p.name)} style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',textAlign:'left'}}><div style={{fontWeight:'800',fontSize:'12px'}}>UPTOWN Official</div><div style={{fontSize:'11px',color:'#aaa'}}>{p.username} • {p.category}</div></button>)}
</div>
</div>
) : (
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
{searchFiltered.map(v=><div key={v.id} style={{background:'#111',borderRadius:'12px',overflow:'hidden'}}><div style={{height:'160px'}}>{renderMedia(v)}</div><div style={{padding:'8px'}}><div style={{fontSize:'11px',fontWeight:'700'}}>UPTOWN Official</div><div style={{fontSize:'10px',color:'#888'}}>{v.username}</div></div></div>)}
</div>
)}
</div>
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'#000'}}>
<div style={{padding:'12px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontWeight:'800',fontSize:'14px'}}>Inbox — UPTOWN Official</div><div style={{fontSize:'10px',color:'#888',marginTop:'2px'}}>Blue tick 10th & 26th — Verified no auto prompts</div></div>
{isOwner && <div style={{display:'flex',gap:'6px'}}><button onClick={()=>setInboxTab('notifications')} style={{background:inboxTab==='notifications'?'#fff':'#1a1a1a',color:inboxTab==='notifications'?'#000':'#888',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Inbox</button><button onClick={()=>setInboxTab('requests')} style={{background:inboxTab==='requests'?'#1D9BF0':'#1a1a1a',color:inboxTab==='requests'?'#fff':'#888',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'800'}}>Requests {ownerRequests.length?`(${ownerRequests.length})`:''}</button></div>}
</div>
<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{isOwner && inboxTab==='requests' ? (
ownerRequests.map(req=>(
<div key={req.id} style={{background:'#0a1a2a',border:'1px solid #1D9BF0',borderRadius:'14px',padding:'12px',marginBottom:'10px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontWeight:'800',fontSize:'13px'}}>{req.username}</div><div style={{fontSize:'10px',color:'#aaa'}}>{req.requesterEmail}</div></div>
<button onClick={()=>handleApproveRequest(req)} style={{background:'#1D9BF0',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontWeight:'900',fontSize:'11px'}}>✓ Approve</button>
</div>
</div>
))
) : (
myNotifications.map(n=>(
<div key={n.id} style={{background:n.type==='blue_tick_prompt'?'#0a2a0a':'#111',border:'1px solid '+(n.type==='blue_tick_prompt'?'#00D632':'#222'),borderRadius:'14px',padding:'12px',marginBottom:'10px'}}>
<div style={{fontWeight:'800',fontSize:'12px'}}>{n.title}</div>
<div style={{fontSize:'11px',color:'#aaa',marginTop:'4px'}}>{n.message}</div>
{n.action==='request_blue_tick' && <button onClick={()=>handleRequestBlueTick(n)} style={{width:'100%',marginTop:'10px',background:'#00D632',color:'#000',border:'none',padding:'12px',borderRadius:'20px',fontWeight:'900',fontSize:'12px'}}>Tap to Request Blue Tick ✓</button>}
</div>
))
)}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,overflowY:'auto',background:'#000',padding:'16px'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{position:'relative'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:profilePic?`url(${profilePic})`:'#fff',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',border:'2px solid #333'}}>{!profilePic && <><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></>}</div>
<label style={{position:'absolute',bottom:'-4px',right:'-4px',width:'24px',height:'24px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #000',fontSize:'10px',cursor:'pointer'}}>📷<input type="file" accept="image/*" onChange={handleProfilePicChange} style={{display:'none'}}/></label>
</div>
<div>
<div style={{fontWeight:'800',fontSize:'16px',display:'flex',alignItems:'center',gap:'6px'}}>UPTOWN Official {user?.verified && <span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'12px',color:'#888'}}>{user?.username||'@user'}</div>
<div style={{fontSize:'11px',color:'#aaa',marginTop:'2px'}}>{editBio||'Tap Edit to change Bio'}</div>
</div>
<div style={{marginLeft:'auto'}}><button onClick={()=>setIsEditing(!isEditing)} style={{background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Edit</button></div>
</div>

{isEditing && (
<div style={{marginTop:'12px',background:'#121212',borderRadius:'12px',padding:'12px'}}>
<div style={{fontSize:'11px',fontWeight:'700',marginBottom:'8px'}}>Edit Profile — Picture, Bio, Names — Every account can edit</div>
<input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Change Name" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'8px',padding:'8px',color:'#fff',marginBottom:'8px'}}/>
<input value={editUsername} onChange={e=>setEditUsername(e.target.value)} placeholder="Change Username" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'8px',padding:'8px',color:'#fff',marginBottom:'8px'}}/>
<input value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Change Bio" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'8px',padding:'8px',color:'#fff',marginBottom:'8px'}}/>
<button onClick={handleSaveProfile} style={{width:'100%',background:'#00D632',color:'#000',border:'none',padding:'10px',borderRadius:'20px',fontWeight:'900'}}>Save Profile</button>
</div>
)}

<div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
<button onClick={()=>setYouTab('videos')} style={{flex:1,background:youTab==='videos'?'#fff':'#1a1a1a',color:youTab==='videos'?'#000':'#888',border:'none',padding:'8px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Videos</button>
<button onClick={()=>setYouTab('favorites')} style={{flex:1,background:youTab==='favorites'?'#FFD700':'#1a1a1a',color:youTab==='favorites'?'#000':'#888',border:'none',padding:'8px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>★ Favorites</button>
</div>

<div style={{marginTop:'12px'}}>
{youTab==='videos' && (
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}}>
{myVideos.map(v=>(
<div key={v.id} 
onTouchStart={()=>handleTouchStart(v.id)}
onTouchEnd={handleTouchEnd}
onMouseDown={()=>handleTouchStart(v.id)}
onMouseUp={handleTouchEnd}
style={{aspectRatio:'9/14',background:'#111',borderRadius:'12px',overflow:'hidden',position:'relative'}}>
{renderMedia(v)}
{v.hidden && <div style={{position:'absolute',top:'6px',left:'6px',background:'rgba(255,0,36,0.8)',color:'#fff',padding:'3px 6px',borderRadius:'8px',fontSize:'8px',fontWeight:'700'}}>🙈 Hidden</div>}
</div>
))}
</div>
)}
{youTab==='favorites' && (
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}}>
{favVideos.map(v=>(
<div key={v.id} style={{aspectRatio:'9/14',background:'#111',borderRadius:'12px',overflow:'hidden',position:'relative'}}>
{renderMedia(v)}
</div>
))}
{favVideos.length===0 && <div style={{gridColumn:'1 / -1',textAlign:'center',color:'#666',fontSize:'12px',marginTop:'20px'}}>No favorites yet — Tap ★ Fav</div>}
</div>
)}
</div>
</div>
)}

{showDeleteModal!==null && (
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:70,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={()=>setShowDeleteModal(null)}>
<div style={{background:'#121212',border:'1px solid #333',borderRadius:'20px',padding:'16px',width:'100%',maxWidth:'320px'}} onClick={e=>e.stopPropagation()}>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',fontSize:'14px',textAlign:'center',marginBottom:'12px'}}>Touch & Hold — Delete / Hide</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
<button onClick={()=>handleDeleteVideo(showDeleteModal)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>🗑️ Delete Video</button>
<button onClick={()=>handleHideVideo(showDeleteModal)} style={{background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'14px',borderRadius:'12px',fontWeight:'800'}}>
{posts.find(p=>p.id===showDeleteModal)?.hidden ? '👁️ Unhide — Show to public' : '🙈 Hide from public — Only you see'}
</button>
<button onClick={()=>setShowDeleteModal(null)} style={{background:'#222',color:'#888',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'700'}}>Cancel</button>
</div>
</div>
</div>
)}

{showComments!==null&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:60,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(null)}><div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'14px',maxHeight:'60vh'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:'700'}}>Comments</div><button onClick={()=>setShowComments(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>×</button></div><div style={{display:'flex',gap:'8px',marginTop:'10px'}}><input placeholder="Add comment" style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'8px 12px',color:'#fff'}}/><button style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px'}}>Post</button></div></div></div>}
{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{pauseAllVideos(); setShowUpload(false)}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px'}} onClick={e=>e.stopPropagation()}>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'15px',marginBottom:'12px'}}>Post — UPTOWN Official</div>
<textarea value={uploadText} onChange={e=>setUploadText(e.target.value)} placeholder="Write text message" style={{width:'100%',height:'80px',background:'#000',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',marginBottom:'10px'}}/>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',marginBottom:'10px'}}/>
{uploadPreview&&<video src={uploadPreview.url} style={{width:'100%',maxHeight:'180px',borderRadius:'12px',marginBottom:'10px'}} autoPlay loop muted playsInline/>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — UPTOWN Official only" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',marginBottom:'12px'}}/>
<button onClick={handlePostNow} style={{width:'100%',background:'#00D632',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>🟢 POST NOW</button>
</div>
</div>
)}

<div style={{height:'66px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px'}}>Home</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('search')}} style={{background:'none',border:'none',color:page==='search'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'18px'}}>🔍</span><span style={{fontSize:'10px'}}>Search</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('inbox'); const upd=notifications.map(n=>({...n,read:true})); setNotifications(upd); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd))}} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1,position:'relative'}}><span style={{fontSize:'18px'}}>✉</span><span style={{fontSize:'10px'}}>Inbox</span>{unread>0&&<span style={{position:'absolute',top:'2px',right:'14px',background:'#FF0024',color:'#fff',fontSize:'8px',padding:'2px 5px',borderRadius:'10px',fontWeight:'800'}}>{unread}</span>}</button>
<button onClick={()=>{pauseAllVideos(); setShowUpload(true)}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900'}}> + </button>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:'none',border:'none',color:page==='live'?'#FF0024':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>🔴</span><span style={{fontSize:'10px'}}>Live</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('you')}} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>○</span><span style={{fontSize:'10px'}}>You</span></button>
</div>

{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'20px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'16px',fontWeight:'900',fontSize:'22px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#fff'}}>TOWN</span> Official</div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'12px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email — komenierashid@gmail.com = Official" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>Continue</button>
</div>
</div>
)}
</div>
)
}
