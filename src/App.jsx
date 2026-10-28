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
const [uploadText,setUploadText]=useState('')
const [universalLink,setUniversalLink]=useState('')
const [uploadPreview,setUploadPreview]=useState(null)
const [uploadBase64,setUploadBase64]=useState(null)
const [docFile,setDocFile]=useState(null)
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
const [viewProfile,setViewProfile]=useState(null)
const [profilePic,setProfilePic]=useState(null)
const [editName,setEditName]=useState('')
const [editBio,setEditBio]=useState('')
const [editUsername,setEditUsername]=useState('')
const [isEditing,setIsEditing]=useState(false)
const [youTab,setYouTab]=useState('videos')
const videoRefs=useRef({})

const officialVideos=[
{id:9001,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ Confidential Account — No one can check — Only owner', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type:'video', likes:15600, fires:520, comments:978, isOfficial:true, confidential:true},
]

const fetchPostsFromDB=async()=>{try{const r=await fetch('/api/posts').then(x=>x.json()).catch(()=>({posts:[]})); if(r.posts?.length) setPosts(r.posts)}catch{}}
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
else setNotifications([{id:1,from:'UPTOWN Official',verified:true,type:'welcome',forEmail:null,title:'Welcome ✓',message:'UPTOWN keeps your account — Login on any phone — Follow & Like will boost your account — You can post videos, text, documents — Edit profile — Delete anytime — Duet allowed',time:'2m ago',read:false}])
fetchPostsFromDB()
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su)
setUser(u); setIsOwner(u.email===OWNER_EMAIL); setEditName(u.name||''); setEditUsername(u.username||''); setEditBio(sBio||'Porn/Sex not allowed — 5 min auto remove — Repeat 7 days ban')
checkBlueTickPrompt(u)
}
},1500)
return()=>clearTimeout(t)
},[])

const checkBlueTickPrompt=(cu)=>{
if(!cu || cu.verified) return
const today=new Date()
const day=today.getDate()
if(day!==10 && day!==26) return
const key=`blue_prompt_${today.getFullYear()}_${today.getMonth()}_${day}_${cu.email}`
if(localStorage.getItem(key)) return
const notif={id:Date.now(),from:'UPTOWN Official',username:'@uptown',verified:true,type:'blue_tick_prompt',forEmail:cu.email,title:'Get Verified ✓ — Blue Tick?',message:'UPTOWN Official is asking if you want blue tick ✓ — Tap to request',time:'now',read:false,action:'request_blue_tick'}
setNotifications(prev=>{const upd=[notif,...prev]; localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd)); return upd})
localStorage.setItem(key,'sent')
}

const pauseAllVideos=()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()})}
useEffect(()=>{pauseAllVideos()},[page,showUpload,showComments,viewProfile])

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
},[page,posts,searchQuery,viewProfile])

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
const nu={id:Date.now(),name:isOfficial?OWNER_NAME:authForm.name,username:isOfficial?OWNER_USERNAME:'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficial,bio:'New user — Edit profile — Duet allowed',profilePic:null,boost:0}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified,bio:nu.bio,profilePic:null}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_users_db',JSON.stringify(db))
setUser(lu); setIsOwner(isOfficial); setShowAuth(false); checkBlueTickPrompt(lu)
setBlockedMsg('✓ Account saved — UPTOWN keeps records — Login on any phone anytime'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found && email!==OWNER_EMAIL){setBlockedMsg('No account — Sign up first — UPTOWN keeps records'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
const isOfficial=email===OWNER_EMAIL
const lu=isOfficial?{name:OWNER_NAME,username:OWNER_USERNAME,email,verified:true,bio:'UPTOWN Official — Confidential',profilePic:null}:{name:found.name,username:found.username,email,verified:found.verified,bio:found.bio,profilePic:found.profilePic}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false); checkBlueTickPrompt(lu)
if(found?.profilePic) setProfilePic(found.profilePic)
if(found?.bio) setEditBio(found.bio)
}
}

