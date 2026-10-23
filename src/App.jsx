"use client"
import { useState, useEffect } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [authMode, setAuthMode] = useState('signup') // login or signup
const [showAuth, setShowAuth] = useState(false)
const [user, setUser] = useState(null)
const [isOwner, setIsOwner] = useState(false)
const [allowPosting, setAllowPosting] = useState(false)
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [follows, setFollows] = useState({})
const [blueBoard, setBlueBoard] = useState([])
const [myVerified, setMyVerified] = useState(false)
const [chatUser, setChatUser] = useState(null)
const [authForm, setAuthForm] = useState({name:'', username:'', email:'', password:''})
const [showBlocked, setShowBlocked] = useState(false)
const [installPrompt, setInstallPrompt] = useState(null)
const [allUsers, setAllUsers] = useState([
  {id:1, name:'Katongole Rashid', username:'@katongole', verified:true, isOwner:true, followers:12400},
  {id:2, name:'Sheilah G', username:'@sheilah', verified:false, followers:892},
  {id:3, name:'DJ Nimrod', username:'@nimrod', verified:false, followers:2100},
])

const videos = [
  {id:1, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Welcome to UPTOWN 🔥 Official launch preparation. Follow each other! #Uptown #Kampala', isOwner:true},
  {id:2, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'See who joined - Go to Following tab and start following! 🚀', isOwner:true},
]

useEffect(()=>{
  // PWA INSTALLABLE - Make it installable like real app
  const link = document.createElement('link')
  link.rel = 'manifest'
  link.href = 'data:application/json;base64,eyJuYW1lIjoiVVBUT1dOIiwic2hvcnRfbmFtZSI6IlVQVE9XTiIsInN0YXJ0X3VybCI6Ii8iLCJkaXNwbGF5Ijoic3RhbmRhbG9uZSIsImJhY2tncm91bmRfY29sb3IiOiIjMDAwMDAwIiwidGhlbWVfY29sb3IiOiIjMDAwMDAwIiwiaWNvbnMiOlt7InNyYyI6Ii9pY29uLnBuZyIsInNpemVzIjoiNTEyeDUxMiIsInR5cGUiOiJpbWFnZS9wbmcifV19'
  document.head.appendChild(link)

  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault()
    setInstallPrompt(e)
  })

  const t=setTimeout(()=>{
    setSplash(false)
    const savedUser = localStorage.getItem('uptown_user')
    const savedUsers = localStorage.getItem('uptown_all_users')
    const savedOwner = localStorage.getItem('uptown_is_owner')
    const savedAllow = localStorage.getItem('uptown_allow_posting')
    const savedFollows = localStorage.getItem('uptown_follows')
    
    if(savedUsers) setAllUsers(JSON.parse(savedUsers))
    if(savedFollows) setFollows(JSON.parse(savedFollows))
    
    if(!savedUser) setShowAuth(true)
    else {
      setUser(JSON.parse(savedUser))
      if(savedOwner==='true') setIsOwner(true)
      if(savedAllow==='true') setAllowPosting(true)
    }
  }, 2200)
  return()=>clearTimeout(t)
},[])

const handleInstall = async () => {
  if(!installPrompt) {
    alert('To install: Tap browser menu (⋮) → Add to Home Screen / Install App')
    return
  }
  installPrompt.prompt()
  const result = await installPrompt.userChoice
  if(result.outcome==='accepted') setInstallPrompt(null)
}

