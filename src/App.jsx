"use client"
import { useState, useEffect, useRef } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [showAuth, setShowAuth] = useState(false)
const [user, setUser] = useState(null)
const [isOwner, setIsOwner] = useState(false) // secret owner check
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [follows, setFollows] = useState({})
const [favorites, setFavorites] = useState([])
const [myVerified, setMyVerified] = useState(false)
const [blueRequests, setBlueRequests] = useState([])
const [chatUser, setChatUser] = useState(null)
const [authForm, setAuthForm] = useState({name:'', username:'', email:'', password:''})

const videos = [
  {id:1, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Kampala nights 🌃 #uptown #kampala', likes:'12.4K', fires:'340', isOwnerPost:true},
  {id:2, user:'Sheilah G', username:'@sheilah', verified:false, caption:'New business in town', likes:'892', fires:'45'},
  {id:3, user:'DJ Nimrod', username:'@nimrod', verified:false, caption:'Muzika mix 🔥', likes:'2.1K', fires:'120'},
]

useEffect(()=>{
  const t=setTimeout(()=>{
    setSplash(false)
    const savedUser = localStorage.getItem('uptown_user')
    const savedOwner = localStorage.getItem('uptown_is_owner')
    if(!savedUser){
      setShowAuth(true)
    } else {
      setUser(JSON.parse(savedUser))
      if(savedOwner==='true') setIsOwner(true)
    }
  }, 2200)
  return()=>clearTimeout(t)
},[])

const handleCreateAccount = () => {
  if(!authForm.name || !authForm.username || !authForm.email || !authForm.password) return
  const email = authForm.email.toLowerCase().trim()
  const ownerCheck = email === 'komenierashid@gmail.com'
  
  const newUser = {name: authForm.name, username:'@'+authForm.username.replace('@',''), email: email}
  localStorage.setItem('uptown_user', JSON.stringify(newUser))
  localStorage.setItem('uptown_is_owner', ownerCheck ? 'true' : 'false')
  
  setUser(newUser)
  setIsOwner(ownerCheck)
  setShowAuth(false)
}

const requestBlueTick = () => {
  if(myVerified) return
  const req = {id:Date.now(), name: user?.name || 'My Page', username: user?.username || '@mypage', message:'Requesting blue tick verification', status:'pending'}
  setBlueRequests([...blueRequests, req])
}

const acceptBlueTick = (id) => {
  setBlueRequests(blueRequests.map(r=> r.id===id ? {...r, status:'accepted'} : r))
  setMyVerified(true)
  setChatUser(null)
}

const handleShare = async (v) => {
  if(navigator.share){
    await navigator.share({title:'UPTOWN', text:`${v.user}: ${v.caption}`, url: location.href}).catch(()=>{})
  } else {
    navigator.clipboard.writeText(location.href)
  }
}

const handleDownload = () => {
  // WATERMARK ONLY ON DOWNLOAD - NOT VISIBLE IN APP
  const canvas = document.createElement('canvas')
  canvas.width = 720; canvas.height = 1280
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,720,1280)
  ctx.fillStyle = '#222'; ctx.font = 'bold 40px Inter'; ctx.fillText('UPTOWN VIDEO', 220, 600)
  // WATERMARK BURNED INSIDE DOWNLOADED FILE ONLY
  ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(480, 1160, 210, 55)
  ctx.fillStyle = '#fff'; ctx.font = '900 20px Inter'
  ctx.beginPath(); ctx.arc(500, 1187, 12, 0, Math.PI*2); ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke()
  ctx.fillText('UP', 485, 1192); ctx.fillStyle='#FF0024'; ctx.fillText('UP', 485, 1192); ctx.fillStyle='#fff'; ctx.fillText('TOWN', 510, 1192)
  const a = document.createElement('a'); a.download = `uptown-${Date.now()}.jpg`; a.href = canvas.toDataURL(); a.click()
}

