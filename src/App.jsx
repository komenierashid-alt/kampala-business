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
const [showDeleteModal,setShowDeleteModal]=useState(null)
const [longPressTimer,setLongPressTimer]=useState(null)
const [profilePic,setProfilePic]=useState(null)
const [editName,setEditName]=useState('')
const [editBio,setEditBio]=useState('')
const [editUsername,setEditUsername]=useState('')
const [isEditing,setIsEditing]=useState(false)
const [youTab,setYouTab]=useState('videos')
const [allUsers,setAllUsers]=useState([])
const videoRefs=useRef({})

const AUTO_PAGES=[
{name:'AI Soaps', username:'@aisoaps', caption:'AI Soaps ✓ Trending', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', category:'For You', user:'UPTOWN Official', verified:true},
]

const extractYoutubeId=(text)=>{
if(!text) return null
const reg=/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
const match=text.match(reg)
return match?match[1]:null
}
const isYoutubeLink=(text)=> extractYoutubeId(text)!==null

const fetchPostsFromDB=async()=>{
try{
const res=await fetch('/api/posts').then(r=>r.json()).catch(()=>({posts:[]}))
if(res.posts && res.posts.length>0){setPosts(res.posts)}
else{
const autoPosts=AUTO_PAGES.map((p,i)=>({id:9000+i,user:p.user,username:p.username,displayName:p.name,verified:p.verified,caption:p.caption,mediaUrl:p.mediaUrl,category:p.category,likes:15601,comments:978,fires:520,views:5000,postedAt:Date.now()-i*60000,postedBy:OWNER_EMAIL,isAutoPage:true,protected:true}))
setPosts(autoPosts); savePostsToDB(autoPosts)
}
}catch(e){
const autoPosts=AUTO_PAGES.map((p,i)=>({id:9000+i,user:p.user,username:p.username,displayName:p.name,verified:p.verified,caption:p.caption,mediaUrl:p.mediaUrl,category:p.category,likes:15601,comments:978,fires:520,views:5000,postedAt:Date.now()-i*60000,isAutoPage:true,protected:true}))
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
const sDB=localStorage.getItem('uptown_users_db')
if(sDB) setAllUsers(JSON.parse(sDB))
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
if(sNot) setNotifications(JSON.parse(sNot))
fetchPostsFromDB()
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su); setUser(u); setIsOwner(u.email===OWNER_EMAIL); setEditName(u.name||''); setEditUsername(u.username||'');
}
},800)
return()=>clearTimeout(t)
},[])

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
v.muted=false; v.volume=1
v.play().catch(()=>{v.muted=true; v.play().catch(()=>{})})
}else v.pause()
})
},{threshold:0.6})
document.querySelectorAll('[data-video-id]').forEach(el=>obs.observe(el))
return()=>obs.disconnect()
},[page,posts])

const handleTouchStart=(videoId)=>{const timer=setTimeout(()=>{setShowDeleteModal(videoId)}, 700); setLongPressTimer(timer)}
const handleTouchEnd=()=>{if(longPressTimer){clearTimeout(longPressTimer); setLongPressTimer(null)}}

// PROTECT OFFICIAL MUZIKA VIDEOS FROM DELETION
const handleDeleteVideo=(id)=>{
const post=posts.find(p=>p.id===id)
// If it's Muzika and posted by Official, only Official can delete
if(post && (post.category==='Muzika' || post.youtubeId) && post.postedBy===OWNER_EMAIL && !isOwner){
setBlockedMsg('Only UPTOWN Official can delete Muzika videos'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); setShowDeleteModal(null); return
}
const filtered=posts.filter(p=>p.id!==id); savePostsToDB(filtered); setShowDeleteModal(null); setBlockedMsg('🗑️ Deleted'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)
}
const handleHideVideo=(id)=>{
const updated=posts.map(p=> p.id===id ? {...p, hidden:!p.hidden} : p); savePostsToDB(updated); setShowDeleteModal(null);
}

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill all'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const isOfficial=email===OWNER_EMAIL
const nu={id:Date.now(),name:isOfficial?'UPTOWN Official':authForm.name,username:isOfficial?'@uptown':'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficial,joinedAt:Date.now()}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db)); setAllUsers(db)
const lu={name:nu.name,username:nu.username,email,verified:nu.verified}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found && email!==OWNER_EMAIL){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800); return}
const isOfficial=email===OWNER_EMAIL
const lu=isOfficial?{name:'UPTOWN Official',username:'@uptown',email,verified:true}:{name:found.name,username:found.username,email,verified:found.verified}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false);
}
}

