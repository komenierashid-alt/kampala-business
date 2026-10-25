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
const videoRefs=useRef({})

const officialVideos=[
{id:101,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video', likes:12400, fires:340, comments:0},
{id:102,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'Tap to pause/play', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video', likes:8920, fires:210, comments:0},
{id:103,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', mediaType:'video', likes:15600, fires:520, comments:0},
]

useEffect(()=>{
const t=setTimeout(()=>{setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sFav=localStorage.getItem('uptown_fav_v3')
const sP=localStorage.getItem('uptown_posts_fit_screen')
const sC=localStorage.getItem('uptown_comments_v1')
const sNot=localStorage.getItem('uptown_notifications_clean_v2')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
if(sP) setPosts(JSON.parse(sP))
if(sC) setCommentCounts(JSON.parse(sC))
if(sNot) setNotifications(JSON.parse(sNot))
else{
const clean=[
{id:1,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'2m ago',title:'Get Verified ✓',message:'UPTOWN Official is asking if you want blue tick?',read:false},
{id:2,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'10m ago',title:'Welcome ✓',message:'Welcome to UPTOWN Official ✓',read:false},
]
setNotifications(clean)
localStorage.setItem('uptown_notifications_clean_v2',JSON.stringify(clean))
}
if(!su) setShowAuth(true)
else{setUser(JSON.parse(su)); if(sO==='true') setIsOwner(true)}
},1800)
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
},{threshold:0.5})
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
if(lower.includes('tiktok.com')) return {type:'tiktok', embed:url, original:url, platform:'TikTok'}
if(lower.includes('instagram.com')) return {type:'instagram', embed:url, original:url, platform:'Instagram'}
if(lower.includes('facebook.com') || lower.includes('fb.watch')) return {type:'facebook', embed:`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`, original:url, platform:'Facebook'}
if(lower.includes('vimeo.com')) return {type:'vimeo', embed:`https://player.vimeo.com/video/${url.match(/vimeo\.com\/(\d+)/)?.[1]}`, original:url, platform:'Vimeo'}
if(lower.match(/\.(mp4|mov|webm|m3u8)(\?|$)/)) return {type:'direct', embed:url, original:url, platform:'Direct'}
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
setTimeout(()=>window.location.reload(),500)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!isOfficial){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const lu=isOfficial?{name:'Katongole Rashid',username:'@uptown',email,verified:true,isOfficial:true}:{name:found.name,username:found.username,email:found.email,verified:false,isOfficial:false}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
setUser(lu); setIsOwner(isOfficial); setShowAuth(false)
setTimeout(()=>window.location.reload(),500)
}
}

const handleFollow=(u)=>{const nf={...follows,[u]:follows[u]==='following'?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf)); setBlockedMsg(nf[id]?'★ Favorite — Any user!':'★ Removed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)}
const handleShare=async(v)=>{const url=v.mediaUrl?.startsWith('http')?v.mediaUrl:location.href; if(navigator.share){try{await navigator.share({title:'UPTOWN',url})}catch{}}else{try{await navigator.clipboard.writeText(url); setBlockedMsg('🔗 Copied!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)}catch{}}}
const handleComment=(id)=>setShowComments(id)
const handlePostComment=(id)=>{
if(!commentInput.trim()) return
setComments(prev=>({...prev,[id]:[...(prev[id]||[]),{id:Date.now(),text:commentInput,user:user?.name||'User'}]}))
const nc={...commentCounts,[id]:(commentCounts[id]||0)+1}
setCommentCounts(nc); localStorage.setItem('uptown_comments_v1',JSON.stringify(nc)); setCommentInput(''); setBlockedMsg('💬 Posted!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)
}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused){v.play(); setPausedMap({...pausedMap,[id]:false})}else{v.pause(); setPausedMap({...pausedMap,[id]:true})}}
const handleFileChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setUploadPreview({url:u,type:f.type}); const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f)}
const handlePasteLink=async()=>{try{const t=await navigator.clipboard.readText(); if(t) setUniversalLink(t)}catch{}}
const handlePostNow=(mode)=>{
const fm=mode||uploadMode
let mu=null; let mt='video'; let li=null
if(fm==='post_muzika'){
if(universalLink){li=parseUniversalLink(universalLink); if(!li){setBlockedMsg('Invalid'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return} mu=universalLink; mt=li.type}
else if(uploadBase64){mu=uploadBase64; mt='video'}
else{setBlockedMsg('Paste link or upload'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
}else{
if(uploadBase64){mu=uploadBase64; mt='video'}
else if(universalLink){li=parseUniversalLink(universalLink); if(li){mu=universalLink; mt=li.type}else{setBlockedMsg('Upload file'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}}
else{setBlockedMsg('Upload file'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
}
const np={id:Date.now(),user:'UPTOWN Official',username:'@uptown',verified:true,caption:uploadCaption||'UPTOWN ✓',mediaUrl:mu,mediaType:mt,linkInfo:li,isMuzika:fm==='post_muzika',likes:0,fires:0,comments:0}
const nposts=[np,...posts]; setPosts(nposts); localStorage.setItem('uptown_posts_fit_screen',JSON.stringify(nposts))
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUniversalLink(''); setShowUpload(false); setUploadMode(null)
setBlockedMsg(fm==='post_muzika'?'✓ Posted in Muzika!':'✓ Uploaded!'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage(fm==='post_muzika'?'muzika':'foryou')},1000)
}

if(splash){
return(
<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="140" height="170" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>
)
}

const forYouFeed=[...posts.filter(p=>!p.isMuzika),...officialVideos]
const muzikaFeed=[...posts.filter(p=>p.isMuzika),...officialVideos]
const renderUniversal=(v)=>{
const info=v.linkInfo || parseUniversalLink(v.mediaUrl)
if(!info){
if(v.mediaType==='image' || v.mediaUrl?.startsWith('data:image')) return <img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline autoPlay muted={false} style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
}
if(info.type==='youtube') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%',border:'none'}}/>
if(info.type==='direct') return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={info.embed} loop playsInline autoPlay controls style={{width:'100%',height:'100%',objectFit:'contain',background:'#000'}}/>
return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%',border:'none'}}/>
}
const linkPreview=parseUniversalLink(universalLink)
const unread=notifications.filter(n=>!n.read).length

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',maxHeight:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden',boxSizing:'border-box'}}>

{/* TOP TABS - FIT TO SCREEN - FIXED HEIGHT */}
<div style={{height:'52px',minHeight:'52px',display:'flex',alignItems:'center',padding:'0 12px',gap:'8px',borderBottom:'1px solid #1a1a1a',background:'#000',flexShrink:0,overflowX:'auto',boxSizing:'border-box'}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'}].map(t=>{
const a=page===t.key
return <button key={t.key} onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage(t.key)}} style={{background:a?'#fff':'#222',color:a?'#000':'#888',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'700',flexShrink:0,height:'32px'}}>{t.label}</button>
})}
</div>

{/* MAIN CONTENT - FIT TO SCREEN - FLEX 1 - NO OVERFLOW */}
<div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column',position:'relative',background:'#000'}}>

{page==='foryou'&&(
<div style={{flex:1,minHeight:0,overflowY:'auto',scrollSnapType:'y mandatory',scrollBehavior:'smooth',WebkitOverflowScrolling:'touch'}}>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
const isPaused=pausedMap[v.id]
const isLiked=likes[v.id]
const isFired=likes['fire_'+v.id]
const isFav=favorites[v.id]
const cCount=commentCounts[v.id]||v.comments||0
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',minHeight:'100%',scrollSnapAlign:'start',position:'relative',background:'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',boxSizing:'border-box'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>

{/* VIDEO FIT TO SCREEN - CONTAIN */}
<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'#111'}}>
<div style={{width:'100%',height:'100%',maxWidth:'100%',maxHeight:'100%'}}>
{renderUniversal(v)}
</div>
</div>

{isPaused&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.55)',width:'72px',height:'72px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',zIndex:5,pointerEvents:'none'}}><div style={{width:0,height:0,borderLeft:'22px solid #fff',borderTop:'13px solid transparent',borderBottom:'13px solid transparent',marginLeft:'4px'}}></div></div>}

{/* RIGHT BUTTONS - FIT TO SCREEN - SCALED DOWN - NO OVERFLOW */}
<div style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',zIndex:3,display:'flex',flexDirection:'column',gap:'14px',alignItems:'center',maxHeight:'88%',justifyContent:'center',padding:'4px 0'}} onClick={e=>e.stopPropagation()}>

{/* Follow - Top - As screenshot - Smaller to fit */}
<button onClick={()=>handleFollow(v.username)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
<div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',border:'2px solid #fff'}}>
<span style={{fontWeight:'900',fontSize:'11px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></span>
<div style={{position:'absolute',bottom:'-8px',left:'50%',transform:'translateX(-50%)',background:isFollowing?'#00D632':'#FF0024',color:'#fff',width:'18px',height:'18px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'900',border:'2px solid #000'}}>{isFollowing?'✓':'+'}</div>
</div>
<div style={{color:'#fff',fontSize:'11px',fontWeight:'600',marginTop:'4px'}}>Follow</div>
</button>

<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'24px',lineHeight:1}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div>
<div style={{fontSize:'11px',fontWeight:'700'}}>{isLiked? (v.likes+1):(v.likes>=1000? (v.likes/1000).toFixed(1)+'K':v.likes)||'12.4K'}</div>
</button>

<button onClick={()=>handleComment(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'14px'}}>💬</span></div>
<div style={{fontSize:'11px',fontWeight:'700'}}>{cCount}</div>
</button>

<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'18px'}}>→</div>
<div style={{fontSize:'11px',fontWeight:'600'}}>Share</div>
</button>

<button onClick={()=>handleFire(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'22px'}}>🔥</div>
<div style={{fontSize:'11px',fontWeight:'700',color:isFired?'#FF6A00':'#fff'}}>{isFired? (v.fires+1) : (v.fires||340)}</div>
</button>

<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#FF0024'}}>
<div style={{fontSize:'20px'}}>★</div>
<div style={{fontSize:'10px',fontWeight:'700'}}>Favorite</div>
</button>
</div>

{/* BOTTOM CAPTION - FIT TO SCREEN - SAFE AREA */}
<div style={{position:'absolute',left:'10px',right:'72px',bottom:'10px',zIndex:2,pointerEvents:'none',boxSizing:'border-box'}}>
<div style={{fontWeight:'700',fontSize:'14px',display:'flex',gap:'4px',alignItems:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>UPTOWN Official <span style={{width:'14px',height:'14px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span></div>
<div style={{fontSize:'12px',marginTop:'4px',lineHeight:'1.3',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',textOverflow:'ellipsis'}}>UPTOWN Official ✓ {v.caption}</div>
<div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'8px'}}>
<div style={{flex:1,height:'2px',background:'rgba(255,255,255,0.3)',borderRadius:'1px'}}><div style={{width:'30%',height:'100%',background:'#fff',borderRadius:'1px'}}></div></div>
<div style={{display:'flex',gap:'8px',alignItems:'center',flexShrink:0}}><span style={{fontSize:'10px',color:'#aaa'}}>0:00</span><span style={{fontSize:'12px'}}>🔊</span><span style={{fontSize:'12px'}}>⛶</span></div>
</div>
</div>

<div style={{position:'absolute',right:'10px',bottom:'10px',zIndex:2,background:'#fff',color:'#000',padding:'4px 8px',borderRadius:'12px',fontSize:'10px',fontWeight:'900',pointerEvents:'none',display:'flex',alignItems:'center',gap:'2px'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'40px',minHeight:'40px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0,boxSizing:'border-box'}}>
<div style={{fontWeight:'700',fontSize:'12px'}}>Muzika — Every link</div>
<button onClick={()=>{setUploadMode(null); setShowUpload(true)}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>+ Post</button>
</div>
<div style={{flex:1,minHeight:0,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
<div style={{position:'absolute',left:'10px',bottom:'10px',zIndex:2,pointerEvents:'none',right:'70px'}}><div style={{fontWeight:'700',fontSize:'13px'}}>UPTOWN Official ✓</div><div style={{fontSize:'11px',marginTop:'2px'}}>{v.caption}</div></div>
</div>
))}
</div>
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'48px',minHeight:'48px',padding:'0 12px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0,boxSizing:'border-box'}}><div style={{fontWeight:'800',fontSize:'13px'}}>Inbox — From UPTOWN Official only</div><div style={{background:'#FF0024',color:'#fff',padding:'3px 8px',borderRadius:'12px',fontSize:'10px'}}>{unread} new</div></div>
<div style={{flex:1,minHeight:0,overflowY:'auto',padding:'10px',boxSizing:'border-box'}}>
{notifications.map(n=>(
<div key={n.id} style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px',marginBottom:'8px'}}>
<div style={{fontWeight:'700',fontSize:'11px',display:'flex',gap:'4px'}}><div style={{width:'20px',height:'20px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'6px',fontWeight:'900'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></div>{n.from} ✓</div>
<div style={{fontSize:'11px',fontWeight:'700',marginTop:'4px'}}>{n.title}</div>
<div style={{fontSize:'10px',color:'#888',marginTop:'2px'}}>{n.message}</div>
</div>
))}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,minHeight:0,overflowY:'auto',padding:'16px',boxSizing:'border-box'}}>
{isOwner?(
<>
<div style={{display:'flex',gap:'10px',alignItems:'center'}}><div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'12px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></div><div><div style={{fontWeight:'800',fontSize:'14px'}}>Katongole Rashid</div><div style={{fontSize:'11px',color:'#888'}}>@uptown • Control</div><div style={{fontSize:'10px',color:'#1D9BF0'}}>komenierashid@gmail.com — Only you see</div></div></div>
<div style={{marginTop:'12px',background:'#0a1a2a',border:'1px solid #1D9BF0',borderRadius:'12px',padding:'10px'}}><div style={{fontSize:'11px',fontWeight:'700',color:'#1D9BF0'}}>🔒 Only you see control info</div><div style={{fontSize:'10px',color:'#aaa',marginTop:'4px'}}>Others see only UPTOWN Official — No name leak</div></div>
</>
):(
<>
<div style={{display:'flex',gap:'10px',alignItems:'center'}}><div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'12px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></div><div><div style={{fontWeight:'800',fontSize:'14px'}}>{user?.name||'Your Account'}</div><div style={{fontSize:'11px',color:'#888'}}>{user?.username||'@user'} • Normal</div></div></div>
<div style={{marginTop:'12px',background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px'}}><div style={{fontSize:'11px',fontWeight:'700'}}>Normal account — From UPTOWN Official only</div><div style={{fontSize:'10px',color:'#888',marginTop:'4px'}}>Any can upload/post + favorite/like/share/fire/comment</div></div>
</>
)}
</div>
)}

{page==='following'&&<div style={{flex:1,minHeight:0,padding:'16px',overflowY:'auto'}}>Following — Same</div>}
{page==='live'&&<div style={{flex:1,minHeight:0,display:'flex',alignItems:'center',justifyContent:'center'}}>🔴 LIVE — Same</div>}

{showComments!==null&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:60,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(null)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'14px',maxHeight:'60vh',display:'flex',flexDirection:'column',boxSizing:'border-box'}} onClick={e=>e.stopPropagation()}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div style={{fontWeight:'700',fontSize:'13px'}}>Comments — {commentCounts[showComments]||0}</div><button onClick={()=>setShowComments(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>×</button></div>
<div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px',minHeight:0}}>
{(comments[showComments]||[]).map(c=>(
<div key={c.id} style={{display:'flex',gap:'8px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#333',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px'}}>U</div><div><div style={{fontSize:'11px',fontWeight:'700'}}>{c.user}</div><div style={{fontSize:'12px'}}>{c.text}</div></div></div>
))}
{(comments[showComments]||[]).length===0&&<div style={{color:'#666',textAlign:'center',padding:'16px',fontSize:'12px'}}>No comments — Be first!</div>}
</div>
<div style={{display:'flex',gap:'8px',marginTop:'10px',borderTop:'1px solid #222',paddingTop:'10px',flexShrink:0}}>
<input value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder="Add comment..." style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'8px 12px',color:'#fff',fontSize:'13px'}}/>
<button onClick={()=>handlePostComment(showComments)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:'700',fontSize:'12px'}}>Post</button>
</div>
</div>
</div>
)}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80,textAlign:'center',maxWidth:'80%',boxSizing:'border-box'}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{setShowUpload(false); setUploadMode(null)}}>
<div style={{background:'#121212',width:'100%',maxWidth:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px',maxHeight:'85vh',overflowY:'auto',boxSizing:'border-box'}} onClick={e=>e.stopPropagation()}>
{uploadMode===null&&(
<>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'16px',marginBottom:'12px'}}>What do you want to do?</div>
<button onClick={()=>setUploadMode('upload_video')} style={{width:'100%',background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'10px',boxSizing:'border-box'}}>
<span>📤</span> Upload Videos — Any user
</button>
<button onClick={()=>setUploadMode('post_muzika')} style={{width:'100%',background:'#1a1a1a',border:'1px solid #00D632',color:'#fff',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'10px',boxSizing:'border-box'}}>
<span>🎬</span> Post Videos — Muzika — Every link
</button>
<div style={{fontSize:'10px',color:'#666',textAlign:'center'}}>Inbox from UPTOWN Official only — Fit to screen</div>
<button onClick={()=>{setShowUpload(false); setUploadMode(null)}} style={{width:'100%',background:'transparent',color:'#666',border:'none',padding:'10px',marginTop:'6px',fontSize:'12px'}}>Cancel</button>
</>
)}
{uploadMode==='upload_video'&&(
<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>setUploadMode(null)} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800',fontSize:'14px'}}>📤 Upload Videos</div></div>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',boxSizing:'border-box'}}/>
{uploadPreview&&<div style={{marginTop:'10px'}}><video src={uploadPreview.url} style={{width:'100%',maxHeight:'200px',borderRadius:'12px',objectFit:'contain'}} autoPlay loop playsInline/></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'10px',color:'#fff',boxSizing:'border-box'}}/>
<button onClick={()=>handlePostNow('upload_video')} style={{marginTop:'12px',width:'100%',background:'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900',boxSizing:'border-box'}}>Upload Videos ✓</button>
</>
)}
{uploadMode==='post_muzika'&&(
<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>setUploadMode(null)} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800',fontSize:'14px'}}>🎬 Post Videos — Muzika</div></div>
<div style={{background:'#0a2a0a',border:'1px solid #00D632',borderRadius:'12px',padding:'10px'}}>
<div style={{fontSize:'11px',fontWeight:'800',color:'#00D632'}}>🔗 EVERY LINK ACCEPTED — Views to owner</div>
<div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
<input value={universalLink} onChange={e=>setUniversalLink(e.target.value)} placeholder="Paste ANY link..." style={{flex:1,background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'11px',boxSizing:'border-box'}}/>
<button onClick={handlePasteLink} style={{background:'#fff',color:'#000',border:'none',padding:'10px 12px',borderRadius:'10px',fontWeight:'800',fontSize:'11px'}}>📋 Paste</button>
</div>
{linkPreview&&<div style={{marginTop:'8px',background:'#000',borderRadius:'10px',padding:'8px',border:'1px solid #00D632'}}><div style={{fontSize:'10px',fontWeight:'700',color:'#00D632'}}>✓ {linkPreview.platform}</div><div style={{marginTop:'6px',height:'120px',background:'#000',borderRadius:'8px',overflow:'hidden'}}>{renderUniversal({mediaUrl:universalLink,linkInfo:linkPreview})}</div></div>}
</div>
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',boxSizing:'border-box'}}/>
<button onClick={()=>handlePostNow('post_muzika')} style={{marginTop:'12px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900',boxSizing:'border-box'}}>Post Videos ✓</button>
</>
)}
</div>
</div>
)}

