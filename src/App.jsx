"use client"
import { useState, useEffect } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [authMode, setAuthMode] = useState('signup')
const [showAuth, setShowAuth] = useState(false)
const [user, setUser] = useState(null)
const [isOwner, setIsOwner] = useState(false)
const [allowPosting, setAllowPosting] = useState(false)
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [follows, setFollows] = useState({})
const [blueBoard, setBlueBoard] = useState([])
const [favorites, setFavorites] = useState({})
const [notifications, setNotifications] = useState([])
const [muzikaVideos, setMuzikaVideos] = useState([
  {id:101, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'UPTOWN Muzika 🔥 Official — Only Owner can upload here', isOwner:true},
])
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

const videos = [
  {id:1, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Welcome to UPTOWN 🔥 Official launch preparation. Follow each other! #Uptown #Kampala', isOwner:true},
  {id:2, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'See who joined - Following tab - start following! 🚀', isOwner:true},
]

useEffect(()=>{
  window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); setInstallPrompt(e) })
  const t=setTimeout(()=>{
    setSplash(false)
    const savedUser = localStorage.getItem('uptown_user')
    const savedUsers = localStorage.getItem('uptown_all_users')
    const savedOwner = localStorage.getItem('uptown_is_owner')
    const savedAllow = localStorage.getItem('uptown_allow_posting')
    const savedFollows = localStorage.getItem('uptown_follows')
    const savedBoard = localStorage.getItem('uptown_blue_board')
    const savedNotifs = localStorage.getItem('uptown_notifications')
    const savedMuzika = localStorage.getItem('uptown_muzika')
    if(savedUsers) setAllUsers(JSON.parse(savedUsers))
    if(savedFollows) setFollows(JSON.parse(savedFollows))
    if(savedBoard) setBlueBoard(JSON.parse(savedBoard))
    if(savedNotifs) setNotifications(JSON.parse(savedNotifs))
    if(savedMuzika) setMuzikaVideos(JSON.parse(savedMuzika))
    if(!savedUser) setShowAuth(true)
    else {
      setUser(JSON.parse(savedUser))
      if(savedOwner==='true') setIsOwner(true)
      if(savedAllow==='true') setAllowPosting(true)
    }
  }, 2200)
  return()=>clearTimeout(t)
},[])

const saveBoard = (b)=>{ setBlueBoard(b); localStorage.setItem('uptown_blue_board', JSON.stringify(b)) }
const saveNotifs = (n)=>{ setNotifications(n); localStorage.setItem('uptown_notifications', JSON.stringify(n)) }
const saveMuzika = (m)=>{ setMuzikaVideos(m); localStorage.setItem('uptown_muzika', JSON.stringify(m)) }

const handleInstall = async () => {
  if(!installPrompt){ alert('Tap browser menu ⋮ → Add to Home Screen'); return }
  installPrompt.prompt()
}

const handleAuth = () => {
  if(!authForm.email || !authForm.password) return
  const email = authForm.email.toLowerCase().trim()
  const ownerCheck = email === 'komenierashid@gmail.com'
  let users = JSON.parse(localStorage.getItem('uptown_all_users') || JSON.stringify(allUsers))
  let existingUsersDB = JSON.parse(localStorage.getItem('uptown_users_db') || '[]')

  if(authMode==='signup'){
    if(!authForm.name || !authForm.username) return
    if(existingUsersDB.find(u=>u.email===email)){ alert('Account exists! Please Login'); setAuthMode('login'); return }
    const newUser = {id:Date.now(), name: authForm.name, username:'@'+authForm.username.replace('@',''), email, password: authForm.password, verified:false, followers:0}
    existingUsersDB.push(newUser); localStorage.setItem('uptown_users_db', JSON.stringify(existingUsersDB))
    users.push(newUser); localStorage.setItem('uptown_all_users', JSON.stringify(users)); setAllUsers(users)
    const loginUser = {name: newUser.name, username: newUser.username, email}
    localStorage.setItem('uptown_user', JSON.stringify(loginUser)); localStorage.setItem('uptown_is_owner', ownerCheck ? 'true' : 'false')
    setUser(loginUser); setIsOwner(ownerCheck); setShowAuth(false)
  } else {
    const found = existingUsersDB.find(u=>u.email===email && u.password===authForm.password)
    if(!found && !ownerCheck){ alert('No account found. Sign Up first'); return }
    const loginUser = ownerCheck ? {name:'Katongole Rashid', username:'@katongole', email} : {name: found.name, username: found.username, email: found.email}
    localStorage.setItem('uptown_user', JSON.stringify(loginUser)); localStorage.setItem('uptown_is_owner', ownerCheck ? 'true' : 'false')
    setUser(loginUser); setIsOwner(ownerCheck); setShowAuth(false)
  }
}