const handleFollow=(username)=>{
const isF=follows[username]==='following'; 
const nf={...follows,[username]:isF?'follow':'following'}; 
setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf)); 
setBlockedMsg(isF?'Unfollowed':'✓ Following '+username); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)
}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf));}
const handleShare=async(v)=>{try{await navigator.clipboard.writeText(v.youtubeId?`https://youtu.be/${v.youtubeId}`:v.mediaUrl||'UPTOWN'); setBlockedMsg('Link copied'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),600)}catch{}}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused){v.muted=false; v.volume=1; v.play().catch(()=>{})} else {v.pause()}}
const handleFileChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setUploadPreview({url:u}); const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f)}
const handleProfilePicChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{setProfilePic(ev.target.result); localStorage.setItem('uptown_profile_pic',ev.target.result);}; r.readAsDataURL(f)}

const handlePostNow=()=>{
let mu=uploadBase64 || uploadPreview?.url
let textCombined=(uploadText||'')+' '+(uploadCaption||'')
let ytId=extractYoutubeId(textCombined)
let isLink= /(https?:\/\/|youtu\.be|youtube\.com)/i.test(textCombined)
if((ytId || isLink) && !isOwner){setBlockedMsg('Only UPTOWN Official can post Muzika links!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
if(!mu && !ytId && !uploadText.trim() && !uploadCaption.trim()){setBlockedMsg('Write something or upload'); setShowBlocked(true); return}
const isMuzika= ytId || isLink
const np={
id:Date.now(),
user: user?.name||'@user',
username: user?.username||'@user',
verified: user?.verified||false,
caption: uploadText||uploadCaption||'',
text: uploadText||null,
mediaUrl:mu||null,
youtubeId:ytId||null,
originalLink: textCombined.trim()||null,
type: ytId?'youtube': (mu?'video':'text'),
category: isMuzika?'Muzika':'For You',
likes:0,comments:0,fires:0,views:0,postedAt:Date.now(),postedBy:user?.email,hidden:false,protected:isMuzika&&isOwner?true:false
}
const nposts=[np, ...posts]; savePostsToDB(nposts)
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUploadText(''); setShowUpload(false)
setBlockedMsg(isMuzika?'✓ Muzika video saved forever!':'✓ Posted'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage(isMuzika?'muzika':'foryou')},800)
}

if(splash){
return(<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="120" height="150" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>)
}

const allNonHidden=[...posts].filter(p=>!p.hidden || p.postedBy===user?.email || isOwner).sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const muzikaVideos=allNonHidden.filter(v=> v.category==='Muzika' || v.type==='youtube' || v.youtubeId)
const forYouVideos=allNonHidden.filter(v=> v.category!=='Muzika' && v.type!=='youtube' && !v.youtubeId)
const textPosts=forYouVideos.filter(v=> v.type==='text')
const normalVideos=forYouVideos.filter(v=> v.type!=='text')

const renderMedia=(v)=>{
if(v.type==='youtube' && v.youtubeId){
return <iframe src={`https://www.youtube.com/embed/${v.youtubeId}?controls=1&rel=0&modestbranding=1`} style={{width:'100%',height:'100%',border:'none',background:'#000'}} allow="encrypted-media" allowFullScreen />
}
if(v.youtubeId && !v.mediaUrl){
return <iframe src={`https://www.youtube.com/embed/${v.youtubeId}?controls=1&rel=0&modestbranding=1`} style={{width:'100%',height:'100%',border:'none',background:'#000'}} allow="encrypted-media" allowFullScreen />
}
if(v.type==='text'){
return <div style={{width:'100%',height:'100%',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}><div style={{background:'#1a1a1a',borderRadius:'16px',padding:'18px',maxWidth:'90%',fontSize:'16px',textAlign:'left',whiteSpace:'pre-wrap'}}>{v.text||v.caption}</div></div>
}
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'cover',background:'#000'}}/>
}

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'52px',display:'flex',alignItems:'center',padding:'0 10px',gap:'8px',borderBottom:'1px solid #1a1a1a',flexShrink:0}}>
<div style={{display:'flex',gap:'8px',flex:1}}>
{/* NO NUMBERS ANYMORE */}
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'}].map(t=><button key={t.key} onClick={()=>{pauseAllVideos(); setPage(t.key)}} style={{background:page===t.key?'#fff':'#222',color:page===t.key?'#000':'#888',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'700',height:'34px'}}>{t.label}</button>)}
</div>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:'#1a1a1a',border:'1px solid #FF0024',color:'#FF0024',padding:'6px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'800',height:'34px'}}>● Live</button>
</div>