const handleAuth = () => {
  if(!authForm.email || !authForm.password) return
  const email = authForm.email.toLowerCase().trim()
  const ownerCheck = email === 'komenierashid@gmail.com'
  
  let users = JSON.parse(localStorage.getItem('uptown_all_users') || JSON.stringify(allUsers))
  let existingUsersDB = JSON.parse(localStorage.getItem('uptown_users_db') || '[]')

  if(authMode==='signup'){
    if(!authForm.name || !authForm.username) return
    // Check if email exists
    if(existingUsersDB.find(u=>u.email===email)){
      alert('Account exists! Please Login instead - Use Login button')
      setAuthMode('login')
      return
    }
    const newUser = {id:Date.now(), name: authForm.name, username:'@'+authForm.username.replace('@',''), email, password: authForm.password, verified:false, followers:0}
    existingUsersDB.push(newUser)
    localStorage.setItem('uptown_users_db', JSON.stringify(existingUsersDB))
    
    users.push(newUser)
    localStorage.setItem('uptown_all_users', JSON.stringify(users))
    setAllUsers(users)
    
    const loginUser = {name: newUser.name, username: newUser.username, email: newUser.email}
    localStorage.setItem('uptown_user', JSON.stringify(loginUser))
    localStorage.setItem('uptown_is_owner', ownerCheck ? 'true' : 'false')
    setUser(loginUser); setIsOwner(ownerCheck); setShowAuth(false)
  } else {
    // LOGIN - Check if account exists even if change phone
    const found = existingUsersDB.find(u=>u.email===email && u.password===authForm.password)
    if(!found && !ownerCheck){
      alert('No account found. Please Sign Up first')
      return
    }
    const loginUser = ownerCheck ? {name:'Katongole Rashid', username:'@katongole', email} : {name: found.name, username: found.username, email: found.email}
    localStorage.setItem('uptown_user', JSON.stringify(loginUser))
    localStorage.setItem('uptown_is_owner', ownerCheck ? 'true' : 'false')
    setUser(loginUser); setIsOwner(ownerCheck); setShowAuth(false)
  }
}

const handleFollow = (username) => {
  const newFollows = {...follows, [username]: follows[username]==='following' ? 'follow' : follows[username]==='followback' ? 'follow' : 'following'}
  if(follows[username]==='followback' || follows[username]===undefined) {
    // If they follow you back
    newFollows[username] = 'following'
  }
  setFollows(newFollows)
  localStorage.setItem('uptown_follows', JSON.stringify(newFollows))
}

const requestBlueTick = () => {
  if(myVerified) return
  const req = {id:Date.now(), name: user?.name || 'My Page', username: user?.username || '@mypage', message:'Requesting blue tick', status:'pending'}
  setBlueBoard([...blueBoard, req])
}

const acceptBlueTick = (id) => {
  setBlueBoard(blueBoard.map(r=> r.id===id ? {...r, status:'accepted'} : r))
  setMyVerified(true); setChatUser(null)
}

const openProfile = (v) => {
  if(v.isOwner){
    setShowBlocked(true); setTimeout(()=>setShowBlocked(false), 2500); return
  }
}

if(splash){
return(<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}><svg width="220" height="250" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>)
}

return(
<div style={{background:'#000', color:'#fff', width:'100vw', height:'100dvh', position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:'Inter, sans-serif'}}>

{showAuth && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:100, display:'flex', flexDirection:'column', padding:'24px', justifyContent:'center', overflowY:'auto'}}>
<div style={{textAlign:'center', marginBottom:'28px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg><div style={{fontWeight:'800', fontSize:'22px', marginTop:'14px'}}>UPTOWN</div><div style={{color:'#888', fontSize:'12px', marginTop:'4px'}}>{authMode==='signup' ? 'Create account - see who joined' : 'Welcome back - Login to continue'}</div></div>

<div style={{display:'flex', background:'#121212', borderRadius:'20px', padding:'4px', marginBottom:'16px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1, background: authMode==='signup'?'#fff':'transparent', color: authMode==='signup'?'#000':'#888', border:'none', padding:'10px', borderRadius:'16px', fontWeight:'700', fontSize:'13px'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1, background: authMode==='login'?'#fff':'transparent', color: authMode==='login'?'#000':'#888', border:'none', padding:'10px', borderRadius:'16px', fontWeight:'700', fontSize:'13px'}}>Login</button>
</div>

<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
{authMode==='signup' && <>
<input value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} placeholder="Your Name" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.username} onChange={e=>setAuthForm({...authForm, username:e.target.value})} placeholder="Username" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
</>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} placeholder="Email (komenierashid@gmail.com for owner)" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700'}}>{authMode==='signup' ? 'Sign Up & See Who Joined' : 'Login - Continue'}</button>
<div style={{fontSize:'11px', color:'#666', textAlign:'center', marginTop:'4px'}}>{authMode==='signup' ? 'After signup, you can follow everyone. If you change phone, just Login' : 'If you change phone, just Login with email & password - No need to signup again'}</div>
</div>
</div>
)}

