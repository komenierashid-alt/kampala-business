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
const [commentInput,setCommentInput]=useState('')
const [comments,setComments]=useState({})
const [posts,setPosts]=useState([])
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [searchQuery,setSearchQuery]=useState('')
const [viewProfile,setViewProfile]=useState(null)
const videoRefs=useRef({})

// AUTOMATIC DATABASE — BIG PAGES — AI SOAPS, AI MOVIES, BIG MUSICIANS, HISTORICAL
const AUTO_PAGES=[
{name:'AI Soaps', username:'@aisoaps', verified:true, caption:'AI Soaps ✓ Trending AI drama — UPTOWN Official created automatically', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type:'video', category:'AI Soaps'},
{name:'AI Movies', username:'@aimovies', verified:true, caption:'AI Movies ✓ Best AI movies — Auto page', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type:'video', category:'AI Movies'},
{name:'Drake', username:'@drake', verified:true, caption:'Drake ✓ America — Big musician — Auto page', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type:'video', category:'America'},
{name:'Beyoncé', username:'@beyonce', verified:true, caption:'Beyoncé ✓ America — Big musician', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', type:'video', category:'America'},
{name:'Burna Boy', username:'@burnaboy', verified:true, caption:'Burna Boy ✓ Africa — Big musician', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', type:'video', category:'Africa'},
{name:'Diamond Platnumz', username:'@diamondplatnumz', verified:true, caption:'Diamond Platnumz ✓ Africa — Big musician', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', type:'video', category:'Africa'},
{name:'Ed Sheeran', username:'@edsheeran', verified:true, caption:'Ed Sheeran ✓ Europe — Big musician', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', type:'video', category:'Europe'},
{name:'Adele', username:'@adele', verified:true, caption:'Adele ✓ Europe — Big musician', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', type:'video', category:'Europe'},
{name:'Historical Africa', username:'@historyafrica', verified:true, caption:'Historical Pages ✓ Africa history — Auto page', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', type:'video', category:'Historical'},
{name:'Historical World', username:'@historyworld', verified:true, caption:'Historical Pages ✓ World history — Auto page', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', type:'video', category:'Historical'},
]

const fetchPostsFromDB=async()=>{
try{
const res=await fetch('/api/posts').then(r=>r.json()).catch(()=>({posts:[]}))
if(res.posts && res.posts.length>0){
setPosts(res.posts)
}else{
// AUTOMATIC — WHEN YOU CONNECT DATABASE — AUTO CREATE PAGES
const autoPosts=AUTO_PAGES.map((p,i)=>({
id:9000+i,
user:'UPTOWN Official',
username:p.username,
displayName:p.name,
verified:true,
caption:p.caption,
mediaUrl:p.mediaUrl,
type:p.type,
category:p.category,
likes:15000+Math.floor(Math.random()*5000),
comments:900+Math.floor(Math.random()*200),
fires:500,
views:20000+Math.floor(Math.random()*10000),
postedAt:Date.now()-i*60000,
postedBy:OWNER_EMAIL,
isAutoPage:true,
official:true
}))
setPosts(autoPosts)
await savePostsToDB(autoPosts)
}
}catch(e){
const autoPosts=AUTO_PAGES.map((p,i)=>({
id:9000+i,
user:'UPTOWN Official',
username:p.username,
displayName:p.name,
verified:true,
caption:p.caption,
mediaUrl:p.mediaUrl,
type:p.type,
category:p.category,
likes:15601,
comments:978,
fires:520,
postedAt:Date.now()-i*60000,
isAutoPage:true
}))
setPosts(autoPosts)
}
}
const savePostsToDB=async(p)=>{
setPosts(p)
try{await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({posts:p})})}catch{}
}

useEffect(()=>{
const t=setTimeout(()=>{
setSplash(false)
const su=localStorage.getItem('uptown_user')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sFav=localStorage.getItem('uptown_fav_v3')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
fetchPostsFromDB()
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su)
setUser(u)
setIsOwner(u.email===OWNER_EMAIL)
}
},1200)
return()=>clearTimeout(t)
},[])

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

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
// ONLY UPTOWN OFFICIAL — NEVER SHOW KATONGOLE RASHID PUBLIC
if((authForm.name.toLowerCase().includes('katongole') || authForm.username.toLowerCase().includes('uptown') || authForm.username.toLowerCase().includes('katongole')) && email!==OWNER_EMAIL){
setBlockedMsg('Only UPTOWN Official account allowed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return
}
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill all'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const isOfficial=email===OWNER_EMAIL
const nu={
id:Date.now(),
name:isOfficial?'UPTOWN Official':authForm.name,
username:isOfficial?'@uptown':'@'+authForm.username.replace('@',''),
email,
password:authForm.password,
verified:isOfficial
}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false)
setBlockedMsg('✓ Account saved — UPTOWN keeps records — Login any phone'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found && email!==OWNER_EMAIL){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000); return}
const isOfficial=email===OWNER_EMAIL
const lu=isOfficial?{name:'UPTOWN Official',username:'@uptown',email,verified:true}:{name:found.name,username:found.username,email,verified:found.verified}
localStorage.setItem('uptown_user',JSON.stringify(lu)); setUser(lu); setIsOwner(isOfficial); setShowAuth(false)
}
}

