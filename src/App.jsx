"use client"
import { useState, useEffect } from "react"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [isKatongole, setIsKatongole] = useState(false) // false = normal user, true = Katongole Rashid owner view
const [follows, setFollows] = useState({})
const [favorites, setFavorites] = useState([])
const [myVerified, setMyVerified] = useState(false) // this user verified?
const [chatUser, setChatUser] = useState(null) // who Katongole is chatting with

// All blue tick requests
const [blueRequests, setBlueRequests] = useState([
  // Example
  // {id:1, name:'Sheilah', username:'@sheilah', message:'Hello boss I want blue tick for my business', status:'pending'}
])

const [notifications, setNotifications] = useState([
  {id:1, type:'follow', text:'John followed you', time:'2h ago'},
])

useEffect(()=>{ setTimeout(()=>setSplash(false), 2200) },[])

// USER REQUESTS BLUE TICK
const requestBlueTick = () => {
  if(myVerified){ alert('You already have blue tick ✓'); return }
  const req = {id:Date.now(), name:'My Page', username:'@mypage', message:'I would like to get blue tick verification please', status:'pending', time:'now'}
  setBlueRequests([...blueRequests, req])
  setNotifications([...notifications, {id:Date.now(), type:'info', text:'Blue tick request sent to Katongole Rashid - He will chat with you directly', time:'now'}])
}

// KATONGOLE ACCEPTS - USER GETS BLUE TICK INSTANTLY
const acceptBlueTick = (reqId) => {
  const req = blueRequests.find(r=>r.id===reqId)
  setBlueRequests(blueRequests.map(r=> r.id===reqId ? {...r, status:'accepted'} : r))
  
  // If this request is from current user (demo), make him verified instantly
  if(req.username === '@mypage'){
    setMyVerified(true)
    setNotifications(n=>[...n, {id:Date.now(), type:'verified', text:'🎉 Congratulations! You got your Blue Tick ✓ Your name now has blue tick', time:'now'}])
  } else {
    // For other users, add global notification
    setNotifications(n=>[...n, {id:Date.now(), type:'verified', text:`${req.name} got blue tick verified ✓`, time:'now'}])
  }
  setChatUser(null)
}

if(splash){
return(
<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}>
<style>{`@keyframes in{0%{transform:scale(0.7);opacity:0}100%{transform:scale(1);opacity:1}} .in{animation:in 0.7s ease forwards}`}</style>
<div className="in"><svg width="200" height="230" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>
</div>
)
}