const FollowButton = ({u}) => {
  const s = follows[u] || 'follow'
  return(
    <div onClick={()=> setFollows({...follows, [u]: s==='follow' ? 'following' : s==='following' ? 'followback' : 'follow'})} style={{cursor:'pointer'}}>
      <div style={{width:'48px', height:'48px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border: s==='followback' ? '2px solid #00D632' : '2px solid #fff', position:'relative'}}>
        <span style={{fontWeight:'900', fontSize:'11px', color:'#000'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</span>
        <div style={{position:'absolute', bottom:'-6px', background: s==='follow'?'#FF0024': s==='following'?'#fff':'#00D632', color: s==='following'?'#000':'#fff', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #000', fontSize:'12px', fontWeight:'700'}}>{s==='follow'?'+':'✓'}</div>
      </div>
    </div>
  )
}

if(splash){
return(
<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}>
<style>{`@keyframes in{0%{transform:scale(0.7);opacity:0}100%{transform:scale(1);opacity:1}} .in{animation:in 0.8s ease forwards}`}</style>
<div className="in"><svg width="220" height="250" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>
</div>
)
}

return(
<div style={{background:'#000', color:'#fff', width:'100vw', height:'100dvh', position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:'Inter, sans-serif'}}>

{/* AUTH WITH EMAIL - SECRET OWNER CHECK */}
{showAuth && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:100, display:'flex', flexDirection:'column', padding:'24px', justifyContent:'center'}}>
<div style={{textAlign:'center', marginBottom:'28px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg><div style={{fontWeight:'800', fontSize:'22px', marginTop:'14px'}}>Welcome to UPTOWN</div><div style={{color:'#888', fontSize:'13px', marginTop:'4px'}}>Create account to start</div></div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
<input value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} placeholder="Your Name" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.username} onChange={e=>setAuthForm({...authForm, username:e.target.value})} placeholder="Username" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} placeholder="Email - komenierashid@gmail.com for owner" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<button onClick={handleCreateAccount} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700', marginTop:'6px'}}>Create Account & Start</button>
</div>
</div>
)}

{/* HEADER - NO OWNER WORD */}
<div style={{display:'flex', padding:'12px 16px', gap:'20px', alignItems:'center', borderBottom:'1px solid #1a1a1a'}}>
{['For You','Muzika','Following'].map(t=>{
  const key = t.toLowerCase().replace(' ',''); const active = (page==='foryou' && t==='For You') || page===key
  return <button key={t} onClick={()=>setPage(key==='foryou'?'foryou':key)} style={{background:'none', border:'none', color: active?'#fff':'#717171', fontSize:'14px', fontWeight: active?'700':'500', borderBottom: active?'2px solid #fff':'2px solid transparent', paddingBottom:'2px'}}>{t}</button>
})}
<button onClick={()=>setPage('live')} style={{marginLeft:'auto', background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'6px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', display:'flex', alignItems:'center', gap:'6px'}}><span style={{width:'6px', height:'6px', background:'#FF0024', borderRadius:'50%'}}></span>Live</button>
</div>

<div style={{flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>

{(page==='foryou' || page==='muzika' || page==='following') && (
<div style={{flex:1, overflowY:'scroll', scrollSnapType:'y mandatory'}}>
{videos.filter(v=> page==='muzika' ? v.isMuzika || v.isOwnerPost : true).map(v=>(
<div key={v.id} style={{width:'100%', height:'100%', scrollSnapAlign:'start', position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
<div style={{position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 40%)', zIndex:1}}></div>
<div style={{color:'#1a1a1a', fontSize:'70px'}}>▶</div>

<div style={{position:'absolute', left:'16px', bottom:'16px', zIndex:2, maxWidth:'70%'}}>
<div style={{display:'flex', alignItems:'center', gap:'8px'}}>
<span style={{fontWeight:'700', fontSize:'15px'}}>{v.user}</span>
{v.verified && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
</div>
<div style={{fontSize:'13px', color:'#d0d0d0', marginTop:'4px'}}>{v.caption}</div>
</div>

{/* RIGHT BUTTONS - NO "with logo" TEXT */}
<div style={{position:'absolute', right:'12px', bottom:'90px', zIndex:2, display:'flex', flexDirection:'column', gap:'22px', alignItems:'center'}}>
<FollowButton u={v.username}/>
<button style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span style={{fontSize:'12px'}}>{v.likes}</span></button>
<button style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><div style={{width:'26px', height:'26px', borderRadius:'50%', background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center'}}>🔥</div><span style={{fontSize:'12px'}}>{v.fires}</span></button>
<button onClick={()=>setFavorites(f=> f.includes(v.id) ? [] : [v.id])} style={{background:'none', border:'none', color: favorites.includes(v.id)?'#FFC700':'#fff', display:'flex', flexDirection:'column', alignItems:'center'}}><svg width="22" height="22" viewBox="0 0 24 24" fill={favorites.includes(v.id)?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>
<button onClick={()=>handleShare(v)} style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg><span style={{fontSize:'11px', fontWeight:'600'}}>Share</span></button>
<button onClick={handleDownload} style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg><span style={{fontSize:'11px', fontWeight:'600'}}>Download</span></button>
</div>
</div>
))}
</div>
)}

{page==='inbox' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', marginBottom:'16px'}}>{isOwner ? 'Owner Panel - Blue Tick Requests' : 'Inbox'}</div>

{isOwner ? (
blueRequests.length===0 ? <div style={{textAlign:'center', color:'#666', marginTop:'40px'}}>No blue tick requests yet<br/><span style={{fontSize:'11px'}}>When users request, they appear here. You can chat directly and accept</span></div> :
blueRequests.map(r=>(
<div key={r.id} style={{background:'#121212', border:'1px solid #222', borderRadius:'14px', padding:'14px', marginBottom:'10px'}}>
<div style={{display:'flex', gap:'10px'}}><div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>{r.name[0]}</div><div><div style={{fontWeight:'600'}}>{r.name} <span style={{color:'#888', fontSize:'11px'}}>{r.username}</span> {r.status==='accepted' && <span style={{color:'#1D9BF0'}}>✓</span>}</div><div style={{fontSize:'12px', color:'#aaa'}}>{r.message}</div></div></div>
<div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
<button onClick={()=>setChatUser(r)} style={{flex:1, background:'#1a1a1a', border:'1px solid #333', color:'#fff', padding:'8px', borderRadius:'10px', fontSize:'12px'}}>💬 Chat</button>
{r.status==='pending' ? <button onClick={()=>acceptBlueTick(r.id)} style={{flex:1, background:'#1D9BF0', color:'#fff', border:'none', padding:'8px', borderRadius:'10px', fontSize:'12px', fontWeight:'700'}}>✓ Accept & Give Tick</button> : <div style={{flex:1, background:'#00D632', color:'#000', padding:'8px', borderRadius:'10px', textAlign:'center', fontSize:'12px', fontWeight:'700'}}>✓ Accepted</div>}
</div>
</div>
))
) : (
<div style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px'}}>
<div style={{fontWeight:'600', fontSize:'14px'}}>Blue Tick {myVerified && <span style={{color:'#1D9BF0'}}>✓</span>}</div>
<div style={{fontSize:'12px', color:'#888', marginTop:'6px'}}>{myVerified ? '🎉 Congratulations you got your blue tick! Your name has blue tick instantly' : 'Request verification - goes to Katongole inbox'}</div>
{!myVerified && <button onClick={requestBlueTick} style={{marginTop:'10px', background:'#fff', color:'#000', border:'none', padding:'8px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>Request Blue Tick</button>}
</div>
)}
</div>
)}

{chatUser && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:70, display:'flex', flexDirection:'column'}}>
<div style={{padding:'14px', borderBottom:'1px solid #1a1a1a', display:'flex', gap:'12px', alignItems:'center'}}><button onClick={()=>setChatUser(null)} style={{background:'none', border:'none', color:'#fff', fontSize:'20px'}}>←</button><div style={{fontWeight:'600'}}>{chatUser.name}</div><div style={{fontSize:'11px', color:'#00D632', marginLeft:'8px'}}>● Direct chat</div></div>
<div style={{flex:1, padding:'16px'}}><div style={{background:'#1a1a1a', padding:'10px 14px', borderRadius:'14px', maxWidth:'80%', fontSize:'13px'}}>{chatUser.message}</div></div>
<div style={{padding:'12px', borderTop:'1px solid #1a1a1a', display:'flex', gap:'8px'}}><input placeholder="Message..." style={{flex:1, background:'#1a1a1a', border:'1px solid #333', borderRadius:'20px', padding:'10px 14px', color:'#fff'}}/><button onClick={()=>acceptBlueTick(chatUser.id)} style={{background:'#1D9BF0', color:'#fff', border:'none', padding:'10px 18px', borderRadius:'20px', fontWeight:'700'}}>Accept ✓</button></div>
</div>
)}

{page==='you' && (
<div style={{padding:'20px'}}>
<div style={{display:'flex', gap:'16px', alignItems:'center'}}>
<div style={{width:'72px', height:'72px', borderRadius:'50%', background:'#fff', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900'}}>UP</div>
<div><div style={{fontWeight:'700', display:'flex', gap:'6px', alignItems:'center'}}>{user?.name || 'My Page'} {myVerified && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'12px', color:'#888'}}>{user?.username} {isOwner && <span style={{background:'#1D9BF0', color:'#fff', fontSize:'9px', padding:'2px 6px', borderRadius:'10px', marginLeft:'6px'}}>OWNER - SECRET</span>}</div></div>
</div>
{isOwner && <div style={{marginTop:'16px', background:'#0a1f2f', border:'1px solid #1D9BF0', borderRadius:'12px', padding:'12px'}}><div style={{fontWeight:'700', fontSize:'13px', color:'#1D9BF0'}}>Owner Controls (Only you see this)</div><div style={{fontSize:'11px', color:'#aaa', marginTop:'4px'}}>• Post to Muzika • Approve blue ticks • Manage all • Your page looks normal to public</div></div>}
<button style={{width:'100%', marginTop:'16px', background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'12px', borderRadius:'12px', fontWeight:'600'}}>Edit Profile</button>
</div>
)}
</div>

{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', zIndex:50, display:'flex', alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'20px 20px 32px'}} onClick={e=>e.stopPropagation()}>
<div style={{width:'36px', height:'4px', background:'#333', borderRadius:'10px', margin:'0 auto 20px'}}></div>
<div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
{[
{l:'Camera', d:'Record'},{l:'Duet', d:'React'},{l:'Upload', d:'Gallery'},
{l:'Photo', d:'Image'},{l:'Text', d:'Post'},{l:'Muzika', d: isOwner ? 'You can post' : 'Owner only'},
].map(i=>(
<div key={i.l} style={{background:'#1a1a1a', border:'1px solid #222', borderRadius:'16px', padding:'18px 8px', textAlign:'center', opacity: i.l==='Muzika' && !isOwner ? 0.4 : 1}}><div style={{fontSize:'12px', fontWeight:'600'}}>{i.l}</div><div style={{fontSize:'10px', color:'#888'}}>{i.d}</div></div>
))}
</div>
</div>
</div>
)}

<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'10px', fontWeight:'600', display:'flex', flexDirection:'column', alignItems:'center'}}>⌂<br/>Home</button>
<button onClick={()=>setPage('live')} style={{background:'none', border:'none', color:'#666', fontSize:'10px', display:'flex', flexDirection:'column', alignItems:'center'}}>◎<br/>Live</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'22px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'#fff':'#666', fontSize:'10px', display:'flex', flexDirection:'column', alignItems:'center', position:'relative'}}>✉<br/>Inbox {isOwner && blueRequests.length>0 && <span style={{position:'absolute', top:'-4px', right:'0', background:'#FF0024', width:'14px', height:'14px', borderRadius:'50%', fontSize:'9px', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>{blueRequests.length}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'#fff':'#666', fontSize:'10px', display:'flex', flexDirection:'column', alignItems:'center'}}>○<br/>You</button>
</div>
</div>
)
}