const handleFollow=(username)=>{
const isF=follows[username]==='following'
const nf={...follows,[username]:isF?'follow':'following'}
setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))
// BOOST ACCOUNT — LIKE & FOLLOW BOOSTS
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
db=db.map(u=> u.username===username ? {...u, boost:(u.boost||0)+(isF?-1:1)} : u)
localStorage.setItem('uptown_users_db',JSON.stringify(db))
setBlockedMsg(isF?'Unfollowed':'✓ Following — Boosts his account!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)
}
const handleLike=(id, targetUsername)=>{
const nl={...likes,[id]:!likes[id]}
setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))
// BOOST ACCOUNT — LIKE BOOSTS ACCOUNT
if(nl[id] && targetUsername){
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
db=db.map(u=> u.username===targetUsername ? {...u, boost:(u.boost||0)+1} : u)
localStorage.setItem('uptown_users_db',JSON.stringify(db))
}
}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf)); setBlockedMsg(nf[id]?'★ Favorited — Check You > Favorites':'★ Removed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}
const handleShare=async(v)=>{try{await navigator.clipboard.writeText(v.mediaUrl||v.text||'UPTOWN Post'); setBlockedMsg('Link copied'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}catch{}}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused) v.play(); else v.pause()}
const handleFileChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; if(f.type.startsWith('image/')){const r=new FileReader(); r.onload=(ev)=>{setProfilePic(ev.target.result); localStorage.setItem('uptown_profile_pic',ev.target.result)}; r.readAsDataURL(f); return} const u=URL.createObjectURL(f); setUploadPreview({url:u,type:f.type}); setPostBtnState('green'); const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f); if(f.type.includes('pdf')||f.type.includes('doc')) setDocFile(f.name)}
const handleProfilePicChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{setProfilePic(ev.target.result); localStorage.setItem('uptown_profile_pic',ev.target.result); let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]'); db=db.map(u=> u.email===user.email ? {...u, profilePic:ev.target.result} : u); localStorage.setItem('uptown_users_db',JSON.stringify(db)); setBlockedMsg('✓ Profile picture updated'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)}; r.readAsDataURL(f)}

const handleRequestBlueTick=(notif)=>{
const req={id:Date.now(), email:user.email, name:user.name, username:user.username, status:'pending', requestedAt:Date.now()}
const newReqs=[req, ...blueTickRequests]; setBlueTickRequests(newReqs); localStorage.setItem('uptown_blue_requests',JSON.stringify(newReqs))
const ownerNotif={id:Date.now()+1,from:user.name,username:user.username,verified:false,type:'blue_tick_request_received',forEmail:OWNER_EMAIL,title:'Blue Tick Request ✓',message:`${user.name} ${user.username} requested blue tick — Tap to verify`,time:'now',read:false,requestId:req.id,requesterEmail:req.email}
const upd=[ownerNotif, ...notifications]; setNotifications(upd); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd))
const updated=notifications.map(n=> n.id===notif.id ? {...n, title:'Request Sent ✓', message:'Request sent to UPTOWN Official — Wait for approval', action:null} : n)
setNotifications(updated); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(updated))
setBlockedMsg('✓ Request sent to UPTOWN Official'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)
}
const handleApproveRequest=(req)=>{
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]'); db=db.map(u=> u.email===req.email ? {...u, verified:true} : u); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const updatedReqs=blueTickRequests.map(r=> r.id===req.id ? {...r, status:'approved'} : r); setBlueTickRequests(updatedReqs); localStorage.setItem('uptown_blue_requests',JSON.stringify(updatedReqs))
const congrats={id:Date.now(),from:'UPTOWN Official',username:'@uptown',verified:true,type:'blue_tick_approved',forEmail:req.email,title:'Congrats! Verified ✓ Blue Tick!',message:`Congrats ${req.name}! You have been verified ✓ Blue tick on your name automatically! No more auto prompts.`,time:'now',read:false}
const upd=[congrats, ...notifications]; setNotifications(upd); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd))
if(user && user.email===req.email){const newUser={...user, verified:true}; setUser(newUser); localStorage.setItem('uptown_user',JSON.stringify(newUser))}
setBlockedMsg(`✓ ${req.name} verified!`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)
}

