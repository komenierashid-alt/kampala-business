"use client"
import { useState, useEffect } from "react"
import { supabase } from "./lib/supabaseClient.js"

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
const [myVerified, setMyVerified] = useState(false)
const [chatUser, setChatUser] = useState(null)
const [authForm, setAuthForm] = useState({name:'', username:'', email:'', password:''})
const [showBlocked, setShowBlocked] = useState(false)
const [installPrompt, setInstallPrompt] = useState(null)
const [posts, setPosts] = useState([])
const [uploadCaption, setUploadCaption] = useState('')
const [uploadPreview, setUploadPreview] = useState(null)

const [allUsers, setAllUsers] = useState([
  {id:1, name:'Katongole Rashid', username:'@katongole', verified:true, isOwner:true, followers:12400},
  {id:2, name:'Sheilah G', username:'@sheilah', verified:false, followers:892},
  {id:3, name:'DJ Nimrod', username:'@nimrod', verified:false, followers:2100},
])

// FIXED: Keep your old default videos as fallback, but add REAL supabase videos
const defaultVideos = [
  {id:1, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Welcome to UPTOWN 🔥 Official launch preparation. Follow each other! #Uptown #Kampala', isOwner:true},
  {id:2, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'See who joined - Following tab - start following! 🚀', isOwner:true},
]
const [supabaseVideos, setSupabaseVideos] = useState([])

useEffect(()=>{
  window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); setInstallPrompt(e) })
  const t=setTimeout(()=>{
    setSplash(false)
    const savedUser = localStorage.getItem('uptown_user')
    const savedUsers = localStorage.getItem('uptown_all_users')
    const savedOwner = localStorage.getItem('uptown_is_owner')
    const savedAllow = localStorage.getItem('uptown_allow_posting')
    const savedFollows = localStorage.getItem('uptown_follows')
    const savedPosts = localStorage.getItem('uptown_posts')
    const savedBlueBoard = localStorage.getItem('uptown_blueboard')
    if(savedUsers) setAllUsers(JSON.parse(savedUsers))
    if(savedFollows) setFollows(JSON.parse(savedFollows))
    if(savedPosts) setPosts(JSON.parse(savedPosts))
    if(savedBlueBoard) setBlueBoard(JSON.parse(savedBlueBoard))
    if(!savedUser) setShowAuth(true)
    else {
      setUser(JSON.parse(savedUser))
      if(savedOwner==='true') setIsOwner(true)
      if(savedAllow==='true') setAllowPosting(true)
    }
  }, 2200)
  return()=>clearTimeout(t)
},[])

// FIXED: Load real videos from Supabase - your design unchanged
useEffect(()=>{
  async function loadRealVideos(){
    const { data } = await supabase.from('videos').select('*').order('created_at',{ascending:false})
    if(data && data.length>0){
      // Convert supabase format to your app format
      const real = data.map(v=>({
        id: v.id,
        user: 'Katongole Rashid',
        username: '@katongole',
        verified: true,
        isOwner: true,
        caption: v.caption || v.video_url,
        mediaUrl: v.video_url?.startsWith('http') ? v.video_url : null,
        mediaType: 'video',
        isNewPost: true,
        created_at: v.created_at
      }))
      setSupabaseVideos(real)
    }
  }
  loadRealVideos()
},[])

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
  const newFollows = {...follows, [username]: follows[username]==='following' ? 'follow' : 'following'}
  setFollows(newFollows); localStorage.setItem('uptown_follows', JSON.stringify(newFollows))
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if(!file) return
  const url = URL.createObjectURL(file)
  setUploadPreview({url, type: file.type, file})
}

const handlePostNow = () => {
  if(!uploadPreview) return
  const newPost = {
    id: Date.now(),
    user: 'Katongole Rashid',
    username: '@katongole',
    verified: true,
    isOwner: true,
    caption: uploadCaption || 'UPTOWN 🔥 New post #Kampala',
    mediaUrl: uploadPreview.url,
    mediaType: uploadPreview.type.startsWith('video') ? 'video' : 'image',
    isNewPost: true
  }
  const updated = [newPost, ...posts]
  setPosts(updated)
  localStorage.setItem('uptown_posts', JSON.stringify(updated))
  setUploadPreview(null)
  setUploadCaption('')
  setShowUpload(false)
  setPage('foryou')
}

