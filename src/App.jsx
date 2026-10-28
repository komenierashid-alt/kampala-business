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
const [uploadMode,setUploadMode]=useState(null)
const [uploadCaption,setUploadCaption]=useState('')
const [universalLink,setUniversalLink]=useState('')
const [uploadPreview,setUploadPreview]=useState(null)
const [uploadBase64,setUploadBase64]=useState(null)
const [follows,setFollows]=useState({})
const [followCounts,setFollowCounts]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [comments,setComments]=useState({})
const [commentCounts,setCommentCounts]=useState({})
const [showComments,setShowComments]=useState(null)
const [commentInput,setCommentInput]=useState('')
const [posts,setPosts]=useState([])
const [pausedMap,setPausedMap]=useState({})
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [notifications,setNotifications]=useState([])
const [verificationRequests,setVerificationRequests]=useState([])
const [profilePic,setProfilePic]=useState(null)
const [editName,setEditName]=useState('')
const [editBio,setEditBio]=useState('')
const [editUsername,setEditUsername]=useState('')
const [isEditing,setIsEditing]=useState(false)
const [isBanned,setIsBanned]=useState(false)
const [banInfo,setBanInfo]=useState(null)
const [postBtnState,setPostBtnState]=useState('green')
const [deferredPrompt,setDeferredPrompt]=useState(null)
const [isInstallable,setIsInstallable]=useState(false)
const [isInstalled,setIsInstalled]=useState(false)
const [showStorePanel,setShowStorePanel]=useState(false)
const [blockedUsers,setBlockedUsers]=useState({})
const [reportedVideos,setReportedVideos]=useState({})
const [searchQuery,setSearchQuery]=useState('')
const [isLive,setIsLive]=useState(false)
const videoRefs=useRef({})

const officialVideos=[
{id:9001,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ 978+ Family', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video', likes:15600, fires:520, comments:978, views:45200, isOfficial:true},
{id:9002,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video', likes:12400, fires:340, comments:0, views:32100, isOfficial:true},
]

// DATABASE ONLY FOR POSTS - REMOVED LOCAL STORAGE - EVERYONE SEES SAME
const fetchPostsFromDB=async()=>{
try{
const res=await fetch('/api/posts').then(r=>r.json()).catch(()=>({posts:[]}))
if(res.posts && res.posts.length>0) setPosts(res.posts)
}catch(e){}
}
const savePostsToDB=async(newPosts)=>{
setPosts(newPosts)
try{ await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({posts:newPosts})}) }catch(e){}
}

useEffect(()=>{
const t=setTimeout(()=>{
setSplash(false)
// STILL KEEP USER LOGIN LOCAL BUT POSTS FROM DB - AS YOU ASKED
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sFC=localStorage.getItem('uptown_follow_counts')
const sL=localStorage.getItem('uptown_likes_v2')
const sFav=localStorage.getItem('uptown_fav_v3')
const sC=localStorage.getItem('uptown_comments_v1')
const sNot=localStorage.getItem('uptown_notifications_final_verified')
const sReq=localStorage.getItem('uptown_verification_requests')
const sPic=localStorage.getItem('uptown_profile_pic')
const sBio=localStorage.getItem('uptown_bio')
const sBlock=localStorage.getItem('uptown_blocked_users')
const sReport=localStorage.getItem('uptown_reported_videos')
if(sF) setFollows(JSON.parse(sF))
if(sFC) setFollowCounts(JSON.parse(sFC))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
if(sC) setCommentCounts(JSON.parse(sC))
if(sReq) setVerificationRequests(JSON.parse(sReq))
if(sPic) setProfilePic(sPic)
if(sBio) setEditBio(sBio)
if(sBlock) setBlockedUsers(JSON.parse(sBlock))
if(sReport) setReportedVideos(JSON.parse(sReport))
let nots=[]
if(sNot) nots=JSON.parse(sNot)
else nots=[{id:1,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'2m ago',title:'Welcome ✓',message:'Welcome to UPTOWN ✓ 978+ Family — Everyone on For You!'}]
fetchPostsFromDB() // <-- DATABASE NOT LOCAL
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su)
setUser(u)
setEditName(u.name||'')
setEditUsername(u.username||'')
if(sO==='true') setIsOwner(true)
setNotifications(nots)
}
},1800)
return()=>clearTimeout(t)
},[])

