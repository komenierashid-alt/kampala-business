"use client"
import { useState, useEffect } from "react"

export default function Home(){
const [splash, setSplash] = useState(true)
useEffect(()=>{ setTimeout(()=>setSplash(false), 3000) },[])

if(splash){
return(
<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}>
<style>{`
@keyframes spinScale {
  0% { transform: rotate(-180deg) scale(0); opacity: 0; }
  60% { transform: rotate(20deg) scale(1.2); opacity: 1; }
  100% { transform: rotate(0deg) scale(1); opacity: 1; }
}
@keyframes textShine {
  0% { opacity: 0; letter-spacing: 20px; transform: translateY(20px); }
  100% { opacity: 1; letter-spacing: -1px; transform: translateY(0); }
}
@keyframes glowPulse {
  0%,100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255,0,0,0.3)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(255,0,0,0.7)); }
}
@keyframes bgZoom {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes out {
  to { opacity: 0; transform: scale(1.3); }
}
.anim-bg { animation: bgZoom 0.6s ease-out; }
.anim-pin { animation: spinScale 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.anim-text { animation: textShine 0.8s ease-out 0.7s forwards, glowPulse 1.5s ease-in-out 1.5s infinite; opacity: 0; }
.anim-out { animation: out 0.5s ease-in 2.5s forwards; }
`}</style>

  <div className="anim-out" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
    <svg width="90vw" height="90vh" viewBox="0 0 200 230" style={{maxWidth:'550px', overflow:'visible'}} className="anim-bg">
      <g className="anim-pin">
        <path d="M100 10 C30 10 10 50 10 80 C10 125 100 220 100 220 C100 220 190 125 190 80 C190 50 170 10 100 10 Z" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g className="anim-text">
        <text x="22" y="110" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="38" letterSpacing="-1">
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