const requestBlueTick = () => {
  if(myVerified) return
  const req = {id:Date.now(), name: user?.name || 'My Page', username: user?.username || '@mypage', message:'Requesting blue tick', status:'pending'}
  const updated = [...blueBoard, req]
  setBlueBoard(updated)
  localStorage.setItem('uptown_blueboard', JSON.stringify(updated))
}

const acceptBlueTick = (id) => {
  const updated = blueBoard.map(r=> r.id===id ? {...r, status:'accepted'} : r)
  setBlueBoard(updated)
  localStorage.setItem('uptown_blueboard', JSON.stringify(updated))
  setMyVerified(true); setChatUser(null)
  const updatedUsers = allUsers.map(u=> u.username === blueBoard.find(r=>r.id===id)?.username ? {...u, verified:true} : u)
  setAllUsers(updatedUsers)
  localStorage.setItem('uptown_all_users', JSON.stringify(updatedUsers))
}

const openProfile = (v) => {
  if(v.isOwner && !isOwner){
    setShowBlocked(true); setTimeout(()=>setShowBlocked(false), 2500); return
  }
}

const handleShare = async (v) => {
  if(isOwner){
    if(navigator.share){ await navigator.share({title:'UPTOWN', text:`${v.user}: ${v.caption}`, url: location.href}).catch(()=>{}) }
  }
}

const handleDownload = () => {
  if(!isOwner) return
  const canvas = document.createElement('canvas'); canvas.width=720; canvas.height=1280
  const ctx = canvas.getContext('2d'); ctx.fillStyle='#000'; ctx.fillRect(0,0,720,1280)
  ctx.fillStyle='#222'; ctx.font='bold 40px Inter'; ctx.fillText('UPTOWN VIDEO', 220, 600)
  ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(480, 1160, 210, 55); ctx.fillStyle='#fff'; ctx.font='900 20px Inter'; ctx.fillText('UPTOWN', 490, 1192)
  const a=document.createElement('a'); a.download=`uptown-${Date.now()}.jpg`; a.href=canvas.toDataURL(); a.click()
}

if(splash){
return(<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}><svg width="220" height="250" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>)
}

const feed = [...posts, ...supabaseVideos, ...defaultVideos]

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
<button onClick={handleAuth} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700'}}>{authMode==='signup' ? 'Sign Up & See App' : 'Login'}</button>
<div style={{fontSize:'11px', color:'#666', textAlign:'center'}}>If change phone, just Login - No signup again</div>
</div>
</div>
)}

<div style={{display:'flex', padding:'12px 16px', gap:'20px', alignItems:'center', borderBottom:'1px solid #1a1a1a'}}>
{['For You','Muzika','Following'].map(t=>{
  const key = t.toLowerCase().replace(' ',''); const active = (page==='foryou' && t==='For You') || page===key
  return <button key={t} onClick={()=>setPage(key==='foryou'?'foryou':key)} style={{background:'none', border:'none', color: active?'#fff':'#717171', fontSize:'14px', fontWeight: active?'700':'500', position:'relative'}}>{t} {!isOwner && (t==='Muzika' || t==='Following') && <span style={{marginLeft:'4px'}}>🔒</span>}</button>
})}
<button onClick={()=>{if(!isOwner){return} setPage('live')}} style={{marginLeft:'auto', background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'6px 12px', borderRadius:'20px', fontSize:'12px'}}>{!isOwner ? '🔒 Live' : '● Live'}</button>
</div>

