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
const [uploadCaption,setUploadCaption]=useState('')
const [youtubeLink,setYoutubeLink]=useState('')
const [uploadPreview,setUploadPreview]=useState(null)
const [uploadBase64,setUploadBase64]=useState(null)
const [profilePic,setProfilePic]=useState(null)
const [follows,setFollows]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [blueBoard,setBlueBoard]=useState([])
const [posts,setPosts]=useState([])
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const containerRef=useRef(null)
const videoRefs=useRef({})

const forYouTests=[
{id:101,user:'Katongole Rashid',username:'@katongole',verified:true,caption:'For You Test 1 🔥 Auto play + pause background', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video'},
{id:102,user:'Katongole Rashid',username:'@katongole',verified:true,caption:'For You Test 2 — Previous pauses', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video'},
{id:103,user:'Katongole Rashid',username:'@katongole',verified:true,caption:'For You Test 3 — Only current plays', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', mediaType:'video'},
]
const muzikaTests=[
{id:201,user:'Katongole Rashid',username:'@katongole',verified:true,caption:'Muzika Test 1 🎵 YouTube auto', mediaUrl:'https://www.youtube.com/watch?v=jNQXAC9IVRw', mediaType:'youtube'},
{id:202,user:'Katongole Rashid',username:'@katongole',verified:true,caption:'Muzika Test 2 🎶 YouTube', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', mediaType:'video'},
{id:203,user:'Katongole Rashid',username:'@katongole',verified:true,caption:'Muzika Test 3 🔥', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', mediaType:'video'},
]

useEffect(()=>{
const t=setTimeout(()=>{setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sL=localStorage.getItem('uptown_likes_v2')
const sP=localStorage.getItem('uptown_posts_final')
const sPic=localStorage.getItem('uptown_profile_pic')
if(sF) setFollows(JSON.parse(sF))
if(sL) setLikes(JSON.parse(sL))
if(sP) setPosts(JSON.parse(sP))
if(sPic) setProfilePic(sPic)
if(!su) setShowAuth(true)
else{setUser(JSON.parse(su)); if(sO==='true') setIsOwner(true)}
},2200)
return()=>clearTimeout(t)
},[])

// PAUSE PREVIOUS VIDEO - NOT PLAY ON BACKGROUND
useEffect(()=>{
if(page!=='foryou' && page!=='muzika') return
const observer=new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
const id=entry.target.getAttribute('data-video-id')
const video=videoRefs.current[id]
if(!video) return
if(entry.isIntersecting){
// Play current, pause others
Object.keys(videoRefs.current).forEach(k=>{
if(k!==id && videoRefs.current[k]){
videoRefs.current[k].pause()
}
})
video.play().catch(()=>{})
}else{
video.pause()
}
})
},{threshold:0.7})

const els=document.querySelectorAll('[data-video-id]')
els.forEach(el=>observer.observe(el))
return()=>observer.disconnect()
},[page,posts])

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
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name + username'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const nu={id:Date.now(),name:authForm.name,username:'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:false}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email}; localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setIsOwner(ownerCheck); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!ownerCheck){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const lu=ownerCheck?{name:'Katongole Rashid',username:'@katongole',email}:{name:found.name,username:found.username,email:found.email}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setIsOwner(ownerCheck); setShowAuth(false)
}
}

