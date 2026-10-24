"use client"
import { useState, useEffect } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [authMode, setAuthMode] = useState('signup')
const [showAuth, setShowAuth] = useState(false)
const [user, setUser] = useState(null)
const [isOwner, setIsOwner] = useState(false)
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [follows, setFollows] = useState({})
const [adFollows, setAdFollows] = useState({}) // advert follow
const [blueBoard, setBlueBoard] = useState([])
const [favorites, setFavorites] = useState({})
const [likes, setLikes] = useState({})
const [notifications, setNotifications] = useState([])
const [muzikaVideos, setMuzikaVideos] = useState([])
const [chatUser, setChatUser] = useState(null)
const [authForm, setAuthForm] = useState({name:'', username:'', email:'', password:''})
const [showBlocked, setShowBlocked] = useState(false)
const [blockedMsg, setBlockedMsg] = useState('')
const [installPrompt, setInstallPrompt] = useState(null)
const [allUsers, setAllUsers] = useState([
  {id:1, name:'Katongole Rashid', username:'@katongole', verified:true, isOwner:true, followers:12400},
  {id:2, name:'Sheilah G', username:'@sheilah', verified:false, followers:892},
  {id:3, name:'DJ Nimrod', username:'@nimrod', verified:false, followers:2100},
])

// 🔥 ADVERT WITH YOUR PICTURE - UNLOCKED
const advertPost = {
  id:'AD_UPTOWN_001',
  isAd:true,
  user:'UPTOWN Official',
  username:'@uptown',
  verified:true,
  caption:'UPTOWN GIRL CHATTIN\' WITH A UPTOWN GUY 🔥 Chattin\' on Uptown Chat, we fly! Swagger on swagger, yeah we lit tonight, Connect, chat, city lights — yeah right! #UptownChat #Advert',
  mediaUrl:'/uptown-ad.jpg', // your picture
  likesCount: 4520
}

const videos = [
  advertPost,
  {id:1, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Welcome to UPTOWN 🔥 Official launch — Follow each other!', isOwner:true, mediaUrl:null},
  {id:2, user:'Sheilah G', username:'@sheilah', verified:false, caption:'Love this app! Follow me back guys 💖', mediaUrl:null},
]

useEffect(()=>{
  window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); setInstallPrompt(e) })
  const t=setTimeout(()=>{
    setSplash(false)
    const savedUser = localStorage.getItem('uptown_user')
    const savedUsers = localStorage.getItem('uptown_all_users')
    const savedOwner = localStorage.getItem('uptown_is_owner')
    const savedFollows = localStorage.getItem('uptown_follows')
    const savedBoard = localStorage.getItem('uptown_blue_board')
    const savedLikes = localStorage.getItem('uptown_likes')
    const savedAdFollows = localStorage.getItem('uptown_ad_follows')
    if(savedUsers) setAllUsers(JSON.parse(savedUsers))
    if(savedFollows) setFollows(JSON.parse(savedFollows))
    if(savedBoard) setBlueBoard(JSON.parse(savedBoard))
    if(savedLikes) setLikes(JSON.parse(savedLikes))
    if(savedAdFollows) setAdFollows(JSON.parse(savedAdFollows))
    if(!savedUser) setShowAuth(true)
    else {
      setUser(JSON.parse(savedUser))
      if(savedOwner==='true') setIsOwner(true)
    }
  }, 2200)
  return()=>clearTimeout(t)
},[])

const saveBoard = (b)=>{ setBlueBoard(b); localStorage.setItem('uptown_blue_board', JSON.stringify(b)) }

const handleAuth = () => {
  if(!authForm.email || !authForm.password) return
  const email = authForm.email.toLowerCase().trim()
  const ownerCheck = email === 'komenierashid@gmail.com'
  let users = JSON.parse(localStorage.getItem('uptown_all_users') || JSON.stringify(allUsers))
  let existingUsersDB = JSON.parse(localStorage.getItem('uptown_users_db') || '[]')
  if(authMode==='signup'){
    if(!authForm.name || !authForm.username) return
    if(existingUsersDB.find(u=>u.email===email)){ alert('Account exists! Login'); setAuthMode('login'); return }
    const newUser = {id:Date.now(), name: authForm.name, username:'@'+authForm.username.replace('@',''), email, password: authForm.password, verified:false, followers:0}
    existingUsersDB.push(newUser); localStorage.setItem('uptown_users_db', JSON.stringify(existingUsersDB))
    users.push(newUser); localStorage.setItem('uptown_all_users', JSON.stringify(users)); setAllUsers(users)
    const loginUser = {name: newUser.name, username: newUser.username, email}
    localStorage.setItem('uptown_user', JSON.stringify(loginUser)); localStorage.setItem('uptown_is_owner', ownerCheck ? 'true' : 'false')
    setUser(loginUser); setIsOwner(ownerCheck); setShowAuth(false)
  } else {
    const found = existingUsersDB.find(u=>u.email===email && u.password===authForm.password)
    if(!found && !ownerCheck){ alert('No account found. Sign Up'); return }
    const loginUser = ownerCheck ? {name:'Katongole Rashid', username:'@katongole', email} : {name: found.name, username: found.username, email: found.email}
    localStorage.setItem('uptown_user', JSON.stringify(loginUser)); localStorage.setItem('uptown_is_owner', ownerCheck ? 'true' : 'false')
    setUser(loginUser); setIsOwner(ownerCheck); setShowAuth(false)
  }
}

