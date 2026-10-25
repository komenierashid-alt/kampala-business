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
const [universalLink,setUniversalLink]=useState('')
const [uploadPreview,setUploadPreview]=useState(null)
const [uploadBase64,setUploadBase64]=useState(null)
const [follows,setFollows]=useState({})
const [likes,setLikes]=useState({})
const [posts,setPosts]=useState([])
const [pausedMap,setPausedMap]=useState({})
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [notifications,setNotifications]=useState([])
const videoRefs=useRef({})

// OFFICIAL VIDEOS - WHAT REGULAR USERS SEE VS WHAT OWNER SEES
const officialVideos=[
{id:101,user:'UPTOWN Official',ownerName:'Katongole Rashid',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video'},
{id:102,user:'UPTOWN Official',ownerName:'Katongole Rashid',username:'@uptown',verified:true,caption:'Tap screen to pause/play', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video'},
{id:103,user:'UPTOWN Official',ownerName:'Katongole Rashid',username:'@uptown',verified:true,caption:'Follow UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', mediaType:'video'},
]

useEffect(()=>{
const t=setTimeout(()=>{setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sP=localStorage.getItem('uptown_posts_private')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sP) setPosts(JSON.parse(sP))

// NOTIFICATIONS - DIFFERENT FOR OWNER VS REGULAR USERS
const sNot=localStorage.getItem('uptown_notifications_private')
if(sNot){
setNotifications(JSON.parse(sNot))
}else{
if(sO==='true'){
// OWNER SEES CONTROL TEXT
const ownerNot=[
{id:1,type:'blue_request',from:'UPTOWN Official',realFrom:'Katongole Rashid (Control)',username:'@uptown',verified:true,time:'2m ago',title:'Get Verified ✓',message:'Control: Requests from users — Only you (komenierashid@gmail.com) can approve blue tick requests!',read:false, ownerOnly:true},
{id:2,type:'control',from:'System',username:'@system',verified:false,time:'10m ago',title:'UPTOWN Official Control',message:'This account is controlled only by Katongole Rashid — komenierashid@gmail.com — No one can check this account! (Only you see this)',read:false, ownerOnly:true},
]
setNotifications(ownerNot)
localStorage.setItem('uptown_notifications_private',JSON.stringify(ownerNot))
}else{
// REGULAR USERS - ONLY SEE UPTOWN OFFICIAL - NO KATONGOLE RASHID - NO EMAIL
const userNot=[
{id:1,type:'blue_request',from:'UPTOWN Official',username:'@uptown',verified:true,time:'2m ago',title:'Get Verified ✓',message:'UPTOWN Official is asking if you want blue tick? Tap to request verification!',read:false},
{id:2,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'10m ago',title:'Welcome to UPTOWN',message:'Welcome to UPTOWN Official ✓ Follow and enjoy videos!',read:false},
{id:3,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'1h ago',title:'New Videos',message:'New videos posted in Muzika — Check them out!',read:false},
]
setNotifications(userNot)
localStorage.setItem('uptown_notifications_private',JSON.stringify(userNot))
}
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
Object.keys(videoRefs.current).forEach(k=>{if(k!==id && videoRefs.current[k]) videoRefs.current[k].pause()})
if(!pausedMap[id]) video.play().catch(()=>{})
}else video.pause()
})
},{threshold:0.7})
const els=document.querySelectorAll('[data-video-id]')
els.forEach(el=>observer.observe(el))
return()=>observer.disconnect()
},[page,posts,pausedMap])