{/* BOTTOM NAV - FIT TO SCREEN - FIXED HEIGHT */}
<div style={{height:'64px',minHeight:'64px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0,padding:'0 4px',boxSizing:'border-box',paddingBottom:'env(safe-area-inset-bottom, 0px)'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1}}><span style={{fontSize:'20px',lineHeight:1}}>⌂</span><span style={{fontSize:'10px',fontWeight:page==='foryou'?'700':'400'}}>Home</span></button>
<button onClick={()=>{setPage('inbox'); const u=notifications.map(n=>({...n,read:true})); setNotifications(u); localStorage.setItem('uptown_notifications_clean_v2',JSON.stringify(u))}} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1,position:'relative'}}><span style={{fontSize:'18px',lineHeight:1}}>✉</span><span style={{fontSize:'10px'}}>Inbox</span>{unread>0&&<span style={{position:'absolute',top:'0px',right:'18px',background:'#FF0024',color:'#fff',fontSize:'8px',padding:'2px 4px',borderRadius:'8px',fontWeight:'800',minWidth:'14px',textAlign:'center'}}>{unread}</span>}</button>
<button onClick={()=>{setUploadMode(null); setShowUpload(true)}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>+</button>
<button onClick={()=>setPage('following')} style={{background:'none',border:'none',color:page==='following'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1}}><span style={{fontSize:'18px',lineHeight:1}}>👥</span><span style={{fontSize:'10px'}}>Board</span></button>
<button onClick={()=>setPage('you')} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1}}><span style={{fontSize:'18px',lineHeight:1}}>○</span><span style={{fontSize:'10px'}}>You</span></button>
</div>

{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'20px',justifyContent:'center',boxSizing:'border-box'}}>
<div style={{textAlign:'center',marginBottom:'16px'}}><svg width="100" height="120" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'12px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800',fontSize:'13px'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800',fontSize:'13px'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Your Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'14px'}}>Continue</button>
</div>
</div>
)}
</div>
)
}