const handleFollow = (username) => {
  if(username==='@katongole' && !isOwner){
    setBlockedMsg('🔒 Confidential — Owner account private'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return
  }
  const newFollows = {...follows, [username]: follows[username]==='following' ? 'follow' : 'following'}
  setFollows(newFollows); localStorage.setItem('uptown_follows', JSON.stringify(newFollows))
}

const handleAdFollow = () => {
  const newVal = adFollows['@uptown'] === 'following' ? 'follow' : 'following'
  const newAd = {...adFollows, ['@uptown']: newVal}
  setAdFollows(newAd); localStorage.setItem('uptown_ad_follows', JSON.stringify(newAd))
}

const handleLike = (id) => {
  const newLikes = {...likes, [id]: !likes[id]}
  setLikes(newLikes); localStorage.setItem('uptown_likes', JSON.stringify(newLikes))
}

const handleFavorite = (id) => {
  setFavorites({...favorites, [id]: !favorites[id]})
}

const requestBlueTick = () => {
  if(!user) return
  if(blueBoard.find(r=>r.email===user.email && r.status==='pending')){
    setBlockedMsg('Already requested!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return
  }
  const req = {id:Date.now(), name: user.name, username: user.username, email: user.email, message:'Requesting blue tick', status:'pending'}
  saveBoard([...blueBoard, req])
  setBlockedMsg('Request sent to Owner!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
}

const acceptBlueTick = (id) => {
  const req = blueBoard.find(r=>r.id===id)
  saveBoard(blueBoard.map(r=> r.id===id ? {...r, status:'accepted'} : r))
  const updatedUsers = allUsers.map(u=> u.username===req.username ? {...u, verified:true} : u); setAllUsers(updatedUsers); localStorage.setItem('uptown_all_users', JSON.stringify(updatedUsers))
  setChatUser(null)
}

const openProfile = (v) => {
  if(v.username === '@katongole' || v.isOwner){
    if(!isOwner){
      setBlockedMsg("🔒 Confidential — Katongole Rashid's account is private"); setShowBlocked(true); setTimeout(()=>setShowBlocked(false), 2000); return
    }
  }
}

if(splash){
return(<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}><svg width="220" height="250" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>)
}

return(
<div style={{background:'#000', color:'#fff', width:'100vw', height:'100dvh', position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:'Inter, sans-serif'}}>

{showAuth && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:100, display:'flex', flexDirection:'column', padding:'24px', justifyContent:'center'}}>
<div style={{textAlign:'center', marginBottom:'28px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>
<div style={{display:'flex', background:'#121212', borderRadius:'20px', padding:'4px', marginBottom:'16px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1, background: authMode==='signup'?'#fff':'transparent', color: authMode==='signup'?'#000':'#888', border:'none', padding:'10px', borderRadius:'16px', fontWeight:'700'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1, background: authMode==='login'?'#fff':'transparent', color: authMode==='login'?'#000':'#888', border:'none', padding:'10px', borderRadius:'16px', fontWeight:'700'}}>Login</button>
</div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
{authMode==='signup' && <><input value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} placeholder="Your Name" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm, username:e.target.value})} placeholder="Username" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} placeholder="Email" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700'}}>{authMode==='signup' ? 'Sign Up' : 'Login'}</button>
</div>
</div>
)}

<div style={{display:'flex', padding:'12px 16px', gap:'20px', borderBottom:'1px solid #1a1a1a'}}>
{['For You','Muzika','Following'].map(t=>{
  const key = t.toLowerCase().replace(' ',''); const active = (page==='foryou' && t==='For You') || page===key
  return <button key={t} onClick={()=>setPage(key==='foryou'?'foryou':key)} style={{background:'none', border:'none', color: active?'#fff':'#717171', fontSize:'14px', fontWeight: active?'700':'500'}}>{t}</button>
})}
</div>