const handleFollow = (username) => {
  if(username==='@katongole' && !isOwner){ setBlockedMsg('🔒 Confidential — Cannot follow private owner account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return }
  const newFollows = {...follows, [username]: follows[username]==='following' ? 'follow' : 'following'}
  setFollows(newFollows); localStorage.setItem('uptown_follows', JSON.stringify(newFollows))
}

const handleFavorite = (id) => {
  const newFav = {...favorites, [id]: !favorites[id]}
  setFavorites(newFav)
}

const requestBlueTick = () => {
  if(!user) return
  if(blueBoard.find(r=>r.email===user.email && r.status==='pending')){
    setBlockedMsg('Already requested! Waiting for Owner'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2500); return
  }
  if(allUsers.find(u=>u.username===user.username && u.verified)){
    setBlockedMsg('You already have blue tick ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2500); return
  }
  const req = {id:Date.now(), name: user.name, username: user.username, email: user.email, message:'Requesting blue tick verification', status:'pending'}
  saveBoard([...blueBoard, req])
  setBlockedMsg('Request sent to Uptown Board! Owner will approve'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2500)
}

const acceptBlueTick = (id) => {
  const req = blueBoard.find(r=>r.id===id)
  if(!req) return
  saveBoard(blueBoard.map(r=> r.id===id ? {...r, status:'accepted'} : r))
  const updatedUsers = allUsers.map(u=> u.username===req.username ? {...u, verified:true} : u); setAllUsers(updatedUsers); localStorage.setItem('uptown_all_users', JSON.stringify(updatedUsers))
  const updatedDB = JSON.parse(localStorage.getItem('uptown_users_db') || '[]').map(u=> u.email===req.email ? {...u, verified:true} : u); localStorage.setItem('uptown_users_db', JSON.stringify(updatedDB))
  saveNotifs([...notifications, {id:Date.now(), toEmail: req.email, text:`Congratulations ${req.name}! You're verified ✓ Blue tick added`, type:'verified'}])
  setChatUser(null)
  setBlockedMsg(`Verified ${req.name} ✓`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2500)
}

const sendInviteToUnverified = () => {
  const unverified = allUsers.filter(u=>!u.verified && !u.isOwner)
  const newNotifs = unverified.map(u=>({id:Date.now()+Math.random(), toEmail: u.email || u.username, text:`UPTOWN: Hi ${u.name}, request for Blue Tick in Inbox`, type:'invite'}))
  saveNotifs([...notifications, ...newNotifs])
  setBlockedMsg(`Invite sent to ${unverified.length} users`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2500)
}

// 🔒 CONFIDENTIAL: ONLY KATONGOLE ACCOUNT PRIVATE
const openProfile = (v) => {
  if(v.username === '@katongole' || v.isOwner){
    if(!isOwner){
      setBlockedMsg("🔒 Confidential — Katongole Rashid's account is private. Cannot be viewed by public");
      setShowBlocked(true); setTimeout(()=>setShowBlocked(false), 2500); return
    }
  }
}

const handleShare = async (v) => {
  if(!isOwner){ setBlockedMsg('Share locked — Owner only'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return }
  if(navigator.share){ await navigator.share({title:'UPTOWN', text:`${v.user}: ${v.caption}`, url: location.href}).catch(()=>{}) }
}

if(splash){
return(<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}><svg width="220" height="250" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>)
}

return(
<div style={{background:'#000', color:'#fff', width:'100vw', height:'100dvh', position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:'Inter, sans-serif'}}>

{showAuth && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:100, display:'flex', flexDirection:'column', padding:'24px', justifyContent:'center'}}>
<div style={{textAlign:'center', marginBottom:'28px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg><div style={{fontWeight:'800', fontSize:'22px', marginTop:'14px'}}>UPTOWN</div></div>
<div style={{display:'flex', background:'#121212', borderRadius:'20px', padding:'4px', marginBottom:'16px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1, background: authMode==='signup'?'#fff':'transparent', color: authMode==='signup'?'#000':'#888', border:'none', padding:'10px', borderRadius:'16px', fontWeight:'700', fontSize:'13px'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1, background: authMode==='login'?'#fff':'transparent', color: authMode==='login'?'#000':'#888', border:'none', padding:'10px', borderRadius:'16px', fontWeight:'700', fontSize:'13px'}}>Login</button>
</div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
{authMode==='signup' && <><input value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} placeholder="Your Name" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm, username:e.target.value})} placeholder="Username" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} placeholder="Email" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700'}}>{authMode==='signup' ? 'Sign Up' : 'Login'}</button>
</div>
</div>
)}

<div style={{display:'flex', padding:'12px 16px', gap:'20px', alignItems:'center', borderBottom:'1px solid #1a1a1a'}}>
{['For You','Muzika','Following'].map(t=>{
  const key = t.toLowerCase().replace(' ',''); const active = (page==='foryou' && t==='For You') || page===key
  return <button key={t} onClick={()=>setPage(key==='foryou'?'foryou':key)} style={{background:'none', border:'none', color: active?'#fff':'#717171', fontSize:'14px', fontWeight: active?'700':'500'}}>{t}</button>
})}
</div>

<div style={{flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>

{page==='foryou' && (
<div style={{flex:1, overflowY:'scroll', scrollSnapType:'y mandatory'}}>
{videos.map(v=>(
<div key={v.id} onClick={()=>openProfile(v)} style={{width:'100%', height:'100%', scrollSnapAlign:'start', position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
<div style={{position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 50%)', zIndex:1}}></div>
<div style={{color:'#1a1a1a', fontSize:'70px'}}>▶</div>
<div style={{position:'absolute', left:'16px', bottom:'20px', zIndex:2, maxWidth:'75%'}}>
<div style={{display:'flex', alignItems:'center', gap:'8px'}}><span style={{fontWeight:'700', fontSize:'16px'}}>{v.user}</span><span style={{width:'20px', height:'20px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>{isOwner ? '' : v.isOwner ? <span style={{fontSize:'10px', background:'#111', padding:'2px 6px', borderRadius:'10px'}}>🔒 Private</span> : null}</div>
<div style={{fontSize:'14px', color:'#fff', marginTop:'8px'}}>{v.caption}</div>
</div>
<div style={{position:'absolute', right:'12px', bottom:'90px', zIndex:2, display:'flex', flexDirection:'column', gap:'18px', alignItems:'center'}}>
<button onClick={(e)=>{e.stopPropagation(); handleFollow(v.username)}} style={{background:'none', border:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
<div style={{width:'48px', height:'48px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border: follows[v.username] ? '2px solid #00D632' : '2px solid #fff', position:'relative'}}>
<span style={{fontWeight:'900', fontSize:'11px', color:'#000'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</span>
<div style={{position:'absolute', bottom:'-6px', background: follows[v.username]?'#00D632':'#FF0024', color:'#fff', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #000', fontSize:'12px'}}>{follows[v.username]? '✓' : '+'}</div>
</div>
<span style={{fontSize:'10px', color:'#fff', fontWeight:'600'}}>{follows[v.username] ? 'Following' : 'Follow'}</span>
</button>
<div style={{display:'flex', flexDirection:'column', gap:'16px', marginTop:'10px', alignItems:'center'}}>
<button style={{background:'none', border:'none', color: isOwner ? '#fff' : '#555', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'22px'}}>{isOwner ? '♡' : '🔒'}</span><span style={{fontSize:'10px'}}>{isOwner ? '12.4K' : '🔒'}</span></button>
<button style={{background:'none', border:'none', color: isOwner ? '#fff' : '#555', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'18px'}}>{isOwner ? '🔥' : '🔒'}</span><span style={{fontSize:'10px'}}>{isOwner ? '340' : '🔒'}</span></button>
<button onClick={(e)=>{e.stopPropagation(); handleShare(v)}} style={{background:'none', border:'none', color: isOwner ? '#fff' : '#555', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'18px'}}>{isOwner ? '↗' : '🔒'}</span><span style={{fontSize:'10px'}}>{isOwner ? 'Share' : '🔒'}</span></button>
<button onClick={(e)=>{e.stopPropagation(); handleFavorite(v.id)}} style={{background:'none', border:'none', color: favorites[v.id] ? '#FFD700' : '#fff', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'22px'}}>{favorites[v.id] ? '★' : '☆'}</span><span style={{fontSize:'10px'}}>{favorites[v.id] ? 'Saved' : 'Fav'}</span></button>
</div>
</div>
</div>
))}
</div>
)}

{page==='muzika' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', fontSize:'18px'}}>Muzika {isOwner ? '— Owner Upload' : '— Watch Only'}</div>
<div style={{fontSize:'12px', color:'#888', marginBottom:'16px'}}>{isOwner ? 'Only you can upload' : 'Only Katongole Rashid can post — You watch'}</div>
{isOwner && <button onClick={()=>setShowUpload(true)} style={{background:'#FF0024', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'20px', fontSize:'12px', marginBottom:'16px'}}>+ Upload Muzika</button>}
{muzikaVideos.map(v=>(
<div key={v.id} style={{background:'#121212', border:'1px solid #1e1e1e', borderRadius:'14px', padding:'14px', marginBottom:'10px'}}>
<div style={{fontWeight:'600'}}>{v.user} ✓</div><div style={{fontSize:'13px', color:'#ccc', marginTop:'6px'}}>{v.caption}</div><div style={{marginTop:'10px', background:'#000', height:'140px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}>▶</div>
</div>
))}
</div>
)}

{page==='following' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', fontSize:'18px', marginBottom:'16px'}}>People</div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
{allUsers.map(u=>{
  const isKatongole = u.username==='@katongole' || u.isOwner
  if(isKatongole && !isOwner){
    return (
      <div key={u.id} style={{background:'#0a0a0a', border:'1px solid #222', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
          <div style={{width:'44px', height:'44px', borderRadius:'50%', background:'#111', display:'flex', alignItems:'center', justifyContent:'center'}}>🔒</div>
          <div><div style={{fontWeight:'600', fontSize:'14px'}}>Private Account 🔒</div><div style={{fontSize:'11px', color:'#555'}}>Confidential — Owner only</div></div>
        </div>
        <div style={{fontSize:'11px', color:'#555', background:'#1a1a1a', padding:'6px 12px', borderRadius:'20px'}}>🔒 Private</div>
      </div>
    )
  }
  return (
    <div key={u.id} style={{background:'#121212', border:'1px solid #1e1e1e', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
        <div style={{width:'44px', height:'44px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>{u.name[0]}</div>
        <div><div style={{fontWeight:'600', fontSize:'14px', display:'flex', gap:'4px', alignItems:'center'}}>{u.name} {u.verified && <span style={{width:'14px', height:'14px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'11px', color:'#888'}}>{u.username}</div></div>
      </div>
      <button onClick={()=>handleFollow(u.username)} style={{background: follows[u.username]==='following' ? '#fff' : '#FF0024', color: follows[u.username]==='following' ? '#000' : '#fff', border:'none', padding:'8px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>{follows[u.username]==='following' ? 'Following ✓' : 'Follow +'}</button>
    </div>
  )
})}
</div>
</div>
)}

{page==='inbox' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', marginBottom:'16px', textAlign:'center'}}>Inbox — Notifications</div>
{notifications.filter(n=> n.toEmail===user?.email || n.toEmail===user?.username).map(notif=>(
<div key={notif.id} style={{background: notif.type==='verified' ? '#0a2a12' : '#121212', border: notif.type==='verified' ? '1px solid #00D632' : '1px solid #222', borderRadius:'14px', padding:'14px', marginBottom:'10px'}}>
<div style={{fontSize:'13px', color: notif.type==='verified' ? '#00D632' : '#fff', fontWeight:'600'}}>{notif.text}</div>
</div>
))}
{isOwner ? (
<div>
<div style={{background:'#121212', border:'1px solid #1D9BF0', borderRadius:'14px', padding:'14px', marginBottom:'16px'}}>
<div style={{fontWeight:'700', color:'#1D9BF0'}}>UPTOWN BOARD — Owner Only</div>
<div style={{marginTop:'12px', display:'flex', gap:'8px'}}>
<button onClick={sendInviteToUnverified} style={{background:'#333', color:'#fff', border:'none', padding:'8px 12px', borderRadius:'20px', fontSize:'11px'}}>📢 Invite Unverified</button>
</div>
</div>
{blueBoard.length===0 ? <div style={{textAlign:'center', color:'#666'}}>No requests</div> : blueBoard.map(r=>(
<div key={r.id} style={{background:'#121212', border:'1px solid #222', borderRadius:'14px', padding:'14px', marginBottom:'10px'}}>
<div style={{display:'flex', gap:'10px'}}><div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>{r.name[0]}</div><div><div style={{fontWeight:'600'}}>{r.name} {r.status==='accepted' && <span style={{color:'#00D632'}}>✓</span>}</div><div style={{fontSize:'11px', color:'#888'}}>{r.username}</div></div></div>
<div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
<button onClick={()=>setChatUser(r)} style={{flex:1, background:'#1a1a1a', border:'1px solid #333', color:'#fff', padding:'8px', borderRadius:'10px'}}>💬 Chat</button>
{r.status==='pending' ? <button onClick={()=>acceptBlueTick(r.id)} style={{flex:1, background:'#1D9BF0', color:'#fff', border:'none', padding:'8px', borderRadius:'10px', fontWeight:'700'}}>✓ Accept</button> : <div style={{flex:1, background:'#00D632', color:'#000', padding:'8px', borderRadius:'10px', textAlign:'center', fontWeight:'700'}}>✓ Verified</div>}
</div>
</div>
))}
</div>
) : (
<div style={{background:'#121212', border:'1px solid #1D9BF0', borderRadius:'14px', padding:'20px', textAlign:'center'}}>
<div style={{fontWeight:'700'}}>Blue Tick Verification</div>
<div style={{fontSize:'12px', color:'#888', marginTop:'6px'}}>Only Katongole Rashid approves</div>
<button onClick={requestBlueTick} style={{marginTop:'14px', background:'#1D9BF0', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'20px', fontWeight:'700'}}>✓ Request Blue Tick</button>
</div>
)}
</div>
)}

{page==='you' && (
<div style={{padding:'20px'}}>
<div style={{display:'flex', gap:'16px', alignItems:'center'}}>
<div style={{width:'72px', height:'72px', borderRadius:'50%', background:'#fff', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900'}}>UP</div>
<div><div style={{fontWeight:'700', display:'flex', gap:'6px', alignItems:'center'}}>{user?.name} {allUsers.find(u=>u.username===user?.username)?.verified && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>} {isOwner && <span style={{background:'#00D632', color:'#000', fontSize:'10px', padding:'2px 8px', borderRadius:'10px'}}>OWNER</span>}</div><div style={{fontSize:'12px', color:'#888'}}>{user?.username}</div></div>
</div>
</div>
)}

{showBlocked && (
<div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'#1a1a1a', border:'1px solid #333', padding:'18px 22px', borderRadius:'14px', zIndex:80, textAlign:'center', maxWidth:'85%'}}>
<div style={{fontWeight:'700', fontSize:'14px'}}>{blockedMsg}</div>
</div>
)}

{chatUser && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:70, display:'flex', flexDirection:'column'}}>
<div style={{padding:'14px', borderBottom:'1px solid #1a1a1a', display:'flex', gap:'12px', alignItems:'center'}}><button onClick={()=>setChatUser(null)} style={{background:'none', border:'none', color:'#fff', fontSize:'20px'}}>←</button><div style={{fontWeight:'600'}}>{chatUser.name}</div></div>
<div style={{flex:1, padding:'16px'}}><div style={{background:'#1a1a1a', padding:'10px 14px', borderRadius:'14px', maxWidth:'80%'}}>{chatUser.message}</div></div>
{isOwner && <div style={{padding:'12px'}}><button onClick={()=>acceptBlueTick(chatUser.id)} style={{width:'100%', background:'#1D9BF0', color:'#fff', border:'none', padding:'12px', borderRadius:'20px', fontWeight:'700'}}>✓ Accept & Verify</button></div>}
</div>
)}
</div>

{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:50, display:'flex', alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'30px 20px', textAlign:'center'}} onClick={e=>e.stopPropagation()}>
{isOwner ? <div><div style={{fontWeight:'700', color:'#00D632'}}>✓ Owner Upload</div><button onClick={()=>{const newV={id:Date.now(), user:'Katongole Rashid', username:'@katongole', verified:true, caption:'New Muzika 🔥', isOwner:true}; saveMuzika([newV, ...muzikaVideos]); setShowUpload(false)}} style={{marginTop:'12px', background:'#FF0024', color:'#fff', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:'700'}}>Post to Muzika</button></div> : <div><div style={{fontSize:'30px'}}>🔒</div><div style={{fontWeight:'700', marginTop:'10px'}}>Only Owner Can Upload in Muzika</div></div>}
</div>
</div>
)}

<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'10px'}}>⌂<br/>Home</button>
<button onClick={()=>setPage('muzika')} style={{background:'none', border:'none', color: page==='muzika'?'#fff':'#666', fontSize:'10px'}}>♫<br/>Muzika</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'#fff':'#666', fontSize:'10px', position:'relative'}}>✉<br/>Inbox {isOwner && blueBoard.filter(b=>b.status==='pending').length>0 && <span style={{position:'absolute', top:'-4px', right:'0', background:'#FF0024', width:'14px', height:'14px', borderRadius:'50%', fontSize:'9px', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>{blueBoard.filter(b=>b.status==='pending').length}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'#fff':'#666', fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
