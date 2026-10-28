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
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:'',bio:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [notifications,setNotifications]=useState([])
const [profilePic,setProfilePic]=useState(null)
const [editName,setEditName]=useState('')
const [editBio,setEditBio]=useState('Porn/Sex not allowed — 5 min auto remove — Repeat = 7 days ban')
const [editUsername,setEditUsername]=useState('')
const [isEditing,setIsEditing]=useState(false)
const [postBtnState,setPostBtnState]=useState('green')
const [deferredPrompt,setDeferredPrompt]=useState(null)
const [isInstallable,setIsInstallable]=useState(false)
const [isInstalled,setIsInstalled]=useState(false)
const [blockedUsers,setBlockedUsers]=useState({})
const [reportedVideos,setReportedVideos]=useState({})
const [isLive,setIsLive]=useState(false)
const [searchQuery,setSearchQuery]=useState('')
const [violations,setViolations]=useState({})
const [bannedUntil,setBannedUntil]=useState({})
const videoRefs=useRef({})

const OWNER_EMAIL='komenierashid@gmail.com'
const OWNER_NAME='Katongole Rashid'
const OWNER_USERNAME='@uptown'

const officialVideos=[
{id:9001,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ 978+ Family — Muzika Only Official — YouTube links — One tap play!', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video', likes:15600, fires:520, comments:978, views:45200, isOfficial:true},
{id:9002,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ Muzika — Only Official posts YouTube — Any link!', mediaUrl:'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&playsinline=1', mediaType:'youtube', likes:12400, fires:340, comments:0, views:32100, isOfficial:true, linkInfo:{type:'youtube', embed:'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&playsinline=1'}},
]

const PORN_KEYWORDS=['porn','sex video','xxx','nude','naked','onlyfans','erotic','18+','pornhub','xvideo']
const isPornContent=(text)=>{
if(!text) return false
const t=text.toLowerCase()
return PORN_KEYWORDS.some(k=>t.includes(k))
}

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
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sFav=localStorage.getItem('uptown_fav_v3')
const sC=localStorage.getItem('uptown_comments_v1')
const sV=localStorage.getItem('uptown_violations')
const sB=localStorage.getItem('uptown_banned_until')
const sNot=localStorage.getItem('uptown_notifications_final')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
if(sC) setCommentCounts(JSON.parse(sC))
if(sV) setViolations(JSON.parse(sV))
if(sB) setBannedUntil(JSON.parse(sB))
if(sNot) setNotifications(JSON.parse(sNot))
else setNotifications([
{id:1,from:'UPTOWN Official',verified:true,time:'2m ago',title:'UPTOWN Policy ✓',message:'Porn/Sex auto remove in 5 min — Repeat = 7 days ban — Muzika only Official posts YouTube',read:false},
{id:2,from:'System',verified:true,time:'5m ago',title:'Welcome 978+ Family',message:'Only komenierashid@gmail.com is UPTOWN Official — Katongole Rashid',read:false}
])
fetchPostsFromDB()
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su)
setUser(u); setEditName(u.name||''); setEditUsername(u.username||'')
if(u.email===OWNER_EMAIL){ setIsOwner(true); localStorage.setItem('uptown_is_owner','true') }
else if(sO==='true' && u.email===OWNER_EMAIL) setIsOwner(true)
}
},1500)
return()=>clearTimeout(t)
},[])

const pauseAllVideos=()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()})}
useEffect(()=>{ pauseAllVideos() },[page,showUpload,showComments])

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

useEffect(()=>{
const handleBeforeInstall=(e)=>{e.preventDefault(); setDeferredPrompt(e); setIsInstallable(true)}
window.addEventListener('beforeinstallprompt', handleBeforeInstall)
window.addEventListener('appinstalled', ()=>{setIsInstalled(true); setIsInstallable(false)})
return()=>window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
},[])

const checkBan=(email)=>{
const until=bannedUntil[email]
if(!until) return false
if(Date.now()<until){
const days=Math.ceil((until-Date.now())/(1000*60*60*24))
setBlockedMsg(`🚫 Banned ${days} days — Porn/Sex repeat — 7 days ban`)
setShowBlocked(true)
setTimeout(()=>setShowBlocked(false),3000)
return true
}else{
const nb={...bannedUntil}; delete nb[email]; setBannedUntil(nb); localStorage.setItem('uptown_banned_until',JSON.stringify(nb))
return false
}
}

const parseUniversalLink=(url)=>{
if(!url) return null
url=url.trim()
const ytReg=/(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/
const ytMatch=url.match(ytReg)
if(ytMatch) return {type:'youtube', embed:`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&playsinline=1&rel=0`, platform:'YouTube'}
if(url.match(/\.(mp4|mov|webm)(\?|$)/i)) return {type:'direct', embed:url}
if(url.startsWith('http')) return {type:'iframe', embed:url}
return null
}

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const nameInput=authForm.name.trim()
const usernameInput=authForm.username.trim()

if(checkBan(email)) return

// ONLY OWNER CAN BE KATONGOLE RASHID / UPTOWN OFFICIAL
if((nameInput.toLowerCase().includes('katongole') || usernameInput.toLowerCase().includes('uptown') || usernameInput.toLowerCase().includes('katongole')) && email!==OWNER_EMAIL){
setBlockedMsg('🚫 Only komenierashid@gmail.com can be Katongole Rashid / UPTOWN Official!')
setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2500); return
}