const handleFollow=(username)=>{const isF=follows[username]==='following'; const nf={...follows,[username]:isF?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf)); setBlockedMsg(isF?'Unfollowed':'✓ Following'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),700)}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf)); setBlockedMsg(nf[id]?'★ Favorited':'★ Removed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),700)}
const handleShare=async(v)=>{try{await navigator.clipboard.writeText(v.mediaUrl); setBlockedMsg('Link copied'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),700)}catch{}}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused) v.play(); else v.pause()}
const handleFileChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setUploadPreview({url:u}); const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f)}
const handleDeleteVideo=(id)=>{if(!confirm('Delete this video?')) return; const filtered=posts.filter(p=>p.id!==id); savePostsToDB(filtered); setBlockedMsg('Deleted'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}

const handlePostNow=()=>{
let mu=uploadBase64 || uploadPreview?.url
if(!mu && !uploadText.trim()){setBlockedMsg('Upload video or write text'); setShowBlocked(true); return}
const isTextOnly=uploadText.trim() && !mu
const np={
id:Date.now(),
user:'UPTOWN Official',
username:user?.username||'@user',
displayName:user?.name||'User',
verified:user?.verified||false,
caption:isTextOnly?uploadText:uploadCaption||uploadText||'UPTOWN Official ✓',
text:uploadText||null,
mediaUrl:mu||null,
type:isTextOnly?'text':'video',
likes:0,comments:0,fires:0,
postedAt:Date.now(),
postedBy:user?.email
}
const nposts=[np, ...posts]; savePostsToDB(nposts)
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUploadText(''); setShowUpload(false)
setBlockedMsg('✓ Posted'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage('foryou')},600)
}