const parseUniversalLink=(url)=>{
if(!url) return null
url=url.trim()
const lower=url.toLowerCase()
const ytReg=/(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/
const ytMatch=url.match(ytReg)
if(ytMatch) return {type:'youtube', id:ytMatch[1], embed:`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&controls=1&playsinline=1&rel=0`, original:url, platform:'YouTube'}
if(lower.includes('tiktok.com')){
const tMatch=url.match(/\/video\/(\d+)/)
if(tMatch) return {type:'tiktok', id:tMatch[1], embed:`https://www.tiktok.com/embed/${tMatch[1]}`, original:url, platform:'TikTok'}
return {type:'tiktok', embed:url, original:url, platform:'TikTok'}
}
if(lower.includes('instagram.com')) return {type:'instagram', embed:url.includes('/embed')?url:url.replace(/\/$/,'')+'/embed', original:url, platform:'Instagram'}
if(lower.includes('facebook.com') || lower.includes('fb.watch')) return {type:'facebook', embed:`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`, original:url, platform:'Facebook'}
if(lower.includes('vimeo.com')){
const vMatch=url.match(/vimeo\.com\/(\d+)/)
if(vMatch) return {type:'vimeo', id:vMatch[1], embed:`https://player.vimeo.com/video/${vMatch[1]}`, original:url, platform:'Vimeo'}
}
if(lower.match(/\.(mp4|mov|webm|m3u8)(\?|$)/)) return {type:'direct', embed:url, original:url, platform:'Direct Video'}
if(lower.startsWith('http')) return {type:'iframe', embed:url, original:url, platform:'Link'}
return null
}

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const isOfficial=email==='komenierashid@gmail.com'
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const nu={id:Date.now(),name:isOfficial?'Katongole Rashid':authForm.name,username:isOfficial?'@uptown':'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficial,isOfficial:isOfficial}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified,isOfficial:nu.isOfficial}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
setUser(lu); setIsOwner(isOfficial); setShowAuth(false)
// Set correct notifications for this user type
localStorage.removeItem('uptown_notifications_private')
setTimeout(()=>window.location.reload(),500)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!isOfficial){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const lu=isOfficial?{name:'Katongole Rashid',username:'@uptown',email,verified:true,isOfficial:true}:{name:found.name,username:found.username,email:found.email,verified:false,isOfficial:false}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
localStorage.removeItem('uptown_notifications_private')
setUser(lu); setIsOwner(isOfficial); setShowAuth(false)
setTimeout(()=>window.location.reload(),500)
}
}

const handleFollow=(username)=>{const nf={...follows,[username]:follows[username]==='following'?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused){v.play(); setPausedMap({...pausedMap,[id]:false})}else{v.pause(); setPausedMap({...pausedMap,[id]:true})}}
const handleFileChange=(e)=>{const file=e.target.files?.[0]; if(!file) return; const url=URL.createObjectURL(file); setUploadPreview({url,type:file.type}); const reader=new FileReader(); reader.onload=(ev)=>setUploadBase64(ev.target.result); reader.readAsDataURL(file)}
const handlePasteLink=async()=>{try{const text=await navigator.clipboard.readText(); if(text){setUniversalLink(text)}}catch{}}