<div style={{flex:1, overflow:'hidden', display:'flex', flexDirection:'column'}}>
<div style={{flex:1, overflowY:'scroll', scrollSnapType:'y mandatory'}}>
{videos.map(v=>{
  const isAd = v.isAd
  const isFollowing = isAd ? adFollows[v.username]==='following' : follows[v.username]==='following'
  const isLiked = likes[v.id]
  return(
<div key={v.id} style={{width:'100%', height:'100%', scrollSnapAlign:'start', position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
{isAd ? (
  <img src={v.mediaUrl} alt="UPTOWN Advert" style={{width:'100%', height:'100%', objectFit:'cover'}} onError={(e)=>{e.target.style.display='none'; e.target.nextSibling.style.display='flex'}}/>
) : null}
{isAd && <div style={{display:'none', width:'100%', height:'100%', background:'#111', alignItems:'center', justifyContent:'center', color:'#333'}}>Advert Image — Upload uptown-ad.jpg to public folder</div>}
{!isAd && <div style={{color:'#222', fontSize:'60px'}}>▶</div>}

{/* UNLOCKED - ADVERT TOP BADGE */}
{isAd && <div style={{position:'absolute', top:'16px', left:'16px', zIndex:2, background:'#FF0024', color:'#fff', padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'800'}}>🔥 ADVERT • UPTOWN CHAT</div>}

<div style={{position:'absolute', left:'16px', bottom:'20px', zIndex:2, maxWidth:'70%'}}>
<div style={{display:'flex', alignItems:'center', gap:'8px'}}><span style={{fontWeight:'700'}}>{v.user}</span>{v.verified && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}{isAd && <span style={{background:'#00D632', color:'#000', fontSize:'9px', padding:'2px 6px', borderRadius:'10px', fontWeight:'800'}}>PROMOTED</span>}</div>
<div style={{fontSize:'14px', marginTop:'8px'}}>{v.caption}</div>
{isAd && <div style={{marginTop:'8px', background:'rgba(0,0,0,0.6)', padding:'6px 10px', borderRadius:'20px', fontSize:'11px', display:'inline-block'}}>Chattin’ on Uptown Chat, we fly! ✨</div>}
</div>

{/* RIGHT BUTTONS - UNLOCKED - FOLLOW, LIKE, FAVORITE */}
<div style={{position:'absolute', right:'12px', bottom:'90px', zIndex:2, display:'flex', flexDirection:'column', gap:'18px', alignItems:'center'}}>

{/* FOLLOW / FOLLOW BACK - OPEN FOR EVERYONE */}
<button onClick={(e)=>{e.stopPropagation(); isAd ? handleAdFollow() : handleFollow(v.username)}} style={{background:'none', border:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
<div style={{width:'48px', height:'48px', borderRadius:'50%', background: isAd ? '#FF0024' : '#fff', display:'flex', alignItems:'center', justifyContent:'center', border: isFollowing ? '2px solid #00D632' : '2px solid #fff', position:'relative'}}>
<span style={{fontWeight:'900', fontSize:'11px', color: isAd ? '#fff' : '#000'}}>{isAd ? 'AD' : <span><span style={{color:'#FF0024'}}>UP</span>TOWN</span>}</span>
<div style={{position:'absolute', bottom:'-6px', background: isFollowing?'#00D632':'#FF0024', color:'#fff', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #000', fontSize:'12px'}}>{isFollowing? '✓' : '+'}</div>
</div>
<span style={{fontSize:'10px', color:'#fff', fontWeight:'700', textAlign:'center'}}>{isFollowing ? (isAd ? 'Following\nFollow Back ✓' : 'Following') : (isAd ? 'Follow\nFollow Back' : 'Follow')}</span>
</button>

{/* LIKE - OPEN FOR EVERYONE */}
<button onClick={(e)=>{e.stopPropagation(); handleLike(v.id)}} style={{background:'none', border:'none', color: isLiked ? '#FF0024' : '#fff', display:'flex', flexDirection:'column', alignItems:'center'}}>
<span style={{fontSize:'24px'}}>{isLiked ? '♥' : '♡'}</span>
<span style={{fontSize:'11px'}}>{isLiked ? (isAd ? '4.5K' : '1') : (isAd ? '4.5K' : '0')} Likes</span>
</button>

{/* COMMENT */}
<button style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'20px'}}>💬</span><span style={{fontSize:'11px'}}>Chat</span></button>

{/* SHARE - NOW UNLOCKED */}
<button onClick={(e)=>{e.stopPropagation(); if(navigator.share) navigator.share({title:'UPTOWN', text:v.caption, url:location.href})}} style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'20px'}}>↗</span><span style={{fontSize:'10px'}}>Share</span></button>

{/* FAVORITE AFTER SHARE - FOR EVERYONE */}
<button onClick={(e)=>{e.stopPropagation(); handleFavorite(v.id)}} style={{background:'none', border:'none', color: favorites[v.id] ? '#FFD700' : '#fff', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'22px'}}>{favorites[v.id] ? '★' : '☆'}</span><span style={{fontSize:'10px'}}>{favorites[v.id] ? 'Saved' : 'Fav'}</span></button>

</div>
</div>
)})}
</div>
</div>

{showBlocked && (
<div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'#1a1a1a', border:'1px solid #333', padding:'18px 22px', borderRadius:'14px', zIndex:80, textAlign:'center', maxWidth:'85%'}}>
<div style={{fontWeight:'700', fontSize:'14px'}}>{blockedMsg}</div>
</div>
)}

<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'10px'}}>⌂<br/>Home</button>
<button onClick={()=>setPage('muzika')} style={{background:'none', border:'none', color: page==='muzika'?'#fff':'#666', fontSize:'10px'}}>♫<br/>Muzika</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'#fff':'#666', fontSize:'10px'}}>✉<br/>Inbox</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'#fff':'#666', fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