return(
<div style={{background:'#000', color:'#fff', width:'100vw', height:'100dvh', position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:'Inter, sans-serif'}}>

{/* HEADER */}
<div style={{display:'flex', padding:'12px 16px', gap:'12px', alignItems:'center', borderBottom:'1px solid #1a1a1a'}}>
{['For You','Muzika','Following'].map(t=>{
  const active = page===t.toLowerCase().replace(' ','')
  return <button key={t} onClick={()=>setPage(t.toLowerCase().replace(' ','')==='foryou'?'foryou':t.toLowerCase())} style={{background:'none', border:'none', color: active?'#fff':'#717171', fontSize:'14px', fontWeight: active?'700':'500'}}>{t}</button>
})}
<button onClick={()=>setIsKatongole(!isKatongole)} style={{marginLeft:'auto', background: isKatongole?'#1D9BF0':'#1a1a1a', color:'#fff', border:'none', padding:'6px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700'}}>{isKatongole?'Owner: Katongole ✓':'Switch to Owner'}</button>
</div>

<div style={{flex:1, position:'relative', overflow:'hidden'}}>

{/* FEED */}
{(page==='foryou') && (
<div style={{width:'100%', height:'100%', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', background:'#000'}}>
<div style={{position:'absolute', left:'16px', bottom:'20px', zIndex:2}}>
<div style={{display:'flex', alignItems:'center', gap:'6px'}}>
<span style={{fontWeight:'700', fontSize:'15px', display:'flex', alignItems:'center', gap:'6px'}}>
Katongole Rashid 
<span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>
</span>
{myVerified && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
</div>
<div style={{fontSize:'13px', color:'#ccc', marginTop:'4px'}}>Kampala nights #uptown</div>
</div>
<div style={{position:'absolute', right:'12px', bottom:'90px', zIndex:2, display:'flex', flexDirection:'column', gap:'20px', alignItems:'center'}}>
<div style={{width:'48px', height:'48px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'11px', color:'#000'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</div>
<div style={{display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'24px'}}>♡</span><span style={{fontSize:'11px'}}>1.2K</span></div>
<div style={{display:'flex', flexDirection:'column', alignItems:'center'}}><span>🔥</span><span style={{fontSize:'11px'}}>340</span></div>
</div>
<div style={{color:'#222', fontSize:'60px'}}>▶</div>
</div>
)}

{page==='inbox' && (
<div style={{height:'100%', display:'flex', flexDirection:'column'}}>
<div style={{padding:'16px', fontWeight:'700', borderBottom:'1px solid #1a1a1a', display:'flex', justifyContent:'space-between'}}>
<span>{isKatongole ? 'Katongole Inbox - Blue Tick Requests' : 'Inbox'}</span>
<span style={{fontSize:'11px', background:'#1a1a1a', padding:'4px 8px', borderRadius:'10px', color:'#888'}}>{isKatongole ? blueRequests.length+' requests' : notifications.length+' new'}</span>
</div>

<div style={{flex:1, overflowY:'auto', padding:'12px'}}>

{/* KATONGOLE VIEW - SEES REQUESTS */}
{isKatongole ? (
blueRequests.length===0 ? <div style={{textAlign:'center', marginTop:'40px', color:'#666'}}>No blue tick requests yet</div> :
blueRequests.map(req=>(
<div key={req.id} style={{background:'#121212', border:'1px solid #222', borderRadius:'14px', padding:'14px', marginBottom:'10px'}}>
<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div style={{display:'flex', gap:'10px', alignItems:'center'}}>
<div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700'}}>{req.name[0]}</div>
<div><div style={{fontWeight:'600', fontSize:'14px', display:'flex', gap:'6px', alignItems:'center'}}>{req.name} <span style={{fontSize:'11px', color:'#888'}}>{req.username}</span> {req.status==='accepted' && <span style={{width:'16px', height:'16px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'12px', color:'#aaa'}}>{req.message}</div></div>
</div>
</div>
<div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
<button onClick={()=>setChatUser(req)} style={{flex:1, background:'#1a1a1a', color:'#fff', border:'1px solid #333', padding:'8px', borderRadius:'10px', fontSize:'12px', fontWeight:'600'}}>💬 Chat Directly</button>
{req.status==='pending' ? 
<button onClick={()=>acceptBlueTick(req.id)} style={{flex:1, background:'#1D9BF0', color:'#fff', border:'none', padding:'8px', borderRadius:'10px', fontSize:'12px', fontWeight:'700'}}>✓ Accept & Give Blue Tick</button>
: <span style={{flex:1, background:'#00D632', color:'#000', padding:'8px', borderRadius:'10px', fontSize:'12px', fontWeight:'700', textAlign:'center'}}>✓ Accepted - User Got Tick</span>
}
</div>
</div>
))
) : (
/* NORMAL USER VIEW */
<>
{myVerified && (
<div style={{background:'linear-gradient(90deg, #1D9BF0, #1DA1F2)', borderRadius:'12px', padding:'14px', marginBottom:'12px', display:'flex', gap:'10px', alignItems:'center'}}>
<div style={{width:'36px', height:'36px', background:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#1D9BF0', fontWeight:'900'}}>✓</div>
<div><div style={{fontWeight:'700', fontSize:'14px'}}>Congratulations! You got your Blue Tick ✓</div><div style={{fontSize:'12px', opacity:0.9}}>Your name now has blue tick instantly</div></div>
</div>
)}

{notifications.map(n=>(
<div key={n.id} style={{background: n.type==='verified' ? '#0a1f2f' : '#121212', border: n.type==='verified'?'1px solid #1D9BF0':'1px solid #1e1e1e', borderRadius:'12px', padding:'12px', marginBottom:'8px'}}>
<div style={{fontSize:'13px', fontWeight: n.type==='verified'?'700':'400'}}>{n.text}</div>
<div style={{fontSize:'11px', color:'#666', marginTop:'4px'}}>{n.time}</div>
</div>
))}

<div style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', marginTop:'10px'}}>
<div style={{fontWeight:'700', fontSize:'14px', display:'flex', alignItems:'center', gap:'8px'}}>
Blue Tick Verification {myVerified && <span style={{width:'16px', height:'16px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
</div>
<div style={{fontSize:'12px', color:'#888', marginTop:'6px'}}>
{myVerified ? 'You are verified ✓' : 'Only Katongole Rashid has blue tick. Request yours - he will talk to you directly and approve.'}
</div>
{!myVerified && <button onClick={requestBlueTick} style={{marginTop:'10px', background:'#fff', color:'#000', border:'none', padding:'8px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>Request Blue Tick → Goes to Katongole Inbox</button>}
</div>
</>
)}

</div>

{/* CHAT MODAL - KATONGOLE TALKS DIRECTLY */}
{chatUser && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:60, display:'flex', flexDirection:'column'}}>
<div style={{padding:'14px 16px', borderBottom:'1px solid #1a1a1a', display:'flex', gap:'12px', alignItems:'center'}}>
<button onClick={()=>setChatUser(null)} style={{background:'none', border:'none', color:'#fff', fontSize:'20px'}}>←</button>
<div style={{width:'36px', height:'36px', borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center'}}>{chatUser.name[0]}</div>
<div><div style={{fontWeight:'600', fontSize:'14px'}}>{chatUser.name}</div><div style={{fontSize:'11px', color:'#00D632'}}>● Online - Talking directly</div></div>
</div>
<div style={{flex:1, padding:'16px', display:'flex', flexDirection:'column', gap:'12px'}}>
<div style={{background:'#1a1a1a', padding:'10px 14px', borderRadius:'18px 18px 18px 4px', alignSelf:'flex-start', maxWidth:'80%', fontSize:'13px'}}>{chatUser.message}</div>
<div style={{background:'#1D9BF0', padding:'10px 14px', borderRadius:'18px 18px 4px 18px', alignSelf:'flex-end', maxWidth:'80%', fontSize:'13px'}}>Hello {chatUser.name}, I received your blue tick request. Tell me about your page?</div>
<div style={{background:'#1a1a1a', padding:'10px 14px', borderRadius:'18px 18px 18px 4px', alignSelf:'flex-start', maxWidth:'80%', fontSize:'13px'}}>I do business in Kampala, I need verification please boss</div>
</div>
<div style={{padding:'12px', borderTop:'1px solid #1a1a1a', display:'flex', gap:'8px'}}>
<input placeholder="Message directly..." style={{flex:1, background:'#1a1a1a', border:'1px solid #333', borderRadius:'20px', padding:'10px 14px', color:'#fff', fontSize:'13px'}}/>
<button onClick={()=>acceptBlueTick(chatUser.id)} style={{background:'#1D9BF0', color:'#fff', border:'none', padding:'10px 18px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>Accept ✓</button>
</div>
</div>
)}

</div>
)}

{page==='you' && (
<div style={{padding:'20px'}}>
<div style={{display:'flex', gap:'14px', alignItems:'center'}}>
<div style={{width:'64px', height:'64px', borderRadius:'50%', background:'#fff', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900'}}>UP</div>
<div><div style={{fontWeight:'700', fontSize:'16px', display:'flex', gap:'6px', alignItems:'center'}}>My Page {myVerified && <span style={{width:'18px', height:'18px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'12px', color:'#888'}}>{myVerified ? 'Verified ✓ - Blue tick active' : 'Not verified - Request in Inbox'}</div></div>
</div>
</div>
)}

</div>

{/* UPLOAD */}
{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(12px)', zIndex:50, display:'flex', alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'20px 20px 32px'}} onClick={e=>e.stopPropagation()}>
<div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
{[{l:'Camera'},{l:'Duet'},{l:'Upload'},{l:'Photo'},{l:'Text'},{l:'Muzika'}].map(i=>(
<div key={i.l} style={{background:'#1a1a1a', borderRadius:'16px', padding:'16px', textAlign:'center', fontSize:'12px', fontWeight:'600'}}>{i.l}</div>
))}
</div>
</div>
</div>
)}

{/* NAV */}
<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'10px'}}>⌂<br/>Home</button>
<button onClick={()=>setPage('inbox')} style={{background:'none', border:'none', color: page==='inbox'?'#fff':'#666', fontSize:'10px', position:'relative'}}>✉<br/>Inbox {blueRequests.length>0 && isKatongole && <span style={{position:'absolute', top:0, right:0, background:'#FF0024', width:'14px', height:'14px', borderRadius:'50%', fontSize:'9px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff'}}>{blueRequests.length}</span>}</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024', border:'none', width:'48px', height:'32px', borderRadius:'10px', color:'#fff', fontSize:'20px'}}>+</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color: page==='you'?'#fff':'#666', fontSize:'10px'}}>○<br/>You {myVerified && '✓'}</button>
</div>
</div>
)
}