const handlePostNow=(mode)=>{
const fm=mode||uploadMode
if(fm==='post_muzika' && !isOwner){setBlockedMsg('Muzika Only Official'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
let mu=uploadBase64 || uploadPreview?.url || universalLink || null
let li=universalLink ? parseLink(universalLink) : null
let textContent=uploadText.trim()
let type='video'
if(textContent && !mu) type='text'
else if(docFile || (mu && uploadPreview?.type?.includes('pdf'))) type='document'
else if(li?.type==='youtube' || fm==='post_muzika') type='video'
if(!mu && !textContent){setBlockedMsg('Write text or upload video/document'); setShowBlocked(true); return}
setPostBtnState('white')
const np={
id:Date.now(),
user:user?.name||'User',
username:user?.username||'@user',
verified:user?.verified||false,
caption:uploadCaption||textContent||'New post ✓ Duet allowed — Text/Doc/Video',
text:textContent||null,
mediaUrl:mu,
docName:docFile||null,
linkInfo:li,
type:type,
isMuzika:fm==='post_muzika',
isLive:isLive,
likes:0,fires:520,
views:Math.floor(Math.random()*5000)+100,
postedBy:user?.email,
postedAt:Date.now(),
profilePic:profilePic
}
const nposts=[np, ...posts]; savePostsToDB(nposts)
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUploadText(''); setUniversalLink(''); setDocFile(null); setShowUpload(false); setUploadMode(null); setIsLive(false)
setBlockedMsg(`✓ Posted ${type} — For You — Scroll down to up — New video`); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage('foryou'); setPostBtnState('green')},800)
}

const handleDeleteVideo=(id)=>{if(!confirm('Delete? You can post anytime — Delete anytime — Keep account')) return; const filtered=posts.filter(p=>p.id!==id); savePostsToDB(filtered); setBlockedMsg('Deleted — Post anytime again'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)}
const handleDuet=(v)=>{setBlockedMsg(`Duet with ${v.user} ✓ Duet allowed`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); setUploadMode('upload_video'); setShowUpload(true); setUploadCaption(`Duet with ${v.username}`)}
const handleSaveProfile=()=>{
if(!user) return
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
db=db.map(u=> u.email===user.email ? {...u, name:editName, username:editUsername, bio:editBio, profilePic:profilePic} : u)
localStorage.setItem('uptown_users_db',JSON.stringify(db))
const newUser={...user, name:editName, username:editUsername, bio:editBio, profilePic:profilePic}
setUser(newUser); localStorage.setItem('uptown_user',JSON.stringify(newUser)); localStorage.setItem('uptown_bio',editBio)
setIsEditing(false); setBlockedMsg('✓ Profile saved — Bio, Name, Pic updated — Account kept'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)
}