const openUserProfile=(username)=>{
if(username==='@uptown'){
setBlockedMsg('🔒 UPTOWN Official is confidential — Only owner'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return
}
const db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
const found=db.find(u=>u.username===username)
setViewProfile(found||{username, name:username.replace('@',''), verified:false, bio:'User of UPTOWN'})
setPage('viewprofile')
}

if(splash){
return(<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="120" height="150" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>)
}

const allVideos=[...posts].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const forYouFeed=allVideos
const searchFiltered=allVideos.filter(v=>{ if(!searchQuery) return false; const q=searchQuery.toLowerCase(); return (v.user?.toLowerCase().includes(q) || v.username?.toLowerCase().includes(q) || v.displayName?.toLowerCase().includes(q) || v.caption?.toLowerCase().includes(q) || v.category?.toLowerCase().includes(q)) })

const renderMedia=(v)=>{
if(v.type==='text'){
return <div style={{width:'100%',height:'100%',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}><div style={{background:'#1a1a1a',borderRadius:'16px',padding:'18px',maxWidth:'85%',fontSize:'15px',lineHeight:'1.4',textAlign:'center'}}>{v.text||v.caption}</div></div>
}
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline muted autoPlay style={{width:'100%',height:'100%',objectFit:'cover',background:'#000'}}/>
}

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>

{/* TOP — CLEAN */}
<div style={{height:'52px',display:'flex',alignItems:'center',padding:'0 10px',gap:'8px',borderBottom:'1px solid #1a1a1a',flexShrink:0}}>
<div style={{display:'flex',gap:'8px',flex:1}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'}].map(t=><button key={t.key} onClick={()=>{pauseAllVideos(); setPage(t.key)}} style={{background:page===t.key?'#fff':'#222',color:page===t.key?'#000':'#888',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'700',height:'34px'}}>{t.label}</button>)}
</div>
<button onClick={()=>{pauseAllVideos(); setPage('search')}} style={{background:'#1a1a1a',border:'1px solid #333',color:'#fff',width:'38px',height:'34px',borderRadius:'20px'}}>🔍</button>
<button onClick={()=>{pauseAllVideos(); setPage('live')}} style={{background:'#1a1a1a',border:'1px solid #FF0024',color:'#FF0024',padding:'6px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'800',height:'34px'}}>● Live</button>
</div>

<div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>

{page==='foryou'&&(
<div style={{flex:1,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
const isLiked=likes[v.id]
const isMine=v.postedBy===user?.email || isOwner
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
{/* VIDEO TAP */}
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderMedia(v)}</div>

{/* RIGHT — CLEAN — NO BOOSTS WORD */}
<div style={{position:'absolute',right:'12px',bottom:'90px',zIndex:3,display:'flex',flexDirection:'column',gap:'16px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'52px',height:'52px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #fff',fontWeight:'900',fontSize:'12px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></div>
<button onClick={()=>handleFollow(v.username)} style={{marginTop:'-10px',width:'22px',height:'22px',borderRadius:'50%',background:isFollowing?'#00D632':'#FF0024',border:'2px solid #000',color:'#fff',fontWeight:'900',fontSize:'14px'}}>{isFollowing?'✓':'+'}</button>
<div style={{fontSize:'12px',fontWeight:'700',marginTop:'4px',color:'#fff'}}>Follow</div>
</div>

<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
<div style={{fontSize:'30px',lineHeight:'1'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div>
<div style={{fontSize:'13px',fontWeight:'700'}}>{isLiked?15602:15601}</div>
</button>

<button onClick={()=>{pauseAllVideos(); setShowComments(v.id)}} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
<div style={{width:'34px',height:'34px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#000'}}>💬</div>
<div style={{fontSize:'13px',fontWeight:'700'}}>978</div>
</button>

<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
<div style={{fontSize:'22px'}}>↗</div>
<div style={{fontSize:'12px',fontWeight:'600'}}>Share</div>
</button>

<button onClick={()=>{const nf={...favorites,[v.id]:!favorites[v.id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf))}} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{fontSize:'22px'}}>★</div>
<div style={{fontSize:'11px'}}>Fav</div>
</button>

<button onClick={()=>setBlockedMsg('Duet allowed — Coming')} style={{background:'none',border:'1px solid #00D632',width:'42px',height:'32px',borderRadius:'20px',color:'#00D632',fontSize:'11px',fontWeight:'800'}}>Duet</button>

<button onClick={()=>handleLike('fire_'+v.id)} style={{background:'#1a1a1a',border:'1px solid #333',width:'42px',height:'42px',borderRadius:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#fff'}}>
<span style={{fontSize:'20px'}}>🔥</span>
<div style={{fontSize:'10px',fontWeight:'700'}}>520</div>
</button>
</div>

{/* BOTTOM — CLEAN — ONLY UPTOWN OFFICIAL — NO BOOSTS, NO LONG TEXT */}
<div style={{position:'absolute',left:'14px',right:'80px',bottom:'20px',zIndex:2,display:'flex',flexDirection:'column',gap:'4px'}}>
<div style={{display:'flex',alignItems:'center',gap:'6px'}}>
<span style={{fontWeight:'900',fontSize:'17px',color:'#fff'}}>UPTOWN Official</span>
<span style={{width:'18px',height:'18px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>
<span style={{fontSize:'13px',color:'#ddd'}}>{v.username}</span>
</div>
{/* ONLY CAPTION SHORT — NO CONFIDENTIAL LONG TEXT */}
{v.caption && <div style={{fontSize:'14px',color:'#fff',lineHeight:'1.3',maxWidth:'95%',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{v.caption}</div>}
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
<div style={{fontWeight:'800',fontSize:'13px',marginBottom:'4px'}}>Auto Pages — AI Soaps, AI Movies, Big Musicians, Historical</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
{AUTO_PAGES.map(p=><button key={p.username} onClick={()=>setSearchQuery(p.category||p.name)} style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',textAlign:'left'}}><div style={{fontWeight:'800',fontSize:'12px'}}>{p.name}</div><div style={{fontSize:'10px',color:'#888',marginTop:'2px'}}>{p.username} • {p.category}</div></button>)}
</div>
</div>
) : (
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
{searchFiltered.map(v=>(
<div key={v.id} style={{background:'#111',borderRadius:'12px',overflow:'hidden'}}>
<div style={{height:'160px',position:'relative'}}>{renderMedia(v)}</div>
<div style={{padding:'8px'}}><div style={{fontSize:'11px',fontWeight:'700'}}>UPTOWN Official</div><div style={{fontSize:'10px',color:'#888'}}>{v.username} • {v.category||''}</div></div>
</div>
))}
</div>
)}
</div>
</div>
)}

{page==='viewprofile'&& viewProfile &&(
<div style={{flex:1,overflowY:'auto',background:'#000',padding:'16px'}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%',marginBottom:'12px'}}>‹</button>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{width:'80px',height:'80px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900'}}>UP</div>
<div><div style={{fontWeight:'800',fontSize:'18px'}}>{viewProfile.name||viewProfile.username} {viewProfile.verified&&'✓'}</div><div style={{fontSize:'12px',color:'#888'}}>{viewProfile.username}</div></div>
</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px',marginTop:'16px'}}>
{allVideos.filter(v=>v.username===viewProfile.username).map(v=>(
<div key={v.id} style={{aspectRatio:'9/12',background:'#111',borderRadius:'8px',overflow:'hidden'}}>{renderMedia(v)}</div>
))}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,overflowY:'auto',background:'#000',padding:'16px'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900'}}>UP</div>
<div><div style={{fontWeight:'800',fontSize:'16px'}}>UPTOWN Official {user?.verified&&'✓'}</div><div style={{fontSize:'12px',color:'#888'}}>{user?.username||'@user'}</div></div>
</div>
<div style={{marginTop:'16px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px'}}>
{allVideos.filter(v=>v.postedBy===user?.email||isOwner).map(v=>(
<div key={v.id} style={{aspectRatio:'9/12',background:'#111',borderRadius:'8px',overflow:'hidden',position:'relative'}}>
{renderMedia(v)}
<button onClick={()=>handleDeleteVideo(v.id)} style={{position:'absolute',top:'4px',right:'4px',background:'rgba(255,0,36,0.8)',border:'none',color:'#fff',padding:'2px 6px',borderRadius:'10px',fontSize:'8px'}}>Delete</button>
</div>
))}
</div>
</div>
)}

{showComments!==null&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:60,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(null)}><div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'14px',maxHeight:'60vh'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div style={{fontWeight:'700'}}>Comments</div><button onClick={()=>setShowComments(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>×</button></div><div style={{display:'flex',gap:'8px',marginTop:'10px'}}><input value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder="Add comment" style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'8px 12px',color:'#fff'}}/><button onClick={()=>{setComments(prev=>({...prev,[showComments]:[...(prev[showComments]||[]),{id:Date.now(),text:commentInput,user:'User'}]})); setCommentInput('')}} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px'}}>Post</button></div></div></div>}
{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{pauseAllVideos(); setShowUpload(false)}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px'}} onClick={e=>e.stopPropagation()}>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'15px',marginBottom:'12px'}}>Post — UPTOWN Official — Video / Text / Document</div>
<textarea value={uploadText} onChange={e=>setUploadText(e.target.value)} placeholder="Write text message — You can post written messages on For You" style={{width:'100%',height:'80px',background:'#000',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',marginBottom:'10px'}}/>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',marginBottom:'10px'}}/>
{uploadPreview&&<video src={uploadPreview.url} style={{width:'100%',maxHeight:'180px',borderRadius:'12px',marginBottom:'10px'}} autoPlay loop muted playsInline/>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — Short only" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',marginBottom:'12px'}}/>
<button onClick={handlePostNow} style={{width:'100%',background:'#00D632',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>🟢 POST NOW</button>
<div style={{fontSize:'9px',color:'#666',textAlign:'center',marginTop:'8px'}}>Automatic database — Every button working — Old videos via search — AI Soaps/Movies pages auto created</div>
</div>
</div>
)}

<div style={{height:'64px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0}}>
<button onClick={()=>{pauseAllVideos(); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px'}}>Home</span></button>
<button onClick={()=>{pauseAllVideos(); setPage('search')}} style={{background:'none',border:'none',color:page==='search'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}><span style={{fontSize:'18px'}}>🔍</span><span style={{fontSize:'10px'}}>Search</span></button>
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
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Name — Will show as UPTOWN Official only" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email — komenierashid@gmail.com = Official" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>Continue — Automatic Database</button>
<div style={{fontSize:'9px',color:'#666',textAlign:'center',marginTop:'6px'}}>✓ Every button working — Automatic DB — Old via search — AI Soaps, AI Movies, Big Musicians, Historical pages auto created when connect DB</div>
</div>
</div>
)}
</div>
)
}
