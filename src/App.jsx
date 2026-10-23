"use client"
import { useState, useEffect } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [videos, setVideos] = useState([
  {id:1, user:'Katongole Rashid', verified:true, views:45200, likes:1200, fires:340},
])
const [follows, setFollows] = useState({})
const [favorites, setFavorites] = useState([])
const [myVideos, setMyVideos] = useState([{id:99, views:210, isPrivate:false, title:'My first video'}])
const [notifications, setNotifications] = useState([
  {id:1, type:'follow', text:'John followed you', time:'2m ago'},
  {id:2, type:'bluetick', text:'Request your Blue Tick now! Tap to apply.', time:'1d ago'},
  {id:3, type:'message', text:'Sheilah: Nice video! (Incoming)'},
  {id:4, type:'message', text:'You: Thanks! (Outgoing)'},
])
const [liveUsers] = useState([{name:'MC Kats', viewers:120}, {name:'DJ Nimrod', viewers:340}])
const [profile, setProfile] = useState({name:'My Page', bio:'Uptown creator', pic:'UP'})

useEffect(()=>{ setTimeout(()=>setSplash(false), 2800) },[])

const toggleFollow = (user) => {
  const cur = follows[user] || 'none'
  if(cur==='none') setFollows({...follows, [user]:'white'})
  else if(cur==='white') setFollows({...follows, [user]:'green'})
  else setFollows({...follows, [user]:'none'})
}
const handleLike = () => setVideos(v=>v.map(x=>({...x, likes:x.likes+1})))
const handleFire = () => { setVideos(v=>v.map(x=>({...x, fires:x.fires+1}))); alert('🔥 FIRE sent!') }
const handleFavorite = () => setFavorites(f=> f.includes(1) ? f.filter(x=>x!==1) : [...f,1])
const requestBlueTick = () => alert('Blue tick request sent to Katongole Rashid inbox!')

// UPLOAD FUNCTIONS
const uploadAction = (type) => {
  setShowUpload(false)
  if(type==='record') alert('🎥 Opening Camera to RECORD VIDEO...')
  if(type==='duet') alert('👥 Duet Video - Choose video to duet...')
  if(type==='video') alert('📹 Upload Video from Gallery...')
  if(type==='picture') alert('🖼️ Upload Picture / Letter...')
  if(type==='post') alert('📝 Create Post - Video, Picture, Text...')
  setMyVideos([...myVideos, {id:Date.now(), views:0, isPrivate:false, title: type + ' upload - ' + new Date().toLocaleTimeString()}])
}

if(splash){
return(
<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}>
<style>{`@keyframes spinScale{0%{transform:rotate(-180deg) scale(0);opacity:0}60%{transform:rotate(20deg) scale(1.2);opacity:1}100%{transform:rotate(0) scale(1);opacity:1}}@keyframes textShine{0%{opacity:0;letter-spacing:20px;transform:translateY(20px)}100%{opacity:1;letter-spacing:-1px;transform:translateY(0)}}@keyframes out{to{opacity:0;transform:scale(1.3)}}.anim-pin{animation:spinScale 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards}.anim-text{animation:textShine 0.8s ease-out 0.7s forwards;opacity:0}.anim-out{animation:out 0.5s ease-in 2.5s forwards}`}</style>
<div className="anim-out"><svg width="90vw" height="90vh" viewBox="0 0 200 230" style={{maxWidth:'550px'}}><g className="anim-pin"><path d="M100 10 C30 10 10 50 10 80 C10 125 100 220 100 220 C100 220 190 125 190 80 C190 50 170 10 100 10 Z" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></g><g className="anim-text"><text x="22" y="110" fontFamily="Arial Black" fontWeight="900" fontSize="38"><tspan fill="#FF0000">UP</tspan><tspan fill="white">TOWN</tspan></text></g></svg></div>
</div>
)
}

