"use client"
import { useState, useEffect, useRef } from "react"
export default function UptownApp(){
const OWNER_EMAIL='komenierashid@gmail.com'
const OWNER_NAME='Katongole Rashid'
const OWNER_USERNAME='@uptown'
const [splash,setSplash]=useState(true)
const [authMode,setAuthMode]=useState('signup')
const [showAuth,setShowAuth]=useState(false)
const [user,setUser]=useState(null)
const [isOwner,setIsOwner]=useState(false)
const [page,setPage]=useState('foryou')
const [showUpload,setShowUpload]=useState(false)
const [uploadMode,setUploadMode]=useState(null)
const [uploadCaption,setUploadCaption]=useState('')
const [universalLink,setUniversalLink]=useState('')
const [uploadPreview,setUploadPreview]=useState(null)
const [uploadBase64,setUploadBase64]=useState(null)
const [follows,setFollows]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [commentCounts,setCommentCounts]=useState({})
const [showComments,setShowComments]=useState(null)
const [commentInput,setCommentInput]=useState('')
const [comments,setComments]=useState({})
const [posts,setPosts]=useState([])
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [notifications,setNotifications]=useState([])
const [blueTickRequests,setBlueTickRequests]=useState([])
const [inboxTab,setInboxTab]=useState('notifications')
const [searchQuery,setSearchQuery]=useState('')
const [postBtnState,setPostBtnState]=useState('green')
const [isLive,setIsLive]=useState(false)
const [sessionStart,setSessionStart]=useState(Date.now())
const videoRefs=useRef({})

const officialVideos=[
{id:9001,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ 978+ Family', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', likes:15600, fires:520, comments:978, isOfficial:true},
{id:9002,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ Muzika — Only Official posts YouTube', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', likes:12400, fires:340, comments:0, isOfficial:true},
]

const fetchPostsFromDB=async()=>{try{const r=await fetch('/api/posts').then(x=>x.json()).catch(()=>({posts:[]})); if(r.posts?.length) setPosts(r.posts)}catch{}}
const savePostsToDB=async(p)=>{setPosts(p); try{await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({posts:p})})}catch{}}

useEffect(()=>{
const t=setTimeout(()=>{
setSplash(false)
const su=localStorage.getItem('uptown_user')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sNot=localStorage.getItem('uptown_notifications_final_v5')
const sReq=localStorage.getItem('uptown_blue_requests')
const lastSeen=localStorage.getItem('uptown_last_seen')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sReq) setBlueTickRequests(JSON.parse(sReq))
if(sNot) setNotifications(JSON.parse(sNot))
else setNotifications([{id:1,from:'UPTOWN Official',verified:true,type:'welcome',forEmail:null,title:'Welcome ✓',message:'Welcome to UPTOWN ✓ 978+ Family — You can upload & post anytime & delete anytime — Duet allowed',time:'2m ago',read:false}])
fetchPostsFromDB()
const now=Date.now()
setSessionStart(now)
if(lastSeen) localStorage.setItem('uptown_last_seen_prev',lastSeen)
localStorage.setItem('uptown_last_seen', now.toString())
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su)
setUser(u); setIsOwner(u.email===OWNER_EMAIL)
// CHECK BLUE TICK PROMPT — 10th & 26th — NOT FOR VERIFIED
checkBlueTickPrompt(u)
}
},1500)
return()=>clearTimeout(t)
},[])

const checkBlueTickPrompt=(currentUser)=>{
if(!currentUser) return
if(currentUser.verified) return // VERIFIED WILL NOT RECEIVE AUTOMATIC NOTIFICATIONS
const today=new Date()
const day=today.getDate()
// FOR TESTING: also allow any day if you want to see — Change to if(true) to test
const isPromptDay=day===10 || day===26
if(!isPromptDay) return
const key=`blue_prompt_${today.getFullYear()}_${today.getMonth()}_${day}_${currentUser.email}`
if(localStorage.getItem(key)) return // ALREADY SENT THIS DAY
const notif={
id:Date.now(),
from:'UPTOWN Official',
username:'@uptown',
verified:true,
type:'blue_tick_prompt',
forEmail:currentUser.email,
title:'Get Verified ✓ — Blue Tick?',
message:'UPTOWN Official is asking if you want blue tick ✓ — Tap to request',
time:'now',
read:false,
action:'request_blue_tick'
}
setNotifications(prev=>{
const updated=[notif, ...prev]
localStorage.setItem('uptown_notifications_final_v5', JSON.stringify(updated))
return updated
})
localStorage.setItem(key,'sent')
}

