"use client"
import { useState, useEffect } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [follows, setFollows] = useState({})
const [favorites, setFavorites] = useState([])
const [myVideos, setMyVideos] = useState([
  {id:1, title:'Uptown Nightlife', views:3421, private:false, time:'2d ago'},
  {id:2, title:'Kampala City Tour', views:1289, private:false, time:'5d ago'},
])

useEffect(()=>{ const t=setTimeout(()=>setSplash(false), 2400); return()=>clearTimeout(t) },[])

if(splash){
return(
<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}>
<style>{`@keyframes in{0%{transform:scale(0.7);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes out{to{opacity:0}} .in{animation:in 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards} .out{animation:out 0.4s 2s forwards}`}</style>
<div className="out"><div className="in">
<svg width="220" height="250" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/><text x="28" y="112" fontFamily="Inter, Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div></div>
</div>
)
}

const FollowButton = ({user}) => {
  const state = follows[user] || 'follow'
  return (
    <div onClick={()=> setFollows({...follows, [user]: state==='follow' ? 'following' : state==='following' ? 'followback' : 'follow'})} style={{cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
      <div style={{width:'48px', height:'48px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border: state==='followback' ? '2px solid #00D632' : '2px solid #fff', position:'relative'}}>
        <span style={{fontWeight:'900', fontSize:'11px', color:'#000'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</span>
        <div style={{position:'absolute', bottom:'-6px', background: state==='follow'?'#FF0024': state==='following'?'#fff':'#00D632', color: state==='following'?'#000':'#fff', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #000', fontSize:'12px', fontWeight:'700'}}>{state==='follow'?'+':'✓'}</div>
      </div>
    </div>
  )
}

return(
<div style={{background:'#000', color:'#fff', width:'100vw', height:'100dvh', position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:'Inter, -apple-system, sans-serif'}}>

{/* HEADER */}
<div style={{display:'flex', padding:'12px 16px', gap:'20px', alignItems:'center', borderBottom:'1px solid #1a1a1a', background:'#000'}}>
{['For You','Muzika','Following'].map(t=>{
  const active = page===t.toLowerCase().replace(' ','')
  const key = t.toLowerCase().replace(' ','')
  return <button key={t} onClick={()=>setPage(key==='foryou'? 'foryou' : key)} style={{background:'none', border:'none', color: active?'#fff':'#717171', fontSize:'14px', fontWeight: active? '700':'500', padding:'0 0 2px', borderBottom: active?'2px solid #fff':'2px solid transparent'}}>{t}</button>
})}
<button onClick={()=>setPage('live')} style={{marginLeft:'auto', background:'#1a1a1a', color:'#fff', border:'1px solid #2a2a2a', padding:'6px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', display:'flex', alignItems:'center', gap:'6px'}}><span style={{width:'6px', height:'6px', background:'#FF0024', borderRadius:'50%'}}></span>Live</button>
</div>

{/* CONTENT */}
<div style={{flex:1, position:'relative', overflow:'hidden', background:'#000'}}>

{/* VIDEO FEED */}
{(page==='foryou' || page==='muzika' || page==='following') && (
<div style={{width:'100%', height:'100%', position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center'}}>
<div style={{width:'100%', height:'100%', background:'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 40%, transparent 100%)', position:'absolute', inset:0, zIndex:1}}></div>

{/* Creator Info - Bottom Left */}
<div style={{position:'absolute', left:'16px', bottom:'16px', zIndex:2, maxWidth:'70%'}}>
<div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
<span style={{fontWeight:'700', fontSize:'15px'}}>Katongole Rashid</span>
<span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>
</div>
<div style={{fontSize:'13px', color:'#d0d0d0', lineHeight:'1.3'}}>Kampala nights 🌃 #uptown #kampala</div>
</div>

{/* Actions - Right Side */}
<div style={{position:'absolute', right:'12px', bottom:'90px', zIndex:2, display:'flex', flexDirection:'column', gap:'22px', alignItems:'center'}}>
<FollowButton user="katongole" />
<button onClick={()=>{}} style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span style={{fontSize:'12px', fontWeight:'600'}}>1.2K</span></button>
<button onClick={()=>{}} style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><div style={{width:'28px', height:'28px', borderRadius:'50%', background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'}}>🔥</div><span style={{fontSize:'12px', fontWeight:'600'}}>340</span></button>
<button onClick={()=>setFavorites(f=> f.includes(1) ? [] : [1])} style={{background:'none', border:'none', color: favorites.includes(1)?'#FFC700':'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><svg width="24" height="24" viewBox="0 0 24 24" fill={favorites.includes(1)?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span style={{fontSize:'11px', fontWeight:'600'}}>Favorite</span></button>
<button style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg><span style={{fontSize:'11px'}}>Share</span></button>
</div>

<div style={{color:'#333', fontSize:'60px'}}>▶</div>
</div>
)}

{page==='live' && (
<div style={{padding:'20px'}}>
<div style={{fontSize:'16px', fontWeight:'700', marginBottom:'16px'}}>Live now</div>
{[{name:'DJ Nimrod', viewers:'342'}, {name:'MC Kats', viewers:'128'}].map(u=>(
<div key={u.name} style={{background:'#121212', border:'1px solid #222', padding:'14px', borderRadius:'14px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
<div style={{display:'flex', gap:'12px', alignItems:'center'}}><div style={{width:'44px', height:'44px', borderRadius:'50%', background:'#222'}}></div><div><div style={{fontWeight:'600', fontSize:'14px', display:'flex', gap:'6px', alignItems:'center'}}>{u.name} <span style={{background:'#FF0024', color:'#fff', fontSize:'9px', padding:'2px 6px', borderRadius:'10px'}}>LIVE</span></div><div style={{fontSize:'12px', color:'#888'}}>{u.viewers} viewers</div></div></div>
<button style={{background:'#fff', color:'#000', border:'none', padding:'8px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:'600'}}>Join</button>
</div>
))}
</div>
)}

{page==='inbox' && (
<div style={{padding:'0'}}>
<div style={{padding:'16px', borderBottom:'1px solid #1a1a1a', fontWeight:'700'}}>Inbox</div>
<div style={{padding:'16px', display:'flex', flexDirection:'column', gap:'12px'}}>
<div style={{background:'#121212', border:'1px solid #FF0024', borderRadius:'12px', padding:'14px'}}><div style={{fontSize:'13px', fontWeight:'600', color:'#FF0024', marginBottom:'4px'}}>Blue Tick Verification</div><div style={{fontSize:'13px', color:'#ccc'}}>Request verification to get your profile verified. Only verified creators get blue badge.</div><button style={{marginTop:'10px', background:'#fff', color:'#000', border:'none', padding:'7px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'600'}}>Request Blue Tick</button></div>
<div style={{display:'flex', gap:'12px', padding:'12px 0', borderBottom:'1px solid #1a1a1a'}}><div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#222'}}></div><div><div style={{fontSize:'14px', fontWeight:'500'}}>New follower</div><div style={{fontSize:'12px', color:'#888'}}>Someone followed you</div></div><div style={{marginLeft:'auto', fontSize:'11px', color:'#666'}}>2h ago</div></div>
</div>
</div>
)}

{page==='you' && (
<div style={{padding:'20px', overflowY:'auto', height:'100%'}}>
<div style={{display:'flex', gap:'16px'}}>
<div style={{width:'72px', height:'72px', borderRadius:'50%', background:'#fff', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900'}}>UP</div>
<div style={{flex:1}}><div style={{fontWeight:'700', fontSize:'18px'}}>My Profile</div><div style={{fontSize:'13px', color:'#888', marginTop:'2px'}}>Edit profile to add bio, change name and photo</div><div style={{display:'flex', gap:'16px', marginTop:'10px', fontSize:'13px'}}><span><b>12</b> <span style={{color:'#888'}}>Followers</span></span><span><b>24</b> <span style={{color:'#888'}}>Following</span></span></div></div>
</div>
<button style={{width:'100%', marginTop:'16px', background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'12px', borderRadius:'12px', fontSize:'14px', fontWeight:'600'}}>Edit Profile</button>

<div style={{marginTop:'24px', display:'flex', justifyContent:'space-between', alignItems:'center'}}><span style={{fontWeight:'700'}}>Your Videos</span><span style={{fontSize:'12px', color:'#888'}}>{myVideos.length} videos</span></div>
<div style={{marginTop:'12px', display:'flex', flexDirection:'column', gap:'8px'}}>
{myVideos.map(v=>(
<div key={v.id} style={{background:'#121212', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'12px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div><div style={{fontSize:'14px', fontWeight:'500'}}>{v.title}</div><div style={{fontSize:'12px', color:'#888', marginTop:'2px'}}>{v.views} views • {v.time} • {v.private ? 'Private' : 'Public'}</div></div>
<button style={{background:'none', border:'none', color:'#888'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
</div>
))}
</div>
</div>
)}
</div>

{/* UPLOAD MODAL - REAL */}
{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(12px)', zIndex:50, display:'flex', alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', borderTop:'1px solid #2a2a2a', padding:'12px 20px 32px'}} onClick={e=>e.stopPropagation()}>
<div style={{width:'36px', height:'4px', background:'#333', borderRadius:'10px', margin:'0 auto 20px'}}></div>
<div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', textAlign:'center'}}>
{[
{icon:'🎬', label:'Camera', desc:'Record'},
{icon:'↗️', label:'Duet', desc:'React'},
{icon:'📤', label:'Upload', desc:'Gallery'},
{icon:'🖼️', label:'Photo', desc:'Image'},
{icon:'📝', label:'Text', desc:'Post'},
{icon:'🎵', label:'Muzika', desc:'Music (Owner)'},
].map(i=>(
<button key={i.label} style={{background:'#1a1a1a', border:'1px solid #222', borderRadius:'16px', padding:'18px 8px', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}>
<span style={{fontSize:'22px'}}>{i.icon}</span>
<span style={{fontSize:'12px', fontWeight:'600'}}>{i.label}</span>
<span style={{fontSize:'10px', color:'#888'}}>{i.desc}</span>
</button>
))}
</div>
</div>
</div>
)}

{/* BOTTOM NAV - REAL */}
<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0 12px', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', fontSize:'10px', fontWeight:'600'}}><svg width="22" height="22" viewBox="0 0 24 24" fill={page==='foryou'?'white':'none'} stroke="currentColor" strokeWidth={page==='foryou'?0:1.6}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>Home</button>
<button onClick={()=>setPage('live')} style={{background:'none', border:'none', color: page==='live'?'#fff':'#666', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', fontSize:'10px', fontWeight:'600'}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>Live</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'22px', fontWeight:'300', display:'flex', alignItems:'center', justifyContent:'center', marginTop:'2px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'#fff':'#666', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', fontSize:'10px', fontWeight:'600'}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Inbox</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'#fff':'#666', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', fontSize:'10px', fontWeight:'600'}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>You</button>
</div>
</div>
)
}