const openUserProfile=(username)=>{
if(username==='@uptown' || username.toLowerCase().includes('uptown')){
setBlockedMsg('🔒 UPTOWN Official account is confidential — No one allowed to check — Only owner'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return
}
const db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
const found=db.find(u=> u.username===username)
if(found){
setViewProfile(found)
}else{
setViewProfile({username, name:username.replace('@',''), bio:'User of UPTOWN — Follow & Like will boost account', profilePic:null, verified:false, boost:0})
}
setPage('viewprofile')
}

if(splash){
return(<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="140" height="170" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>)
}

const allVideos=[...posts, ...officialVideos].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const lastSeenPrev=parseInt(localStorage.getItem('uptown_last_seen_prev')||'0')
const forYouFeed=allVideos.filter(v=>{ if(v.isOfficial) return true; if(!lastSeenPrev) return true; return (v.postedAt||0) > lastSeenPrev || Date.now()-(v.postedAt||0) < 3*24*60*60*1000 }).sort((a,b)=>(b.boost||0)-(a.boost||0) || (b.postedAt||b.id)-(a.postedAt||a.id))
const searchFiltered=allVideos.filter(v=>{ if(!searchQuery) return false; const q=searchQuery.toLowerCase(); return (v.user?.toLowerCase().includes(q) || v.username?.toLowerCase().includes(q) || v.caption?.toLowerCase().includes(q) || v.text?.toLowerCase().includes(q)) })

const renderUniversal=(v)=>{
const info=v.linkInfo || parseLink(v.mediaUrl)
if(v.type==='text'){
return <div style={{width:'100%',height:'100%',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}><div style={{background:'#1a1a1a',border:'1px solid #333',borderRadius:'16px',padding:'16px',maxWidth:'90%',fontSize:'15px',lineHeight:'1.4',textAlign:'center'}}>{v.text || v.caption}</div></div>
}
if(v.type==='document'){
return <div style={{width:'100%',height:'100%',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'10px'}}><div style={{fontSize:'40px'}}>📄</div><div style={{background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',fontSize:'12px'}}>{v.docName || 'Document'} — Tap to open</div><div style={{fontSize:'11px',color:'#888'}}>{v.caption}</div></div>
}
if(!info) return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
if(info.type==='youtube') return <iframe width="100%" height="100%" src={info.embed} allow="autoplay; encrypted-media" allowFullScreen style={{width:'100%',height:'100%',border:'none'}}/>
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={info.embed} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#000'}}/>
}

const myNotifications=notifications.filter(n=> !n.forEmail || n.forEmail===user?.email || (isOwner && n.forEmail===OWNER_EMAIL))
const ownerRequests=blueTickRequests.filter(r=> r.status==='pending')
const unread=myNotifications.filter(n=>!n.read && (n.forEmail===user?.email || !n.forEmail || (isOwner && n.forEmail===OWNER_EMAIL))).length
const myVideos=posts.filter(p=>p.postedBy===user?.email)
const favVideos=allVideos.filter(v=> favorites[v.id])

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
<div style={{height:'32px',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'11px',color:'#00D632',fontWeight:'700'}}>● For You — Only New Videos — Scroll down to up — Duet allowed — Text/Doc/Video — Delete anytime</span></div>
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
{isMine && <button onClick={()=>handleDeleteVideo(v.id)} style={{background:'rgba(255,0,36,0.8)',border:'none',color:'#fff',padding:'4px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'700'}}>🗑️ Delete</button>}
{v.type && <span style={{background:'rgba(0,0,0,0.6)',border:'1px solid #333',color:'#fff',padding:'4px 8px',borderRadius:'20px',fontSize:'9px'}}>{v.type==='text'?'📝 Text': v.type==='document'?'📄 Doc':'🎬 Video'}</span>}
</div>

<div style={{position:'absolute',right:'10px',top:'38%',transform:'translateY(-50%)',zIndex:3,display:'flex',flexDirection:'column',gap:'12px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{position:'relative',width:'54px',height:'62px',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'50px',height:'50px',borderRadius:'50%',background:v.profilePic?`url(${v.profilePic})`:'#fff',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #fff'}}>{!v.profilePic && <span style={{fontWeight:'900',fontSize:'11px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></span>}</div>
<button onClick={()=>handleFollow(v.username)} style={{position:'absolute',bottom:'12px',left:'50%',transform:'translateX(-50%)',width:'22px',height:'22px',borderRadius:'50%',background:isFollowing?'#00D632':'#FF0024',border:'2px solid #000',color:'#fff',fontWeight:'900'}}>{isFollowing?'✓':'+'}</button>
<div style={{marginTop:'6px',fontSize:'11px',fontWeight:'700',color:'#fff'}}>{isFollowing?'Following':'Follow'}</div>
</div>
<button onClick={()=>handleLike(v.id, v.username)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'24px'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div><div style={{fontSize:'11px'}}>{isLiked? (v.likes+1) : '15600'}</div><div style={{fontSize:'8px',color:'#00D632'}}>Boosts account</div></button>
<button onClick={()=>handleComment(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>💬</div><div style={{fontSize:'11px'}}>{commentCounts[v.id]||978}</div></button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div>→</div><div style={{fontSize:'11px'}}>Share</div></button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',color:favorites[v.id]?'#FFD700':'#888',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'20px'}}>★</div><div style={{fontSize:'9px'}}>Fav</div></button>
<button onClick={()=>handleDuet(v)} style={{background:'#1a1a1a',border:'1px solid #00D632',width:'36px',height:'36px',borderRadius:'50%',color:'#00D632',fontSize:'10px',fontWeight:'800'}}>Duet</button>
<button onClick={()=>handleFire(v.id)} style={{background:isFired?'#FF6A00':'#1a1a1a',border:'1px solid #333',width:'38px',height:'38px',borderRadius:'50%',color:'#fff'}}><span style={{fontSize:'18px'}}>🔥</span><div style={{fontSize:'8px'}}>{isFired? (v.fires+1) : 520}</div></button>
</div>

<div style={{position:'absolute',left:'12px',right:'78px',bottom:'28px',zIndex:2,pointerEvents:'none',display:'flex',flexDirection:'column',gap:'5px',maxWidth:'78%'}}>
<div style={{display:'flex',alignItems:'center',gap:'6px'}}>
<button onClick={()=>openUserProfile(v.username)} style={{background:'none',border:'none',fontWeight:'900',fontSize:'16px',color:'#fff',textShadow:'0 1px 4px rgba(0,0,0,0.9)',pointerEvents:'auto'}}>{v.user}</button>
{v.verified && <span style={{width:'18px',height:'18px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
<span style={{fontSize:'11px',color:'#ddd'}}>{v.username}</span>
</div>
<div style={{fontSize:'13px',color:'#fff',textShadow:'0 1px 3px rgba(0,0,0,0.9)'}}>{v.caption} {v.text && `— ${v.text.slice(0,60)}`}</div>
<div style={{fontSize:'11px',color:'#fff',opacity:0.9}}>♪ UPTOWN • Tap name to check account • Duet allowed • Delete anytime • Boost: {(JSON.parse(localStorage.getItem('uptown_users_db')||'[]').find(u=>u.username===v.username)?.boost||0)} likes</div>
</div>
</div>
)})}
</div>
)}

{page==='viewprofile'&& viewProfile &&(
<div style={{flex:1,overflowY:'auto',background:'#000'}}>
<div style={{padding:'16px'}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%',marginBottom:'12px'}}>‹ Back</button>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{width:'80px',height:'80px',borderRadius:'50%',background:viewProfile.profilePic?`url(${viewProfile.profilePic})`:'#fff',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',border:'2px solid #333'}}>{!viewProfile.profilePic && <span style={{color:'#FF0024'}}>UP</span>}</div>
<div>
<div style={{fontWeight:'800',fontSize:'18px',display:'flex',alignItems:'center',gap:'6px'}}>{viewProfile.name||viewProfile.username} {viewProfile.verified && <span style={{width:'18px',height:'18px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'12px',color:'#888'}}>{viewProfile.username} • Boost: {viewProfile.boost||0} • Likes boost account</div>
<div style={{fontSize:'11px',color:'#aaa',marginTop:'4px',maxWidth:'200px'}}>{viewProfile.bio||'User of UPTOWN — Duet allowed — Good arrangement'}</div>
</div>
</div>
<div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
<button onClick={()=>handleFollow(viewProfile.username)} style={{flex:1,background:follows[viewProfile.username]==='following'?'#00D632':'#fff',color:'#000',border:'none',padding:'10px',borderRadius:'20px',fontWeight:'800'}}>{follows[viewProfile.username]==='following'?'✓ Following — Boosts':'Follow — Boost account'}</button>
<button onClick={()=>handleDuet({user:viewProfile.name, username:viewProfile.username})} style={{background:'#1a1a1a',border:'1px solid #00D632',color:'#00D632',padding:'10px 16px',borderRadius:'20px',fontWeight:'700'}}>Duet</button>
</div>
</div>
<div style={{padding:'0 12px 20px'}}>
<div style={{fontWeight:'700',fontSize:'13px',marginBottom:'10px'}}>Good arrangement — Videos — Text — Documents — Duet allowed — Delete anytime</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px'}}>
{allVideos.filter(v=> v.username===viewProfile.username).map(v=>(
<div key={v.id} style={{aspectRatio:'9/12',background:'#111',borderRadius:'8px',overflow:'hidden',position:'relative'}}>
{renderUniversal(v)}
<div style={{position:'absolute',bottom:'4px',left:'4px',fontSize:'8px',background:'rgba(0,0,0,0.6)',padding:'2px 4px',borderRadius:'6px'}}>{v.type==='text'?'📝': v.type==='document'?'📄':'▶'} {v.likes||0}</div>
</div>
))}
</div>
{allVideos.filter(v=> v.username===viewProfile.username).length===0 && <div style={{textAlign:'center',color:'#666',marginTop:'20px',fontSize:'12px'}}>No posts yet — User can post videos, text, documents anytime</div>}
</div>
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{padding:'10px 12px',borderBottom:'1px solid #1a1a1a'}}>
<div style={{fontWeight:'800',fontSize:'14px'}}>Inbox — Blue Tick 10th & 26th — Verified no auto prompts</div>
{isOwner && (
<div style={{display:'flex',gap:'8px',marginTop:'10px'}}>
<button onClick={()=>setInboxTab('notifications')} style={{background:inboxTab==='notifications'?'#fff':'#1a1a1a',color:inboxTab==='notifications'?'#000':'#888',border:'none',padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Notifications</button>
<button onClick={()=>setInboxTab('requests')} style={{background:inboxTab==='requests'?'#1D9BF0':'#1a1a1a',color:inboxTab==='requests'?'#fff':'#888',border:'none',padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'800'}}>Requests {ownerRequests.length?`(${ownerRequests.length})`:''}</button>
</div>
)}
</div>
<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{isOwner && inboxTab==='requests' ? (
ownerRequests.map(req=>(
<div key={req.id} style={{background:'#0a1a2a',border:'1px solid #1D9BF0',borderRadius:'14px',padding:'12px',marginBottom:'10px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontWeight:'800',fontSize:'13px'}}>{req.name} {req.username}</div><div style={{fontSize:'10px',color:'#aaa'}}>{req.email}</div></div>
<button onClick={()=>handleApproveRequest(req)} style={{background:'#1D9BF0',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontWeight:'900'}}>Approve ✓</button>
</div>
</div>
))
) : (
myNotifications.map(n=>(
<div key={n.id} style={{background:n.type==='blue_tick_prompt'?'#0a2a0a': n.type==='blue_tick_approved'?'#0a2a1a' : '#111', border:'1px solid '+(n.type==='blue_tick_prompt'?'#00D632':'#222'), borderRadius:'14px',padding:'12px',marginBottom:'10px'}}>
<div style={{fontWeight:'800',fontSize:'12px'}}>{n.title}</div>
<div style={{fontSize:'11px',color:'#aaa',marginTop:'4px'}}>{n.message}</div>
{n.action==='request_blue_tick' && <button onClick={()=>handleRequestBlueTick(n)} style={{width:'100%',marginTop:'10px',background:'#00D632',color:'#000',border:'none',padding:'12px',borderRadius:'20px',fontWeight:'900'}}>Tap to Request Blue Tick ✓</button>}
</div>
))
)}
</div>
</div>
)}

{page==='search'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',alignItems:'center',gap:'8px'}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%'}}>‹</button>
<input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search old videos — Any person or video — Text/Doc/Video — Duet allowed" autoFocus style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'10px 14px',color:'#fff',fontSize:'13px'}}/>
</div>
<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{!searchQuery ? <div style={{textAlign:'center',marginTop:'40px',color:'#666',fontSize:'12px'}}>Search old videos — For You shows only new — Old via search — Everyone allowed to check accounts except UPTOWN Official confidential</div> :
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{searchFiltered.map(v=><div key={v.id} style={{width:'100%',height:'200px',position:'relative',background:'#111',borderRadius:'12px',overflow:'hidden'}}><div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div><div style={{position:'absolute',left:'10px',bottom:'10px'}}><button onClick={()=>openUserProfile(v.username)} style={{background:'rgba(0,0,0,0.6)',border:'none',color:'#fff',fontSize:'11px',fontWeight:'700'}}>{v.user} {v.verified && '✓'} — Tap to check account</button></div></div>)}</div>
}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,overflowY:'auto',background:'#000'}}>
<div style={{padding:'16px'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{position:'relative'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:profilePic?`url(${profilePic})`:'#fff',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',border:'2px solid #333'}}>{!profilePic && <span><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></span>}</div>
<label style={{position:'absolute',bottom:'-4px',right:'-4px',width:'24px',height:'24px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #000',fontSize:'10px',cursor:'pointer'}}>📷<input type="file" accept="image/*" onChange={handleProfilePicChange} style={{display:'none'}}/></label>
</div>
<div>
<div style={{fontWeight:'800',fontSize:'16px',display:'flex',alignItems:'center',gap:'6px'}}>{user?.name||'Guest'} {user?.verified && <span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'12px',color:'#888'}}>{user?.username||'@user'} • Boost: {(JSON.parse(localStorage.getItem('uptown_users_db')||'[]').find(u=>u.email===user?.email)?.boost||0)} • Follow & Like boost account</div>
<div style={{fontSize:'11px',color:'#aaa',marginTop:'2px'}}>{editBio}</div>
</div>
<div style={{marginLeft:'auto'}}><button onClick={()=>setIsEditing(!isEditing)} style={{background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'6px 14px',borderRadius:'20px',fontSize:'11px'}}>Edit</button></div>
</div>

{isEditing && (
<div style={{marginTop:'12px',background:'#121212',borderRadius:'12px',padding:'12px'}}>
<div style={{fontSize:'11px',fontWeight:'700',marginBottom:'8px'}}>Edit Profile — Profile picture, Bio, Names, Delete videos, Favorites — UPTOWN keeps records</div>
<input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Change name" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'8px',padding:'8px',color:'#fff',marginBottom:'8px'}}/>
<input value={editUsername} onChange={e=>setEditUsername(e.target.value)} placeholder="Change username" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'8px',padding:'8px',color:'#fff',marginBottom:'8px'}}/>
<input value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Change Bio" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'8px',padding:'8px',color:'#fff',marginBottom:'8px'}}/>
<button onClick={handleSaveProfile} style={{width:'100%',background:'#00D632',color:'#000',border:'none',padding:'10px',borderRadius:'20px',fontWeight:'900'}}>Save — Keep account on any phone</button>
</div>
)}

<div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
<button onClick={()=>setYouTab('videos')} style={{flex:1,background:youTab==='videos'?'#fff':'#1a1a1a',color:youTab==='videos'?'#000':'#888',border:'none',padding:'8px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Videos — Good arrangement</button>
<button onClick={()=>setYouTab('favorites')} style={{flex:1,background:youTab==='favorites'?'#FFD700':'#1a1a1a',color:youTab==='favorites'?'#000':'#888',border:'none',padding:'8px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>★ Favorites</button>
<button onClick={()=>setYouTab('text')} style={{flex:1,background:youTab==='text'?'#1D9BF0':'#1a1a1a',color:youTab==='text'?'#fff':'#888',border:'none',padding:'8px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Text/Docs</button>
</div>
</div>

<div style={{padding:'0 12px 20px'}}>
{youTab==='videos' && (
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px'}}>
{myVideos.filter(v=> v.type!=='text' && v.type!=='document').map(v=>(
<div key={v.id} style={{aspectRatio:'9/12',background:'#111',borderRadius:'8px',overflow:'hidden',position:'relative'}}>
{renderUniversal(v)}
<button onClick={()=>handleDeleteVideo(v.id)} style={{position:'absolute',top:'4px',right:'4px',background:'rgba(255,0,36,0.8)',border:'none',color:'#fff',padding:'2px 6px',borderRadius:'10px',fontSize:'8px'}}>Delete</button>
</div>
))}
</div>
)}
{youTab==='favorites' && (
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px'}}>
{favVideos.map(v=>(
<div key={v.id} style={{aspectRatio:'9/12',background:'#111',borderRadius:'8px',overflow:'hidden',position:'relative'}}>
{renderUniversal(v)}
</div>
))}
</div>
)}
{youTab==='text' && (
<div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
{myVideos.filter(v=> v.type==='text' || v.type==='document').map(v=>(
<div key={v.id} style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontSize:'12px',fontWeight:'700'}}>{v.type==='text'?'📝 Text Message':'📄 Document'}</div><div style={{fontSize:'11px',color:'#aaa',marginTop:'2px'}}>{v.text||v.caption}</div></div>
<button onClick={()=>handleDeleteVideo(v.id)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'10px'}}>Delete</button>
</div>
))}
</div>
)}
</div>
</div>
)}

{showComments!==null&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:60,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(null)}><div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'14px',maxHeight:'60vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div style={{fontWeight:'700'}}>Comments — Like boosts account</div><button onClick={()=>setShowComments(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>×</button></div><div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px'}}>{(comments[showComments]||[]).map(c=><div key={c.id} style={{display:'flex',gap:'8px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#333',display:'flex',alignItems:'center',justifyContent:'center'}}>U</div><div><div style={{fontSize:'11px',fontWeight:'700'}}>{c.user}</div><div style={{fontSize:'12px'}}>{c.text}</div></div></div>)}</div><div style={{display:'flex',gap:'8px',marginTop:'10px'}}><input value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder="Comment — Like boosts account" style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'8px 12px',color:'#fff'}}/><button onClick={()=>{setComments(prev=>({...prev,[showComments]:[...(prev[showComments]||[]),{id:Date.now(),text:commentInput,user:user?.name}]})); setCommentCounts({...commentCounts,[showComments]:(commentCounts[showComments]||0)+1}); setCommentInput('')}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px'}}>Post</button></div></div></div>}
{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{pauseAllVideos(); setShowUpload(false); setUploadMode(null); setPostBtnState('green')}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px',maxHeight:'85vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
{uploadMode===null&&<>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'16px',marginBottom:'12px'}}>Post — Video, Text, Document — Anytime — Delete anytime</div>
<button onClick={()=>{setUploadMode('upload_video'); setPostBtnState('green')}} style={{width:'100%',background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'14px',fontWeight:'800',marginBottom:'10px'}}>📤 Video — For You — New only — Duet allowed</button>
<button onClick={()=>{setUploadMode('upload_text'); setPostBtnState('green')}} style={{width:'100%',background:'#1a1a1a',border:'1px solid #1D9BF0',color:'#fff',padding:'14px',borderRadius:'14px',fontWeight:'800',marginBottom:'10px'}}>📝 Written Message — For You — Text post</button>
<button onClick={()=>{setUploadMode('upload_doc'); setPostBtnState('green')}} style={{width:'100%',background:'#1a1a1a',border:'1px solid #FFD700',color:'#fff',padding:'14px',borderRadius:'14px',fontWeight:'800',marginBottom:'10px'}}>📄 Document — For You — PDF/Doc</button>
<button onClick={()=>{setUploadMode('post_muzika'); setPostBtnState('green')}} style={{width:'100%',background:'#1a1a1a',border:'1px solid #00D632',color:'#fff',padding:'14px',borderRadius:'14px',fontWeight:'800'}}>🎬 Muzika — Only Official — YouTube</button>
</>}
{uploadMode==='upload_video'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800'}}>📤 Video — Anytime — Boosts account</div></div>
<input type="file" accept="video/*,image/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'10px'}}><video src={uploadPreview.url} style={{width:'100%',maxHeight:'200px',borderRadius:'12px'}} autoPlay loop muted playsInline/></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — Like will boost your account" style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('upload_video')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#00D632':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>{postBtnState==='green'?'🟢 POST VIDEO — Green':'⚪ POSTED'}</button>
</>}
{uploadMode==='upload_text'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800'}}>📝 Written Message — For You — Not only videos</div></div>
<textarea value={uploadText} onChange={e=>setUploadText(e.target.value)} placeholder="Write message — As long as you are user of UPTOWN — Post on For You — Duet allowed" style={{width:'100%',height:'120px',background:'#000',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — Optional" style={{marginTop:'8px',width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('upload_text')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#1D9BF0':'#fff',color:postBtnState==='green'?'#fff':'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>{postBtnState==='green'?'🟢 POST TEXT MESSAGE — For You':'⚪ POSTED'}</button>
<div style={{fontSize:'9px',color:'#666',marginTop:'6px',textAlign:'center'}}>✓ People can post written messages on For You not only videos — As long as he is user</div>
</>}
{uploadMode==='upload_doc'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800'}}>📄 Document — For You — PDF/Word</div></div>
<input type="file" accept=".pdf,.doc,.docx,.txt,.ppt" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
{docFile && <div style={{marginTop:'8px',fontSize:'11px',color:'#FFD700'}}>Selected: {docFile}</div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption for document" style={{marginTop:'8px',width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('upload_doc')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#FFD700':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>{postBtnState==='green'?'🟢 POST DOCUMENT — For You':'⚪ POSTED'}</button>
</>}
{uploadMode==='post_muzika'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800'}}>🎬 Muzika — Only Official</div></div>
<input value={universalLink} onChange={e=>{setUniversalLink(e.target.value); setPostBtnState('green')}} placeholder="YouTube link — One tap play" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('post_muzika')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#00D632':'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900'}}>🟢 POST MUZIKA</button>
</>}
</div>
</div>
)}

<div style={{height:'64px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px'}}>Home — New</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('inbox'); const upd=notifications.map(n=>({...n,read:true})); setNotifications(upd); localStorage.setItem('uptown_notifications_final_v5',JSON.stringify(upd))}} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1,position:'relative'}}><span style={{fontSize:'18px'}}>✉</span><span style={{fontSize:'10px'}}>Inbox</span>{unread>0&&<span style={{position:'absolute',top:'0px',right:'10px',background:'#FF0024',color:'#fff',fontSize:'8px',padding:'2px 4px',borderRadius:'8px',fontWeight:'800'}}>{unread}</span>}</button>
<button onClick={()=>{pauseAllVideos(); setUploadMode(null); setShowUpload(true); setPostBtnState('green')}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900'}}> + </button>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:'none',border:'none',color:page==='live'?'#FF0024':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>🔴</span><span style={{fontSize:'10px'}}>Live</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('you')}} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>○</span><span style={{fontSize:'10px'}}>You — Edit</span></button>
</div>

{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'20px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'16px',fontWeight:'900',fontSize:'20px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#fff'}}>TOWN</span> — Keep accounts — Login any phone</div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'12px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Sign Up — Keep records</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Login — Any phone</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Your Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email — UPTOWN keeps records — Any phone login" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password — Keep account" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>Continue — Follow & Like boost account</button>
<div style={{fontSize:'9px',color:'#666',textAlign:'center'}}>✓ UPTOWN keeps records — Any other phone just login — Following & Like boost your account — Post videos, text, documents — Edit profile — Delete anytime — Duet allowed</div>
</div>
</div>
)}
</div>
)
}