<div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>
{page==='foryou'&&(
<div style={{flex:1,overflowY:'auto'}}>
{textPosts.length>0 && (
<div style={{padding:'10px',background:'#080808',borderBottom:'1px solid #1a1a1a'}}>
<div style={{fontWeight:'800',fontSize:'12px',color:'#888',marginBottom:'8px'}}>✍️ Written Posts</div>
{textPosts.map(v=>(
<div key={'text_'+v.id} style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px',marginBottom:'8px'}}>
<div style={{fontWeight:'800',fontSize:'12px'}}>{v.user} <span style={{color:'#888',fontWeight:'400'}}>{v.username}</span></div>
<div style={{fontSize:'13px',marginTop:'4px',whiteSpace:'pre-wrap'}}>{v.text||v.caption}</div>
</div>
))}
</div>
)}
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{normalVideos.map(v=>{
const isFollowing=follows[v.username]==='following'
const isLiked=likes[v.id]
const isMine=v.postedBy===user?.email || isOwner
return(
<div key={v.id} data-video-id={v.id} onTouchStart={()=>isMine && handleTouchStart(v.id)} onTouchEnd={handleTouchEnd} style={{width:'100%',height:'calc(100vh - 118px)',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0,zIndex:5}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0,zIndex:1}}>{renderMedia(v)}</div>
<div style={{position:'absolute',right:'12px',bottom:'90px',zIndex:6,display:'flex',flexDirection:'column',gap:'16px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'52px',height:'52px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'10px',color:'#000'}}>{v.user?.slice(0,2).toUpperCase()}</div>
<button onClick={()=>handleFollow(v.username)} style={{marginTop:'-10px',width:'22px',height:'22px',borderRadius:'50%',background:isFollowing?'#00D632':'#FF0024',border:'2px solid #000',color:'#fff',fontWeight:'900'}}>{isFollowing?'✓':'+'}</button>
</div>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{fontSize:'28px'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div></button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',color:'#fff'}}><div style={{fontSize:'20px'}}>↗</div></button>
</div>
<div style={{position:'absolute',left:'14px',right:'80px',bottom:'20px',zIndex:6,pointerEvents:'none'}}>
<div style={{fontWeight:'900',fontSize:'14px'}}>{v.user} {v.verified && '✓'}</div>
<div style={{fontSize:'13px',color:'#ddd'}}>{v.username}</div>
<div style={{fontSize:'13px',marginTop:'2px'}}>{v.caption}</div>
</div>
</div>
)})}
</div>
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory',background:'#000'}}>
{muzikaVideos.length===0 ? (
<div style={{padding:'40px',textAlign:'center',color:'#666'}}>No Muzika videos yet</div>
):(
muzikaVideos.map(v=>{
const isMine=v.postedBy===user?.email || isOwner
return(
<div key={v.id} data-video-id={v.youtubeId?'yt_'+v.id:v.id} onTouchStart={()=>isMine && handleTouchStart(v.id)} onTouchEnd={handleTouchEnd} style={{width:'100%',height:'calc(100vh - 118px)',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0}}>{renderMedia(v)}</div>
{/* NO RED MUZIKA-OFFICIAL LABEL ANYMORE - CLEAN */}
<div style={{position:'absolute',left:'14px',right:'14px',bottom:'14px',zIndex:2,display:'flex',flexDirection:'column',gap:'2px'}}>
<div style={{fontWeight:'900',fontSize:'14px',color:'#fff',textShadow:'0 1px 3px #000'}}>{v.user} {v.verified && '✓'}</div>
<div style={{fontSize:'12px',color:'#ccc',textShadow:'0 1px 2px #000'}}>{v.username}</div>
<div style={{fontSize:'12px',color:'#fff',marginTop:'2px',textShadow:'0 1px 3px #000',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.caption||v.originalLink}</div>
</div>
</div>
)
})
)}
</div>
)}

{page==='following'&&(
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory',background:'#000'}}>
<div style={{padding:'20px',textAlign:'center',color:'#666'}}>Following — {Object.keys(follows).filter(k=>follows[k]==='following').length} users</div>
</div>
)}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{pauseAllVideos(); setShowUpload(false)}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'15px',marginBottom:'12px'}}>Post — {isOwner?'UPTOWN Official':'Your Account'}</div>
<textarea value={uploadText} onChange={e=>setUploadText(e.target.value)} placeholder={isOwner?"Paste YouTube link here — stays forever in Muzika":"Write text (Muzika links only Official)"} style={{width:'100%',height:'60px',background:'#000',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',marginBottom:'10px'}}/>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',marginBottom:'10px'}}/>
{uploadPreview&&<video src={uploadPreview.url} controls style={{width:'100%',maxHeight:'180px',borderRadius:'12px',marginBottom:'10px'}} autoPlay loop/>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder={isOwner?"Caption OR https://youtu.be/...":"Caption"} style={{width:'100%',background:'#000',border:'1px solid '+(isOwner?'#333':'#333'),borderRadius:'10px',padding:'10px',color:'#fff',marginBottom:'12px'}}/>
{isYoutubeLink(uploadCaption+' '+uploadText) && isOwner && <div style={{background:'#0a1a0a',border:'1px solid #00D632',borderRadius:'8px',padding:'8px',marginBottom:'10px',fontSize:'11px',color:'#00D632'}}>✓ Will stay in Muzika forever — All new users will see it!</div>}
{isYoutubeLink(uploadCaption+' '+uploadText) && !isOwner && <div style={{background:'#330a0a',border:'1px solid #FF0024',borderRadius:'8px',padding:'8px',marginBottom:'10px',fontSize:'11px',color:'#FF0024'}}>❌ Only Official can post Muzika</div>}
<button onClick={handlePostNow} style={{width:'100%',background:'#00D632',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>🟢 POST NOW — Saved in Muzika forever</button>
</div>
</div>
)}

<div style={{height:'66px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px'}}>Home</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('muzika')}} style={{background:'none',border:'none',color:page==='muzika'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'18px'}}>🎵</span><span style={{fontSize:'10px'}}>Muzika</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('following')}} style={{background:'none',border:'none',color:page==='following'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'18px'}}>👥</span><span style={{fontSize:'10px'}}>Following</span></button>
<button onClick={()=>{pauseAllVideos(); setShowUpload(true)}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900'}}> + </button>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:'none',border:'none',color:page==='live'?'#FF0024':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>🔴</span><span style={{fontSize:'10px'}}>Live</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('you')}} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span>○</span><span style={{fontSize:'10px'}}>You</span></button>
</div>

{showDeleteModal!==null && (
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:70,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={()=>setShowDeleteModal(null)}>
<div style={{background:'#121212',border:'1px solid #333',borderRadius:'20px',padding:'16px',width:'100%',maxWidth:'320px'}} onClick={e=>e.stopPropagation()}>
{(()=>{const p=posts.find(x=>x.id===showDeleteModal); const isProtectedMuzika=p && (p.category==='Muzika' || p.youtubeId) && p.postedBy===OWNER_EMAIL; if(isProtectedMuzika && !isOwner){return <div style={{textAlign:'center',padding:'10px'}}><div style={{fontWeight:'800'}}>🔒 Protected</div><div style={{fontSize:'11px',color:'#888',marginTop:'6px'}}>This Muzika video is protected — Only UPTOWN Official can delete — It stays forever for all users!</div><button onClick={()=>setShowDeleteModal(null)} style={{width:'100%',marginTop:'12px',background:'#222',border:'none',color:'#fff',padding:'12px',borderRadius:'12px'}}>OK</button></div> } return <><button onClick={()=>handleDeleteVideo(showDeleteModal)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',width:'100%',marginBottom:'8px'}}>🗑️ Delete</button><button onClick={()=>setShowDeleteModal(null)} style={{background:'#222',color:'#888',border:'none',padding:'12px',borderRadius:'12px',width:'100%'}}>Cancel</button></> })()}
</div>
</div>
)}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'20px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'16px',fontWeight:'900',fontSize:'22px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#fff'}}>TOWN</span></div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'12px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Your Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>Continue — Watch all Muzika videos</button>
</div>
</div>
)}
</div>
)
}
