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
const [userName,setUserName]=useState('')
const [userBio,setUserBio]=useState('')
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
const [notifications,setNotifications]=useState([])
const [blueRequests,setBlueRequests]=useState([])
const [userVerified,setUserVerified]=useState(false)
const [youTab,setYouTab]=useState('videos')
const videoRefs=useRef({})

// UPTOWN OFFICIAL - ONLY Katongole Rashid with komenierashid@gmail.com CAN CONTROL
const officialVideos=[
{id:101,user:'Katongole Rashid',username:'@uptown',realOwner:'komenierashid@gmail.com',verified:true,caption:'UPTOWN Official ✓ Controlled only by Katongole Rashid — komenierashid@gmail.com', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video',views:12400},
{id:102,user:'Katongole Rashid',username:'@uptown',realOwner:'komenierashid@gmail.com',verified:true,caption:'Only owner can verify requests & post Muzika', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video',views:8920},
{id:103,user:'Katongole Rashid',username:'@uptown',realOwner:'komenierashid@gmail.com',verified:true,caption:'UPTOWN Official — Control account — No one can check', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', mediaType:'video',views:15600},
]

useEffect(()=>{
const t=setTimeout(()=>{setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sP=localStorage.getItem('uptown_posts_final_v4')
const sNot=localStorage.getItem('uptown_notifications_v2')
const sBlue=localStorage.getItem('uptown_blue_requests_v2')
const sVer=localStorage.getItem('uptown_user_verified_v2')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sP) setPosts(JSON.parse(sP))
if(sNot) setNotifications(JSON.parse(sNot))
else{
const init=[
{id:1,type:'blue_request',from:'Katongole Rashid',username:'@uptown',verified:true,time:'2m ago',title:'Get Verified ✓',message:'UPTOWN Official (Katongole Rashid) is asking if you want blue tick? Tap to request — Only komenierashid@gmail.com can approve!',read:false},
{id:2,type:'general',from:'Katongole Rashid',username:'@uptown',verified:true,time:'10m ago',title:'UPTOWN Official Control',message:'This account is controlled only by Katongole Rashid — komenierashid@gmail.com — No one can check this account!',read:false},
]
setNotifications(init)
}
if(sBlue) setBlueRequests(JSON.parse(sBlue))
if(sVer) setUserVerified(sVer==='true')
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su)
setUser(u)
setUserName(u.name)
if(sO==='true'){
setIsOwner(true)
setUserVerified(true)
}else{
setIsOwner(false)
}
}
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

// ONLY Katongole Rashid with komenierashid@gmail.com IS UPTOWN OFFICIAL WITH BLUE TICK
const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const isOfficialEmail=email==='komenierashid@gmail.com'
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')

if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); setBlockedMsg('Account exists — Login'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const nu={id:Date.now(),name:isOfficialEmail?'Katongole Rashid':authForm.name,username:isOfficialEmail?'@uptown':'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficialEmail,isOfficial:isOfficialEmail}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified,isOfficial:nu.isOfficial}
localStorage.setItem('uptown_user',JSON.stringify(lu))
localStorage.setItem('uptown_is_owner',isOfficialEmail?'true':'false')
localStorage.setItem('uptown_user_verified_v2',isOfficialEmail?'true':'false')
setUser(lu); setUserName(lu.name); setIsOwner(isOfficialEmail); setUserVerified(isOfficialEmail); setShowAuth(false)
setBlockedMsg(isOfficialEmail?'✓ Welcome Katongole Rashid — UPTOWN Official Control ✓':'✓ Account created — Regular user'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!isOfficialEmail){setBlockedMsg('No account — Sign Up'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const lu=isOfficialEmail?{name:'Katongole Rashid',username:'@uptown',email,verified:true,isOfficial:true}:{name:found.name,username:found.username,email:found.email,verified:found.verified||false,isOfficial:false}
localStorage.setItem('uptown_user',JSON.stringify(lu))
localStorage.setItem('uptown_is_owner',isOfficialEmail?'true':'false')
localStorage.setItem('uptown_user_verified_v2',lu.verified?'true':'false')
setUser(lu); setUserName(lu.name); setIsOwner(isOfficialEmail); setUserVerified(lu.verified); setShowAuth(false)
}
}

// + BUTTON FOR FOLLOW - REMOVE WORD UNDER + BUTTON
const handleFollow=(username)=>{
// If trying to follow UPTOWN Official — check if owner
if(username==='@uptown' && !isOwner){
// No one can check uptown official account — but can follow
}
const nf={...follows,[username]:follows[username]==='following'?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))
}

const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf)}
const handlePin=(id)=>{const np={...pinned,[id]:!pinned[id]}; setPinned(np); localStorage.setItem('uptown_pinned',JSON.stringify(np))}

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

// NO ONE CAN CHECK UPTOWN OFFICIAL ACCOUNT - IT IS CONTROL
const handleCheckOfficialAccount=()=>{
if(!isOwner){
setBlockedMsg('⛔ UPTOWN Official is control account — Only Katongole Rashid (komenierashid@gmail.com) can control it! You cannot check this account.')
setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2500)
return false
}
return true
}

const handlePostNow=()=>{
// MUZIKA — ONLY OWNER CAN POST VIDEOS AND LINKS FOR OTHERS TO WATCH
if(page==='muzika' && !isOwner){
setBlockedMsg('⛔ Only Katongole Rashid (UPTOWN Official) can post in Muzika — Others can only watch!')
setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2500)
return
}
let mediaUrl=null; let mediaType='video'
if(youtubeLink){const ytId=getYoutubeId(youtubeLink); if(!ytId){setBlockedMsg('Invalid YouTube'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return} mediaUrl=youtubeLink; mediaType='youtube'}
else if(uploadBase64){mediaUrl=uploadBase64; mediaType=uploadType==='picture'?'image':'video'}
else{setBlockedMsg('Choose file'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const np={id:Date.now(),user:isOwner?'Katongole Rashid':userName,username:isOwner?'@uptown':user?.username||'@user',verified:isOwner?true:userVerified,caption:uploadCaption||(isOwner?'UPTOWN Official ✓':'User post'),mediaUrl,mediaType,isMuzika:page==='muzika',views:0,isOfficial:isOwner}
const newPosts=[np,...posts]; setPosts(newPosts); localStorage.setItem('uptown_posts_final_v4',JSON.stringify(newPosts))
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setYoutubeLink(''); setShowUpload(false)
setBlockedMsg(isOwner?'✓ Video posted as UPTOWN Official — Others can watch in Muzika!':'✓ Video posted!'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage('foryou')},2000)
}

const handleNotificationTap=(not)=>{
if(not.type==='blue_request'){
if(!isOwner && userVerified){
setBlockedMsg('Already verified ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return
}
if(isOwner){
// Owner cannot request himself
setBlockedMsg('You are the owner — You control verification!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
return
}
const newReq={id:Date.now(),name:userName,username:user?.username||'@user',email:user?.email,status:'pending',time:new Date().toLocaleString()}
const updatedReq=[...blueRequests,newReq]
setBlueRequests(updatedReq)
localStorage.setItem('uptown_blue_requests_v2',JSON.stringify(updatedReq))
const sentNot={id:Date.now(),type:'general',from:'Katongole Rashid',username:'@uptown',verified:true,time:'Just now',title:'Request Sent ✓',message:'Your blue tick request sent to Katongole Rashid (UPTOWN Official) — Waiting approval... Only komenierashid@gmail.com can approve!',read:false}
const updatedNot=notifications.map(n=>n.id===not.id?{...n,read:true}:n)
const finalNot=[sentNot,...updatedNot]
setNotifications(finalNot)
localStorage.setItem('uptown_notifications_v2',JSON.stringify(finalNot))
setBlockedMsg('Request sent to Katongole Rashid ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
}else{
const updated=notifications.map(n=>n.id===not.id?{...n,read:true}:n)
setNotifications(updated)
localStorage.setItem('uptown_notifications_v2',JSON.stringify(updated))
}
}

const handleApproveBlueTick=(reqId)=>{
if(!isOwner){
setBlockedMsg('Only Katongole Rashid can approve!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return
}
const approved=blueRequests.map(r=>r.id===reqId?{...r,status:'approved'}:r)
setBlueRequests(approved)
localStorage.setItem('uptown_blue_requests_v2',JSON.stringify(approved))
const approvedNot={id:Date.now(),type:'verified',from:'Katongole Rashid',username:'@uptown',verified:true,time:'Just now',title:'Congratulations! Verified ✓',message:'Congratulations! You are verified by Katongole Rashid — UPTOWN Official! You get automatically blue tick! Only komenierashid@gmail.com controls this!',read:false}
const finalNot=[approvedNot,...notifications]
setNotifications(finalNot)
localStorage.setItem('uptown_notifications_v2',JSON.stringify(finalNot))
setBlockedMsg('✓ Approved — User gets blue tick!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}

if(splash){
return(
<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<style>{`@keyframes pulse {0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}`}</style>
<svg width="160" height="190" viewBox="0 0 200 230" style={{animation:'pulse 1.2s infinite'}}><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
<div style={{marginTop:'20px',fontWeight:'700',fontSize:'12px',color:'#888'}}>UPTOWN — Only Katongole Rashid Controls</div>
</div>
)
}

const forYouFeed=[...posts,...officialVideos].sort((a,b)=> (pinned[b.id]?1:0) - (pinned[a.id]?1:0))

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
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column'}}>
{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'24px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'20px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg><div style={{fontSize:'11px',color:'#FF0024',marginTop:'8px',fontWeight:'700'}}>Only Katongole Rashid — komenierashid@gmail.com — is UPTOWN Official ✓</div></div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'16px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'12px',borderRadius:'16px',fontWeight:'800'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'12px',borderRadius:'16px',fontWeight:'800'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Your Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email — komenierashid@gmail.com = Owner Official" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'16px',borderRadius:'12px',fontWeight:'900'}}>{authMode==='signup'?'Sign Up':'Login'}</button>
<div style={{fontSize:'10px',color:'#666',textAlign:'center'}}>Only komenierashid@gmail.com gets UPTOWN Official blue tick + control</div>
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
const isOfficialPost=v.username==='@uptown' || v.isOfficial
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{width:'100%',height:'100%'}}>{renderVideo(v)}</div>
{isPaused&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',width:'70px',height:'70px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',zIndex:5,pointerEvents:'none'}}>▶</div>}
{pinned[v.id]&&<div style={{position:'absolute',top:'12px',left:'12px',background:'#FFD700',color:'#000',padding:'4px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'800',zIndex:2}}>📌 Pinned</div>}
{isOfficialPost&&<div style={{position:'absolute',top:'12px',right:'12px',background:'#1D9BF0',color:'#fff',padding:'4px 10px',borderRadius:'20px',fontSize:'9px',fontWeight:'800',zIndex:2}}>CONTROL ACCOUNT</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,maxWidth:'62%',pointerEvents:'none'}}>
<div style={{fontWeight:'700',display:'flex',gap:'6px',alignItems:'center'}} onClick={e=>{e.stopPropagation(); handleCheckOfficialAccount()}}>{v.user} {v.verified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div>
<div style={{fontSize:'10px',color:'#888',marginTop:'4px'}}>Tap screen pause/play</div>
</div>
<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:3,display:'flex',flexDirection:'column',gap:'18px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
{/* + BUTTON FOR FOLLOW - REMOVE WORD UNDER + BUTTON */}
<button onClick={()=>handleFollow(v.username)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'52px',height:'52px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',border:isFollowing?'2px solid #00D632':'2px solid #fff'}}>
<span style={{fontWeight:'900',fontSize:'11px',color:'#000'}}>UP</span>
{/* + BUTTON ONLY - NO WORD UNDER */}
<div style={{position:'absolute',bottom:'-6px',left:'50%',transform:'translateX(-50%)',background:isFollowing?'#00D632':'#FF0024',color:'#fff',width:'22px',height:'22px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:'900',border:'2px solid #000'}}>{isFollowing?'✓':'+'}</div>
</div>
</button>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:likes[v.id]?'#FF0024':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'24px'}}>{likes[v.id]?'♥':'♡'}</span></button>
<button onClick={()=>handleFire(v.id)} style={{background:'none',border:'none',color:likes['fire_'+v.id]?'#FF6A00':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>🔥</span></button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',color:favorites[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>{favorites[v.id]?'★':'☆'}</span></button>
<button onClick={()=>handlePin(v.id)} style={{background:'none',border:'none',color:pinned[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'18px'}}>📌</span></button>
</div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,display:'flex',flexDirection:'column'}}>
<div style={{padding:'12px 16px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontWeight:'700',fontSize:'13px'}}>{isOwner?'Muzika — You Control (Katongole Rashid) ✓':'Muzika — Only UPTOWN Official can post'}</div><div style={{fontSize:'10px',color:'#888'}}>{isOwner?'You can post videos & YouTube links for others to watch':'Only komenierashid@gmail.com can post here'}</div></div>
{isOwner?<button onClick={()=>{setUploadType('video'); setShowUpload(true)}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>+ Post Muzika</button>:<div style={{fontSize:'10px',color:'#FF0024'}}>Watch only</div>}
</div>
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{[...posts.filter(p=>p.isMuzika),...officialVideos].map(v=>{
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{width:'100%',height:'100%'}}>{renderVideo(v)}</div>
{pausedMap[v.id]&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',width:'70px',height:'70px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',zIndex:5,pointerEvents:'none'}}>▶</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,pointerEvents:'none'}}><div style={{fontWeight:'700',display:'flex',gap:'6px'}}>{v.user} ✓ Control</div><div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div></div>
</div>
)})}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,overflowY:'auto',padding:'16px'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:profilePic?`url(${profilePic})`:'#fff',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',color:'#000',border:isOwner?'2px solid #1D9BF0':'2px solid #333',position:'relative'}}>
{!profilePic&&'UP'}
<div style={{position:'absolute',bottom:'-4px',right:'-4px',background:'#FF0024',width:'22px',height:'22px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:'#fff'}}>📷</div>
</div>
<div>
<div style={{fontWeight:'800',display:'flex',gap:'6px'}}>{userName} {isOwner&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'12px',color:'#888'}}>{user?.username} {isOwner&&'• CONTROL ACCOUNT — Katongole Rashid'}</div>
<div style={{fontSize:'11px',color:isOwner?'#1D9BF0':'#666'}}>{isOwner?'Only you control UPTOWN Official ✓ komenierashid@gmail.com':'Regular user — Cannot control Official'}</div>
</div>
</div>
<div style={{marginTop:'16px',background:isOwner?'#0a1a2a':'#121212',border:isOwner?'1px solid #1D9BF0':'1px solid #222',borderRadius:'12px',padding:'12px'}}>
<div style={{fontSize:'12px',fontWeight:'700'}}>{isOwner?'✓ You are UPTOWN Official Control':'Regular Account'}</div>
<div style={{fontSize:'11px',color:'#888',marginTop:'4px'}}>{isOwner?'You can verify requests, post Muzika videos & links for others to watch. No one can check your Official account because it is control of application.':'Only Katongole Rashid with komenierashid@gmail.com can use UPTOWN Official with blue tick'}</div>
</div>
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{padding:'16px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:'800'}}>Inbox — {isOwner?'Control — Approve requests':'Notifications'}</div>{isOwner&&<div style={{background:'#1D9BF0',padding:'4px 10px',borderRadius:'20px',fontSize:'10px'}}>CONTROL</div>}</div>
<div style={{flex:1,overflowY:'auto',padding:'12px'}}>
{isOwner&&blueRequests.length>0&&(
<div style={{marginBottom:'16px'}}>
<div style={{fontWeight:'700',fontSize:'13px',marginBottom:'8px'}}>🔵 Blue Tick Requests — Only you can approve (Katongole Rashid)</div>
{blueRequests.map(r=>(
<div key={r.id} style={{background:'#121212',border:'1px solid #1D9BF0',padding:'12px',borderRadius:'12px',marginBottom:'8px'}}>
<div style={{display:'flex',justifyContent:'space-between'}}>
<div><div style={{fontWeight:'700',fontSize:'12px'}}>{r.name} {r.username}</div><div style={{fontSize:'11px',color:r.status==='approved'?'#00D632':'#FF0024'}}>{r.status} • {r.time}</div><div style={{fontSize:'10px',color:'#888'}}>{r.email}</div></div>
{r.status==='pending'&&<button onClick={()=>handleApproveBlueTick(r.id)} style={{background:'#1D9BF0',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Approve ✓</button>}
</div>
</div>
))}
</div>
)}
{notifications.map(n=>(
<div key={n.id} onClick={()=>handleNotificationTap(n)} style={{background:n.read?'#121212':'#1a1a1a',border:n.type==='blue_request'?'1px solid #1D9BF0':'1px solid #222',borderRadius:'16px',padding:'14px',marginBottom:'10px',cursor:'pointer'}}>
<div style={{fontWeight:'700',fontSize:'12px',display:'flex',gap:'6px'}}>{n.from} {n.verified&&'✓'} <span style={{fontSize:'10px',color:'#666'}}>{n.time}</span></div>
<div style={{fontWeight:'700',fontSize:'12px',marginTop:'4px',color:n.type==='blue_request'?'#1D9BF0':'#fff'}}>{n.title}</div>
<div style={{fontSize:'12px',color:'#aaa',marginTop:'4px'}}>{n.message}</div>
{n.type==='blue_request'&&!isOwner&&<div style={{marginTop:'8px',background:'#1D9BF0',color:'#fff',padding:'8px',borderRadius:'10px',textAlign:'center',fontSize:'11px',fontWeight:'700'}}>TAP TO REQUEST BLUE TICK — Katongole Rashid will approve</div>}
</div>
))}
</div>
</div>
)}

{page==='following'&&<div style={{flex:1,padding:'20px'}}>Following</div>}
{page==='live'&&<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>🔴 LIVE</div>}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'16px 20px',borderRadius:'14px',zIndex:80,textAlign:'center',maxWidth:'85%'}}><div style={{fontWeight:'700',fontSize:'13px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'24px',borderTopRightRadius:'24px',padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center'}}>{page==='muzika'?isOwner?'Post to Muzika — Only you (Katongole Rashid) can post':'Cannot post — Only Official can post Muzika':'Post — '+userName}</div>
{page==='muzika'&&!isOwner?(
<div style={{marginTop:'20px',textAlign:'center',padding:'20px',background:'#1a1a1a',borderRadius:'12px'}}>
<div style={{fontSize:'14px',fontWeight:'700',color:'#FF0024'}}>⛔ Only Katongole Rashid can post in Muzika</div>
<div style={{fontSize:'12px',color:'#888',marginTop:'8px'}}>Muzika is controlled by UPTOWN Official (komenierashid@gmail.com). Others can only watch videos and links.</div>
<button onClick={()=>setShowUpload(false)} style={{marginTop:'16px',background:'#222',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'12px'}}>Close</button>
</div>
):(
<>
<div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
{[{label:'📹 Video',type:'video'},{label:'🖼️ Pictures',type:'picture'},{label:'👥 Duet',type:'duet'}].map(t=>(
<button key={t.type} onClick={()=>setUploadType(t.type)} style={{flex:1,background:uploadType===t.type?'#fff':'#1a1a1a',color:uploadType===t.type?'#000':'#888',border:'none',padding:'12px 6px',borderRadius:'12px',fontSize:'11px',fontWeight:'700'}}>{t.label}</button>
))}
</div>
<div style={{marginTop:'14px',background:'#1a1a1a',borderRadius:'12px',padding:'12px'}}>
<input value={youtubeLink} onChange={e=>setYoutubeLink(e.target.value)} placeholder="YouTube link..." style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
</div>
<input type="file" accept={uploadType==='picture'?'image/*':'video/*,image/*'} onChange={handleFileChange} style={{width:'100%',marginTop:'12px',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'12px'}}>{uploadPreview.type.startsWith('video')?<video src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}} autoPlay loop playsInline/>:<img src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}}/>}</div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'12px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
<button onClick={handlePostNow} style={{marginTop:'14px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>POST AS {isOwner?'UPTOWN OFFICIAL ✓ CONTROL':'USER'} ✓</button>
</>
)}
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