// STOP VIDEOS IN BACKGROUND - FIXED
const pauseAllVideos=()=>{
Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()})
}
useEffect(()=>{ pauseAllVideos() },[page,showUpload,showComments,showStorePanel])

useEffect(()=>{
if(typeof window!=='undefined' && 'serviceWorker' in navigator){
const swCode=`self.addEventListener('install',e=>{self.skipWaiting()}); self.addEventListener('activate',e=>{self.clients.claim()});`
const blob=new Blob([swCode],{type:'application/javascript'})
const swUrl=URL.createObjectURL(blob)
navigator.serviceWorker.register(swUrl).catch(()=>{})
}
if(typeof window!=='undefined'){
const isStandalone=window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
if(isStandalone) setIsInstalled(true)
}
const handleBeforeInstall=(e)=>{e.preventDefault(); setDeferredPrompt(e); setIsInstallable(true)}
window.addEventListener('beforeinstallprompt', handleBeforeInstall)
window.addEventListener('appinstalled', ()=>{setIsInstalled(true); setIsInstallable(false)})
const manifest={name:"UPTOWN - 978+ Family",short_name:"UPTOWN",start_url:"/",display:"standalone",background_color:"#000000",theme_color:"#FF0024",icons:[{src:"https://via.placeholder.com/512x512/FF0024/FFFFFF?text=UPTOWN",sizes:"512x512",type:"image/png"}]}
const manifestBlob=new Blob([JSON.stringify(manifest)],{type:'application/json'})
const manifestUrl=URL.createObjectURL(manifestBlob)
let link=document.querySelector('link[rel="manifest"]')
if(!link){link=document.createElement('link'); link.rel='manifest'; document.head.appendChild(link)}
link.href=manifestUrl
return()=>window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
},[])

// VIDEO ENGINE - FOR YOU + MUZIKA + LIVE ALL PLAY
useEffect(()=>{
const observer=new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
const id=entry.target.getAttribute('data-video-id')
const video=videoRefs.current[id]
if(!video) return
if(entry.isIntersecting){
Object.keys(videoRefs.current).forEach(k=>{if(k!==id && videoRefs.current[k]) videoRefs.current[k].pause()})
video.play().catch(()=>{})
}else video.pause()
})
},{threshold:0.6})
const els=document.querySelectorAll('[data-video-id]')
els.forEach(el=>observer.observe(el))
return()=>observer.disconnect()
},[page,posts,searchQuery])