return(
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', inset:0}}>

<div style={{display:'flex', alignItems:'center', padding:'10px 12px', borderBottom:'1px solid #222', gap:'12px'}}>
<button onClick={()=>setPage('foryou')} style={{background: page==='foryou'?'#222':'transparent', border: page==='foryou'?'1px solid #fff':'none', color: page==='foryou'?'white':'#888', padding:'5px 12px', borderRadius:'15px', fontSize:'13px', fontWeight:'bold'}}>For You</button>
<button onClick={()=>setPage('muzika')} style={{background:'none', border:'none', color: page==='muzika'?'white':'#888', fontSize:'13px'}}>Muzika</button>
<button onClick={()=>setPage('following')} style={{background:'none', border:'none', color: page==='following'?'white':'#888', fontSize:'13px'}}>Following</button>
<button onClick={()=>setPage('liveList')} style={{marginLeft:'auto', background:'#FF0000', color:'white', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', border:'none', display:'flex', gap:'5px', alignItems:'center'}}><span style={{width:'7px', height:'7px', background:'white', borderRadius:'50%'}}></span>Live 2</button>
</div>

<div style={{flex:1, position:'relative', background:'black', overflow:'auto'}}>
{page!=='inbox' && page!=='you' && page!=='liveList' && (
<div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'black', position:'relative'}}>
<div style={{fontSize:'80px', opacity:0.15}}>▶</div>

{/* BOTTOM LEFT - NAME WITH BLUE TICK IN CYCLE */}
<div style={{position:'absolute', bottom:'20px', left:'10px', display:'flex', flexDirection:'column', gap:'2px'}}>
<div style={{fontWeight:'bold', fontSize:'15px', display:'flex', alignItems:'center', gap:'6px'}}>
Katongole Rashid
{/* BLUE TICK IN CYCLE */}
<span style={{width:'18px', height:'18px', background:'#1DA1F2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:'white', fontWeight:'bold'}}>✓</span>
</div>
<div style={{fontSize:'12px', color:'#aaa'}}>Full screen video - everybody sees everybody</div>
</div>

<div style={{position:'absolute', right:'10px', bottom:'100px', display:'flex', flexDirection:'column', gap:'16px', alignItems:'center'}}>
<div style={{position:'relative', cursor:'pointer'}} onClick={()=>toggleFollow('Katongole Rashid')}>
<div style={{width:'52px', height:'52px', borderRadius:'50%', border: follows['Katongole Rashid']==='green' ? '2px solid #00FF00' : '2px solid white', background:'white', color:'black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'10px'}}><span style={{color:'red'}}>UP</span>TOWN</div>
<div style={{background: follows['Katongole Rashid']==='none' ? '#FF0000' : follows['Katongole Rashid']==='white' ? 'white' : '#00FF00', color: follows['Katongole Rashid']==='white' ? 'black' : 'white', width:'22px', height:'22px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', position:'absolute', bottom:'-7px', left:'50%', transform:'translateX(-50%)', border:'2px solid black', fontWeight:'bold'}}>{follows['Katongole Rashid']==='none' ? '+' : '✓'}</div>
</div>
<div style={{fontSize:'10px', color: follows['Katongole Rashid']==='green' ? '#00FF00' : '#888'}}>{follows['Katongole Rashid']==='none'?'':follows['Katongole Rashid']==='white'?'White ✓':'Green ✓ Follow Back'}</div>

<button onClick={handleLike} style={{background:'none', border:'none', color:'white', textAlign:'center'}}><div style={{fontSize:'26px'}}>♡</div><div style={{fontSize:'11px'}}>1200</div><div style={{fontSize:'9px'}}>Like</div></button>
<button onClick={handleFire} style={{background:'none', border:'none', color:'white', textAlign:'center'}}><div style={{fontSize:'22px'}}>🔥</div><div style={{fontSize:'11px'}}>340</div><div style={{fontSize:'9px'}}>Fire</div></button>
<button onClick={handleFavorite} style={{background:'none', border:'none', color: favorites.includes(1)?'#FF0000':'white', textAlign:'center'}}><div style={{fontSize:'16px'}}>★</div><div style={{fontSize:'11px', fontWeight:'bold'}}>Favorite</div></button>
<div style={{textAlign:'center'}}><div style={{fontSize:'20px'}}>↗</div><div style={{fontSize:'11px'}}>Share</div></div>
</div>
</div>
)}

{page==='liveList' && (
<div style={{padding:'15px'}}>
<h3>🔴 Live Now - Tap to Watch</h3>
{[{name:'MC Kats', viewers:120}, {name:'DJ Nimrod', viewers:340}].map((u,i)=>(
<div key={i} style={{background:'#222', padding:'12px', borderRadius:'10px', marginBottom:'10px', display:'flex', justifyContent:'space-between'}}>
<div><b>{u.name}</b> 🔴<div style={{fontSize:'12px', color:'#aaa'}}>{u.viewers} watching</div></div>
<button onClick={()=>alert(`Request to join ${u.name} live - waiting approval`)} style={{background:'#FF0000', color:'white', border:'none', padding:'6px 14px', borderRadius:'15px'}}>Request Join</button>
</div>
))}
</div>
)}

{page==='inbox' && (
<div style={{padding:'15px'}}>
<h3>Inbox - Notifications + Messages</h3>
{notifications.map(n=>(
<div key={n.id} onClick={()=> n.text.includes('Blue Tick') ? requestBlueTick() : null} style={{background: n.text.includes('Blue Tick') ? '#1a1a2e' : '#222', border: n.text.includes('Blue Tick') ? '1px solid #1DA1F2' : 'none', padding:'12px', borderRadius:'10px', marginBottom:'8px'}}>
<div style={{fontSize:'13px'}}>{n.text}</div><div style={{fontSize:'11px', color:'#888'}}>{n.time || 'now'}</div>
</div>
))}
</div>
)}

{page==='you' && (
<div style={{padding:'15px'}}>
<div style={{display:'flex', gap:'15px', alignItems:'center'}}>
<div style={{width:'70px', height:'70px', borderRadius:'50%', background:'white', color:'black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{profile.pic}</div>
<div><div style={{fontWeight:'bold', display:'flex', gap:'6px', alignItems:'center'}}>{profile.name} <span style={{width:'16px', height:'16px', background:'#ccc', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'black'}}>✓</span><span style={{fontSize:'10px', color:'#888'}}>No blue tick - request in Inbox</span></div><div style={{fontSize:'12px', color:'#aaa'}}>{profile.bio}</div></div>
</div>
<h4 style={{marginTop:'20px'}}>Your Videos - Views + Private/Delete</h4>
{myVideos.map(v=>(
<div key={v.id} style={{background:'#222', padding:'10px', borderRadius:'10px', marginBottom:'8px', display:'flex', justifyContent:'space-between'}}>
<div><b>{v.title}</b><div style={{fontSize:'11px', color:'#aaa'}}>{v.views} views • {v.isPrivate ? '🔒 Private' : '🌍 Public'}</div></div>
<div style={{display:'flex', gap:'6px'}}>
<button onClick={()=> setMyVideos(myVideos.map(m=> m.id===v.id ? {...m, isPrivate:!m.isPrivate}:m))} style={{background:'#333', color:'white', border:'none', padding:'5px 8px', borderRadius:'10px', fontSize:'11px'}}>{v.isPrivate?'Public':'Private'}</button>
<button onClick={()=> setMyVideos(myVideos.filter(m=>m.id!==v.id))} style={{background:'red', color:'white', border:'none', padding:'5px 8px', borderRadius:'10px', fontSize:'11px'}}>Delete</button>
</div>
</div>
))}
</div>
)}
</div>

{/* RED BUTTON UPLOAD MENU */}
{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9999, display:'flex', alignItems:'flex-end', justifyContent:'center'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#1a1a1a', width:'100%', maxWidth:'400px', borderTopLeftRadius:'20px', borderTopRightRadius:'20px', padding:'20px', borderTop:'1px solid #333'}} onClick={e=>e.stopPropagation()}>
<div style={{width:'40px', height:'4px', background:'#444', borderRadius:'2px', margin:'0 auto 15px'}}></div>
<h3 style={{margin:'0 0 15px', textAlign:'center'}}>Create & Upload</h3>
<div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
<button onClick={()=>uploadAction('record')} style={{background:'#222', border:'none', color:'white', padding:'18px', borderRadius:'15px', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}><span style={{fontSize:'28px'}}>🎥</span><span style={{fontSize:'13px', fontWeight:'bold'}}>Record Video</span></button>
<button onClick={()=>uploadAction('duet')} style={{background:'#222', border:'none', color:'white', padding:'18px', borderRadius:'15px', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}><span style={{fontSize:'28px'}}>👥</span><span style={{fontSize:'13px', fontWeight:'bold'}}>Duet Video</span></button>
<button onClick={()=>uploadAction('video')} style={{background:'#222', border:'none', color:'white', padding:'18px', borderRadius:'15px', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}><span style={{fontSize:'28px'}}>📹</span><span style={{fontSize:'13px', fontWeight:'bold'}}>Upload Video</span></button>
<button onClick={()=>uploadAction('picture')} style={{background:'#222', border:'none', color:'white', padding:'18px', borderRadius:'15px', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}><span style={{fontSize:'28px'}}>🖼️</span><span style={{fontSize:'13px', fontWeight:'bold'}}>Picture / Letter</span></button>
</div>
<button onClick={()=>uploadAction('post')} style={{width:'100%', marginTop:'12px', background:'#FF0000', color:'white', border:'none', padding:'16px', borderRadius:'15px', fontWeight:'bold', fontSize:'15px'}}>📝 Post Anything - Video, Photo, Text</button>
<button onClick={()=>setShowUpload(false)} style={{width:'100%', marginTop:'10px', background:'transparent', color:'#888', border:'none', padding:'10px'}}>Cancel</button>
</div>
</div>
)}

{/* BOTTOM NAV */}
<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #222', background:'black', alignItems:'center'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'white':'#666', fontSize:'11px', textAlign:'center'}}>⌂<br/>Home</button>
<button onClick={()=>setPage('liveList')} style={{background:'none', border:'none', color: page==='liveList'?'#FF0000':'#666', fontSize:'11px', textAlign:'center'}}>◯<br/>Live<br/><span style={{fontSize:'8px'}}>DOWN</span></button>

{/* BIG RED + BUTTON MIDDLE - NOW UPLOAD CENTER */}
<button onClick={()=>setShowUpload(true)} style={{width:'62px', height:'42px', background:'#FF0000', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px', fontWeight:'bold', color:'white', border:'2px solid #FF0000', boxShadow:'0 0 15px rgba(255,0,0,0.4)'}}>+</button>

<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'white':'#666', fontSize:'11px', textAlign:'center', position:'relative'}}>✉<br/>Inbox {notifications.length>0 && <span style={{position:'absolute', top:'-2px', right:'-4px', background:'red', color:'white', borderRadius:'50%', width:'16px', height:'16px', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}>{notifications.length}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'white':'#666', fontSize:'11px', textAlign:'center'}}>○<br/>You</button>
</div>
</div>
)
}