// FOR TESTING — FORCE PROMPT NOW BUTTON — FOR YOU TO TEST
const forceSendPrompt=()=>{
if(!user || user.verified) {setBlockedMsg('Verified users will not receive prompt'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const notif={
id:Date.now(),
from:'UPTOWN Official',
verified:true,
type:'blue_tick_prompt',
forEmail:user.email,
title:'Get Verified ✓ — Blue Tick?',
message:'UPTOWN Official is asking if you want blue tick ✓ — Tap to request',
time:'now',
read:false,
action:'request_blue_tick'
}
const updated=[notif, ...notifications]
setNotifications(updated)
localStorage.setItem('uptown_notifications_final_v5', JSON.stringify(updated))
setBlockedMsg('✓ Prompt sent — Check inbox'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)
}

const pauseAllVideos=()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()})}
useEffect(()=>{pauseAllVideos()},[page,showUpload,showComments])

useEffect(()=>{
const obs=new IntersectionObserver((entries)=>{
entries.forEach(e=>{
const id=e.target.getAttribute('data-video-id')
const v=videoRefs.current[id]
if(!v) return
if(e.isIntersecting){
Object.keys(videoRefs.current).forEach(k=>{if(k!==id && videoRefs.current[k]) videoRefs.current[k].pause()})
v.play().catch(()=>{})
}else v.pause()
})
},{threshold:0.6})
document.querySelectorAll('[data-video-id]').forEach(el=>obs.observe(el))
return()=>obs.disconnect()
},[page,posts,searchQuery])

const parseLink=(url)=>{
if(!url) return null
const yt=url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^"&?\/\s]{11})/)
if(yt) return {type:'youtube', embed:`https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&playsinline=1`}
if(url.match(/\.(mp4|mov|webm)/i)) return {type:'direct', embed:url}
if(url.startsWith('http')) return {type:'iframe', embed:url}
return null
}

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
if((authForm.name.toLowerCase().includes('katongole') || authForm.username.toLowerCase().includes('uptown')) && email!==OWNER_EMAIL){
setBlockedMsg('Only komenierashid@gmail.com can be Katongole Rashid'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return
}
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const isOfficial=email===OWNER_EMAIL
const nu={id:Date.now(),name:isOfficial?OWNER_NAME:authForm.name,username:isOfficial?OWNER_USERNAME:'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficial}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false); checkBlueTickPrompt(lu)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found && email!==OWNER_EMAIL){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
const isOfficial=email===OWNER_EMAIL
const lu=isOfficial?{name:OWNER_NAME,username:OWNER_USERNAME,email,verified:true}:{name:found.name,username:found.username,email,verified:found.verified}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false); checkBlueTickPrompt(lu)
}
}

const handleFollow=(u)=>{const isF=follows[u]==='following'; const nf={...follows,[u]:isF?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleShare=async(v)=>{try{await navigator.clipboard.writeText(v.mediaUrl); setBlockedMsg('Link copied'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}catch{}}
const handleComment=(id)=>{pauseAllVideos(); setShowComments(id)}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused) v.play(); else v.pause()}
const handleFileChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setUploadPreview({url:u}); setPostBtnState('green'); const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f);}

