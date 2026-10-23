"use client"
import { useState, useEffect } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [page, setPage] = useState('foryou') // foryou, muzika, following, liveList, inbox, you
const [videos, setVideos] = useState([
  {id:1, user:'Katongole Rashid', verified:true, views:45200, likes:1200, fires:340, isPrivate:false, url:'video1'},
  {id:2, user:'Sheilah', verified:false, views:1200, likes:45, fires:10, isPrivate:false},
  {id:3, user:'Muzika Official', verified:false, views:8900, likes:230, fires:50, isPrivate:false, isMuzika:true},
])
const [follows, setFollows] = useState({}) // {username: 'none' | 'white' | 'green'}
const [favorites, setFavorites] = useState([])
const [myVideos, setMyVideos] = useState([{id:99, views:210, isPrivate:false, title:'My first video'}])
const [notifications, setNotifications] = useState([
  {id:1, type:'follow', text:'John followed you', time:'2m ago'},
  {id:2, type:'bluetick', text:'Request your Blue Tick now! Tap to apply. Get verified like Katongole Rashid', time:'1d ago'},
  {id:3, type:'message', text:'Sheilah: Nice video! (Incoming)', from:'Sheilah'},
  {id:4, type:'message', text:'You: Thanks! (Outgoing)', from:'Me'},
])
const [liveUsers, setLiveUsers] = useState([{name:'MC Kats', viewers:120}, {name:'DJ Nimrod', viewers:340}])
const [showLive, setShowLive] = useState(false)
const [profile, setProfile] = useState({name:'My Page', bio:'Uptown creator', pic:'UP', followers:12})

useEffect(()=>{ setTimeout(()=>setSplash(false), 2800)
// Blue tick notification every 15 days - 2 per month
const interval = setInterval(()=>{
  setNotifications(n=>[...n, {id:Date.now(), type:'bluetick', text:'🔵 Get Blue Tick verified? Only Katongole Rashid has it now. Request approval - Tap here!', time:'now'}])
}, 10000) // demo: 10 sec, change to 15 days: 15*24*60*60*1000
return ()=>clearInterval(interval)
},[])

// FOLLOW LOGIC
const toggleFollow = (user) => {
  const current = follows[user] || 'none'
  if(current === 'none'){
    setFollows({...follows, [user]: 'white'}) // you followed him = white tick on his page
    setNotifications(n=>[...n, {id:Date.now(), type:'follow', text:`You followed ${user}`, time:'now'}])
  } else if(current === 'white'){
    // if he follows back, green
    setFollows({...follows, [user]: 'green'})
  } else {
    setFollows({...follows, [user]: 'none'})
  }
}

const handleLike = (id) => {
  setVideos(videos.map(v=> v.id===id ? {...v, likes: v.likes+1} : v))
}
const handleFire = (id) => {
  setVideos(videos.map(v=> v.id===id ? {...v, fires: v.fires+1} : v))
  alert('🔥 FIRE sent! User is very happy!')
}
const handleFavorite = (id) => {
  if(favorites.includes(id)) setFavorites(favorites.filter(f=>f!==id))
  else setFavorites([...favorites, id])
}
const requestBlueTick = () => {
  setNotifications(n=>[...n, {id:Date.now(), type:'message', text:'Blue Tick Request Sent to Katongole Rashid inbox', time:'now'}])
  alert('Blue tick request sent to Katongole Rashid inbox! He will talk to you directly.')
}

if(splash){
return(
<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}>
<style>{`@keyframes spinScale{0%{transform:rotate(-180deg) scale(0);opacity:0}60%{transform:rotate(20deg) scale(1.2);opacity:1}100%{transform:rotate(0) scale(1);opacity:1}}@keyframes textShine{0%{opacity:0;letter-spacing:20px;transform:translateY(20px)}100%{opacity:1;letter-spacing:-1px;transform:translateY(0)}}@keyframes out{to{opacity:0;transform:scale(1.3)}}.anim-pin{animation:spinScale 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards}.anim-text{animation:textShine 0.8s ease-out 0.7s forwards, glow 1.5s ease-in-out 1.5s infinite;opacity:0}@keyframes glow{0%,100%{filter:drop-shadow(0 0 5px rgba(255,0,0,0.3))}50%{filter:drop-shadow(0 0 20px rgba(255,0,0,0.7))}}.anim-out{animation:out 0.5s ease-in 2.5s forwards}`}</style>
<div className="anim-out"><svg width="90vw" height="90vh" viewBox="0 0 200 230" style={{maxWidth:'550px', overflow:'visible'}}><g className="anim-pin"><path d="M100 10 C30 10 10 50 10 80 C10 125 100 220 100 220 C100 220 190 125 190 80 C190 50 170 10 100 10 Z" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></g><g className="anim-text"><text x="22" y="110" fontFamily="Arial Black" fontWeight="900" fontSize="38" letterSpacing="-1"><tspan fill="#FF0000">UP</tspan><tspan fill="white">TOWN</tspan></text></g></svg></div>
</div>
)
}