<div style={{flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>

{page==='foryou' && (
<div style={{flex:1, overflowY:'scroll', scrollSnapType:'y mandatory'}}>
{feed.map(v=>(
<div key={v.id} onClick={()=>openProfile(v)} style={{width:'100%', height:'100%', scrollSnapAlign:'start', position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
{v.mediaUrl ? (
  v.mediaType==='video' ? <video src={v.mediaUrl} autoPlay loop muted style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <img src={v.mediaUrl} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
) : null}
<div style={{position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 50%)', zIndex:1}}></div>
{!v.mediaUrl && <div style={{color:'#1a1a1a', fontSize:'70px'}}>▶</div>}
<div style={{position:'absolute', left:'16px', bottom:'20px', zIndex:2, maxWidth:'75%'}}>
<div style={{display:'flex', alignItems:'center', gap:'8px'}}><span style={{fontWeight:'700', fontSize:'16px'}}>{v.user}</span><span style={{width:'20px', height:'20px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>{!isOwner && <span style={{fontSize:'10px'}}>🔒</span>}</div>
<div style={{fontSize:'14px', color:'#fff', marginTop:'8px'}}>{v.caption}</div>
{isOwner && <div style={{fontSize:'11px', color:'#00D632', marginTop:'6px'}}>✓ You are Owner - Full access - Upload enabled</div>}
</div>

<div style={{position:'absolute', right:'12px', bottom:'90px', zIndex:2, display:'flex', flexDirection:'column', gap:'18px', alignItems:'center'}}>
<button onClick={(e)=>{e.stopPropagation(); handleFollow(v.username)}} style={{background:'none', border:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
<div style={{width:'48px', height:'48px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border: follows[v.username] ? '2px solid #00D632' : '2px solid #fff', position:'relative'}}>
<span style={{fontWeight:'900', fontSize:'11px', color:'#000'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</span>
<div style={{position:'absolute', bottom:'-6px', background: follows[v.username]?'#00D632':'#FF0024', color:'#fff', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #000', fontSize:'12px'}}>{follows[v.username]? '✓' : '+'}</div>
</div>
<span style={{fontSize:'10px', color:'#fff', fontWeight:'600'}}>{follows[v.username] ? 'Following' : 'Follow'}</span>
</button>

<div style={{display:'flex', flexDirection:'column', gap:'16px', marginTop:'10px'}}>
<button onClick={(e)=>{e.stopPropagation(); if(!isOwner) return; }} style={{background:'none', border:'none', color: isOwner ? '#fff' : '#555', display:'flex', flexDirection:'column', alignItems:'center', position:'relative'}}><span style={{fontSize:'22px'}}>{isOwner ? '♡' : '🔒'}</span><span style={{fontSize:'10px'}}>{isOwner ? '12.4K' : '🔒'}</span></button>
<button style={{background:'none', border:'none', color: isOwner ? '#fff' : '#555', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'18px'}}>{isOwner ? '🔥' : '🔒'}</span><span style={{fontSize:'10px'}}>{isOwner ? '340' : '🔒'}</span></button>
<button onClick={(e)=>{e.stopPropagation(); handleShare(v)}} style={{background:'none', border:'none', color: isOwner ? '#fff' : '#555', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'18px'}}>{isOwner ? '↗' : '🔒'}</span><span style={{fontSize:'10px'}}>{isOwner ? 'Share' : '🔒'}</span></button>
<button onClick={(e)=>{e.stopPropagation(); handleDownload()}} style={{background:'none', border:'none', color: isOwner ? '#fff' : '#555', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'18px'}}>{isOwner ? '⬇' : '🔒'}</span><span style={{fontSize:'10px'}}>{isOwner ? 'Download' : '🔒'}</span></button>
</div>
</div>
</div>
))}
</div>
)}

{page==='following' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', fontSize:'18px', marginBottom:'4px'}}>People who joined UPTOWN {isOwner ? '' : '🔒 Preview'}</div>
<div style={{fontSize:'12px', color:'#888', marginBottom:'16px'}}>{allUsers.length} members • {isOwner ? 'Full access' : 'Follow allowed - Other features locked until launch'}</div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
{allUsers.filter(u=> isOwner || !u.isOwner).map(u=>(
<div key={u.id} style={{background:'#121212', border:'1px solid #1e1e1e', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center', opacity: !isOwner && u.isOwner ? 0.6 : 1}}>
<div style={{display:'flex', gap:'12px', alignItems:'center'}}>
<div style={{width:'44px', height:'44px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700'}}>{u.name[0]}</div>
<div><div style={{fontWeight:'600', fontSize:'14px', display:'flex', gap:'4px', alignItems:'center'}}>{u.name} {u.verified && <span style={{width:'14px', height:'14px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>} {!isOwner && <span>🔒</span>}</div><div style={{fontSize:'11px', color:'#888'}}>{u.username} • {u.followers} followers • {isOwner ? 'Full' : '🔒 Locked'}</div></div>
</div>
<button onClick={()=>handleFollow(u.username)} style={{background: follows[u.username]==='following' ? '#fff' : '#FF0024', color: follows[u.username]==='following' ? '#000' : '#fff', border:'none', padding:'8px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>
{follows[u.username]==='following' ? 'Following ✓' : 'Follow +'}
</button>
</div>
))}
</div>
</div>
)}

{page==='inbox' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', marginBottom:'16px', textAlign:'center'}}>Inbox {isOwner ? '' : '🔒'}</div>
{isOwner ? (
<div>
<div style={{background:'#121212', border:'1px solid #1D9BF0', borderRadius:'14px', padding:'14px', marginBottom:'16px'}}>
<div style={{fontWeight:'700', color:'#1D9BF0'}}>UPTOWN BOARD - Owner Only</div>
<div style={{fontSize:'11px', color:'#888', marginTop:'4px'}}>You see everything • All notifications here</div>
<div style={{marginTop:'12px'}}><button onClick={()=>{const nv=!allowPosting; setAllowPosting(nv); localStorage.setItem('uptown_allow_posting', nv?'true':'false')}} style={{background: allowPosting ? '#00D632' : '#333', color: allowPosting?'#000':'#fff', border:'none', padding:'6px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700'}}>{allowPosting ? 'Public Posting ALLOWED ✓' : 'Public Posting DISABLED'}</button></div>
</div>
{blueBoard.length===0 ? <div style={{textAlign:'center', color:'#666', marginTop:'30px'}}>Uptown Board empty</div> : blueBoard.map(r=>(
<div key={r.id} style={{background:'#121212', border:'1px solid #222', borderRadius:'14px', padding:'14px', marginBottom:'10px'}}>
<div style={{display:'flex', gap:'10px'}}><div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>{r.name[0]}</div><div><div style={{fontWeight:'600'}}>{r.name}</div><div style={{fontSize:'12px', color:'#aaa'}}>{r.message}</div></div></div>
<div style={{display:'flex', gap:'8px', marginTop:'12px'}}><button onClick={()=>setChatUser(r)} style={{flex:1, background:'#1a1a1a', border:'1px solid #333', color:'#fff', padding:'8px', borderRadius:'10px', fontSize:'12px'}}>💬 Chat</button>{r.status==='pending' ? <button onClick={()=>acceptBlueTick(r.id)} style={{flex:1, background:'#1D9BF0', color:'#fff', border:'none', padding:'8px', borderRadius:'10px', fontSize:'12px', fontWeight:'700'}}>✓ Accept</button> : <div style={{flex:1, background:'#00D632', color:'#000', padding:'8px', borderRadius:'10px', textAlign:'center', fontSize:'12px', fontWeight:'700'}}>✓ Accepted</div>}</div>
</div>
))}
</div>
) : (
<div style={{background:'#121212', border:'1px solid #222', borderRadius:'14px', padding:'30px 20px', textAlign:'center'}}>
<div style={{fontSize:'30px', marginBottom:'10px'}}>🔒</div>
<div style={{fontWeight:'700', fontSize:'16px'}}>Inbox Locked</div>
<div style={{fontSize:'13px', color:'#888', marginTop:'8px'}}>Appearance preview only<br/>Follow people and watch adverts<br/>Full access coming at launch</div>
<div style={{marginTop:'20px', background:'#1a1a1a', padding:'12px', borderRadius:'10px'}}>
<div style={{fontWeight:'600', fontSize:'14px'}}>Blue Tick</div>
<div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>Request goes to Uptown Board 🔒</div>
<button onClick={requestBlueTick} style={{marginTop:'10px', background:'#333', color:'#888', border:'none', padding:'8px 16px', borderRadius:'20px', fontSize:'12px'}}>🔒 Request Locked</button>
</div>
</div>
)}
</div>
)}

{page==='you' && (
<div style={{padding:'20px', overflowY:'auto', height:'100%'}}>
<div style={{display:'flex', gap:'16px', alignItems:'center'}}>
<div style={{width:'72px', height:'72px', borderRadius:'50%', background:'#fff', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900'}}>UP</div>
<div><div style={{fontWeight:'700', display:'flex', gap:'6px'}}>{user?.name || 'My Page'} {isOwner && <span style={{background:'#00D632', color:'#000', fontSize:'10px', padding:'2px 8px', borderRadius:'10px'}}>OWNER - FULL ACCESS</span>}</div><div style={{fontSize:'12px', color:'#888'}}>{user?.username}</div></div>
</div>
<div style={{marginTop:'20px', display:'flex', flexDirection:'column', gap:'10px'}}>
<button onClick={handleInstall} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}><span>📲</span> Install UPTOWN App {isOwner ? '' : '🔒 Preview'}</button>
<button onClick={()=>{localStorage.removeItem('uptown_user'); localStorage.removeItem('uptown_is_owner'); setShowAuth(true); setAuthMode('login')}} style={{background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'12px', borderRadius:'12px', fontSize:'13px'}}>Switch / Login on other phone</button>
</div>
{isOwner && <div style={{marginTop:'16px', background:'#0a1f2f', border:'1px solid #1D9BF0', borderRadius:'12px', padding:'12px'}}><div style={{fontWeight:'700', fontSize:'13px', color:'#1D9BF0'}}>OWNER CONTROLS - Everything works for you</div><div style={{fontSize:'11px', color:'#aaa', marginTop:'4px'}}>You can post, share, download, see board, manage all • Public sees appearance with 🔒 locks except Follow + button</div></div>}
</div>
)}

{showBlocked && (
<div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'#1a1a1a', border:'1px solid #333', padding:'18px 22px', borderRadius:'14px', zIndex:80, textAlign:'center'}}>
<div style={{fontWeight:'700'}}>🔒 Confidential</div><div style={{fontSize:'12px', color:'#888', marginTop:'6px'}}>Katongole Rashid's page is private<br/>Cannot be opened by public</div>
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
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'24px 20px', textAlign:'center'}} onClick={e=>e.stopPropagation()}>
{isOwner ? (
<div>
<div style={{fontSize:'18px', fontWeight:'700', color:'#00D632'}}>✓ Upload Enabled - Owner</div>
<div style={{marginTop:'16px'}}>
<input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{background:'#1a1a1a', border:'1px solid #333', borderRadius:'10px', padding:'10px', color:'#fff', width:'100%'}} />
{uploadPreview && (
  <div style={{marginTop:'12px'}}>
    {uploadPreview.type.startsWith('video') ? <video src={uploadPreview.url} style={{width:'100%', borderRadius:'12px', maxHeight:'200px'}} controls/> : <img src={uploadPreview.url} style={{width:'100%', borderRadius:'12px', maxHeight:'200px', objectFit:'cover'}}/>}
  </div>
)}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Write caption... #Uptown #Kampala" style={{marginTop:'12px', background:'#1a1a1a', border:'1px solid #333', borderRadius:'10px', padding:'12px', color:'#fff', width:'100%'}}/>
<button onClick={handlePostNow} style={{marginTop:'12px', background:'#fff', color:'#000', border:'none', width:'100%', padding:'14px', borderRadius:'12px', fontWeight:'800'}}>POST NOW 🚀</button>
</div>
<div style={{marginTop:'16px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', opacity:0.5}}>{['Camera','Upload','Muzika'].map(t=><div key={t} style={{background:'#1a1a1a', border:'1px solid #222', borderRadius:'12px', padding:'14px', fontSize:'12px'}}>{t}</div>)}</div>
</div>
) : (
<div><div style={{fontSize:'30px'}}>🔒</div><div style={{fontSize:'18px', fontWeight:'700', marginTop:'10px'}}>Posting Locked</div><div style={{fontSize:'13px', color:'#888', marginTop:'8px'}}>Preparation mode<br/>You can see appearance and follow each other<br/>Videos by Katongole Rashid only<br/>Follow + button is open</div></div>
)}
</div>
</div>
)}

<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'10px', fontWeight:'600'}}>⌂<br/>Home {isOwner ? '' : ''}</button>
<button onClick={()=>{if(!isOwner){ setShowBlocked(true); setTimeout(()=>setShowBlocked(false), 2000); return} setPage('live')}} style={{background:'none', border:'none', color:'#666', fontSize:'10px'}}>◎<br/>{isOwner ? 'Live' : '🔒 Live'}</button>
<button onClick={()=>setShowUpload(true)} style={{background: isOwner ? '#FF0024' : '#FF0024', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'#fff':'#666', fontSize:'10px', position:'relative'}}>✉<br/>{isOwner ? 'Board' : '🔒 Inbox'} {isOwner && blueBoard.length>0 && <span style={{position:'absolute', top:'-4px', right:'0', background:'#FF0024', width:'14px', height:'14px', borderRadius:'50%', fontSize:'9px', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>{blueBoard.length}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'#fff':'#666', fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