const handleRequestBlueTick=(notif)=>{
if(!user) return
// CREATE REQUEST FOR OWNER
const req={id:Date.now(), email:user.email, name:user.name, username:user.username, status:'pending', requestedAt:Date.now()}
const newReqs=[req, ...blueTickRequests]
setBlueTickRequests(newReqs); localStorage.setItem('uptown_blue_requests',JSON.stringify(newReqs))
// NOTIFICATION FOR OWNER — UPTOWN OFFICIAL INBOX WILL RECEIVE
const ownerNotif={
id:Date.now()+1,
from:user.name,
username:user.username,
verified:user.verified||false,
type:'blue_tick_request_received',
forEmail:OWNER_EMAIL,
title:'Blue Tick Request ✓',
message:`${user.name} ${user.username} requested blue tick — Tap to verify`,
time:'now',
read:false,
requestId:req.id,
requesterEmail:req.email
}
const ownerNotifs=[ownerNotif, ...notifications]
setNotifications(ownerNotifs); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(ownerNotifs))
// UPDATE USER NOTIF TO PENDING
const updated=notifications.map(n=> n.id===notif.id ? {...n, title:'Request Sent ✓', message:'Your blue tick request sent to UPTOWN Official — Wait for approval', action:null} : n)
setNotifications(updated); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(updated))
setBlockedMsg('✓ Request sent to UPTOWN Official'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)
}

const handleApproveRequest=(req)=>{
// UPDATE USERS DB — AUTOMATIC BLUE TICK ON HIS NAME
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
db=db.map(u=> u.email===req.email ? {...u, verified:true} : u)
localStorage.setItem('uptown_users_db',JSON.stringify(db))
// UPDATE REQUEST STATUS
const updatedReqs=blueTickRequests.map(r=> r.id===req.id ? {...r, status:'approved'} : r)
setBlueTickRequests(updatedReqs); localStorage.setItem('uptown_blue_requests',JSON.stringify(updatedReqs))
// SEND CONGRATS NOTIFICATION TO USER — AUTOMATICALLY VERIFIED
const congrats={
id:Date.now(),
from:'UPTOWN Official',
username:'@uptown',
verified:true,
type:'blue_tick_approved',
forEmail:req.email,
title:'Congrats! Verified ✓ Blue Tick!',
message:`Congrats ${req.name}! You have been verified ✓ Blue tick added on your name automatically! You will no longer receive automatic blue tick requests.`,
time:'now',
read:false
}
const updatedNotifs=[congrats, ...notifications]
setNotifications(updatedNotifs); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(updatedNotifs))
// IF OWNER APPROVES HIS OWN REQUEST? UPDATE CURRENT USER IF SAME EMAIL
if(user && user.email===req.email){
const newUser={...user, verified:true}
setUser(newUser); localStorage.setItem('uptown_user',JSON.stringify(newUser))
}
setBlockedMsg(`✓ ${req.name} verified — Blue tick added!`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}

const handlePostNow=(mode)=>{
const fm=mode||uploadMode
if(fm==='post_muzika' && !isOwner){setBlockedMsg('Muzika Only Official'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
let mu=null; let li=null
if(universalLink){ li=parseLink(universalLink); mu=universalLink }
else if(uploadBase64) mu=uploadBase64
else if(uploadPreview?.url) mu=uploadPreview.url
else{setBlockedMsg('Upload video'); setShowBlocked(true); return}
setPostBtnState('white')
const np={id:Date.now(),user:user?.name||'User',username:user?.username||'@user',verified:user?.verified||false,caption:uploadCaption||'New video ✓ Duet allowed',mediaUrl:mu,linkInfo:li,isMuzika:fm==='post_muzika',isLive:isLive,likes:0,fires:520,views:Math.floor(Math.random()*5000)+100,postedBy:user?.email,postedAt:Date.now()}
const nposts=[np, ...posts]; savePostsToDB(nposts)
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUniversalLink(''); setShowUpload(false); setUploadMode(null); setIsLive(false)
setBlockedMsg('✓ Posted — For You — New video!'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage('foryou'); setPostBtnState('green')},800)
}

const handleDeleteVideo=(id)=>{
if(!confirm('Delete this video? — You can delete any time — Play Store Policy')) return
const filtered=posts.filter(p=>p.id!==id)
savePostsToDB(filtered)
setBlockedMsg('🗑️ Deleted — You can post anytime again'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)
}

const handleDuet=(v)=>{
setBlockedMsg(`Duet with ${v.user} ✓ — Upload your video — Duet allowed!`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
setUploadMode('upload_video'); setShowUpload(true); setUploadCaption(`Duet with ${v.username} — ${v.caption}`)
}

if(splash){
return(<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="140" height="170" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>)
}

const lastSeenPrev=parseInt(localStorage.getItem('uptown_last_seen_prev')||'0')
const allVideos=[...posts, ...officialVideos].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
// FOR YOU — ONLY NEW VIDEOS WHEN YOU OPEN APP — OLD VIDEOS VIA SEARCH
const forYouFeed=allVideos.filter(v=>{
// NEW VIDEOS ONLY: Show videos posted after lastSeenPrev OR within last 3 days OR official
if(v.isOfficial) return true
if(!lastSeenPrev) return true
return (v.postedAt||v.id) > lastSeenPrev || (Date.now() - (v.postedAt||0) < 3*24*60*60*1000)
}).sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))