return(
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', inset:0}}>

{/* TOP BAR */}
<div style={{display:'flex', alignItems:'center', padding:'10px 12px', borderBottom:'1px solid #222', gap:'12px', background:'black'}}>
<button onClick={()=>setPage('foryou')} style={{background: page==='foryou'?'#222':'transparent', border: page==='foryou'?'1px solid #fff':'none', color: page==='foryou'?'white':'#888', padding:'5px 10px', borderRadius:'15px', fontSize:'13px', fontWeight: page==='foryou'?'bold':''}}>For You</button>
<button onClick={()=>setPage('muzika')} style={{background: page==='muzika'?'#222':'transparent', border: page==='muzika'?'1px solid #fff':'none', color: page==='muzika'?'white':'#888', padding:'5px 10px', borderRadius:'15px', fontSize:'13px'}}>Muzika</button>
<button onClick={()=>setPage('following')} style={{background: page==='following'?'#222':'transparent', color: page==='following'?'white':'#888', border:'none', padding:'5px 10px', fontSize:'13px'}}>Following</button>
<button onClick={()=>setPage('liveList')} style={{marginLeft:'auto', background:'#FF0000', color:'white', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', border:'none', display:'flex', gap:'5px', alignItems:'center'}}><span style={{width:'7px', height:'7px', background:'white', borderRadius:'50%'}}></span>Live {liveUsers.length}</button>
</div>

{/* MAIN CONTENT FULL SCREEN VIDEO */}
<div style={{flex:1, position:'relative', background:'#111', overflow:'auto'}}>

{page==='foryou' || page==='muzika' || page==='following' ? (
<div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'black', position:'relative'}}>
<div style={{fontSize:'80px', opacity:0.1}}>▶</div>
<div style={{position:'absolute', bottom:'20px', left:'10px'}}><div style={{fontWeight:'bold'}}>Katongole Rashid <span style={{color:'#1DA1F2'}}>✓</span></div><div style={{fontSize:'12px', color:'#aaa'}}>Full screen video - everybody sees everybody</div></div>

{/* RIGHT BUTTONS */}
<div style={{position:'absolute', right:'10px', bottom:'100px', display:'flex', flexDirection:'column', gap:'16px', alignItems:'center'}}>
{/* Profile + Follow Logic */}
<div style={{position:'relative', cursor:'pointer'}} onClick={()=>toggleFollow('Katongole Rashid')}>
<div style={{width:'52px', height:'52px', borderRadius:'50%', border: follows['Katongole Rashid']==='white' ? '2px solid white' : follows['Katongole Rashid']==='green' ? '2px solid #00FF00' : '2px solid white', background:'white', color:'black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'10px'}}><span style={{color:'red'}}>UP</span>TOWN</div>
<div style={{background: follows['Katongole Rashid']==='none' ? '#FF0000' : follows['Katongole Rashid']==='white' ? 'white' : '#00FF00', color: follows['Katongole Rashid']==='white' ? 'black' : 'white', width:'22px', height:'22px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', position:'absolute', bottom:'-7px', left:'50%', transform:'translateX(-50%)', border:'2px solid black', fontWeight:'bold', fontSize:'12px'}}>
{follows['Katongole Rashid']==='none' ? '+' : '✓'}
</div>
</div>
<div style={{fontSize:'10px', color: follows['Katongole Rashid']==='white' ? 'white' : follows['Katongole Rashid']==='green' ? '#00FF00' : '#888'}}>{follows['Katongole Rashid']==='none'?'Follow':follows['Katongole Rashid']==='white'?'White ✓': 'Green ✓ Follow Back'}</div>

<button onClick={()=>handleLike(1)} style={{background:'none', border:'none', color:'white', textAlign:'center'}}><div style={{fontSize:'26px'}}>♡</div><div style={{fontSize:'11px'}}>{videos[0].likes}</div><div style={{fontSize:'9px', color:'#888'}}>Like</div></button>
<button onClick={()=>handleFire(1)} style={{background:'none', border:'none', color:'white', textAlign:'center'}}><div style={{fontSize:'22px'}}>🔥</div><div style={{fontSize:'11px'}}>{videos[0].fires}</div><div style={{fontSize:'9px', color:'#888'}}>Fire = Very Happy</div></button>
<button onClick={()=>handleFavorite(1)} style={{background:'none', border:'none', color: favorites.includes(1) ? '#FF0000' : 'white', textAlign:'center'}}><div style={{fontSize:'16px'}}>★</div><div style={{fontSize:'11px', fontWeight:'bold'}}>Favorite</div></button>
<div style={{textAlign:'center'}}><div style={{fontSize:'20px'}}>↗</div><div style={{fontSize:'11px'}}>Share</div></div>
</div>
</div>
) : null}

{page==='liveList' && (
<div style={{padding:'15px'}}>
<h3 style={{margin:'0 0 10px'}}>🔴 People On Live Now</h3>
{liveUsers.map((u,i)=>(
<div key={i} style={{background:'#222', padding:'12px', borderRadius:'10px', marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div><div style={{fontWeight:'bold'}}>{u.name} 🔴 LIVE</div><div style={{fontSize:'12px', color:'#aaa'}}>{u.viewers} viewers</div></div>
<button onClick={()=>alert(`Request sent to ${u.name} to join live! If he accepts you join`)} style={{background:'#FF0000', color:'white', border:'none', padding:'6px 14px', borderRadius:'15px', fontSize:'12px'}}>Request Join</button>
</div>
))}
<button onClick={()=>setShowLive(true)} style={{width:'100%', marginTop:'20px', background:'#FF0000', color:'white', padding:'14px', borderRadius:'10px', border:'none', fontWeight:'bold', fontSize:'16px'}}>🎥 START YOUR LIVE (Down Live Button)</button>
{showLive && <div style={{marginTop:'15px', background:'red', padding:'20px', borderRadius:'10px', textAlign:'center'}}>🔴 YOU ARE LIVE NOW! People can see you in Live List</div>}
</div>
)}

{page==='inbox' && (
<div style={{padding:'15px'}}>
<h3 style={{margin:'0 0 10px'}}>Inbox - All Notifications & Messages</h3>
<div style={{fontSize:'12px', color:'#aaa', marginBottom:'10px'}}>Incoming + Outgoing + Follows + Blue Tick Requests</div>
{notifications.map(n=>(
<div key={n.id} onClick={()=> n.type==='bluetick' ? requestBlueTick() : null} style={{background: n.type==='bluetick' ? '#1a1a2e' : '#222', border: n.type==='bluetick' ? '1px solid #FF0000' : 'none', padding:'12px', borderRadius:'10px', marginBottom:'8px', cursor: n.type==='bluetick' ? 'pointer' : 'default'}}>
<div style={{fontWeight: n.type==='bluetick' ? 'bold' : 'normal', color: n.type==='bluetick' ? '#FF0000' : 'white'}}>{n.text}</div>
<div style={{fontSize:'11px', color:'#888', marginTop:'4px'}}>{n.time} {n.type==='bluetick' ? ' - TAP TO REQUEST' : ''}</div>
</div>
))}
</div>
)}

{page==='you' && (
<div style={{padding:'15px', overflowY:'auto'}}>
<div style={{display:'flex', gap:'15px', alignItems:'center'}}>
<div style={{width:'70px', height:'70px', borderRadius:'50%', background:'white', color:'black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{profile.pic}</div>
<div><div style={{fontWeight:'bold', fontSize:'18px', display:'flex', gap:'6px', alignItems:'center'}}>{profile.name} <button onClick={()=>{const n=prompt('Change page name:', profile.name); if(n) setProfile({...profile, name:n})}} style={{background:'#333', color:'white', border:'none', padding:'2px 8px', borderRadius:'10px', fontSize:'10px'}}>Edit</button></div><div style={{fontSize:'12px', color:'#aaa'}}>{profile.bio}</div><div style={{fontSize:'12px'}}>Followers: {profile.followers} • Following: {Object.keys(follows).length}</div></div>
</div>
<button onClick={()=>{const b=prompt('Change bio:', profile.bio); if(b) setProfile({...profile, bio:b})}} style={{marginTop:'10px', background:'#222', color:'white', border:'none', padding:'8px 14px', borderRadius:'15px', fontSize:'12px'}}>Change Bio</button>
<button onClick={()=>{const p=prompt('Change profile pic letters:', profile.pic); if(p) setProfile({...profile, pic:p})}} style={{marginLeft:'8px', background:'#222', color:'white', border:'none', padding:'8px 14px', borderRadius:'15px', fontSize:'12px'}}>Change Profile Pic</button>

<h4 style={{marginTop:'20px'}}>Your Videos - Views + Private + Delete</h4>
{myVideos.map(v=>(
<div key={v.id} style={{background:'#222', padding:'10px', borderRadius:'10px', marginBottom:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div><div style={{fontWeight:'bold'}}>{v.title}</div><div style={{fontSize:'11px', color:'#aaa'}}>{v.views} views • {v.isPrivate ? '🔒 Private' : '🌍 Public'}</div></div>
<div style={{display:'flex', gap:'6px'}}>
<button onClick={()=> setMyVideos(myVideos.map(m=> m.id===v.id ? {...m, isPrivate: !m.isPrivate} : m))} style={{background:'#333', color:'white', border:'none', padding:'5px 8px', borderRadius:'10px', fontSize:'11px'}}>{v.isPrivate ? 'Make Public' : 'Make Private'}</button>
<button onClick={()=> setMyVideos(myVideos.filter(m=> m.id!==v.id))} style={{background:'#FF0000', color:'white', border:'none', padding:'5px 8px', borderRadius:'10px', fontSize:'11px'}}>Delete</button>
</div>
</div>
))}

<h4 style={{marginTop:'20px'}}>★ Your Favorite Videos</h4>
{favorites.length===0 ? <div style={{color:'#888', fontSize:'12px'}}>No favorites yet. Tap ★ Favorite on any video</div> : favorites.map(f=> <div key={f} style={{background:'#222', padding:'10px', borderRadius:'10px', marginBottom:'6px'}}>Favorited Video #{f} ❤️</div>)}

<div style={{marginTop:'20px', background:'#111', padding:'10px', borderRadius:'10px', border:'1px solid #333'}}>
<div style={{fontSize:'12px', fontWeight:'bold'}}>🔵 Blue Tick Status</div>
<div style={{fontSize:'11px', color:'#aaa', marginTop:'4px'}}>Only Katongole Rashid has blue tick ✓. You: Not verified. You will get 2 notifications per month to request.</div>
<button onClick={requestBlueTick} style={{marginTop:'8px', background:'#1DA1F2', color:'white', border:'none', padding:'6px 12px', borderRadius:'15px', fontSize:'12px'}}>Request Blue Tick - Goes to Katongole Rashid Inbox</button>
</div>
</div>
)}

</div>

{/* BOTTOM NAV - 5 BUTTONS */}
<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #222', background:'black', alignItems:'center'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'white':'#666', fontSize:'11px', textAlign:'center'}}>⌂<br/>Home</button>
<button onClick={()=>setPage('liveList')} style={{background:'none', border:'none', color: page==='liveList'?'#FF0000':'#666', fontSize:'11px', textAlign:'center', fontWeight: page==='liveList'?'bold':''}}>○<br/>Live<br/><span style={{fontSize:'9px'}}>{page==='liveList'?'UP':'DOWN'}</span></button>
<div style={{width:'52px', height:'36px', background:'#FF0000', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'bold', color:'white', cursor:'pointer'}}>+</div>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'white':'#666', fontSize:'11px', textAlign:'center', position:'relative'}}>✉<br/>Inbox {notifications.length>0 && <span style={{position:'absolute', top:'-2px', right:'-4px', background:'red', color:'white', borderRadius:'50%', width:'16px', height:'16px', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}>{notifications.length}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'white':'#666', fontSize:'11px', textAlign:'center'}}>○<br/>You<br/><span style={{fontSize:'8px'}}>Bio/Videos/Views</span></button>
</div>
</div>
)
}
