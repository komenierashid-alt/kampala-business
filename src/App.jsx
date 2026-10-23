"use client"
import { useState, useEffect } from "react"

export default function Home(){
const [splash, setSplash] = useState(true)
useEffect(()=>{ setTimeout(()=>setSplash(false), 3200) },[])

if(splash){
return(
<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999, overflow:'hidden'}}>
<style>{`
@keyframes dropBounce {
  0% { transform: translateY(-500px) scale(0.2); opacity: 0; }
  60% { transform: translateY(20px) scale(1.15); opacity: 1; }
  80% { transform: translateY(-10px) scale(0.95); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes fadeInText {
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes pulseGlow {
  0%,100% { filter: drop-shadow(0 0 0px white); }
  50% { filter: drop-shadow(0 0 25px rgba(255,255,255,0.6)); }
}
@keyframes fadeOutSplash {
  0% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
.animate-pin { animation: dropBounce 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulseGlow 1.5s ease-in-out 1s infinite; }
.animate-text { animation: fadeInText 1s ease-out 0.6s forwards; opacity: 0; }
.splash-out { animation: fadeOutSplash 0.4s ease-out 2.8s forwards; }
`}</style>

  <div className="splash-out" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
    <svg width="90vw" height="90vh" viewBox="0 0 200 230" style={{maxWidth:'550px', maxHeight:'650px', overflow:'visible'}}>
      <g className="animate-pin">
        <path d="M100 10 C30 10 10 50 10 80 C10 125 100 220 100 220 C100 220 190 125 190 80 C190 50 170 10 100 10 Z" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g className="animate-text">
        <text x="22" y="108" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="38" letterSpacing="-1">
          <tspan fill="#FF0000">UP</tspan><tspan fill="white">TOWN</tspan>
        </text>
      </g>
    </svg>
  </div>
</div>
)
}

return(
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', inset:0}}>
<div style={{display:'flex', alignItems:'center', padding:'10px 12px', borderBottom:'1px solid #222', gap:'20px'}}>
<div style={{background:'#222', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', border:'1px solid #333', display:'flex', gap:'5px', alignItems:'center', marginRight:'4px'}}><span style={{width:'7px', height:'7px', background:'red', borderRadius:'50%'}}></span>Live</div>
<span style={{fontWeight:'bold', borderBottom:'2px solid white', fontSize:'13px', paddingBottom:'3px'}}>For You</span>
<span style={{color:'#888', fontSize:'13px'}}>Muzika</span>
<span style={{color:'#888', fontSize:'13px'}}>Following</span>
<div style={{marginLeft:'auto'}}>🔍</div>
</div>

<div style={{flex:1, position:'relative'}}>
<div style={{position:'absolute', right:'10px', bottom:'110px', display:'flex', flexDirection:'column', gap:'18px', alignItems:'center'}}>
<div style={{position:'relative'}}><div style={{width:'52px', height:'52px', borderRadius:'50%', border:'2px solid white', background:'white', color:'black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'10px'}}><span style={{color:'red'}}>UP</span>TOWN</div><div style={{background:'red', color:'white', width:'22px', height:'22px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', position:'absolute', bottom:'-7px', left:'50%', transform:'translateX(-50%)', border:'2px solid black'}}>+</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'26px'}}>♡</div><div style={{fontSize:'11px'}}>0</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'22px'}}>💬</div><div style={{fontSize:'11px'}}>0</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'20px'}}>↗</div><div style={{fontSize:'11px'}}>Share</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'22px'}}>🔥</div><div style={{fontSize:'11px'}}>0</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'16px', color:'red'}}>★</div><div style={{fontSize:'11px', color:'red', fontWeight:'bold'}}>Favorite</div></div>
</div>

<div style={{position:'absolute', left:'10px', bottom:'12px', fontWeight:'bold', fontSize:'14px'}}>Katongole Rashid ✓</div>
<div style={{position:'absolute', right:'10px', bottom:'12px'}}><div style={{background:'white', color:'black', padding:'8px 18px', borderRadius:'20px', fontSize:'13px', fontWeight:'bold'}}>✓ Joined</div></div>
</div>

<div style={{display:'flex', justifyContent:'space-around', padding:'12px 0', borderTop:'1px solid #222', alignItems:'center'}}>
<span style={{fontSize:'11px', textAlign:'center', fontWeight:'bold'}}>⌂<br/>Home</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>Live</span>
<span style={{width:'52px', height:'36px', background:'red', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'bold'}}>+</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>✉<br/>Inbox</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>You</span>
</div>
</div>
)
}