const parseUniversalLink=(url)=>{
if(!url) return null
url=url.trim()
const ytReg=/(?:youtube\.com\/.*v=|youtu\.be\/)([^"&?\/\s]{11})/
const ytMatch=url.match(ytReg)
if(ytMatch) return {type:'youtube', embed:`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&playsinline=1&rel=0`, platform:'YouTube'}
if(url.match(/\.(mp4|mov|webm)(\?|$)/i)) return {type:'direct', embed:url, platform:'Direct'}
if(url.startsWith('http')) return {type:'iframe', embed:url, platform:'Link'}
return null
}
const isPornContent=(text, url)=>{
if(!text && !url) return false
const combined=(text+' '+(url||'')).toLowerCase()
const pornKeywords=['porn','sex video','xxx','nude','naked','pornhub','xvideos','onlyfans','nsfw','erotic','boobs','pussy','dick','anal','blowjob','hardcore','sex tape','leaked nude','18+ porn','brazzers','xnxx']
return pornKeywords.some(k=>combined.includes(k))
}
const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const isOfficial=email==='komenierashid@gmail.com'
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const nu={id:Date.now(),name:isOfficial?'Katongole Rashid':authForm.name,username:isOfficial?'@uptown':'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficial,isOfficial:isOfficial,bio:'New on UPTOWN ✓'}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified,isOfficial:nu.isOfficial,bio:nu.bio}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
setUser(lu); setEditName(lu.name); setEditUsername(lu.username); setIsOwner(isOfficial); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!isOfficial){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const lu=isOfficial?{name:'Katongole Rashid',username:'@uptown',email,verified:true,isOfficial:true,bio:'Control'}:{name:found.name,username:found.username,email:found.email,verified:found.verified||false,isOfficial:false,bio:found.bio||''}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
setUser(lu); setEditName(lu.name); setEditUsername(lu.username); setIsOwner(isOfficial); setShowAuth(false)
}
}
const handleFollow=(username)=>{
const isFollowing=follows[username]==='following'
const nf={...follows,[username]:isFollowing?'follow':'following'}
setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))
const nc={...followCounts,[username]:(followCounts[username]||0)+(isFollowing?-1:1)}
setFollowCounts(nc); localStorage.setItem('uptown_follow_counts',JSON.stringify(nc))
setBlockedMsg(isFollowing?'Unfollowed':'✓ Following!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)
}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf))}
const handleShare=async(v)=>{try{await navigator.clipboard.writeText(v.mediaUrl); setBlockedMsg('🔗 Copied!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}catch{}}
const handleComment=(id)=>{pauseAllVideos(); setShowComments(id)}
const handlePostComment=(id)=>{
if(!commentInput.trim()) return
setComments(prev=>({...prev,[id]:[...(prev[id]||[]),{id:Date.now(),text:commentInput,user:user?.name||'User'}]}))
const nc={...commentCounts,[id]:(commentCounts[id]||0)+1}
setCommentCounts(nc); localStorage.setItem('uptown_comments_v1',JSON.stringify(nc)); setCommentInput('')
}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused) v.play(); else v.pause()}
const handleFileChange=(e)=>{
const f=e.target.files?.[0]; if(!f) return;
const u=URL.createObjectURL(f);
setUploadPreview({url:u,type:f.type}); setPostBtnState('green');
const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f);
}
const handleProfilePicChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setProfilePic(u); const r=new FileReader(); r.onload=(ev)=>{localStorage.setItem('uptown_profile_pic',ev.target.result)}; r.readAsDataURL(f)}
const handleSaveProfile=()=>{
if(!editName.trim()){setBlockedMsg('Name required'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
const updated={...user,name:editName,username:editUsername,bio:editBio}
setUser(updated); localStorage.setItem('uptown_user',JSON.stringify(updated)); localStorage.setItem('uptown_bio',editBio)
setIsEditing(false); setBlockedMsg('✓ Saved!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)
}
const handleReportVideo=(v)=>{setReportedVideos({...reportedVideos,[v.id]:true}); localStorage.setItem('uptown_reported_videos',JSON.stringify({...reportedVideos,[v.id]:true})); setBlockedMsg('🚩 Reported! 24h review'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)}
const handleBlockUser=(username)=>{setBlockedUsers({...blockedUsers,[username]:true}); localStorage.setItem('uptown_blocked_users',JSON.stringify({...blockedUsers,[username]:true})); setBlockedMsg(`🚫 Blocked ${username}`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)}
const handleDeleteAccount=()=>{
if(!confirm('Delete account?')) return
localStorage.removeItem('uptown_user'); localStorage.removeItem('uptown_is_owner'); window.location.reload()
}
const handleOneButtonStoreEngine=async()=>{
if(deferredPrompt){deferredPrompt.prompt(); const {outcome}=await deferredPrompt.userChoice; if(outcome==='accepted') setIsInstalled(true); setDeferredPrompt(null); setIsInstallable(false); return}
setShowStorePanel(true)
}
// POST BUTTON FIXED - 1 TAP DIRECT + GREEN -> WHITE
const handlePostNow=(mode)=>{
const fm=mode||uploadMode
if(fm==='post_muzika' && !isOwner){setBlockedMsg('Muzika: Only Official'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
let mu=null; let li=null
if(fm==='post_muzika'){
if(universalLink){ li=parseUniversalLink(universalLink); mu=universalLink } 
else if(uploadBase64){ mu=uploadBase64 }
else if(uploadPreview?.url){ mu=uploadPreview.url }
else{setBlockedMsg('Paste link'); setShowBlocked(true); return}
}else{
if(uploadBase64) mu=uploadBase64
else if(uploadPreview?.url) mu=uploadPreview.url
else if(universalLink){ li=parseUniversalLink(universalLink); mu=universalLink }
else{setBlockedMsg('Upload video!'); setShowBlocked(true); return}
}
setPostBtnState('white') // WHITE AFTER POST
const np={id:Date.now(),user:user?.name||'User',username:user?.username||'@user',verified:user?.verified||false,caption:uploadCaption||'New video ✓',mediaUrl:mu,linkInfo:li,isMuzika:fm==='post_muzika',isLive:isLive,likes:0,fires:0,views:Math.floor(Math.random()*5000)+100,postedBy:user?.email,postedAt:Date.now()}
const nposts=[np,...posts]
savePostsToDB(nposts) // DATABASE NOT LOCAL STORAGE
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUniversalLink(''); setShowUpload(false); setUploadMode(null); setIsLive(false);
pauseAllVideos()
setBlockedMsg('✓ Posted! Everyone sees!'); setShowBlocked(true);
setTimeout(()=>{setShowBlocked(false); setPage(fm==='post_muzika'?'muzika':'foryou'); setPostBtnState('green')},1000) // GREEN BEFORE NEXT POST
}

if(splash){
return(<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="140" height="170" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>)
}

const allForYouPosts=[...posts.filter(p=>!p.isMuzika && !p.isLive && !blockedUsers[p.username])]
const sortedForYou=allForYouPosts.sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const forYouFeed=[...sortedForYou,...officialVideos.filter(v=>!blockedUsers[v.username])]
const muzikaFeed=[...posts.filter(p=>p.isMuzika && !blockedUsers[p.username]),...officialVideos].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const liveFeed=[...posts.filter(p=>p.isLive && !blockedUsers[p.username])].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const myVideos=posts.filter(p=>p.postedBy===user?.email)
const searchFiltered=[...forYouFeed,...muzikaFeed,...liveFeed].filter(v=>{ if(!searchQuery) return false; const q=searchQuery.toLowerCase(); return (v.user?.toLowerCase().includes(q) || v.username?.toLowerCase().includes(q) || v.caption?.toLowerCase().includes(q)) })

const renderUniversal=(v)=>{
const info=v.linkInfo || parseUniversalLink(v.mediaUrl)
if(!info){
if(v.mediaUrl?.startsWith('data:image')) return <img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
}
if(info.type==='youtube') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allow="autoplay" style={{width:'100%',height:'100%',border:'none'}}/>
if(info.type==='direct') return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={info.embed} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#000'}}/>
return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" style={{width:'100%',height:'100%',border:'none'}}/>
}

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',display:'flex',alignItems:'center',padding:'0 12px',gap:'8px',borderBottom:'1px solid #1a1a1a',flexShrink:0}}>
<div style={{display:'flex',gap:'8px',flex:1}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'}].map(t=><button key={t.key} onClick={()=>{pauseAllVideos(); setPage(t.key)}} style={{background:page===t.key?'#fff':'#222',color:page===t.key?'#000':'#888',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'700',height:'32px'}}>{t.label}</button>)}
</div>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:page==='live'?'#FF0024':'#1a1a1a',color:page==='live'?'#fff':'#FF0024',border:'1px solid #FF0024',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'800',height:'32px'}}>● Live</button>
</div>

<div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column',background:'#000'}}>
{page==='foryou'&&(
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory'}}>
<div style={{height:'32px',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'11px',color:'#00D632',fontWeight:'700'}}>● For You — Everyone — Database — 978+ — No local storage!</span></div>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
const isLiked=likes[v.id]
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
<div style={{position:'absolute',top:'12px',right:'12px',zIndex:4}}><button onClick={()=>{const m=prompt('1=Report 2=Block'); if(m==='1') handleReportVideo(v); if(m==='2') handleBlockUser(v.username)}} style={{background:'rgba(0,0,0,0.6)',border:'1px solid #333',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>⋯</button></div>
<div style={{position:'absolute',right:'10px',top:'42%',transform:'translateY(-50%)',zIndex:3,display:'flex',flexDirection:'column',gap:'14px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{position:'relative',width:'54px',height:'62px',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'50px',height:'50px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #fff'}}><span style={{fontWeight:'900',fontSize:'11px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></span></div>
<button onClick={()=>handleFollow(v.username)} style={{position:'absolute',bottom:'12px',left:'50%',transform:'translateX(-50%)',width:'22px',height:'22px',borderRadius:'50%',background:isFollowing?'#00D632':'#FF0024',border:'2px solid #000',color:'#fff',fontWeight:'900'}}>{isFollowing?'✓':'+'}</button>
<div style={{marginTop:'6px',fontSize:'11px',fontWeight:'700',color:'#fff'}}>{isFollowing?'Following':'Follow'}</div>
</div>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'24px'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div><div style={{fontSize:'11px'}}>{v.likes}</div></button>
<button onClick={()=>handleComment(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>💬</div><div style={{fontSize:'11px'}}>{commentCounts[v.id]||v.comments||0}</div></button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div>→</div><div style={{fontSize:'11px'}}>Share</div></button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',color:'#FF0024',display:'flex',flexDirection:'column',alignItems:'center'}}><div>★</div><div style={{fontSize:'10px'}}>Fav</div></button>
{/* SEARCH BUTTON - AFTER FAVORITE BEFORE YOU - FIXED */}
<button onClick={()=>{pauseAllVideos(); setPage('search')}} style={{background:'#1a1a1a',border:'1px solid #333',width:'32px',height:'32px',borderRadius:'50%',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'14px'}}>🔍</span><span style={{fontSize:'7px',fontWeight:'700'}}>Search</span></button>
</div>
<div style={{position:'absolute',left:'12px',right:'76px',bottom:'22px',zIndex:2,pointerEvents:'none'}}><div style={{fontWeight:'800',fontSize:'15px'}}>{v.user} {v.verified&&'✓'}</div><div style={{fontSize:'12px',marginTop:'4px'}}>{v.caption}</div></div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'40px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
<div style={{fontWeight:'700',fontSize:'12px'}}>Muzika — Plays now — Database!</div>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>+ Post</button>
</div>
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
<div style={{position:'absolute',left:'12px',bottom:'22px',zIndex:2}}><div style={{fontWeight:'700',fontSize:'13px'}}>UPTOWN Official ✓</div></div>
</div>
))}
</div>
</div>
)}

{page==='live'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'40px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div style={{fontWeight:'800',fontSize:'13px'}}>🔴 Live — Open — No Coming Soon!</div>
<button onClick={()=>{setIsLive(true); setShowUpload(true)}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'800'}}>🔴 Go Live</button>
</div>
<div style={{flex:1,overflowY:'auto',padding:'12px'}}>
{liveFeed.length===0? <div style={{textAlign:'center',marginTop:'60px'}}><div style={{fontSize:'40px'}}>🔴</div><div style={{fontWeight:'700',marginTop:'10px'}}>No Live Now — Be first!</div><button onClick={()=>{setIsLive(true); setShowUpload(true)}} style={{marginTop:'12px',background:'#FF0024',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'20px'}}>Start Live</button></div> :
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>{liveFeed.map(v=><div key={v.id} style={{background:'#121212',border:'1px solid #FF0024',borderRadius:'12px',overflow:'hidden'}}><div style={{height:'160px',background:'#000'}}>{renderUniversal(v)}</div><div style={{padding:'8px',fontSize:'11px'}}>{v.user} 🔴 LIVE</div></div>)}</div>
}
</div>
</div>
)}

{page==='search'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',padding:'0 12px',background:'#0a0a0a',display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%'}}>‹</button>
<input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search after Favorite — Before You — 978+ videos..." autoFocus style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'10px 14px',color:'#fff',fontSize:'13px'}}/>
</div>
<div style={{flex:1,overflowY:'auto'}}>
{searchFiltered.length===0? <div style={{padding:'20px',textAlign:'center',color:'#666'}}>Search — After Favorite button — Before You button — As you asked!</div> :
searchFiltered.map(v=>(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'60vh',position:'relative',background:'#111',borderBottom:'1px solid #222',display:'flex',alignItems:'center',justifyContent:'center'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
</div>
))}
</div>
</div>
)}

{page==='following'&&(
<div style={{flex:1,padding:'16px',overflowY:'auto'}}>
<div style={{fontWeight:'700',marginBottom:'12px'}}>Following — Works — Database — Boost on For You</div>
{posts.filter(p=>follows[p.username]==='following').length===0? <div style={{color:'#666',textAlign:'center',marginTop:'40px'}}><div style={{fontSize:'40px'}}>👥</div><div style={{marginTop:'10px'}}>No following yet — Follow on For You — Works for everyone!</div><button onClick={()=>setPage('foryou')} style={{marginTop:'12px',background:'#fff',color:'#000',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>Go For You</button></div> :
posts.filter(p=>follows[p.username]==='following').map(v=>(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'50vh',position:'relative',background:'#111',marginBottom:'8px',borderRadius:'12px',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
</div>
))
}
</div>
)}

{page==='you'&&(
<div style={{flex:1,overflowY:'auto',padding:'16px',background:'#000'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'14px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></div>
<div><div style={{fontWeight:'800',fontSize:'16px'}}>{user?.name||'Guest'} — 978+</div><div style={{fontSize:'12px',color:'#888'}}>{user?.username||'@user'} — Database</div></div>
</div>
{isOwner&&<div style={{marginTop:'16px',background:'linear-gradient(135deg,#FF0024 0%,#00D632 100%)',borderRadius:'16px',padding:'2px'}}><div style={{background:'#000',borderRadius:'14px',padding:'14px'}}><div style={{fontWeight:'900',fontSize:'13px'}}>🚀 One Button Engine — Android + iPhone</div><button onClick={handleOneButtonStoreEngine} style={{width:'100%',marginTop:'10px',background:isInstallable?'#00D632':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'13px'}}>{isInstalled?'✓ Installed!':isInstallable?'📲 INSTALL NOW!':'🚀 ENGINE'}</button></div></div>}
</div>
)}

{showComments!==null&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:60,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(null)}><div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'14px',maxHeight:'60vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div style={{fontWeight:'700'}}>Comments</div><button onClick={()=>setShowComments(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>×</button></div><div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px'}}>{(comments[showComments]||[]).map(c=><div key={c.id} style={{display:'flex',gap:'8px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#333',display:'flex',alignItems:'center',justifyContent:'center'}}>U</div><div><div style={{fontSize:'11px',fontWeight:'700'}}>{c.user}</div><div style={{fontSize:'12px'}}>{c.text}</div></div></div>)}</div><div style={{display:'flex',gap:'8px',marginTop:'10px',borderTop:'1px solid #222',paddingTop:'10px'}}><input value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder="Add comment..." style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'8px 12px',color:'#fff'}}/><button onClick={()=>handlePostComment(showComments)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:'700'}}>Post</button></div></div></div>}
{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80,textAlign:'center'}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{pauseAllVideos(); setShowUpload(false); setUploadMode(null); setPostBtnState('green')}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px',maxHeight:'85vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
{uploadMode===null&&<>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'16px',marginBottom:'12px'}}>Upload — Database — 978+ see same</div>
<button onClick={()=>{setUploadMode('upload_video'); setPostBtnState('green')}} style={{width:'100%',background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',marginBottom:'10px'}}>📤 Upload Videos — For You</button>
<button onClick={()=>{setIsLive(true); setUploadMode('upload_video'); setPostBtnState('green')}} style={{width:'100%',background:'#1a1a1a',border:'1px solid #FF0024',color:'#FF0024',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',marginBottom:'10px'}}>🔴 Go Live — Open!</button>
<button onClick={()=>{setUploadMode('post_muzika'); setPostBtnState('green')}} style={{width:'100%',background:'#1a1a1a',border:'1px solid #00D632',color:'#fff',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px'}}>🎬 Post Muzika — Plays now!</button>
</>}
{uploadMode==='upload_video'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800',fontSize:'14px'}}>{isLive?'🔴 Go Live — Open':'📤 Upload — Database'}</div></div>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'10px'}}><video src={uploadPreview.url} style={{width:'100%',maxHeight:'200px',borderRadius:'12px'}} autoPlay loop muted playsInline/></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption..." style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('upload_video')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#00D632':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'14px'}}>
{postBtnState==='green'? (isLive?'🟢 GO LIVE NOW — Green — 1 Tap!':'🟢 POST NOW — Green — 1 Tap Direct!') : '⚪ POSTED ✓ — White — Success!'}
</button>
</>}
{uploadMode==='post_muzika'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800'}}>🎬 Muzika — Fixed plays!</div></div>
<input value={universalLink} onChange={e=>{setUniversalLink(e.target.value); setPostBtnState('green')}} placeholder="Paste link" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('post_muzika')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#00D632':'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900'}}>
{postBtnState==='green'?'🟢 POST IN MUZIKA — Green':'⚪ POSTED ✓ — White'}
</button>
</>}
</div>
</div>
)}

<div style={{height:'64px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px'}}>Home</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('search')}} style={{background:'none',border:'none',color:page==='search'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>🔍</span><span style={{fontSize:'10px'}}>Search</span></button>
<button onClick={()=>{pauseAllVideos(); setUploadMode(null); setShowUpload(true); setPostBtnState('green')}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900',display:'flex',alignItems:'center',justifyContent:'center'}}> + </button>
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
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>Continue</button>
</div>
</div>
)}
</div>
)
}