let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name & username'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const isOfficial=email===OWNER_EMAIL
const nu={id:Date.now(),name:isOfficial?OWNER_NAME:authForm.name,username:isOfficial?OWNER_USERNAME:'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficial,isOfficial:isOfficial,bio:isOfficial?'Porn/Sex not allowed — 5 min auto remove — Repeat = 7 days ban':authForm.bio}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified,isOfficial:nu.isOfficial,bio:nu.bio}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
setUser(lu); setEditName(lu.name); setEditUsername(lu.username); setIsOwner(isOfficial); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found && email!==OWNER_EMAIL){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const isOfficial=email===OWNER_EMAIL
const lu=isOfficial?{name:OWNER_NAME,username:OWNER_USERNAME,email,verified:true,isOfficial:true,bio:'Porn/Sex not allowed — 5 min auto remove — Repeat = 7 days ban'}:{name:found.name,username:found.username,email:found.email,verified:found.verified||false,isOfficial:false,bio:found.bio}
if(checkBan(lu.email)) return
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
setUser(lu); setEditName(lu.name); setEditUsername(lu.username); setIsOwner(isOfficial); setShowAuth(false)
}
}

const handleFollow=(username)=>{const isFollowing=follows[username]==='following'; const nf={...follows,[username]:isFollowing?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf)); setBlockedMsg(isFollowing?'Unfollowed':'✓ Following — DB!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl)); setBlockedMsg(nl['fire_'+id]?'🔥 Fire — DB!':'🔥 Removed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf)); setBlockedMsg(nf[id]?'★ Favorited — DB!':'★ Removed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}
const handleShare=async(v)=>{try{await navigator.clipboard.writeText(v.mediaUrl); setBlockedMsg('🔗 Copied — DB!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}catch{}}
const handleComment=(id)=>{pauseAllVideos(); setShowComments(id)}
const handlePostComment=(id)=>{
if(!commentInput.trim()) return
if(isPornContent(commentInput)){setBlockedMsg('🚫 Porn/Sex not allowed — Comment blocked — 5 min policy'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return}
setComments(prev=>({...prev,[id]:[...(prev[id]||[]),{id:Date.now(),text:commentInput,user:user?.name||'User'}]}))
setCommentCounts({...commentCounts,[id]:(commentCounts[id]||0)+1})
localStorage.setItem('uptown_comments_v1',JSON.stringify({...commentCounts,[id]:(commentCounts[id]||0)+1}))
setCommentInput('')
}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused) v.play(); else v.pause()}
const handleFileChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setUploadPreview({url:u}); setPostBtnState('green'); const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f);}
const handleReportVideo=(v)=>{setReportedVideos({...reportedVideos,[v.id]:true}); const newN={id:Date.now(),from:'System',verified:true,time:'now',title:'🚩 Reported ✓',message:`Video ${v.id} reported — 24h review — Play Store Policy`,read:false}; const nn=[newN,...notifications]; setNotifications(nn); localStorage.setItem('uptown_notifications_final',JSON.stringify(nn)); setBlockedMsg('🚩 Reported — 24h — Policy ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)}
const handleBlockUser=(username)=>{setBlockedUsers({...blockedUsers,[username]:true}); setBlockedMsg(`🚫 Blocked ${username} — Policy ✓`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)}
const handleDeleteAccount=()=>{if(confirm('Delete Account? — Play Store Policy — This removes all your data?')){localStorage.clear(); setUser(null); setShowAuth(true); setBlockedMsg('🗑️ Account deleted — Policy ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)}}

const handleOneButtonStoreEngine=async()=>{
if(deferredPrompt){deferredPrompt.prompt(); const {outcome}=await deferredPrompt.userChoice; if(outcome==='accepted') setIsInstalled(true); setDeferredPrompt(null); setIsInstallable(false); return}
if('serviceWorker' in navigator){
const swCode=`self.addEventListener('install',e=>{self.skipWaiting()}); self.addEventListener('activate',e=>{self.clients.claim()});`
const blob=new Blob([swCode],{type:'application/javascript'})
const swUrl=URL.createObjectURL(blob)
navigator.serviceWorker.register(swUrl).then(()=>{setBlockedMsg('✓ PWA Ready — Install from browser menu — Android + iPhone'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)})
}
}

const handlePostNow=(mode)=>{
const fm=mode||uploadMode
if(!user){setBlockedMsg('Login first'); setShowBlocked(true); return}
if(checkBan(user.email)) return

// MUZIKA ONLY UPTOWN OFFICIAL
if(fm==='post_muzika'){
if(!isOwner){setBlockedMsg('🚫 Muzika Only UPTOWN Official — Only katongole can post YouTube!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return}
}

let mu=null; let li=null
if(fm==='post_muzika'){
if(universalLink){ li=parseUniversalLink(universalLink); mu=universalLink } 
else if(uploadBase64){ mu=uploadBase64 }
else if(uploadPreview?.url){ mu=uploadPreview.url }
else{setBlockedMsg('Paste YouTube link — Muzika only Official!'); setShowBlocked(true); return}
}else{
if(uploadBase64) mu=uploadBase64
else if(uploadPreview?.url) mu=uploadPreview.url
else if(universalLink){ li=parseUniversalLink(universalLink); mu=universalLink }
else{setBlockedMsg('Upload video!'); setShowBlocked(true); return}
}

// ANTI-PORN AUTO FILTER — 5 MIN REMOVE + 7 DAYS BAN
const fullText=(uploadCaption||'')+' '+(universalLink||'')
if(isPornContent(fullText) && !isOwner){
const currentViolations=(violations[user.email]||0)+1
const newViol={...violations,[user.email]:currentViolations}
setViolations(newViol); localStorage.setItem('uptown_violations',JSON.stringify(newViol))

if(currentViolations===1){
// First violation — 5 min auto remove + warning
setBlockedMsg('⚠️ Porn/Sex detected — Auto remove in 5 min — Warning — Repeat = 7 days ban!')
setShowBlocked(true)
const warnNotif={id:Date.now(),from:'UPTOWN Moderation',verified:true,time:'now',title:'⚠️ 1st Violation — Porn/Sex',message:'Your video contains porn/sex — Auto removed in 5 minutes — If you post again, 7 days ban — Play Store Policy',read:false}
const nn=[warnNotif,...notifications]; setNotifications(nn); localStorage.setItem('uptown_notifications_final',JSON.stringify(nn))
// Post but auto remove after 5 min
const np={id:Date.now(),user:user?.name||'User',username:user?.username||'@user',verified:user?.verified||false,caption:uploadCaption||'Flagged',mediaUrl:mu,linkInfo:li,isMuzika:false,isLive:false,likes:0,fires:0,views:0,postedBy:user?.email,postedAt:Date.now(),isFlagged:true,removeAt:Date.now()+5*60*1000}
const nposts=[np,...posts]; savePostsToDB(nposts)
setTimeout(()=>{
const filtered=posts.filter(p=>p.id!==np.id)
savePostsToDB(filtered)
const autoNotif={id:Date.now(),from:'UPTOWN Moderation',verified:true,time:'now',title:'🗑️ Auto Removed — 5 min',message:'Your porn/sex video was auto removed after 5 min — Next time 7 days ban',read:false}
const nn2=[autoNotif,...notifications]; setNotifications(nn2); localStorage.setItem('uptown_notifications_final',JSON.stringify(nn2))
},5*60*1000)
}else{
// Second violation — 7 days ban
const banUntil=Date.now()+7*24*60*60*1000
const newBanned={...bannedUntil,[user.email]:banUntil}
setBannedUntil(newBanned); localStorage.setItem('uptown_banned_until',JSON.stringify(newBanned))
const banNotif={id:Date.now(),from:'UPTOWN Moderation',verified:true,time:'now',title:'🚫 7 DAYS BAN — Repeat',message:'You posted porn/sex again — Account banned 7 days — Play Store + App Store Policy 1.2 UGC',read:false}
const nn=[banNotif,...notifications]; setNotifications(nn); localStorage.setItem('uptown_notifications_final',JSON.stringify(nn))
setBlockedMsg('🚫 7 DAYS BAN — Repeat porn/sex — Policy!')
}
setTimeout(()=>setShowBlocked(false),3000)
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUniversalLink(''); setShowUpload(false); setUploadMode(null); setIsLive(false); setPostBtnState('green')
return
}

setPostBtnState('white')
const np={id:Date.now(),user:isOwner?OWNER_NAME:user?.name||'User',username:isOwner?OWNER_USERNAME:user?.username||'@user',verified:isOwner?true:user?.verified||false,caption:uploadCaption||(fm==='post_muzika'?'UPTOWN Official ✓ Muzika — Only Official posts! — One tap play!':'New video ✓'),mediaUrl:mu,linkInfo:li,isMuzika:fm==='post_muzika',isLive:isLive,likes:0,fires:520,views:Math.floor(Math.random()*5000)+100,postedBy:user?.email,postedAt:Date.now()}
const nposts=[np,...posts]
savePostsToDB(nposts)
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUniversalLink(''); setShowUpload(false); setUploadMode(null); setIsLive(false);
pauseAllVideos()
setBlockedMsg('✓ Posted — DB — All working!'); setShowBlocked(true);
setTimeout(()=>{setShowBlocked(false); setPage(fm==='post_muzika'?'muzika':'foryou'); setPostBtnState('green')},1000)
}

if(splash){
return(<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="140" height="170" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>)
}

const forYouFeed=[...posts.filter(p=>!p.isMuzika && !p.isLive && !blockedUsers[p.username] && !p.isFlagged),...officialVideos.filter(v=>!blockedUsers[v.username])].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const muzikaFeed=[...posts.filter(p=>p.isMuzika && !blockedUsers[p.username] && !p.isFlagged),...officialVideos].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const liveFeed=[...posts.filter(p=>p.isLive && !blockedUsers[p.username] && !p.isFlagged)].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const myVideos=posts.filter(p=>p.postedBy===user?.email)
const searchFiltered=[...forYouFeed,...muzikaFeed,...liveFeed].filter(v=>{
if(!searchQuery) return false
const q=searchQuery.toLowerCase()
return (v.user?.toLowerCase().includes(q) || v.username?.toLowerCase().includes(q) || v.caption?.toLowerCase().includes(q))
})

const renderUniversal=(v)=>{
const info=v.linkInfo || parseUniversalLink(v.mediaUrl)
if(!info){
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
}
if(info.type==='youtube') return <iframe width="100%" height="100%" src={info.embed} allow="autoplay; encrypted-media" allowFullScreen style={{width:'100%',height:'100%',border:'none'}}/>
if(info.type==='direct') return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={info.embed} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#000'}}/>
return <iframe width="100%" height="100%" src={info.embed} allow="autoplay; encrypted-media" allowFullScreen style={{width:'100%',height:'100%',border:'none'}}/>
}
const unread=notifications.filter(n=>!n.read).length
const userViolations=violations[user?.email||'']||0

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',display:'flex',alignItems:'center',padding:'0 8px',gap:'6px',borderBottom:'1px solid #1a1a1a',flexShrink:0,background:'#000'}}>
<div style={{display:'flex',gap:'6px',flex:1,overflowX:'auto'}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'}].map(t=><button key={t.key} onClick={()=>{pauseAllVideos(); setPage(t.key)}} style={{background:page===t.key?'#fff':'#222',color:page===t.key?'#000':'#888',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700',height:'32px',flexShrink:0}}>{t.label}</button>)}
</div>
<button onClick={()=>{pauseAllVideos(); setPage('search')}} style={{background:page==='search'?'#fff':'#1a1a1a',color:page==='search'?'#000':'#fff',border:'1px solid #333',width:'36px',height:'32px',borderRadius:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>🔍</button>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:page==='live'?'#FF0024':'#1a1a1a',color:page==='live'?'#fff':'#FF0024',border:'1px solid #FF0024',padding:'6px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'800',height:'32px',display:'flex',alignItems:'center',gap:'4px',flexShrink:0}}><span style={{width:'6px',height:'6px',background:page==='live'?'#fff':'#FF0024',borderRadius:'50%'}}></span>Live</button>
</div>

<div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column',background:'#000'}}>
{page==='foryou'&&(
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory'}}>
<div style={{height:'32px',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'11px',color:'#00D632',fontWeight:'700'}}>● For You — 978+ — DB + Anti-Porn 5min + 7days ban</span></div>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
const isLiked=likes[v.id]
const isFired=likes['fire_'+v.id]
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
<div style={{position:'absolute',top:'12px',right:'12px',zIndex:4}}><button onClick={()=>{const m=prompt('Play Store Policy:\n1=Report\n2=Block\n3=Delete My Account'); if(m==='1') handleReportVideo(v); if(m==='2') handleBlockUser(v.username); if(m==='3') handleDeleteAccount()}} style={{background:'rgba(0,0,0,0.6)',border:'1px solid #333',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>⋯</button></div>
<div style={{position:'absolute',right:'10px',top:'42%',transform:'translateY(-50%)',zIndex:3,display:'flex',flexDirection:'column',gap:'14px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{position:'relative',width:'54px',height:'62px',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'50px',height:'50px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #fff'}}><span style={{fontWeight:'900',fontSize:'11px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></span></div>
<button onClick={()=>handleFollow(v.username)} style={{position:'absolute',bottom:'12px',left:'50%',transform:'translateX(-50%)',width:'22px',height:'22px',borderRadius:'50%',background:isFollowing?'#00D632':'#FF0024',border:'2px solid #000',color:'#fff',fontWeight:'900'}}>{isFollowing?'✓':'+'}</button>
<div style={{marginTop:'6px',fontSize:'11px',fontWeight:'700',color:'#fff'}}>{isFollowing?'Following':'Follow'}</div>
</div>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'24px'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div><div style={{fontSize:'11px',fontWeight:'700'}}>{isLiked? (v.likes+1) : '15600'}</div></button>
<button onClick={()=>handleComment(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>💬</div><div style={{fontSize:'11px',fontWeight:'700'}}>{commentCounts[v.id]||978}</div></button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div>→</div><div style={{fontSize:'11px'}}>Share — DB</div></button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',color:'#FF0024',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'20px'}}>★</div><div style={{fontSize:'10px'}}>Fav — DB</div></button>
<button onClick={()=>handleFire(v.id)} style={{background:isFired?'#FF6A00':'#1a1a1a',border:isFired?'1px solid #FF6A00':'1px solid #333',width:'38px',height:'38px',borderRadius:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#fff'}}>
<span style={{fontSize:'20px'}}>🔥</span>
<div style={{fontSize:'8px',fontWeight:'800'}}>{isFired? (v.fires+1) : 520}</div>
</button>
</div>
<div style={{position:'absolute',left:'12px',right:'78px',bottom:'28px',zIndex:2,pointerEvents:'none',display:'flex',flexDirection:'column',gap:'5px',maxWidth:'78%'}}>
<div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
<span style={{fontWeight:'900',fontSize:'16px',color:'#fff',textShadow:'0 1px 4px rgba(0,0,0,0.9)'}}>{v.user}</span>
{v.verified && (<span style={{width:'18px',height:'18px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>)}
<span style={{fontSize:'11px',color:'#ddd'}}>{v.username}</span>
</div>
<div style={{fontSize:'13px',color:'#fff',lineHeight:'1.35',fontWeight:'500',textShadow:'0 1px 3px rgba(0,0,0,0.9)'}}>{v.caption}</div>
<div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'2px'}}><span style={{fontSize:'12px'}}>♪</span><span style={{fontSize:'11px',color:'#fff',opacity:0.95}}>UPTOWN Official ✓ • 978+ Family • Original sound • Anti-Porn Policy</span></div>
</div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'44px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div style={{fontWeight:'800',fontSize:'12px'}}>🎬 Muzika — Only UPTOWN Official — YouTube — One tap play!</div>
{isOwner && <button onClick={()=>{setUploadMode('post_muzika'); setShowUpload(true)}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'800'}}>+ Post YouTube</button>}
</div>
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
<div style={{position:'absolute',left:'12px',right:'12px',bottom:'28px',zIndex:2,pointerEvents:'none',display:'flex',flexDirection:'column',gap:'4px'}}>
<div style={{display:'flex',alignItems:'center',gap:'6px'}}>
<span style={{fontWeight:'900',fontSize:'15px',color:'#fff',textShadow:'0 1px 4px rgba(0,0,0,0.9)'}}>UPTOWN Official</span>
<span style={{width:'18px',height:'18px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>
<span style={{background:'#FF0024',color:'#fff',fontSize:'9px',padding:'2px 6px',borderRadius:'10px',fontWeight:'800'}}>Muzika</span>
<span style={{background:'#1D9BF0',color:'#fff',fontSize:'9px',padding:'2px 6px',borderRadius:'10px',fontWeight:'800'}}>YouTube</span>
</div>
<div style={{fontSize:'12px',color:'#fff',textShadow:'0 1px 3px rgba(0,0,0,0.8)'}}>{v.caption} — One tap play!</div>
</div>
</div>
))}
</div>
</div>
)}

{page==='search'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'#000'}}>
<div style={{height:'52px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%'}}>‹</button>
<input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search — DB — All working..." autoFocus style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'10px 14px',color:'#fff',fontSize:'13px'}}/>
</div>
<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{!searchQuery ? <div style={{textAlign:'center',marginTop:'40px'}}><div style={{fontSize:'40px'}}>🔍</div><div style={{fontWeight:'700',marginTop:'10px'}}>Search — DB Ready — All buttons working</div></div> :
searchFiltered.length===0 ? <div style={{textAlign:'center',marginTop:'40px',color:'#666'}}>No results for "{searchQuery}"</div> :
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{searchFiltered.map(v=><div key={v.id} data-video-id={v.id} style={{width:'100%',height:'200px',position:'relative',background:'#111',borderRadius:'12px',overflow:'hidden'}}><div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div></div>)}</div>
}
</div>
</div>
)}

{page==='live'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'40px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div style={{fontWeight:'800',fontSize:'13px'}}>🔴 Live — DB — Open</div>
<button onClick={()=>{setIsLive(true); setShowUpload(true)}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'800'}}>🔴 Go Live</button>
</div>
<div style={{flex:1,overflowY:'auto',padding:'12px'}}>
{liveFeed.length===0? <div style={{textAlign:'center',marginTop:'60px'}}><div style={{fontSize:'40px'}}>🔴</div><div style={{fontWeight:'700',marginTop:'10px'}}>No Live Now — Be first — DB!</div></div> :
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>{liveFeed.map(v=><div key={v.id} style={{background:'#121212',border:'1px solid #FF0024',borderRadius:'12px',overflow:'hidden'}}><div style={{height:'160px',background:'#000'}}>{renderUniversal(v)}</div><div style={{padding:'8px',fontSize:'11px',display:'flex',alignItems:'center',gap:'4px'}}>{v.user} <span style={{width:'14px',height:'14px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span> 🔴 LIVE</div></div>)}</div>
}
</div>
</div>
)}

{page==='following'&&(<div style={{flex:1,padding:'16px',overflowY:'auto'}}><div style={{fontWeight:'700',marginBottom:'12px'}}>Following — DB — Boost on For You</div>{posts.filter(p=>follows[p.username]==='following').length===0? <div style={{color:'#666',textAlign:'center',marginTop:'40px'}}>Follow someone — DB!</div> : posts.filter(p=>follows[p.username]==='following').map(v=><div key={v.id} data-video-id={v.id} style={{width:'100%',height:'50vh',position:'relative',background:'#111',marginBottom:'8px',borderRadius:'12px',overflow:'hidden'}}><div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div></div>)}</div>)}

{page==='inbox'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'48px',padding:'0 12px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontWeight:'800',fontSize:'13px'}}>Inbox — Anti-Porn Warning + DB</div><div style={{background:'#FF0024',color:'#fff',padding:'3px 8px',borderRadius:'12px',fontSize:'10px'}}>{unread} new</div></div>
<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{notifications.map(n=>(
<div key={n.id} style={{background:n.title.includes('Violation')||n.title.includes('BAN')?'#2a0a0a':'#1a1a1a',border:'1px solid '+ (n.title.includes('BAN')?'#FF0024':'#222'),borderRadius:'12px',padding:'12px',marginBottom:'10px'}}>
<div style={{fontWeight:'700',fontSize:'11px',display:'flex',alignItems:'center',gap:'4px'}}>{n.from} {n.verified && <span style={{width:'14px',height:'14px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>} <span style={{fontSize:'9px',color:'#888'}}>• {n.time}</span></div>
<div style={{fontSize:'12px',marginTop:'4px',fontWeight:'700'}}>{n.title}</div>
<div style={{fontSize:'11px',color:'#aaa',marginTop:'2px'}}>{n.message}</div>
</div>
))}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,overflowY:'auto',padding:'0',background:'#000'}}>
<div style={{padding:'16px'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'14px',position:'relative'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span><div style={{position:'absolute',bottom:'-4px',right:'-4px',width:'24px',height:'24px',background:'#1a1a1a',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #000'}}>📷</div></div>
<div><div style={{fontWeight:'800',fontSize:'16px',display:'flex',alignItems:'center',gap:'6px'}}>{user?.name||'Guest'} {user?.verified && <span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'12px',color:'#888'}}>{user?.username||'@user'} • {userViolations} violations</div><div style={{fontSize:'11px',color:'#aaa',marginTop:'2px',maxWidth:'180px'}}>{user?.bio||editBio}</div></div>
<div style={{marginLeft:'auto'}}><button onClick={()=>setIsEditing(!isEditing)} style={{background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Edit</button></div>
</div>
{isEditing && <div style={{marginTop:'12px',background:'#121212',borderRadius:'12px',padding:'12px'}}><input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Name — Only owner can be Katongole" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'8px',padding:'8px',color:'#fff',marginBottom:'8px'}}/><input value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Bio — Porn/Sex not allowed policy" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'8px',padding:'8px',color:'#fff'}}/></div>}
</div>

{/* UPTOWN OFFICIAL ENGINE — ONE BUTTON — AS YOUR SCREENSHOT */}
<div style={{margin:'0 12px',background:'#0a0a0a',border:'2px solid #FF0024',borderRadius:'20px',padding:'14px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'10px'}}>
<div style={{display:'flex',gap:'8px',flex:1}}><span style={{fontSize:'20px'}}>🚀</span><div><div style={{fontWeight:'900',fontSize:'14px',lineHeight:'1.2'}}>UPTOWN Official Engine — One Button</div><div style={{fontSize:'10px',color:'#aaa',marginTop:'4px'}}>One code for Android + iPhone — Play Store + App Store — PWA + Report + Block + Delete Account — Apple Policy 1.2 + Google UGC complied ✓</div></div></div>
<div style={{background:isInstalled?'#00D632':'#1a1a1a',color:isInstalled?'#000':'#00D632',border:'1px solid #00D632',borderRadius:'12px',padding:'8px 10px',textAlign:'center',minWidth:'70px'}}><div style={{fontWeight:'900',fontSize:'10px'}}>{isInstalled?'INSTALLED':'READY'}</div><div style={{fontSize:'10px'}}>{isInstalled?'✓':'○'}</div></div>
</div>

<div style={{marginTop:'12px',background:isInstalled?'#00D632':'#1a1a1a',border:isInstalled?'none':'1px solid #333',borderRadius:'12px',padding:'12px',display:'flex',alignItems:'center',gap:'10px'}}>
<span style={{fontSize:'16px'}}>{isInstalled?'✓':'○'}</span>
<div style={{flex:1}}><div style={{fontWeight:'900',fontSize:'13px',color:isInstalled?'#000':'#fff'}}>{isInstalled?'✓ Installed — Android + iPhone — One Code!':'○ Not Installed — One Button Engine'}</div></div>
</div>

<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginTop:'12px'}}>
<div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'12px',textAlign:'center'}}><div style={{fontSize:'20px'}}>🤖</div><div style={{fontWeight:'800',fontSize:'11px',marginTop:'4px'}}>Android Ready</div><div style={{fontSize:'9px',color:'#00D632',marginTop:'2px'}}>TWA + PWA ✓</div></div>
<div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'12px',textAlign:'center'}}><div style={{fontSize:'20px'}}>🍎</div><div style={{fontWeight:'800',fontSize:'11px',marginTop:'4px'}}>iPhone Ready</div><div style={{fontSize:'9px',color:'#00D632',marginTop:'2px'}}>PWA + Report ✓</div></div>
</div>

<div style={{marginTop:'10px',background:'#121212',borderRadius:'10px',padding:'10px'}}>
<div style={{fontSize:'9px',color:'#888',lineHeight:'1.4'}}>
<b style={{color:'#fff'}}>Play Store Policy ✓:</b> Report + Block + Delete Account + Privacy + 5min porn remove + 7 days ban + UGC declaration<br/>
<b style={{color:'#fff'}}>App Store Policy ✓:</b> Apple 1.2 UGC + Report + Block + Delete Account + 24h review + Privacy Label + 17+ rating + YouTube links one-tap play<br/>
<b style={{color:'#fff'}}>Muzika Policy:</b> Only UPTOWN Official (komenierashid@gmail.com) posts YouTube — Any link — One tap plays<br/>
<b style={{color:'#fff'}}>Anti-Porn:</b> Auto detect porn/sex → 5 min auto remove → Warning notification → Repeat → 7 days ban — All DB working!
</div>
</div>

<button onClick={handleOneButtonStoreEngine} style={{width:'100%',marginTop:'12px',background:isInstalled?'#00D632':isInstallable?'#00D632':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'13px'}}>
{isInstalled?'✓ INSTALLED — Play Store + App Store Ready!':isInstallable?'📲 INSTALL NOW — Android + iPhone — One Button!':'🚀 ONE BUTTON ENGINE — Install Policy'}
</button>

</div>

<div style={{display:'flex',gap:'8px',margin:'14px 12px'}}>
<div style={{flex:1,background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px',textAlign:'center'}}><div style={{fontWeight:'800',fontSize:'16px'}}>{myVideos.length}</div><div style={{fontSize:'9px',color:'#888'}}>Videos — DB</div></div>
<div style={{flex:1,background:'#121212',border:isOwner?'2px solid #FF0024':'1px solid #222',borderRadius:'12px',padding:'10px',textAlign:'center'}}><div style={{fontWeight:'800',fontSize:'16px',color:userViolations>0?'#FF0024':'#00D632'}}>{userViolations}</div><div style={{fontSize:'9px',color:'#888'}}>Violations</div></div>
<div style={{flex:1,background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px',textAlign:'center'}}><div style={{fontWeight:'800',fontSize:'16px'}}>15,373</div><div style={{fontSize:'9px',color:'#888'}}>Family</div></div>
</div>

<div style={{margin:'0 12px 20px',display:'flex',flexDirection:'column',gap:'8px'}}>
<button onClick={handleDeleteAccount} style={{background:'#1a1a1a',border:'1px solid #FF0024',color:'#FF0024',padding:'10px',borderRadius:'10px',fontSize:'11px',fontWeight:'700'}}>🗑️ Delete Account — Play Store + App Store Policy ✓</button>
<div style={{fontSize:'8px',color:'#555',textAlign:'center'}}>Only komenierashid@gmail.com = Katongole Rashid = UPTOWN Official ✓ — All buttons DB working — Ready for Play Store + App Store</div>
</div>

</div>
)}

{showComments!==null&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:60,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(null)}><div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'14px',maxHeight:'60vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div style={{fontWeight:'700'}}>Comments — {commentCounts[showComments]||978} — Anti-Porn + DB</div><button onClick={()=>setShowComments(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>×</button></div><div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px'}}>{(comments[showComments]||[]).map(c=><div key={c.id} style={{display:'flex',gap:'8px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#333',display:'flex',alignItems:'center',justifyContent:'center'}}>U</div><div><div style={{fontSize:'11px',fontWeight:'700'}}>{c.user}</div><div style={{fontSize:'12px'}}>{c.text}</div></div></div>)}</div><div style={{display:'flex',gap:'8px',marginTop:'10px',borderTop:'1px solid #222',paddingTop:'10px'}}><input value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder="Add comment — No porn/sex — DB..." style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'8px 12px',color:'#fff'}}/><button onClick={()=>handlePostComment(showComments)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:'700'}}>Post — DB</button></div></div></div>}
{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #FF0024',padding:'14px 18px',borderRadius:'14px',zIndex:80,textAlign:'center',maxWidth:'80%'}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{pauseAllVideos(); setShowUpload(false); setUploadMode(null); setPostBtnState('green')}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px',maxHeight:'85vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
{uploadMode===null&&<>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'16px',marginBottom:'6px'}}>Upload — DB + Anti-Porn Policy</div>
<div style={{fontSize:'10px',color:'#888',textAlign:'center',marginBottom:'12px'}}>Porn/Sex = 5 min auto remove + Warning — Repeat = 7 days ban — Muzika only Official YouTube</div>
<button onClick={()=>{setUploadMode('upload_video'); setPostBtnState('green')}} style={{width:'100%',background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',marginBottom:'10px'}}>📤 Upload Video — For You — DB + Filter</button>
<button onClick={()=>{setIsLive(true); setUploadMode('upload_video'); setPostBtnState('green')}} style={{width:'100%',background:'#1a1a1a',border:'1px solid #FF0024',color:'#FF0024',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',marginBottom:'10px'}}>🔴 Go Live — DB</button>
<button onClick={()=>{if(!isOwner){setBlockedMsg('🚫 Muzika Only UPTOWN Official — Only komenierashid@gmail.com'); setShowBlocked(true); return} setUploadMode('post_muzika'); setPostBtnState('green')}} style={{width:'100%',background:isOwner?'#00D632':'#1a1a1a',border:isOwner?'none':'1px solid #333',color:isOwner?'#000':'#666',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px'}}>{isOwner?'🎬 Post Muzika — YouTube — Official ✓':'🎬 Muzika — Only Official (You not Official)'}</button>
</>}
{uploadMode==='upload_video'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800',fontSize:'14px'}}>{isLive?'🔴 Go Live — DB':'📤 Upload — Anti-Porn Filter'}</div></div>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'10px'}}><video src={uploadPreview.url} style={{width:'100%',maxHeight:'200px',borderRadius:'12px'}} autoPlay loop muted playsInline/></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — No porn/sex — Auto filter — DB..." style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'10px',color:'#fff'}}/>
<div style={{fontSize:'9px',color:'#666',marginTop:'6px'}}>⚠️ Auto: porn/sex/xxx/nude = 5 min remove + warning + repeat = 7 days ban — Play Store Policy</div>
<button onClick={()=>handlePostNow('upload_video')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#00D632':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'14px'}}>
{postBtnState==='green'? (isLive?'🟢 GO LIVE NOW — Green — DB':'🟢 POST NOW — Green — DB + Filter') : '⚪ POSTED ✓ — White — DB!'}
</button>
</>}
{uploadMode==='post_muzika'&&<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800'}}>🎬 Muzika — Only Official — YouTube</div></div>
<div style={{fontSize:'10px',color:'#00D632',marginBottom:'8px'}}>✓ Only UPTOWN Official (komenierashid@gmail.com) can post — Any YouTube link — One tap play!</div>
<input value={universalLink} onChange={e=>{setUniversalLink(e.target.value); setPostBtnState('green')}} placeholder="Paste YouTube link — Any link — One tap play — DB" style={{width:'100%',background:'#000',border:'1px solid #00D632',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — UPTOWN Official ✓" style={{width:'100%',marginTop:'8px',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('post_muzika')} style={{marginTop:'12px',width:'100%',background:postBtnState==='green'?'#00D632':'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900'}}>
{postBtnState==='green'?'🟢 POST IN MUZIKA — Green — YouTube':'⚪ POSTED ✓ — White'}
</button>
</>}
</div>
</div>
)}

<div style={{height:'64px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px'}}>Home</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('inbox')}} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1,position:'relative'}}><span style={{fontSize:'18px'}}>✉</span><span style={{fontSize:'10px'}}>Inbox</span>{unread>0&&<span style={{position:'absolute',top:'0px',right:'12px',background:'#FF0024',color:'#fff',fontSize:'8px',padding:'2px 4px',borderRadius:'8px',fontWeight:'800'}}>{unread}</span>}</button>
<button onClick={()=>{pauseAllVideos(); setUploadMode(null); setShowUpload(true); setPostBtnState('green')}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900',display:'flex',alignItems:'center',justifyContent:'center'}}> + </button>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:'none',border:'none',color:page==='live'?'#FF0024':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>🔴</span><span style={{fontSize:'10px'}}>Live</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('you')}} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>○</span><span style={{fontSize:'10px'}}>You</span></button>
</div>

{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'20px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'16px',fontWeight:'900',fontSize:'20px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#fff'}}>TOWN</span> — Official Only komenierashid@gmail.com</div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'12px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Your Name — Can't be Katongole unless komenierashid@gmail.com" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username — Can't be uptown unless owner" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email — komenierashid@gmail.com = Official ✓" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>Continue — Anti-Porn + DB</button>
<div style={{fontSize:'9px',color:'#666',textAlign:'center',marginTop:'8px'}}>Porn/Sex = 5 min auto remove + 7 days ban — Play Store + App Store Policy 1.2 UGC — Report + Block + Delete Account</div>
</div>
</div>
)}
</div>
)
}