<div style={{display:'flex', padding:'12px 16px', gap:'20px', alignItems:'center', borderBottom:'1px solid #1a1a1a'}}>
{['For You','Muzika','Following'].map(t=>{
  const key = t.toLowerCase().replace(' ',''); const active = (page==='foryou' && t==='For You') || page===key
  return <button key={t} onClick={()=>setPage(key==='foryou'?'foryou':key)} style={{background:'none', border:'none', color: active?'#fff':'#717171', fontSize:'14px', fontWeight: active?'700':'500'}}>{t}</button>
})}
<button onClick={()=>setPage('live')} style={{marginLeft:'auto', background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'6px 12px', borderRadius:'20px', fontSize:'12px'}}><span style={{width:'6px', height:'6px', background:'#FF0024', borderRadius:'50%', display:'inline-block', marginRight:'4px'}}></span>Live</button>
</div>

<div style={{flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>

{page==='foryou' && (
<div style={{flex:1, overflowY:'scroll', scrollSnapType:'y mandatory'}}>
{videos.map(v=>(
<div key={v.id} onClick={()=>openProfile(v)} style={{width:'100%', height:'100%', scrollSnapAlign:'start', position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
<div style={{position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 50%)', zIndex:1}}></div>
<div style={{color:'#1a1a1a', fontSize:'70px'}}>▶</div>
<div style={{position:'absolute', left:'16px', bottom:'20px', zIndex:2, maxWidth:'80%'}}>
<div style={{display:'flex', alignItems:'center', gap:'8px'}}><span style={{fontWeight:'700', fontSize:'16px'}}>{v.user}</span><span style={{width:'20px', height:'20px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span><span style={{fontSize:'11px', background:'#FFA500', color:'#000', padding:'3px 8px', borderRadius:'8px', fontWeight:'700'}}>ADVERT</span></div>
<div style={{fontSize:'14px', color:'#fff', marginTop:'8px'}}>{v.caption}</div>
</div>
<div style={{position:'absolute', right:'12px', bottom:'100px', zIndex:2}}><div style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', padding:'8px 12px', borderRadius:'20px', fontSize:'11px', color:'#888'}}>Watch Only</div></div>
</div>
))}
</div>
)}

{page==='following' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', fontSize:'18px', marginBottom:'4px'}}>People who joined UPTOWN</div>
<div style={{fontSize:'12px', color:'#888', marginBottom:'16px'}}>{allUsers.length} members • Follow each other • Only Katongole can post for now</div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
{allUsers.filter(u=> !u.isOwner).map(u=>(
<div key={u.id} style={{background:'#121212', border:'1px solid #1e1e1e', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div style={{display:'flex', gap:'12px', alignItems:'center'}}>
<div style={{width:'44px', height:'44px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700'}}>{u.name[0]}</div>
<div><div style={{fontWeight:'600', fontSize:'14px', display:'flex', gap:'6px', alignItems:'center'}}>{u.name} {u.verified && <span style={{width:'16px', height:'16px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'12px', color:'#888'}}>{u.username} • {u.followers} followers</div></div>
</div>
<button onClick={()=>handleFollow(u.username)} style={{background: follows[u.username]==='following' || follows[u.username]==='followback' ? '#fff' : '#FF0024', color: follows[u.username]==='following' || follows[u.username]==='followback' ? '#000' : '#fff', border:'none', padding:'8px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>
{follows[u.username]==='following' ? 'Following ✓' : follows[u.username]==='followback' ? 'Follow Back' : 'Follow'}
</button>
</div>
))}
</div>
<div style={{marginTop:'20px', background:'#0a0a0a', border:'1px dashed #333', borderRadius:'12px', padding:'12px', textAlign:'center'}}>
<div style={{fontSize:'12px', color:'#888'}}>Only Katongole Rashid can post until launch</div>
<div style={{fontSize:'11px', color:'#666', marginTop:'4px'}}>You can see each other and follow / follow back now</div>
</div>
</div>
)}

{page==='inbox' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', marginBottom:'16px', textAlign:'center'}}>Inbox</div>
{isOwner ? (
<div>
<div style={{background:'#121212', border:'1px solid #1D9BF0', borderRadius:'14px', padding:'14px', marginBottom:'16px'}}>
<div style={{fontWeight:'700', color:'#1D9BF0'}}>UPTOWN BOARD</div>
<div style={{fontSize:'11px', color:'#888', marginTop:'4px'}}>Only you see this • All notifications here</div>
<div style={{marginTop:'12px', display:'flex', gap:'8px', alignItems:'center'}}>
<span style={{fontSize:'12px'}}>Public posting:</span>
<button onClick={()=>{const nv=!allowPosting; setAllowPosting(nv); localStorage.setItem('uptown_allow_posting', nv?'true':'false')}} style={{background: allowPosting ? '#00D632' : '#333', color: allowPosting?'#000':'#fff', border:'none', padding:'6px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700'}}>{allowPosting ? 'ALLOWED ✓' : 'DISABLED - Only you post'}</button>
</div>
</div>
{blueBoard.map(r=>(
<div key={r.id} style={{background:'#121212', border:'1px solid #222', borderRadius:'14px', padding:'14px', marginBottom:'10px'}}>
<div style={{display:'flex', gap:'10px'}}><div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>{r.name[0]}</div><div><div style={{fontWeight:'600'}}>{r.name} <span style={{color:'#888', fontSize:'11px'}}>{r.username}</span></div><div style={{fontSize:'12px', color:'#aaa'}}>{r.message}</div></div></div>
<div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
<button onClick={()=>setChatUser(r)} style={{flex:1, background:'#1a1a1a', border:'1px solid #333', color:'#fff', padding:'8px', borderRadius:'10px', fontSize:'12px'}}>💬 Chat</button>
{r.status==='pending' ? <button onClick={()=>acceptBlueTick(r.id)} style={{flex:1, background:'#1D9BF0', color:'#fff', border:'none', padding:'8px', borderRadius:'10px', fontSize:'12px', fontWeight:'700'}}>✓ Accept</button> : <div style={{flex:1, background:'#00D632', color:'#000', padding:'8px', borderRadius:'10px', textAlign:'center', fontSize:'12px', fontWeight:'700'}}>✓ Accepted</div>}
</div>
</div>
))}
</div>
) : (
<div style={{background:'#121212', border:'1px solid #222', borderRadius:'14px', padding:'20px', textAlign:'center'}}>
<div style={{fontWeight:'700', fontSize:'16px', marginBottom:'8px'}}>Blue Tick</div>
<div style={{fontSize:'13px', color:'#888', marginBottom:'16px'}}>Request goes to Uptown Board</div>
{myVerified ? <div style={{background:'#1D9BF0', color:'#fff', padding:'10px', borderRadius:'10px', fontWeight:'700'}}>🎉 Blue Tick ✓</div> : <button onClick={requestBlueTick} style={{background:'#fff', color:'#000', border:'none', padding:'10px 20px', borderRadius:'20px', fontWeight:'700'}}>Request Blue Tick</button>}
</div>
)}
</div>
)}

{page==='you' && (
<div style={{padding:'20px', overflowY:'auto', height:'100%'}}>
<div style={{display:'flex', gap:'16px', alignItems:'center'}}>
<div style={{width:'72px', height:'72px', borderRadius:'50%', background:'#fff', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900'}}>UP</div>
<div><div style={{fontWeight:'700'}}>{user?.name || 'My Page'} {myVerified && '✓'}</div><div style={{fontSize:'12px', color:'#888'}}>{user?.username} • {Object.keys(follows).filter(k=>follows[k]==='following').length} Following</div></div>
</div>

<div style={{marginTop:'20px', display:'flex', flexDirection:'column', gap:'10px'}}>
<button onClick={handleInstall} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
<span style={{fontSize:'18px'}}>📲</span> Install UPTOWN App
</button>
<div style={{fontSize:'11px', color:'#666', textAlign:'center'}}>Tap to install like TikTok - appears on home screen. If someone gets your link, they can install instantly</div>

<button onClick={()=>{localStorage.removeItem('uptown_user'); localStorage.removeItem('uptown_is_owner'); setShowAuth(true); setAuthMode('login')}} style={{background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'12px', borderRadius:'12px', fontSize:'13px'}}>Switch Account / Login on other phone</button>
<div style={{fontSize:'11px', color:'#666', textAlign:'center'}}>If you change phone, just Login - No need to signup again</div>
</div>

{isOwner && <div style={{marginTop:'16px', background:'#0a1f2f', border:'1px solid #1D9BF0', borderRadius:'12px', padding:'12px'}}><div style={{fontWeight:'700', fontSize:'13px', color:'#1D9BF0'}}>OWNER - Only you post</div><div style={{fontSize:'11px', color:'#aaa', marginTop:'4px'}}>Public sees each other and follows, but cannot post until you allow</div></div>}
</div>
)}

{showBlocked && (
<div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'#1a1a1a', border:'1px solid #333', padding:'18px 22px', borderRadius:'14px', zIndex:80, textAlign:'center'}}>
<div style={{fontWeight:'700'}}>🔒 Confidential</div><div style={{fontSize:'12px', color:'#888', marginTop:'6px'}}>Katongole Rashid's page is private<br/>Cannot be opened</div>
</div>
)}

{chatUser && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:70, display:'flex', flexDirection:'column'}}>
<div style={{padding:'14px', borderBottom:'1px solid #1a1a1a', display:'flex', gap:'12px', alignItems:'center'}}><button onClick={()=>setChatUser(null)} style={{background:'none', border:'none', color:'#fff', fontSize:'20px'}}>←</button><div style={{fontWeight:'600'}}>{chatUser.name}</div></div>
<div style={{flex:1, padding:'16px'}}><div style={{background:'#1a1a1a', padding:'10px 14px', borderRadius:'14px', maxWidth:'80%', fontSize:'13px'}}>{chatUser.message}</div></div>
<div style={{padding:'12px', borderTop:'1px solid #1a1a1a', display:'flex', gap:'8px'}}><input placeholder="Message..." style={{flex:1, background:'#1a1a1a', border:'1px solid #333', borderRadius:'20px', padding:'10px 14px', color:'#fff'}}/><button onClick={()=>acceptBlueTick(chatUser.id)} style={{background:'#1D9BF0', color:'#fff', border:'none', padding:'10px 18px', borderRadius:'20px', fontWeight:'700'}}>Accept ✓</button></div>
</div>
)}
</div>

{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:50, display:'flex', alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'30px 20px', textAlign:'center'}} onClick={e=>e.stopPropagation()}>
{!isOwner && !allowPosting ? (
<div><div style={{fontSize:'18px', fontWeight:'700'}}>🚧 Only Katongole can post</div><div style={{fontSize:'13px', color:'#888', marginTop:'8px'}}>Preparation mode - You can see who joined and follow each other in Following tab</div></div>
) : (<div>Upload enabled</div>)}
</div>
</div>
)}

<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'10px', fontWeight:'600'}}>⌂<br/>Home</button>
<button onClick={()=>setPage('following')} style={{background:'none', border:'none', color: page==='following'?'#fff':'#666', fontSize:'10px', fontWeight:'600'}}>👥<br/>People</button>
<button onClick={()=>setShowUpload(true)} style={{background: isOwner || allowPosting ? '#FF0024' : '#333', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'#fff':'#666', fontSize:'10px', position:'relative'}}>✉<br/>Inbox {isOwner && blueBoard.length>0 && <span style={{position:'absolute', top:'-4px', right:'0', background:'#FF0024', width:'14px', height:'14px', borderRadius:'50%', fontSize:'9px', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>{blueBoard.length}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'#fff':'#666', fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
