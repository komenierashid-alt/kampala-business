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
const [follows,setFollows]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [posts,setPosts]=useState([])
const [pausedMap,setPausedMap]=useState({})
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [showShareMenu,setShowShareMenu]=useState(null)
const [notifications,setNotifications]=useState([])
const [blueRequests,setBlueRequests]=useState([])
const [userVerified,setUserVerified]=useState(false)
const videoRefs=useRef({})

const forYouTests=[
{id:101,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ Tap screen video pause — tap again play', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video'},
{id:102,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ Inbox has blue tick notification', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video'},
{id:103,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', mediaType:'video'},
]
const muzikaTests=[
{id:201,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ Muzika', mediaUrl:'https://www.youtube.com/watch?v=jNQXAC9IVRw', mediaType:'youtube'},
{id:202,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', mediaType:'video'},
{id:203,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', mediaType:'video'},
]

useEffect(()=>{
const t=setTimeout(()=>{setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sP=localStorage.getItem('uptown_posts_final')
const sPic=localStorage.getItem('uptown_profile_pic')
const sNot=localStorage.getItem('uptown_notifications')
const sBlue=localStorage.getItem('uptown_blue_requests')
const sVer=localStorage.getItem('uptown_user_verified')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sP) setPosts(JSON.parse(sP))
if(sPic) setProfilePic(sPic)
if(sBlue) setBlueRequests(JSON.parse(sBlue))
if(sVer) setUserVerified(sVer==='true')
if(sNot){
setNotifications(JSON.parse(sNot))
}else{
// INITIAL NOTIFICATIONS FROM UPTOWN OFFICIAL
const initNot=[
{id:1,type:'blue_request',from:'UPTOWN Official',username:'@uptown',verified:true,time:'2m ago',title:'Get Verified ✓',message:'UPTOWN Official is asking you if you want blue tick? Press this notification to request blue tick and UPTOWN Official will approve your request!',read:false},
{id:2,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'10m ago',title:'Welcome to UPTOWN',message:'Welcome to UPTOWN Official ✓ Follow, like, duet, download with logo!',read:false},
{id:3,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'1h ago',title:'New Feature',message:'You can now download videos with UPTOWN logo at end! Tap Share → Download',read:false},
]
setNotifications(initNot)
localStorage.setItem('uptown_notifications',JSON.stringify(initNot))
}
if(!su) setShowAuth(true)
else{setUser(JSON.parse(su)); if(sO==='true') setIsOwner(true)}
},2200)
return()=>clearTimeout(t)
},[])

// AUTO REMOVE BLUE TICK REQUEST NOTIFICATION WHEN VERIFIED
useEffect(()=>{
if(userVerified){
// Remove all blue_request notifications
const filtered=notifications.filter(n=>n.type!=='blue_request')
if(filtered.length!==notifications.length){
setNotifications(filtered)
localStorage.setItem('uptown_notifications',JSON.stringify(filtered))
}
}
},[userVerified])

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

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const ownerCheck=email==='komenierashid@gmail.com'
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const nu={id:Date.now(),name:authForm.name,username:'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:false}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:'UPTOWN Official',username:'@uptown',email,verified:false}; localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setIsOwner(ownerCheck); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!ownerCheck){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const lu={name:'UPTOWN Official',username:'@uptown',email,verified:false}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setIsOwner(ownerCheck); setShowAuth(false)
}
}

const handleFollow=(username)=>{const nf={...follows,[username]:follows[username]==='following'?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>setFavorites({...favorites,[id]:!favorites[id]})

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
reader.onload=(ev)=>{setProfilePic(ev.target.result); localStorage.setItem('uptown_profile_pic',ev.target.result)}
reader.readAsDataURL(file)
}

// INBOX BLUE TICK REQUEST LOGIC
const handleNotificationTap=(not)=>{
if(not.type==='blue_request'){
if(userVerified){
setBlockedMsg('You are already verified ✓ No need to request again!')
setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
return
}
// Create blue tick request
const newReq={id:Date.now(),name:user?.name||'User',username:user?.username||'@me',email:user?.email,status:'pending',time:new Date().toLocaleString()}
const updatedReq=[...blueRequests,newReq]
setBlueRequests(updatedReq)
localStorage.setItem('uptown_blue_requests',JSON.stringify(updatedReq))

// Add notification - request sent
const sentNot={id:Date.now(),type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'Request Sent ✓',message:'Your blue tick request sent to UPTOWN Official! Waiting for approval...',read:false}
const updatedNot=notifications.map(n=>n.id===not.id?{...n,read:true}:n)
const finalNot=[sentNot,...updatedNot]
setNotifications(finalNot)
localStorage.setItem('uptown_notifications',JSON.stringify(finalNot))
setBlockedMsg('Blue tick request sent to UPTOWN Official ✓ Waiting approval')
setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)

// AUTO APPROVE AFTER 3 SECONDS (simulate official approves)
setTimeout(()=>{
const approvedNot={id:Date.now()+1,type:'verified',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'Congratulations! You are Verified ✓',message:'Congratulations! You are verified and you get automatically blue tick! ✓ Welcome to UPTOWN Official verified family! You will not receive blue tick request notifications again.',read:false}
const afterApprove=[approvedNot,...finalNot.filter(n=>n.type!=='blue_request')]
setNotifications(afterApprove)
localStorage.setItem('uptown_notifications',JSON.stringify(afterApprove))
setUserVerified(true)
localStorage.setItem('uptown_user_verified','true')
// Update request status
const approvedReq=updatedReq.map(r=>r.id===newReq.id?{...r,status:'approved'}:r)
setBlueRequests(approvedReq)
localStorage.setItem('uptown_blue_requests',JSON.stringify(approvedReq))
},3000)
}else{
// Mark as read
const updated=notifications.map(n=>n.id===not.id?{...n,read:true}:n)
setNotifications(updated)
localStorage.setItem('uptown_notifications',JSON.stringify(updated))
}
}

const handleDownloadWithLogo=async(v)=>{
setBlockedMsg('Downloading with UPTOWN logo at end...'); setShowBlocked(true)
try{
const videoEl=document.createElement('video')
videoEl.crossOrigin='anonymous'
videoEl.src=v.mediaUrl
videoEl.muted=true
await new Promise(res=>{videoEl.onloadedmetadata=res})
const canvas=document.createElement('canvas')
canvas.width=videoEl.videoWidth||720
canvas.height=videoEl.videoHeight||1280
const ctx=canvas.getContext('2d')
const stream=canvas.captureStream(30)
const recorder=new MediaRecorder(stream,{mimeType:'video/webm'})
const chunks=[]
recorder.ondataavailable=e=>chunks.push(e.data)
recorder.onstop=()=>{
const blob=new Blob(chunks,{type:'video/webm'})
const url=URL.createObjectURL(blob)
const a=document.createElement('a')
a.href=url
a.download=`UPTOWN-${v.id}.webm`
a.click()
setBlockedMsg('Downloaded ✓ With UPTOWN logo at end!'); setTimeout(()=>setShowBlocked(false),2000)
}
recorder.start()
videoEl.currentTime=0
videoEl.play()
const draw=()=>{
if(videoEl.ended || videoEl.currentTime>=videoEl.duration){
let frames=0
const interval=setInterval(()=>{
ctx.fillStyle='#000'
ctx.fillRect(0,0,canvas.width,canvas.height)
const cx=canvas.width/2, cy=canvas.height/2-40
ctx.strokeStyle='white'
ctx.lineWidth=8
ctx.beginPath()
ctx.moveTo(cx,cy+80)
ctx.bezierCurveTo(cx-120,cy-40,cx-60,cy-100,cx,cy-20)
ctx.bezierCurveTo(cx+60,cy-100,cx+120,cy-40,cx,cy+80)
ctx.stroke()
ctx.fillStyle='#FF0024'
ctx.font='bold 48px Arial Black'
ctx.textAlign='center'
ctx.fillText('UP',cx-35,cy+20)
ctx.fillStyle='white'
ctx.fillText('TOWN',cx+35,cy+20)
frames++
if(frames>60){clearInterval(interval); recorder.stop()}
},33)
return
}
ctx.drawImage(videoEl,0,0,canvas.width,canvas.height)
ctx.fillStyle='rgba(0,0,0,0.4)'
ctx.fillRect(canvas.width-140,canvas.height-50,130,36)
ctx.fillStyle='#FF0024'
ctx.font='bold 14px Arial Black'
ctx.fillText('UP',canvas.width-130,canvas.height-26)
ctx.fillStyle='white'
ctx.fillText('TOWN',canvas.width-108,canvas.height-26)
requestAnimationFrame(draw)
}
draw()
}catch{
const a=document.createElement('a')
a.href=v.mediaUrl
a.download=`UPTOWN-${v.id}.mp4`
a.target='_blank'
a.click()
setBlockedMsg('Downloaded ✓'); setTimeout(()=>setShowBlocked(false),1500)
}
setShowShareMenu(null)
}

const handlePostNow=()=>{
let mediaUrl=null; let mediaType='video'
if(youtubeLink){const ytId=getYoutubeId(youtubeLink); if(!ytId){setBlockedMsg('Invalid YouTube'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return} mediaUrl=youtubeLink; mediaType='youtube'}
else if(uploadBase64){mediaUrl=uploadBase64; mediaType=uploadType==='picture'?'image':'video'}
else{setBlockedMsg('Choose file'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const np={id:Date.now(),user:'UPTOWN Official',username:'@uptown',verified:userVerified||true,caption:uploadCaption||'UPTOWN Official ✓',mediaUrl,mediaType,isMuzika:page==='muzika',isDuet:uploadType==='duet'}
const newPosts=[np,...posts]; setPosts(newPosts); localStorage.setItem('uptown_posts_final',JSON.stringify(newPosts))
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setYoutubeLink(''); setShowUpload(false)
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

const forYouFeed=[...posts.filter(p=>!p.isMuzika),...forYouTests]
const muzikaFeed=[...posts.filter(p=>p.isMuzika),...muzikaTests]

const renderVideo=(v)=>{
const ytId=getYoutubeId(v.mediaUrl)
if(v.mediaType==='youtube' || ytId){
return <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}?autoplay=0&controls=1&playsinline=1`} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%'}}/>
}
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'cover'}}/>
}

const unreadCount=notifications.filter(n=>!n.read).length

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column'}}>
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
{/* TAP ANYWHERE ON VIDEO TO PAUSE/PLAY */}
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{width:'100%',height:'100%'}}>{renderVideo(v)}</div>
{isPaused&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',width:'70px',height:'70px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',zIndex:5,pointerEvents:'none'}}>▶</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,maxWidth:'62%',pointerEvents:'none'}}>
<div style={{fontWeight:'700',display:'flex',gap:'6px'}}>{v.user} <span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span></div>
<div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div>
<div style={{fontSize:'10px',color:'#888',marginTop:'4px'}}>Tap screen to pause/play</div>
</div>
<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:3,display:'flex',flexDirection:'column',gap:'15px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<button onClick={()=>handleFollow(v.username)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',border:isFollowing?'2px solid #00D632':'2px solid #fff'}}><span style={{fontWeight:'900',fontSize:'10px',color:'#000'}}>UP</span><div style={{position:'absolute',bottom:'-5px',background:isFollowing?'#00D632':'#FF0024',color:'#fff',width:'18px',height:'18px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',border:'2px solid #000'}}>{isFollowing?'✓':'+'}</div></div><span style={{fontSize:'9px',color:'#fff',fontWeight:'700',marginTop:'4px',textAlign:'center'}}>{isFollowing?'Following\n✓':'Follow\nBack'}</span></button>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:likes[v.id]?'#FF0024':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>{likes[v.id]?'♥':'♡'}</span><span style={{fontSize:'10px'}}>Like</span></button>
<button onClick={()=>handleFire(v.id)} style={{background:'none',border:'none',color:likes['fire_'+v.id]?'#FF6A00':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>🔥</span><span style={{fontSize:'10px'}}>Fire</span></button>
<button onClick={()=>setShowShareMenu(showShareMenu===v.id?null:v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'18px'}}>↗</span><span style={{fontSize:'10px'}}>Share</span></button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',color:favorites[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>{favorites[v.id]?'★':'☆'}</span><span style={{fontSize:'10px'}}>Fav</span></button>
</div>
{showShareMenu===v.id&&(
<div style={{position:'absolute',right:'70px',bottom:'100px',background:'#1a1a1a',border:'1px solid #333',borderRadius:'16px',padding:'12px',zIndex:10,width:'200px'}} onClick={e=>e.stopPropagation()}>
<button onClick={()=>handleDownloadWithLogo(v)} style={{width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'10px',borderRadius:'10px',fontWeight:'700',fontSize:'12px'}}>⬇ Download + UPTOWN Logo at End</button>
</div>
)}
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,display:'flex',flexDirection:'column'}}>
<div style={{padding:'12px 16px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:'700',fontSize:'13px'}}>Muzika — UPTOWN Official ✓</div><button onClick={()=>{setUploadType('video'); setShowUpload(true)}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>+ Post</button></div>
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>{
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{width:'100%',height:'100%'}}>{renderVideo(v)}</div>
{pausedMap[v.id]&&v.mediaType!=='youtube'&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',width:'70px',height:'70px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',zIndex:5,pointerEvents:'none'}}>▶</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,pointerEvents:'none'}}><div style={{fontWeight:'700',display:'flex',gap:'6px'}}>{v.user} ✓</div><div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div><div style={{fontSize:'10px',color:'#888',marginTop:'4px'}}>Tap screen to pause/play</div></div>
</div>
)})}
</div>
</div>
)}

{/* INBOX - EVERY NOTIFICATIONS + BLUE TICK REQUEST */}
{page==='inbox'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{padding:'16px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div style={{fontWeight:'800',fontSize:'16px'}}>Inbox — {unreadCount} new</div>
{userVerified&&<div style={{background:'#1D9BF0',color:'#fff',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Verified ✓ Blue Tick</div>}
</div>
<div style={{flex:1,overflowY:'auto',padding:'12px'}}>
{notifications.length===0&&<div style={{textAlign:'center',marginTop:'40px',color:'#666'}}>No notifications</div>}
{notifications.map(n=>(
<div key={n.id} onClick={()=>handleNotificationTap(n)} style={{background:n.read?'#121212':'#1a1a1a',border:n.type==='blue_request'?'1px solid #1D9BF0':n.type==='verified'?'1px solid #00D632':'1px solid #222',borderRadius:'16px',padding:'14px',marginBottom:'10px',cursor:'pointer',position:'relative'}}>
{!n.read&&<div style={{position:'absolute',top:'14px',right:'14px',width:'8px',height:'8px',background:'#FF0024',borderRadius:'50%'}}></div>}
<div style={{display:'flex',gap:'10px',alignItems:'center'}}>
<div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'10px',color:'#000'}}>UP</div>
<div style={{flex:1}}>
<div style={{fontWeight:'700',fontSize:'13px',display:'flex',gap:'6px',alignItems:'center'}}>{n.from} <span style={{width:'14px',height:'14px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="7" height="7" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span> <span style={{fontSize:'10px',color:'#666'}}>{n.time}</span></div>
<div style={{fontWeight:'700',fontSize:'12px',marginTop:'4px',color:n.type==='blue_request'?'#1D9BF0':n.type==='verified'?'#00D632':'#fff'}}>{n.title}</div>
<div style={{fontSize:'12px',color:'#aaa',marginTop:'4px',lineHeight:'1.4'}}>{n.message}</div>
{n.type==='blue_request'&&!userVerified&&<div style={{marginTop:'10px',background:'#1D9BF0',color:'#fff',padding:'8px',borderRadius:'10px',textAlign:'center',fontWeight:'700',fontSize:'12px'}}>👆 TAP THIS NOTIFICATION TO REQUEST BLUE TICK</div>}
{n.type==='verified'&&<div style={{marginTop:'10px',background:'#00D632',color:'#000',padding:'8px',borderRadius:'10px',textAlign:'center',fontWeight:'800',fontSize:'12px'}}>✓ YOU ARE NOW VERIFIED — BLUE TICK ACTIVE</div>}
</div>
</div>
</div>
))}
{/* OWNER VIEW - BLUE TICK REQUESTS TO APPROVE */}
{isOwner&&blueRequests.length>0&&(
<div style={{marginTop:'20px',borderTop:'1px solid #333',paddingTop:'16px'}}>
<div style={{fontWeight:'700',fontSize:'14px',marginBottom:'10px'}}>Blue Tick Requests (Owner View)</div>
{blueRequests.map(r=>(
<div key={r.id} style={{background:'#121212',padding:'12px',borderRadius:'12px',marginBottom:'8px',display:'flex',justifyContent:'space-between'}}>
<div><div style={{fontWeight:'700',fontSize:'13px'}}>{r.name} {r.username}</div><div style={{fontSize:'11px',color:r.status==='approved'?'#00D632':'#FF0024'}}>{r.status}</div></div>
{r.status==='pending'&&<button onClick={()=>{
const approved=blueRequests.map(x=>x.id===r.id?{...x,status:'approved'}:x)
setBlueRequests(approved); localStorage.setItem('uptown_blue_requests',JSON.stringify(approved))
const approvedNot={id:Date.now(),type:'verified',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'Congratulations! You are Verified ✓',message:'Congratulations! You are verified and you get automatically blue tick!',read:false}
const finalNot=[approvedNot,...notifications.filter(n=>n.type!=='blue_request')]
setNotifications(finalNot); localStorage.setItem('uptown_notifications',JSON.stringify(finalNot))
setUserVerified(true); localStorage.setItem('uptown_user_verified','true')
}} style={{background:'#1D9BF0',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px'}}>Approve</button>}
</div>
))}
</div>
)}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,padding:'20px'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<label style={{width:'70px',height:'70px',borderRadius:'50%',background:profilePic?`url(${profilePic})`:'#fff',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',color:'#000',position:'relative',cursor:'pointer',border:userVerified?'2px solid #1D9BF0':'2px solid #333'}}>
{!profilePic&&'UP'}
<input type="file" accept="image/*" onChange={handleProfilePicChange} style={{display:'none'}}/>
<div style={{position:'absolute',bottom:'-4px',right:'-4px',background:'#FF0024',width:'22px',height:'22px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:'#fff'}}>📷</div>
</label>
<div><div style={{fontWeight:'700',display:'flex',gap:'6px',alignItems:'center'}}>UPTOWN Official {userVerified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'12px',color:'#888'}}>@uptown {userVerified?'• Verified ✓ Blue Tick':''}</div></div>
</div>
<div style={{marginTop:'16px',display:'flex',gap:'10px'}}>
<button onClick={()=>{setAuthMode('login'); setShowAuth(true)}} style={{flex:1,background:'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'700'}}>Login</button>
<button onClick={()=>{setAuthMode('signup'); setShowAuth(true)}} style={{flex:1,background:'#FF0024',color:'#fff',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'700'}}>Sign Up</button>
</div>
</div>
)}
{page==='following'&&<div style={{flex:1,padding:'20px'}}>Following</div>}
{page==='live'&&<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>🔴 LIVE</div>}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'16px 20px',borderRadius:'14px',zIndex:80,textAlign:'center',maxWidth:'80%'}}><div style={{fontWeight:'700',fontSize:'13px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'24px',borderTopRightRadius:'24px',padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center'}}>Post — UPTOWN Official ✓</div>
<div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
{[
{label:'📹 Video', type:'video'},
{label:'🖼️ Pictures', type:'picture'},
{label:'👥 Duet', type:'duet'},
].map(t=>(
<button key={t.type} onClick={()=>setUploadType(t.type)} style={{flex:1,background:uploadType===t.type?'#fff':'#1a1a1a',color:uploadType===t.type?'#000':'#888',border:'none',padding:'12px 6px',borderRadius:'12px',fontSize:'11px',fontWeight:'700'}}>{t.label}</button>
))}
</div>
<div style={{marginTop:'14px',background:'#1a1a1a',borderRadius:'12px',padding:'12px'}}>
<input value={youtubeLink} onChange={e=>setYoutubeLink(e.target.value)} placeholder="YouTube link..." style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
</div>
<input type="file" accept={uploadType==='picture'?'image/*':'video/*,image/*'} onChange={handleFileChange} style={{width:'100%',marginTop:'12px',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'12px'}}>{uploadPreview.type.startsWith('video')?<video src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}} autoPlay loop playsInline/>:<img src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}}/>}</div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'12px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
<button onClick={handlePostNow} style={{marginTop:'14px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>POST ✓</button>
</div>
</div>
)}

<div style={{display:'flex',justifyContent:'space-around',padding:'10px 0',borderTop:'1px solid #1a1a1a',background:'#000'}}>
<button onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',fontSize:'10px'}}>⌂<br/>For You</button>
<button onClick={()=>setPage('following')} style={{background:'none',border:'none',color:'#666',fontSize:'10px'}}>👥<br/>People</button>
<button onClick={()=>{setUploadType('video'); setShowUpload(true)}} style={{background:'#FF0024',border:'none',width:'52px',height:'36px',borderRadius:'12px',color:'#fff',fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',fontSize:'10px',position:'relative'}}>✉<br/>Inbox{unreadCount>0&&<span style={{position:'absolute',top:'0px',right:'8px',background:'#FF0024',color:'#fff',fontSize:'9px',width:'14px',height:'14px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>{unreadCount}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none',border:'none',color:'#666',fontSize:'10px',position:'relative'}}>○<br/>You{userVerified&&<span style={{position:'absolute',top:'-2px',right:'2px',width:'12px',height:'12px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="6" height="6" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</button>
</div>
</div>
)
}
