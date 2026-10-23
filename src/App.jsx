"use client"
import { useState, useEffect, useRef } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [showAuth, setShowAuth] = useState(false)
const [user, setUser] = useState(null) // {name, username}
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [currentVideo, setCurrentVideo] = useState(0)
const [isKatongole, setIsKatongole] = useState(false)
const [blueRequests, setBlueRequests] = useState([])
const [myVerified, setMyVerified] = useState(false)
const feedRef = useRef(null)

const videos = [
  {id:1, user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Kampala nights 🌃 #uptown #kampala', likes:'12.4K', fires:'340'},
  {id:2, user:'Sheilah G', username:'@sheilah', verified:false, caption:'New business in town 💼', likes:'892', fires:'45'},
  {id:3, user:'DJ Nimrod', username:'@nimrod', verified:false, caption:'Muzika mix 🔥', likes:'2.1K', fires:'120', isMuzika:true},
]

const [authForm, setAuthForm] = useState({name:'', username:'', password:''})

useEffect(()=>{
  const t=setTimeout(()=>{ setSplash(false)
    const saved = localStorage.getItem('uptown_user')
    if(!saved){ setShowAuth(true) } else { setUser(JSON.parse(saved)) }
  }, 2500)
  return()=>clearTimeout(t)
},[])

const handleCreateAccount = () => {
  if(!authForm.name || !authForm.username || !authForm.password){ alert('Fill all fields'); return }
  const newUser = {name: authForm.name, username:'@'+authForm.username.replace('@','')}
  localStorage.setItem('uptown_user', JSON.stringify(newUser))
  setUser(newUser)
  setShowAuth(false)
}

const handleScroll = (e) => {
  const scrollTop = e.target.scrollTop
  const height = e.target.clientHeight
  const index = Math.round(scrollTop / height)
  setCurrentVideo(index)
}

// SHARE VIDEO
const handleShare = async (video) => {
  const shareData = {title:'UPTOWN', text:`Watch ${video.user} on UPTOWN: ${video.caption}`, url: window.location.href}
  if(navigator.share){
    try{ await navigator.share(shareData) } catch{}
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied! Share anywhere')
  }
}

// DOWNLOAD VIDEO WITH UPTOWN WATERMARK
const handleDownload = () => {
  // Create canvas with UPTOWN logo watermark
  const canvas = document.createElement('canvas')
  canvas.width = 720
  canvas.height = 1280
  const ctx = canvas.getContext('2d')
  // Black background simulating video
  ctx.fillStyle = '#000'
  ctx.fillRect(0,0,720,1280)
  ctx.fillStyle = '#333'
  ctx.font = 'bold 40px Arial'
  ctx.fillText('UPTOWN VIDEO', 240, 600)
  // UPTOWN WATERMARK INSIDE VIDEO - bottom right
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillRect(460, 1160, 220, 60)
  ctx.fillStyle = '#000'
  ctx.font = '900 22px Arial'
  ctx.fillText('UP', 480, 1195)
  ctx.fillStyle = '#FF0024'
  ctx.fillText('UP', 480, 1195)
  ctx.fillStyle = '#000'
  ctx.fillText('TOWN', 515, 1195)
  // Logo pin small
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(470, 1170)
  ctx.arc(485, 1175, 15, 0, Math.PI*2)
  ctx.stroke()
  
  const link = document.createElement('a')
  link.download = `uptown-video-${Date.now()}.jpg`
  link.href = canvas.toDataURL()
  link.click()
  
  // For real video file, you would draw actual video frame on canvas then add watermark
  // This demo shows JPG with watermark, replace with video blob + watermark in production
  alert('Video downloaded with UPTOWN logo watermark inside ✓')
}

if(splash){
return(
<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}>
<style>{`@keyframes in{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} .in{animation:in 0.8s ease forwards, float 2s ease-in-out infinite 0.8s}`}</style>
<div className="in"><svg width="200" height="230" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>
</div>
)
}

return(
<div style={{background:'#000', color:'#fff', width:'100vw', height:'100dvh', position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:'Inter, sans-serif'}}>

{/* AUTH - NEW USER CREATE ACCOUNT */}
{showAuth && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:100, display:'flex', flexDirection:'column', padding:'24px', justifyContent:'center'}}>
<div style={{textAlign:'center', marginBottom:'30px'}}>
<svg width="120" height="140" viewBox="0 0 200 230" style={{margin:'0 auto'}}><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
<div style={{fontSize:'22px', fontWeight:'800', marginTop:'16px'}}>Welcome to UPTOWN</div>
<div style={{fontSize:'14px', color:'#888', marginTop:'6px'}}>Kampala's business network</div>
</div>

<div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
<input value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} placeholder="Your Name" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff', fontSize:'15px'}}/>
<input value={authForm.username} onChange={e=>setAuthForm({...authForm, username:e.target.value})} placeholder="Username (e.g. sheilah)" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff', fontSize:'15px'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff', fontSize:'15px'}}/>
<button onClick={handleCreateAccount} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700', fontSize:'15px', marginTop:'8px'}}>Create Account & Start Scrolling</button>
<div style={{textAlign:'center', fontSize:'12px', color:'#666', marginTop:'8px'}}>By creating account you agree to UPTOWN Terms</div>
</div>
</div>
)}