const handlePostNow=()=>{
if(page==='muzika' && !isOwner){setBlockedMsg('Only UPTOWN Official can post in Muzika — Others watch only'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return}
let mediaUrl=null; let mediaType='video'; let linkInfo=null
if(page==='muzika'){
if(universalLink){
linkInfo=parseUniversalLink(universalLink)
if(!linkInfo){setBlockedMsg('Invalid link'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return}
mediaUrl=universalLink
mediaType=linkInfo.type
}else if(uploadBase64){mediaUrl=uploadBase64; mediaType='video'}
else{setBlockedMsg('Paste ANY link'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
}else{
if(uploadBase64){mediaUrl=uploadBase64; mediaType='video'}
else{setBlockedMsg('Upload video'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
}
const np={id:Date.now(),user:isOwner?'UPTOWN Official':user?.name||'User',username:isOwner?'@uptown':user?.username||'@user',verified:isOwner?true:false,caption:uploadCaption||(linkInfo?`[${linkInfo.platform}] — Views go to owner ✓`:'UPTOWN ✓'),mediaUrl,mediaType,linkInfo,isMuzika:page==='muzika',isOfficial:isOwner}
const newPosts=[np,...posts]; setPosts(newPosts); localStorage.setItem('uptown_posts_private',JSON.stringify(newPosts))
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUniversalLink(''); setShowUpload(false)
setBlockedMsg(linkInfo?`✓ Posted in Muzika! ${linkInfo.platform} — Views to owner!`:'✓ Video posted!'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage('foryou')},2000)
}

if(splash){
return(
<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="160" height="190" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>
)
}

const forYouFeed=[...posts.filter(p=>!p.isMuzika),...officialVideos]
const muzikaFeed=[...posts.filter(p=>p.isMuzika),...officialVideos]

const renderUniversal=(v)=>{
const info=v.linkInfo || parseUniversalLink(v.mediaUrl)
if(!info){
if(v.mediaType==='image' || v.mediaUrl?.startsWith('data:image')) return <img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'cover'}}/>
}
if(info.type==='youtube') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%'}}/>
if(info.type==='tiktok') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%'}}/>
if(info.type==='instagram') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%'}}/>
if(info.type==='facebook') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%'}}/>
if(info.type==='vimeo') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%'}}/>
if(info.type==='direct') return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={info.embed} loop playsInline autoPlay controls style={{width:'100%',height:'100%',objectFit:'cover'}}/>
if(info.type==='iframe') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%'}}/>
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'cover'}}/>
}

const linkPreview=parseUniversalLink(universalLink)

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column'}}>
{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'24px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'20px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'16px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'12px',borderRadius:'16px',fontWeight:'800'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'12px',borderRadius:'16px',fontWeight:'800'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Your Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'16px',borderRadius:'12px',fontWeight:'900'}}>Continue</button>
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
// WHAT REGULAR USERS SEE: ONLY UPTOWN OFFICIAL - NO KATONGOLE RASHID - NO EMAIL
const displayName=isOwner?v.ownerName||'UPTOWN Official': 'UPTOWN Official'
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{width:'100%',height:'100%'}}>{renderUniversal(v)}</div>
{isPaused&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',width:'70px',height:'70px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',zIndex:5,pointerEvents:'none'}}>▶</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,maxWidth:'62%',pointerEvents:'none'}}>
<div style={{fontWeight:'700',display:'flex',gap:'6px'}}>{displayName} {v.verified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div>
</div>
<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:3,display:'flex',flexDirection:'column',gap:'18px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<button onClick={()=>handleFollow(v.username)} style={{background:'none',border:'none'}}>
<div style={{width:'52px',height:'52px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
<span style={{fontWeight:'900',fontSize:'11px',color:'#000'}}>UP</span>
<div style={{position:'absolute',bottom:'-6px',left:'50%',transform:'translateX(-50%)',background:isFollowing?'#00D632':'#FF0024',color:'#fff',width:'22px',height:'22px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:'900',border:'2px solid #000'}}>{isFollowing?'✓':'+'}</div>
</div>
</button>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:likes[v.id]?'#FF0024':'#fff'}}><span style={{fontSize:'24px'}}>{likes[v.id]?'♥':'♡'}</span></button>
</div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,display:'flex',flexDirection:'column'}}>
<div style={{padding:'12px 16px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontWeight:'700',fontSize:'13px'}}>{isOwner?'Muzika — Control':'Muzika'}</div><div style={{fontSize:'10px',color:'#00D632'}}>{isOwner?'Every link accepted — Views to owner':'Watch videos'}</div></div>
{isOwner&&<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>+ Post</button>}
</div>
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>{
const info=v.linkInfo || parseUniversalLink(v.mediaUrl)
const displayName=isOwner?v.ownerName||'UPTOWN Official':'UPTOWN Official'
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{width:'100%',height:'100%'}}>{renderUniversal(v)}</div>
<div style={{position:'absolute',top:'12px',left:'12px',background:'#00D632',color:'#000',padding:'4px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'800',zIndex:2}}>{info?.platform||'Muzika'} • Views → Owner</div>
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,pointerEvents:'none'}}><div style={{fontWeight:'700'}}>{displayName} ✓</div><div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div></div>
</div>
)})}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,padding:'20px'}}>
<div style={{fontWeight:'700',fontSize:'16px'}}>{isOwner?'Katongole Rashid — UPTOWN Official ✓ Control (Only you see this)':user?.name||'Your Account'}</div>
<div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{isOwner?'Email: komenierashid@gmail.com — Only you see email — Others see only UPTOWN Official':'@'+(user?.username?.replace('@','')||'user')+' — Normal account'}</div>
<div style={{marginTop:'16px',background:isOwner?'#0a1a2a':'#121212',border:isOwner?'1px solid #1D9BF0':'1px solid #222',padding:'12px',borderRadius:'12px'}}>
<div style={{fontSize:'12px',fontWeight:'700'}}>{isOwner?'✓ You are control — Only you see Katongole Rashid & email':'Your normal account'}</div>
<div style={{fontSize:'11px',color:'#888',marginTop:'4px'}}>{isOwner?'Others see only UPTOWN Official — They never see Katongole Rashid or komenierashid@gmail.com — You control app, verify requests, post Muzika':'You receive notifications from other people and UPTOWN Official — You only see UPTOWN Official, not Katongole Rashid'}</div>
</div>
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{padding:'16px',borderBottom:'1px solid #1a1a1a'}}><div style={{fontWeight:'800'}}>{isOwner?'Inbox — Control (Only you see control info)':'Inbox — Notifications'}</div><div style={{fontSize:'10px',color:'#888'}}>{isOwner?'You see control messages':'You receive from people and UPTOWN Official'}</div></div>
<div style={{flex:1,overflowY:'auto',padding:'12px'}}>
{notifications.map(n=>(
<div key={n.id} style={{background:n.ownerOnly?'#0a1a2a':'#121212',border:n.ownerOnly?'1px solid #1D9BF0':'1px solid #222',borderRadius:'12px',padding:'12px',marginBottom:'10px'}}>
<div style={{display:'flex',gap:'8px',alignItems:'center'}}><div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'8px',color:'#000'}}>UP</div><div><div style={{fontWeight:'700',fontSize:'12px',display:'flex',gap:'6px'}}>{n.from} {n.verified&&'✓'} <span style={{fontSize:'10px',color:'#666'}}>{n.time}</span></div><div style={{fontSize:'11px',fontWeight:'700',color:n.ownerOnly?'#1D9BF0':'#fff'}}>{n.title}</div></div></div>
<div style={{fontSize:'12px',color:'#aaa',marginTop:'6px'}}>{n.message}</div>
{n.ownerOnly&&isOwner&&<div style={{fontSize:'9px',color:'#1D9BF0',marginTop:'6px'}}>🔒 Only you see this control info — Others don't see Katongole Rashid or email</div>}
</div>
))}
</div>
</div>
)}

