"use client"
import { useState, useEffect } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
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

const videos = [
  {id:1, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Welcome to UPTOWN 🔥 Official launch preparation. Follow us for updates! #Uptown #Kampala', likes:'12.4K', fires:'890', isOwner:true},
  {id:2, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Big things coming... Businesses, Muzika, Live. Stay tuned! 🚀', likes:'8.2K', fires:'450', isOwner:true},
]

useEffect(()=>{
  const t=setTimeout(()=>{
    setSplash(false)
    const savedUser = localStorage.getItem('uptown_user')
    const savedOwner = localStorage.getItem('uptown_is_owner')
    const savedAllow = localStorage.getItem('uptown_allow_posting')
    if(!savedUser) setShowAuth(true)
    else {
      setUser(JSON.parse(savedUser))
      if(savedOwner==='true') setIsOwner(true)
      if(savedAllow==='true') setAllowPosting(true)
    }
  }, 2200)
  return()=>clearTimeout(t)
},[])

const handleCreateAccount = () => {
  if(!authForm.name || !authForm.username || !authForm.email || !authForm.password) return
  const email = authForm.email.toLowerCase().trim()
  const ownerCheck = email === 'komenierashid@gmail.com'
  const newUser = {name: authForm.name, username:'@'+authForm.username.replace('@',''), email}
  localStorage.setItem('uptown_user', JSON.stringify(newUser))
  localStorage.setItem('uptown_is_owner', ownerCheck ? 'true' : 'false')
  setUser(newUser); setIsOwner(ownerCheck); setShowAuth(false)
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
<div style={{position:'fixed', inset:0, background:'#000', zIndex:100, display:'flex', flexDirection:'column', padding:'24px', justifyContent:'center'}}>
<div style={{textAlign:'center', marginBottom:'28px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg><div style={{fontWeight:'800', fontSize:'22px', marginTop:'14px'}}>Welcome to UPTOWN</div></div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
<input value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} placeholder="Your Name" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.username} onChange={e=>setAuthForm({...authForm, username:e.target.value})} placeholder="Username" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} placeholder="Email" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<button onClick={handleCreateAccount} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700'}}>Sign Up & Watch</button>
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

{(page==='foryou' || page==='muzika' || page==='following') && (
<div style={{flex:1, overflowY:'scroll', scrollSnapType:'y mandatory'}}>
<div style={{background:'#0a0a0a', borderBottom:'1px solid #1a1a1a', padding:'8px 16px', textAlign:'center'}}>
<span style={{fontSize:'11px', color:'#666'}}>Preparation Mode: Watch only - No like/share/download</span>
</div>

{videos.map(v=>(
<div key={v.id} onClick={()=>openProfile(v)} style={{width:'100%', height:'100%', scrollSnapAlign:'start', position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
<div style={{position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 50%)', zIndex:1}}></div>
<div style={{color:'#1a1a1a', fontSize:'70px'}}>▶</div>

{/* LEFT - ONLY WATCH */}
<div style={{position:'absolute', left:'16px', bottom:'20px', zIndex:2, maxWidth:'80%'}}>
<div style={{display:'flex', alignItems:'center', gap:'8px'}}>
<span style={{fontWeight:'700', fontSize:'16px'}}>{v.user}</span>
<span style={{width:'20px', height:'20px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>
<span style={{fontSize:'11px', background:'#FFA500', color:'#000', padding:'3px 8px', borderRadius:'8px', fontWeight:'700'}}>ADVERT</span>
</div>
<div style={{fontSize:'14px', color:'#fff', marginTop:'8px', lineHeight:'1.4'}}>{v.caption}</div>
<div style={{fontSize:'11px', color:'#666', marginTop:'8px'}}>👁 Watch only - No interaction allowed in preparation</div>
</div>

{/* RIGHT SIDE - NO BUTTONS FOR PUBLIC - ONLY OWNER SEES */}
{isOwner ? (
<div style={{position:'absolute', right:'12px', bottom:'90px', zIndex:2, display:'flex', flexDirection:'column', gap:'18px', alignItems:'center'}}>
<div style={{width:'48px', height:'48px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'11px', color:'#000'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</div>
<div style={{color:'#888', fontSize:'10px', textAlign:'center'}}>Owner<br/>View</div>
</div>
) : (
<div style={{position:'absolute', right:'12px', bottom:'100px', zIndex:2}}>
<div style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', padding:'8px 12px', borderRadius:'20px', fontSize:'11px', color:'#888'}}>Watch Only</div>
</div>
)}
</div>
))}
</div>
)}

{page==='inbox' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', marginBottom:'16px', textAlign:'center'}}>Inbox</div>
{isOwner ? (
<div>
<div style={{background:'#121212', border:'1px solid #1D9BF0', borderRadius:'14px', padding:'14px', marginBottom:'16px'}}>
<div style={{fontWeight:'700', color:'#1D9BF0', fontSize:'16px'}}>UPTOWN BOARD</div>
<div style={{fontSize:'11px', color:'#888', marginTop:'4px'}}>All notifications come here - Only you see this board</div>
<div style={{marginTop:'12px', display:'flex', gap:'8px', alignItems:'center'}}>
<span style={{fontSize:'12px'}}>Public posting:</span>
<button onClick={()=>{const nv=!allowPosting; setAllowPosting(nv); localStorage.setItem('uptown_allow_posting', nv?'true':'false')}} style={{background: allowPosting ? '#00D632' : '#333', color: allowPosting?'#000':'#fff', border:'none', padding:'6px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700'}}>{allowPosting ? 'ALLOWED ✓' : 'DISABLED'}</button>
</div>
</div>
{blueBoard.length===0 ? <div style={{textAlign:'center', color:'#666', marginTop:'30px'}}>Uptown Board empty<br/><span style={{fontSize:'11px'}}>Blue tick requests will appear here</span></div> :
blueBoard.map(r=>(
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
<div style={{fontSize:'13px', color:'#888', marginBottom:'16px'}}>Request verification - goes to Uptown Board</div>
{myVerified ? <div style={{background:'#1D9BF0', color:'#fff', padding:'10px', borderRadius:'10px', fontWeight:'700'}}>🎉 Congratulations you got your Blue Tick ✓</div> : <button onClick={requestBlueTick} style={{background:'#fff', color:'#000', border:'none', padding:'10px 20px', borderRadius:'20px', fontWeight:'700'}}>Request Blue Tick</button>}
<div style={{marginTop:'20px', fontSize:'11px', color:'#555'}}>Watch only mode - Preparation</div>
</div>
)}
</div>
)}

{chatUser && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:70, display:'flex', flexDirection:'column'}}>
<div style={{padding:'14px', borderBottom:'1px solid #1a1a1a', display:'flex', gap:'12px', alignItems:'center'}}><button onClick={()=>setChatUser(null)} style={{background:'none', border:'none', color:'#fff', fontSize:'20px'}}>←</button><div style={{fontWeight:'600'}}>{chatUser.name}</div></div>
<div style={{flex:1, padding:'16px'}}><div style={{background:'#1a1a1a', padding:'10px 14px', borderRadius:'14px', maxWidth:'80%', fontSize:'13px'}}>{chatUser.message}</div></div>
<div style={{padding:'12px', borderTop:'1px solid #1a1a1a', display:'flex', gap:'8px'}}><input placeholder="Message..." style={{flex:1, background:'#1a1a1a', border:'1px solid #333', borderRadius:'20px', padding:'10px 14px', color:'#fff'}}/><button onClick={()=>acceptBlueTick(chatUser.id)} style={{background:'#1D9BF0', color:'#fff', border:'none', padding:'10px 18px', borderRadius:'20px', fontWeight:'700'}}>Accept ✓</button></div>
</div>
)}

{showBlocked && (
<div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'#1a1a1a', border:'1px solid #333', padding:'18px 22px', borderRadius:'14px', zIndex:80, textAlign:'center'}}>
<div style={{fontWeight:'700', fontSize:'16px'}}>🔒 Confidential</div><div style={{fontSize:'12px', color:'#888', marginTop:'6px'}}>Katongole Rashid's page is private<br/>Cannot be opened</div>
</div>
)}

{page==='you' && (
<div style={{padding:'20px'}}>
<div style={{display:'flex', gap:'16px', alignItems:'center'}}>
<div style={{width:'72px', height:'72px', borderRadius:'50%', background:'#fff', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900'}}>UP</div>
<div><div style={{fontWeight:'700', display:'flex', gap:'6px', alignItems:'center'}}>{user?.name || 'My Page'} {myVerified && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'12px', color:'#888'}}>{user?.username}</div></div>
</div>
{isOwner && <div style={{marginTop:'16px', background:'#0a1f2f', border:'1px solid #1D9BF0', borderRadius:'12px', padding:'12px'}}><div style={{fontWeight:'700', fontSize:'13px', color:'#1D9BF0'}}>OWNER - Uptown Board Only You</div><div style={{fontSize:'11px', color:'#aaa', marginTop:'4px'}}>All notifications go to Uptown Board • Public cannot like/share/download • Watch only</div></div>}
</div>
)}
</div>

{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:50, display:'flex', alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'30px 20px', textAlign:'center'}} onClick={e=>e.stopPropagation()}>
{!isOwner && !allowPosting ? (
<div><div style={{fontSize:'18px', fontWeight:'700'}}>🚧 Posting Disabled</div><div style={{fontSize:'13px', color:'#888', marginTop:'8px'}}>Preparation mode: You can watch only.<br/>No like, share, download, or posting.<br/>Owner posts adverts only.</div></div>
) : (
<div style={{fontSize:'14px'}}>Upload enabled for owner</div>
)}
</div>
</div>
)}

<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'10px', fontWeight:'600'}}>⌂<br/>Home</button>
<button onClick={()=>setPage('live')} style={{background:'none', border:'none', color:'#666', fontSize:'10px'}}>◎<br/>Live</button>
<button onClick={()=>setShowUpload(true)} style={{background: isOwner || allowPosting ? '#FF0024' : '#333', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'#fff':'#666', fontSize:'10px', position:'relative'}}>✉<br/>Inbox {isOwner && blueBoard.length>0 && <span style={{position:'absolute', top:'-4px', right:'0', background:'#FF0024', width:'14px', height:'14px', borderRadius:'50%', fontSize:'9px', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>{blueBoard.length}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'#fff':'#666', fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