const handleFollow=(username)=>{const nf={...follows,[username]:follows[username]==='following'?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf)); setBlockedMsg(nf[username]==='following'?'Following ✓':'Unfollowed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{setFavorites({...favorites,[id]:!favorites[id]}); setBlockedMsg('Saved'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),800)}
const handleShare=(v)=>{navigator.clipboard.writeText(location.href); setBlockedMsg('Link copied ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)}

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
reader.onload=(ev)=>{setProfilePic(ev.target.result); localStorage.setItem('uptown_profile_pic',ev.target.result); setBlockedMsg('Profile changed ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)}
reader.readAsDataURL(file)
}
const handlePostNow=()=>{
let mediaUrl=null; let mediaType='video'
if(youtubeLink){const ytId=getYoutubeId(youtubeLink); if(!ytId){setBlockedMsg('Invalid YouTube'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return} mediaUrl=youtubeLink; mediaType='youtube'}
else if(uploadBase64){mediaUrl=uploadBase64; mediaType=uploadPreview.type.startsWith('video')?'video':'image'}
else{setBlockedMsg('Choose video or YouTube link'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const np={id:Date.now(),user:user?.name||'My Page',username:user?.username||'@me',verified:true,caption:uploadCaption||'UPTOWN 🔥',mediaUrl,mediaType,isMuzika:page==='muzika'}
const newPosts=[np,...posts]; setPosts(newPosts); localStorage.setItem('uptown_posts_final',JSON.stringify(newPosts))
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setYoutubeLink(''); setShowUpload(false)
}

if(splash){
return(
<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<style>{`@keyframes pulse {0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}`}</style>
<svg width="160" height="190" viewBox="0 0 200 230" style={{animation:'pulse 1.2s infinite'}}>
<path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/>
<text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text>
</svg>
<div style={{marginTop:'20px',fontWeight:'700',letterSpacing:'2px',fontSize:'12px',color:'#888'}}>UPTOWN CHAT — LOADING...</div>
</div>
)
}

const forYouFeed=[...posts.filter(p=>!p.isMuzika),...forYouTests]
const muzikaFeed=[...posts.filter(p=>p.isMuzika),...muzikaTests]

const renderVideo=(v)=>{
const ytId=getYoutubeId(v.mediaUrl)
if(v.mediaType==='youtube' || ytId){
return <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}?autoplay=0&controls=1&playsinline=1`} frameBorder="0" allow="encrypted-media" allowFullScreen style={{width:'100%',height:'100%'}}/>
}
if(v.mediaUrl){
if(v.mediaType==='video' || v.mediaUrl.includes('.mp4') || v.mediaUrl.startsWith('data:video')){
return <video 
ref={el=>{if(el) videoRefs.current[v.id]=el}} 
data-video-id={v.id}
src={v.mediaUrl} 
loop 
playsInline 
autoPlay
style={{width:'100%',height:'100%',objectFit:'cover'}}
/>
}
return <img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
}
return <div style={{width:'100%',height:'100%',background:'#111'}}/>
}

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
<div ref={containerRef} style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
{renderVideo(v)}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,maxWidth:'62%'}}>
<div style={{fontWeight:'700'}}>{v.user} {v.verified&&'✓'}</div>
<div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div>
</div>
<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:2,display:'flex',flexDirection:'column',gap:'15px',alignItems:'center'}}>
<button onClick={()=>handleFollow(v.username)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',border:isFollowing?'2px solid #00D632':'2px solid #fff'}}><span style={{fontWeight:'900',fontSize:'10px',color:'#000'}}>UP</span><div style={{position:'absolute',bottom:'-5px',background:isFollowing?'#00D632':'#FF0024',color:'#fff',width:'18px',height:'18px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',border:'2px solid #000'}}>{isFollowing?'✓':'+'}</div></div>
<span style={{fontSize:'9px',color:'#fff',fontWeight:'700',marginTop:'4px',textAlign:'center'}}>{isFollowing?'Following\n✓':'Follow\nBack'}</span>
</button>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:likes[v.id]?'#FF0024':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>{likes[v.id]?'♥':'♡'}</span><span style={{fontSize:'10px'}}>Like</span></button>
<button onClick={()=>handleFire(v.id)} style={{background:'none',border:'none',color:likes['fire_'+v.id]?'#FF6A00':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>🔥</span><span style={{fontSize:'10px'}}>Fire</span></button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'18px'}}>↗</span><span style={{fontSize:'10px'}}>Share</span></button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',color:favorites[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>{favorites[v.id]?'★':'☆'}</span><span style={{fontSize:'10px'}}>Fav</span></button>
</div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,display:'flex',flexDirection:'column'}}>
<div style={{padding:'12px 16px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:'700',fontSize:'13px'}}>Muzika — YouTube auto play in app</div><button onClick={()=>setShowUpload(true)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>+ Post</button></div>
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>{
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',flexShrink:0}}>
{renderVideo(v)}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2}}><div style={{fontWeight:'700'}}>{v.user} ✓</div><div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div></div>
<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:2,display:'flex',flexDirection:'column',gap:'15px',alignItems:'center'}}>
<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',color:likes[v.id]?'#FF0024':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>{likes[v.id]?'♥':'♡'}</span><span style={{fontSize:'10px'}}>Like</span></button>
<button onClick={()=>handleFire(v.id)} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>🔥</span><span style={{fontSize:'10px'}}>Fire</span></button>
</div>
</div>
)})}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,padding:'20px',overflowY:'auto'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<label style={{width:'70px',height:'70px',borderRadius:'50%',background:profilePic?`url(${profilePic})`:'#fff',backgroundSize:'cover',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',color:'#000',position:'relative',cursor:'pointer',border:'2px solid #333'}}>
{!profilePic&&'UP'}
<input type="file" accept="image/*" onChange={handleProfilePicChange} style={{display:'none'}}/>
<div style={{position:'absolute',bottom:'-4px',right:'-4px',background:'#FF0024',width:'22px',height:'22px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:'#fff'}}>📷</div>
</label>
<div><div style={{fontWeight:'700'}}>{user?.name}</div><div style={{fontSize:'12px',color:'#888'}}>{user?.username}</div><div style={{fontSize:'11px',color:'#00D632',marginTop:'4px'}}>Tap to change profile picture</div></div>
</div>
<div style={{marginTop:'20px',display:'flex',gap:'10px'}}>
<button onClick={()=>{setAuthMode('login'); setShowAuth(true)}} style={{flex:1,background:'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'700'}}>Login Button</button>
<button onClick={()=>{setAuthMode('signup'); setShowAuth(true)}} style={{flex:1,background:'#FF0024',color:'#fff',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'700'}}>Sign Up Button</button>
</div>
</div>
)}

{page==='following'&&<div style={{flex:1,padding:'20px'}}>Following page — buttons active</div>}
{page==='live'&&<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>🔴 LIVE</div>}
{page==='inbox'&&<div style={{flex:1,padding:'20px',textAlign:'center'}}>Inbox — Blue tick</div>}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'16px 20px',borderRadius:'14px',zIndex:80}}><div style={{fontWeight:'700',fontSize:'13px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'24px',borderTopRightRadius:'24px',padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center'}}>{page==='muzika'?'Post to Muzika — YouTube allowed':'Post Video'}</div>
<div style={{marginTop:'14px',background:'#1a1a1a',borderRadius:'12px',padding:'12px'}}>
<div style={{fontSize:'12px',fontWeight:'700'}}>🔗 YouTube Link (auto plays in app)</div>
<input value={youtubeLink} onChange={e=>setYoutubeLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={{width:'100%',marginTop:'6px',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
</div>
<div style={{marginTop:'8px',textAlign:'center',color:'#666',fontSize:'12px'}}>OR upload</div>
<input type="file" accept="video/*,image/*" onChange={handleFileChange} style={{width:'100%',marginTop:'12px',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'12px'}}><video src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}} autoPlay loop playsInline/></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'12px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
<button onClick={handlePostNow} style={{marginTop:'14px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900'}}>POST NOW ✓</button>
</div>
</div>
)}

<div style={{display:'flex',justifyContent:'space-around',padding:'10px 0',borderTop:'1px solid #1a1a1a',background:'#000'}}>
<button onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage('foryou')}} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',fontSize:'10px'}}>⌂<br/>For You</button>
<button onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage('following')}} style={{background:'none',border:'none',color:'#666',fontSize:'10px'}}>👥<br/>People</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024',border:'none',width:'52px',height:'36px',borderRadius:'12px',color:'#fff',fontSize:'22px'}}>+</button>
<button onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage('inbox')}} style={{background:'none',border:'none',color:'#666',fontSize:'10px'}}>✉<br/>Inbox</button>
<button onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage('you')}} style={{background:'none',border:'none',color:'#666',fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