{/* HEADER */}
<div style={{display:'flex', padding:'12px 16px', gap:'18px', alignItems:'center', borderBottom:'1px solid #1a1a1a', background:'#000', zIndex:10}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#717171', fontSize:'14px', fontWeight: page==='foryou'?'700':'500'}}>For You</button>
<button onClick={()=>setPage('muzika')} style={{background:'none', border:'none', color: page==='muzika'?'#fff':'#717171', fontSize:'14px', fontWeight:'500'}}>Muzika</button>
<button onClick={()=>setPage('following')} style={{background:'none', border:'none', color: page==='following'?'#fff':'#717171', fontSize:'14px', fontWeight:'500'}}>Following</button>
<button onClick={()=>setIsKatongole(!isKatongole)} style={{marginLeft:'auto', background: isKatongole?'#1D9BF0':'#1a1a1a', color:'#fff', border:'none', padding:'5px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:'700'}}>{isKatongole?'Owner ✓':'Owner'}</button>
</div>

{/* FEED - SCROLLABLE */}
<div ref={feedRef} onScroll={handleScroll} style={{flex:1, overflowY:'scroll', scrollSnapType:'y mandatory', WebkitOverflowScrolling:'touch'}}>

{videos.map((v, idx)=>(
<div key={v.id} style={{width:'100%', height:'100%', scrollSnapAlign:'start', position:'relative', background:'#000', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
{/* VIDEO PLACEHOLDER */}
<div style={{width:'100%', height:'100%', background:`linear-gradient(180deg, #111 0%, #000 100%)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#222', fontSize:'80px'}}>▶</div>

{/* GRADIENT */}
<div style={{position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 40%)', pointerEvents:'none'}}></div>

{/* LEFT INFO */}
<div style={{position:'absolute', left:'14px', bottom:'18px', zIndex:2, maxWidth:'68%'}}>
<div style={{display:'flex', alignItems:'center', gap:'6px'}}>
<span style={{fontWeight:'700', fontSize:'15px'}}>{v.user}</span>
{v.verified && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
{myVerified && v.username==='@mypage' && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
<span style={{fontSize:'12px', color:'#aaa'}}>{v.username}</span>
</div>
<div style={{fontSize:'13px', color:'#ddd', marginTop:'6px', lineHeight:'1.3'}}>{v.caption}</div>
</div>

{/* RIGHT ACTIONS */}
<div style={{position:'absolute', right:'10px', bottom:'80px', zIndex:2, display:'flex', flexDirection:'column', gap:'20px', alignItems:'center'}}>
<div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
<div style={{width:'48px', height:'48px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'11px', color:'#000'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</div>
<div style={{width:'20px', height:'20px', background:'#FF0024', borderRadius:'50%', marginTop:'-10px', border:'2px solid #000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:'#fff'}}>+</div>
</div>

<button style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><span style={{fontSize:'26px'}}>♡</span><span style={{fontSize:'12px', fontWeight:'600'}}>{v.likes}</span></button>
<button style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><span style={{fontSize:'20px'}}>🔥</span><span style={{fontSize:'12px'}}>{v.fires}</span></button>

{/* SHARE BUTTON - SHARE + DOWNLOAD */}
<button onClick={()=>handleShare(v)} style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
<span style={{fontSize:'11px', fontWeight:'600'}}>Share</span>
</button>

<button onClick={handleDownload} style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
<span style={{fontSize:'10px'}}>Download</span>
<span style={{fontSize:'8px', color:'#FF0024'}}>with logo</span>
</button>
</div>

{/* WATERMARK INSIDE VIDEO - ALWAYS VISIBLE */}
<div style={{position:'absolute', bottom:'90px', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)', padding:'4px 10px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'6px', zIndex:2, border:'1px solid rgba(255,255,255,0.15)'}}>
<svg width="18" height="20" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="8"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
<span style={{fontSize:'10px', fontWeight:'700', letterSpacing:'0.5px'}}>UPTOWN</span>
</div>
</div>
))}

</div>

{/* BOTTOM NAV */}
<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'10px', fontWeight:'600', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}><span style={{fontSize:'18px'}}>⌂</span>Home</button>
<button style={{background:'none', border:'none', color:'#666', fontSize:'10px', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}><span style={{fontSize:'16px'}}>◎</span>Live</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color:'#666', fontSize:'10px', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}>✉<br/>Inbox</button>
<button style={{background:'none', border:'none', color:'#666', fontSize:'10px', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}>○<br/>You</button>
</div>

{/* UPLOAD SHEET */}
{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(12px)', zIndex:50, display:'flex', alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
{['Record','Duet','Upload','Photo','Text','Muzika'].map(l=>(
<div key={l} style={{background:'#1a1a1a', borderRadius:'16px', padding:'16px', textAlign:'center', fontSize:'12px', fontWeight:'600'}}>{l}</div>
))}
</div>
</div>
</div>
)}

</div>
)
}