{page==='following'&&<div style={{flex:1,padding:'20px'}}>Following — Same</div>}
{page==='live'&&<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>🔴 LIVE — Same</div>}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'16px 20px',borderRadius:'14px',zIndex:80,textAlign:'center',maxWidth:'85%'}}><div style={{fontWeight:'700',fontSize:'13px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'24px',borderTopRightRadius:'24px',padding:'20px',maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
{page==='muzika'?(
<>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'16px'}}>{isOwner?'Muzika — Control — Paste ANY Link':'Cannot post'}</div>
{isOwner?(
<>
<div style={{background:'#0a2a0a',border:'1px solid #00D632',borderRadius:'12px',padding:'12px',marginTop:'12px'}}>
<div style={{fontSize:'12px',fontWeight:'800',color:'#00D632'}}>🔗 EVERY LINK ACCEPTED — Views go to owner — Easy for you</div>
<div style={{display:'flex',gap:'8px',marginTop:'10px'}}>
<input value={universalLink} onChange={e=>setUniversalLink(e.target.value)} placeholder="Paste any link..." style={{flex:1,background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff',fontSize:'12px'}}/>
<button onClick={handlePasteLink} style={{background:'#fff',color:'#000',border:'none',padding:'12px 14px',borderRadius:'10px',fontWeight:'800',fontSize:'12px'}}>📋 Paste</button>
</div>
{linkPreview&&<div style={{marginTop:'10px',background:'#000',borderRadius:'10px',padding:'10px',border:'1px solid #00D632'}}>
<div style={{fontSize:'11px',fontWeight:'700',color:'#00D632'}}>✓ {linkPreview.platform} — Views to owner</div>
<div style={{marginTop:'8px',height:'140px',background:'#000',borderRadius:'8px',overflow:'hidden'}}>{renderUniversal({mediaUrl:universalLink,linkInfo:linkPreview})}</div>
</div>}
</div>
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'12px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
<button onClick={handlePostNow} style={{marginTop:'14px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>{linkPreview?`POST ${linkPreview.platform.toUpperCase()} ✓`:'POST IN MUZIKA ✓'}</button>
</>
):(
<div style={{marginTop:'20px',textAlign:'center',padding:'20px',background:'#1a1a1a',borderRadius:'12px'}}>
<div style={{fontSize:'14px',fontWeight:'700',color:'#FF0024'}}>⛔ Only UPTOWN Official can post</div>
<div style={{fontSize:'12px',color:'#888',marginTop:'8px'}}>Others watch only</div>
</div>
)}
</>
):(
<>
<div style={{fontWeight:'800',textAlign:'center'}}>Post — Same</div>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',marginTop:'12px',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'12px'}}><video src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}} autoPlay loop playsInline/></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'12px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
<button onClick={handlePostNow} style={{marginTop:'14px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>POST ✓</button>
</>
)}
</div>
</div>
)}

<div style={{display:'flex',justifyContent:'space-around',padding:'10px 0',borderTop:'1px solid #1a1a1a',background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',fontSize:'10px'}}>⌂<br/>For You</button>
<button onClick={()=>setPage('following')} style={{background:'none',border:'none',color:'#666',fontSize:'10px'}}>👥<br/>People</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024',border:'none',width:'52px',height:'36px',borderRadius:'12px',color:'#fff',fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',fontSize:'10px'}}>✉<br/>Inbox</button>
<button onClick={()=>setPage('you')} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