const searchFiltered=allVideos.filter(v=>{
if(!searchQuery) return false
const q=searchQuery.toLowerCase()
return (v.user?.toLowerCase().includes(q) || v.username?.toLowerCase().includes(q) || v.caption?.toLowerCase().includes(q))
})

const renderUniversal=(v)=>{
const info=v.linkInfo || parseLink(v.mediaUrl)
if(!info) return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
if(info.type==='youtube') return <iframe width="100%" height="100%" src={info.embed} allow="autoplay; encrypted-media" allowFullScreen style={{width:'100%',height:'100%',border:'none'}}/>
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={info.embed} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#000'}}/>
}

const myNotifications=notifications.filter(n=> !n.forEmail || n.forEmail===user?.email || (isOwner && n.forEmail===OWNER_EMAIL))
const ownerRequests=blueTickRequests.filter(r=> r.status==='pending')
const unread=myNotifications.filter(n=>!n.read && (n.forEmail===user?.email || !n.forEmail || (isOwner && n.forEmail===OWNER_EMAIL))).length

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',display:'flex',alignItems:'center',padding:'0 8px',gap:'6px',borderBottom:'1px solid #1a1a1a',flexShrink:0}}>
<div style={{display:'flex',gap:'6px',flex:1}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'}].map(t=><button key={t.key} onClick={()=>{pauseAllVideos(); setPage(t.key)}} style={{background:page===t.key?'#fff':'#222',color:page===t.key?'#000':'#888',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700',height:'32px'}}>{t.label}</button>)}
</div>
<button onClick={()=>{pauseAllVideos(); setPage('search')}} style={{background:page==='search'?'#fff':'#1a1a1a',color:page==='search'?'#000':'#fff',border:'1px solid #333',width:'36px',height:'32px',borderRadius:'20px'}}>🔍</button>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:page==='live'?'#FF0024':'#1a1a1a',color:page==='live'?'#fff':'#FF0024',border:'1px solid #FF0024',padding:'6px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'800',height:'32px'}}>● Live</button>
</div>

<div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column',background:'#000'}}>
{page==='foryou'&&(
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory'}}>
<div style={{height:'32px',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
<span style={{fontSize:'11px',color:'#00D632',fontWeight:'700'}}>● For You — Only New Videos — Scroll down to up — Duet allowed</span>
<button onClick={forceSendPrompt} style={{background:'#1D9BF0',color:'#fff',border:'none',padding:'3px 8px',borderRadius:'10px',fontSize:'9px'}}>Test Blue Tick Prompt</button>
</div>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
const isLiked=likes[v.id]
const isFired=likes['fire_'+v.id]
const isMine=v.postedBy===user?.email
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
<div style={{position:'absolute',top:'12px',left:'12px',zIndex:4,display:'flex',gap:'6px'}}>
{isMine && <button onClick={()=>handleDeleteVideo(v.id)} style={{background:'rgba(255,0,36,0.8)',border:'none',color:'#fff',padding:'4px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'700'}}>🗑️ Delete — Anytime</button>}
<span style={{background:'rgba(0,0,0,0.6)',border:'1px solid #333',color:'#00D632',padding:'4px 8px',borderRadius:'20px',fontSize:'9px'}}>New ✓</span>
</div>

<div style={{position:'absolute',right:'10px',top:'42%',transform:'translateY(-50%)',zIndex:3,display:'flex',flexDirection:'column',gap:'12px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{position:'relative',width:'54px',height:'62px',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'50px',height:'50px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontWeight:'900',fontSize:'11px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></span></div>
<button onClick={()=>handleFollow(v.username)} style={{position:'absolute',bottom:'12px',left:'50%',transform:'translateX(-50%)',width:'22px',height:'22px',borderRadius:'50%',background:isFollowing?'#00D632':'#FF0024',border:'2px solid #000',color:'#fff',fontWeight:'900'}}>{isFollowing?'✓':'+'}</button>
<div style={{marginTop:'6px',fontSize:'11px',fontWeight:'700',color:'#fff'}}>{isFollowing?'Following':'Follow'}</div>
</div>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'24px'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div><div style={{fontSize:'11px'}}>{isLiked? (v.likes+1) : '15600'}</div></button>
<button onClick={()=>handleComment(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>💬</div><div style={{fontSize:'11px'}}>{commentCounts[v.id]||978}</div></button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div>→</div><div style={{fontSize:'11px'}}>Share</div></button>
<button onClick={()=>handleDuet(v)} style={{background:'#1a1a1a',border:'1px solid #00D632',width:'36px',height:'36px',borderRadius:'50%',color:'#00D632',fontSize:'10px',fontWeight:'800',display:'flex',alignItems:'center',justifyContent:'center'}}>Duet</button>
<button onClick={()=>handleFire(v.id)} style={{background:isFired?'#FF6A00':'#1a1a1a',border:'1px solid #333',width:'38px',height:'38px',borderRadius:'50%',color:'#fff'}}><span style={{fontSize:'18px'}}>🔥</span><div style={{fontSize:'8px'}}>{isFired? (v.fires+1) : 520}</div></button>
</div>

<div style={{position:'absolute',left:'12px',right:'78px',bottom:'28px',zIndex:2,pointerEvents:'none',display:'flex',flexDirection:'column',gap:'5px',maxWidth:'78%'}}>
<div style={{display:'flex',alignItems:'center',gap:'6px'}}>
<span style={{fontWeight:'900',fontSize:'16px',color:'#fff',textShadow:'0 1px 4px rgba(0,0,0,0.9)'}}>{v.user}</span>
{v.verified && <span style={{width:'18px',height:'18px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
<span style={{fontSize:'11px',color:'#ddd'}}>{v.username}</span>
</div>
<div style={{fontSize:'13px',color:'#fff',textShadow:'0 1px 3px rgba(0,0,0,0.9)'}}>{v.caption}</div>
<div style={{fontSize:'11px',color:'#fff',opacity:0.9}}>♪ UPTOWN Official ✓ • 978+ Family • Duet allowed • Delete anytime</div>
</div>
</div>
)})}
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'#000'}}>
<div style={{padding:'10px 12px',borderBottom:'1px solid #1a1a1a'}}>
<div style={{fontWeight:'800',fontSize:'14px'}}>Inbox — From UPTOWN Official</div>
<div style={{fontSize:'10px',color:'#888',marginTop:'2px'}}>Blue Tick requests — 10th & 26th — Verified will not receive automatic prompts — Duet allowed — Delete anytime — New videos on For You</div>
{isOwner && (
<div style={{display:'flex',gap:'8px',marginTop:'10px'}}>
<button onClick={()=>setInboxTab('notifications')} style={{background:inboxTab==='notifications'?'#fff':'#1a1a1a',color:inboxTab==='notifications'?'#000':'#888',border:'none',padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Notifications {myNotifications.length}</button>
<button onClick={()=>setInboxTab('requests')} style={{background:inboxTab==='requests'?'#1D9BF0':'#1a1a1a',color:inboxTab==='requests'?'#fff':'#888',border:'none',padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'800'}}>Blue Tick Requests {ownerRequests.length>0?`(${ownerRequests.length})`:''}</button>
</div>
)}
</div>

<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{isOwner && inboxTab==='requests' ? (
ownerRequests.length===0 ? <div style={{textAlign:'center',marginTop:'40px',color:'#666'}}><div style={{fontSize:'30px'}}>✓</div><div style={{marginTop:'8px',fontSize:'12px'}}>No blue tick requests now — Requests from users will appear here on 10th & 26th</div></div> :
ownerRequests.map(req=>(
<div key={req.id} style={{background:'#0a1a2a',border:'1px solid #1D9BF0',borderRadius:'14px',padding:'12px',marginBottom:'10px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div>
<div style={{fontWeight:'800',fontSize:'13px',display:'flex',alignItems:'center',gap:'6px'}}>{req.name} <span style={{fontSize:'11px',color:'#888'}}>{req.username}</span></div>
<div style={{fontSize:'10px',color:'#aaa',marginTop:'2px'}}>Requested blue tick — {new Date(req.requestedAt).toLocaleString()} — Pending</div>
<div style={{fontSize:'11px',color:'#1D9BF0',marginTop:'4px'}}>From: {req.email}</div>
</div>
<button onClick={()=>handleApproveRequest(req)} style={{background:'#1D9BF0',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontWeight:'900',fontSize:'11px'}}>✓ Approve — Verify</button>
</div>
<div style={{fontSize:'10px',color:'#666',marginTop:'8px'}}>Tap Approve — User will receive congrats notification + blue tick automatically on his name — He will not receive automatic prompts again</div>
</div>
))
) : (
myNotifications.length===0 ? <div style={{textAlign:'center',marginTop:'40px',color:'#666'}}>No notifications — On 10th & 26th you will receive blue tick request prompt (if not verified)</div> :
myNotifications.map(n=>(
<div key={n.id} style={{background:n.type==='blue_tick_prompt'?'#0a2a0a': n.type==='blue_tick_approved'?'#0a2a1a' : n.type==='blue_tick_request_received'?'#1a1a2a' : '#111', border:'1px solid '+(n.type==='blue_tick_prompt'?'#00D632': n.type==='blue_tick_approved'?'#1D9BF0':'#222'), borderRadius:'14px',padding:'12px',marginBottom:'10px'}}>
<div style={{display:'flex',alignItems:'center',gap:'8px'}}>
<div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'10px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></div>
<div>
<div style={{fontWeight:'800',fontSize:'12px',display:'flex',alignItems:'center',gap:'4px'}}>{n.from} {n.verified && <span style={{width:'14px',height:'14px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'10px',color:'#888'}}>{n.time} • {n.type}</div>
</div>
</div>
<div style={{marginTop:'8px'}}>
<div style={{fontWeight:'800',fontSize:'12px',color:n.type==='blue_tick_prompt'?'#00D632': n.type==='blue_tick_approved'?'#1D9BF0':'#fff', textAlign:'center'}}>{n.title}</div>
<div style={{fontSize:'11px',color:'#aaa',marginTop:'4px',textAlign:'center'}}>{n.message}</div>
{n.type==='blue_tick_prompt' && n.action==='request_blue_tick' && (
<button onClick={()=>handleRequestBlueTick(n)} style={{width:'100%',marginTop:'10px',background:'#00D632',color:'#000',border:'none',padding:'12px',borderRadius:'20px',fontWeight:'900',fontSize:'12px'}}>Tap to Request Blue Tick ✓</button>
)}
{n.type==='blue_tick_approved' && (
<div style={{marginTop:'10px',background:'#1D9BF0',color:'#fff',padding:'10px',borderRadius:'12px',textAlign:'center',fontWeight:'800',fontSize:'11px'}}>✓ You are verified! Blue tick on your name automatically! No more automatic prompts!</div>
)}
</div>
</div>
))
)
}
</div>
</div>
)}

{page==='search'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',alignItems:'center',gap:'8px'}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%'}}>‹</button>
<input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search old videos — Any person or video — Duet allowed" autoFocus style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'10px 14px',color:'#fff',fontSize:'13px'}}/>
</div>
<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{!searchQuery ? <div style={{textAlign:'center',marginTop:'40px'}}><div style={{fontSize:'30px'}}>🔍</div><div style={{fontSize:'12px',color:'#888',marginTop:'8px'}}>Search old videos here — For You shows only new videos — Old videos via search — Duet allowed — Delete anytime</div></div> :
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{searchFiltered.map(v=><div key={v.id} style={{width:'100%',height:'200px',position:'relative',background:'#111',borderRadius:'12px',overflow:'hidden'}}><div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div><div style={{position:'absolute',left:'10px',bottom:'10px'}}><div style={{fontSize:'11px',fontWeight:'700',display:'flex',alignItems:'center',gap:'4px'}}>{v.user} {v.verified && <span style={{width:'14px',height:'14px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div></div>{v.postedBy===user?.email && <button onClick={()=>handleDeleteVideo(v.id)} style={{position:'absolute',top:'8px',right:'8px',background:'rgba(255,0,36,0.8)',border:'none',color:'#fff',padding:'4px 8px',borderRadius:'12px',fontSize:'9px'}}>Delete</button>}</div>)}</div>
}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,overflowY:'auto',padding:'16px',background:'#000'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'14px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></div>
<div><div style={{fontWeight:'800',fontSize:'16px',display:'flex',alignItems:'center',gap:'6px'}}>{user?.name||'Guest'} {user?.verified && <span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'12px',color:'#888'}}>{user?.username||'@user'} • {user?.verified?'Verified ✓ — No more auto prompts':'Not verified — Will receive prompt 10th & 26th'}</div></div>
</div>
<div style={{marginTop:'16px',display:'flex',gap:'8px'}}>
<div style={{flex:1,background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px',textAlign:'center'}}><div style={{fontWeight:'800'}}>{posts.filter(p=>p.postedBy===user?.email).length}</div><div style={{fontSize:'9px',color:'#888'}}>My Videos — Delete anytime</div></div>
<div style={{flex:1,background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px',textAlign:'center'}}><div style={{fontWeight:'800'}}>{forYouFeed.length}</div><div style={{fontSize:'9px',color:'#888'}}>New on For You</div></div>
</div>
<div style={{marginTop:'12px',background:'#0a0a0a',border:'1px solid #333',borderRadius:'12px',padding:'10px'}}>
<div style={{fontSize:'10px',color:'#888'}}>✓ Upload & post anytime — Delete anytime — For You scroll down to up — New videos only on open — Old via search — Duet allowed — Blue tick 10th & 26th — Verified users no more prompts</div>
</div>
<div style={{marginTop:'12px'}}>
{posts.filter(p=>p.postedBy===user?.email).map(v=>(
<div key={v.id} style={{background:'#111',border:'1px solid #222',borderRadius:'12px',padding:'8px',marginBottom:'8px',display:'flex',gap:'8px',alignItems:'center'}}>
<div style={{width:'60px',height:'80px',background:'#000',borderRadius:'8px',overflow:'hidden'}}>{renderUniversal(v)}</div>
<div style={{flex:1}}><div style={{fontSize:'11px',fontWeight:'700'}}>{v.caption}</div><div style={{fontSize:'9px',color:'#888'}}>{new Date(v.postedAt).toLocaleString()} — Duet allowed</div></div>
<button onClick={()=>handleDeleteVideo(v.id)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:'700'}}>Delete</button>
</div>
))}
</div>
</div>
)}

{showComments!==null&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:60,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(null)}><div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'14px',maxHeight:'60vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div style={{fontWeight:'700'}}>Comments — Duet allowed</div><button onClick={()=>setShowComments(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>×</button></div><div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px'}}>{(comments[showComments]||[]).map(c=><div key={c.id} style={{display:'flex',gap:'8px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#333',display:'flex',alignItems:'center',justifyContent:'center'}}>U</div><div><div style={{fontSize:'11px',fontWeight:'700'}}>{c.user}</div><div style={{fontSize:'12px'}}>{c.text}</div></div></div>)}</div><div style={{display:'flex',gap:'8px',marginTop:'10px'}}><input value={commentInput} onChange={e=>{setComments(prev=>({...prev,[showComments]:[...(prev[showComments]||[]),{id:Date.now(),text:commentInput,user:user?.name}]})); setCommentCounts({...commentCounts,[showComments]:(commentCounts[showComments]||0)+1}); setCommentInput('')}} placeholder="Add comment — Duet allowed" style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'8px 12px',color:'#fff'}} onKeyDown={e=>{if(e.key==='Enter'){setComments(prev=>({...prev,[showComments]:[...(prev[showComments]||[]),{id:Date.now(),text:commentInput,user:user?.name}]})); setCommentCounts({...commentCounts,[showComments]:(commentCounts[showComments]||0)+1}); setCommentInput('')}}}/><button onClick={()=>{setComments(prev=>({...prev,[showComments]:[...(prev[showComments]||[]),{id:Date.now(),text:commentInput,user:user?.name}]})); setCommentCounts({...commentCounts,[showComments]:(commentCounts[showComments]||0)+1}); setCommentInput('')}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px'}}>Post</button></div></div></div>}
{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{pauseAllVideos(); setShowUpload(false); setUploadMode(null); setPostBtnState('green')}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px',maxHeight:'85vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
{uploadMode===null&&<>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'16px',marginBottom:'12px'}}>Upload — Post anytime — Delete anytime — Duet allowed</div>
<button onClick={()=>{setUploadMode('upload_video'); setPostBtnState('green')}} style={{width:'100%',background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'14px',fontWeight:'800',marginBottom:'10px'}}>📤 Upload Video — For You — New only</button>
<button onClick={()=>{setUploadMode('post_muzika'); setPostBtnState('green')}} style={{width:'100%',background:'#1a1a1a',border:'1px solid #00D632',color:'#fff',padding:'14px',borderRadius:'14px',fontWeight:'800'}}>🎬 Post Muzika — Only Official</button>
</>}
{uploadMode==='upload_video'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800'}}>📤 Upload — Anytime — Duet allowed</div></div>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'10px'}}><video src={uploadPreview.url} style={{width:'100%',maxHeight:'200px',borderRadius:'12px'}} autoPlay loop muted playsInline/></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — Duet allowed — New on For You" style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'10px',color:'#fff'}}/>
<input value={universalLink} onChange={e=>setUniversalLink(e.target.value)} placeholder="Or paste YouTube link — Any link" style={{marginTop:'8px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('upload_video')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#00D632':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>{postBtnState==='green'?'🟢 POST NOW — Green — New on For You':'⚪ POSTED ✓ — White'}</button>
<div style={{fontSize:'9px',color:'#666',marginTop:'8px',textAlign:'center'}}>✓ All videos go For You — Scroll down to up — New video — Open app only new — Old via search — Delete anytime</div>
</>}
{uploadMode==='post_muzika'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800'}}>🎬 Muzika — Only Official</div></div>
<input value={universalLink} onChange={e=>{setUniversalLink(e.target.value); setPostBtnState('green')}} placeholder="Paste YouTube link — One tap play" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('post_muzika')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#00D632':'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900'}}>{postBtnState==='green'?'🟢 POST MUZIKA — Official':'⚪ POSTED'}</button>
</>}
</div>
</div>
)}

<div style={{height:'64px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px'}}>Home — New</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('inbox'); const upd=notifications.map(n=>({...n,read:true})); setNotifications(upd); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd))}} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1,position:'relative'}}><span style={{fontSize:'18px'}}>✉</span><span style={{fontSize:'10px'}}>Inbox</span>{unread>0&&<span style={{position:'absolute',top:'0px',right:'10px',background:'#FF0024',color:'#fff',fontSize:'8px',padding:'2px 4px',borderRadius:'8px',fontWeight:'800'}}>{unread}</span>}</button>
<button onClick={()=>{pauseAllVideos(); setUploadMode(null); setShowUpload(true); setPostBtnState('green')}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900'}}> + </button>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:'none',border:'none',color:page==='live'?'#FF0024':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>🔴</span><span style={{fontSize:'10px'}}>Live</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('you')}} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>○</span><span style={{fontSize:'10px'}}>You</span></button>
</div>

{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'20px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'16px',fontWeight:'900',fontSize:'20px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#fff'}}>TOWN</span> — 978+</div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'12px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Your Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email — komenierashid@gmail.com = Official" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>Continue — Duet allowed — Delete anytime</button>
<div style={{fontSize:'9px',color:'#666',textAlign:'center'}}>✓ Upload anytime — Delete anytime — For You new only — Old via search — Blue tick 10th & 26th — Verified no auto prompts</div>
</div>
</div>
)}
</div>
)
}
