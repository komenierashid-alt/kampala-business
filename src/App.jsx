"use client"
import { useState, useEffect } from "react"

export default function Home(){
const [showSplash, setShowSplash] = useState(true)

useEffect(() => {
  const timer = setTimeout(() => setShowSplash(false), 2200)
  return () => clearTimeout(timer)
}, [])

// 1. SPLASH SCREEN - FULL SCREEN KB LOGO ONLY
if(showSplash){
return(
<div style={{
  width:'100vw',
  height:'100dvh',
  background:'black',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  position:'fixed',
  top:0, left:0, right:0, bottom:0,
  zIndex:99999
}}>
  {/* YOUR LOGO FULL SCREEN */}
  <div style={{
    width:'220px',
    height:'220px',
    background:'black',
    borderRadius:'40px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    position:'relative'
  }}>
    <div style={{
      width:'160px',
      height:'180px',
      border:'8px solid white',
      borderRadius:'50% 50% 50% 50% / 60% 60% 40% 40%',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      position:'relative',
      clipPath:'path("M 80 0 C 10 0 0 60 0 80 C 0 140 80 180 80 180 C 80 180 160 140 160 80 C 160 60 150 0 80 0 Z")',
      borderBottom:'none',
      transform:'rotate(0deg)'
    }}>
      <div style={{
        position:'absolute',
        width:'100%',
        height:'100%',
        border:'7px solid white',
        borderRadius:'50% 50% 0 0 0 0',
        borderBottom:'none',
        borderLeft:'none',
        borderRight:'none',
        top:'-4px'
      }}></div>
    </div>
    <div style={{
      position:'absolute',
      top:'50%',
      left:'50%',
      transform:'translate(-50%, -55%)',
      display:'flex',
      fontWeight:'900',
      fontSize:'56px',
      letterSpacing:'-2px'
    }}>
      <span style={{color:'#ff0000'}}>K</span>
      <span style={{color:'white'}}>B</span>
    </div>
    {/* PIN SHAPE */}
    <div style={{
      position:'absolute',
      width:'140px',
      height:'160px',
      border:'7px solid white',
      borderRadius:'70px 70px 10px 10px',
      borderBottom:'none',
      top:'15px',
      borderLeft:'7px solid white',
      borderRight:'7px solid white',
      borderTop:'7px solid white',
      transform:'rotate(0deg)',
      clipPath:'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)',
      display:'none'
    }}></div>
    {/* CORRECT PIN USING SVG */}
    <svg width="180" height="190" viewBox="0 0 100 110" style={{position:'absolute'}}>
      <path d="M 50 5 C 15 5 5 30 5 45 C 5 70 50 105 50 105 C 50 105 95 70 95 45 C 95 30 85 5 50 5 Z" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
</div>
)
}

// 2. MAIN APP - AFTER SPLASH
return(
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', top:0, left:0, right:0, bottom:0}}>

<div style={{display:'flex', alignItems:'center', padding:'10px 12px', borderBottom:'1px solid #222', background:'black'}}>
<div style={{background:'#222', color:'white', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', border:'1px solid #333', display:'flex', alignItems:'center', gap:'5px', marginRight:'24px'}}><span style={{width:'7px', height:'7px', background:'#ff0000', borderRadius:'50%', display:'inline-block'}}></span>Live</div>
<span style={{color:'white', fontWeight:'bold', borderBottom:'2px solid white', fontSize:'13px', paddingBottom:'3px', marginRight:'20px'}}>For You</span>
<span style={{color:'#888', fontSize:'13px', marginRight:'20px'}}>Muzika</span>
<span style={{color:'#888', fontSize:'13px'}}>Following</span>
<div style={{marginLeft:'auto', fontSize:'18px'}}>🔍</div>
</div>

<div style={{flex:1, background:'black', position:'relative'}}>
<div style={{position:'absolute', right:'10px', bottom:'110px', display:'flex', flexDirection:'column', gap:'18px', alignItems:'center'}}>
<div style={{position:'relative'}}>
<div style={{width:'52px', height:'52px', borderRadius:'50%', border:'2px solid white', background:'white', color:'black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}><span style={{color:'red'}}>K</span>B</div>
<div style={{background:'#ff0000', color:'white', width:'22px', height:'22px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', position:'absolute', bottom:'-7px', left:'50%', transform:'translateX(-50%)', border:'2px solid black', fontWeight:'bold'}}>+</div>
</div>
<div style={{textAlign:'center'}}><div style={{fontSize:'26px'}}>♡</div><div style={{fontSize:'11px'}}>0</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'22px'}}>💬</div><div style={{fontSize:'11px'}}>0</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'20px'}}>↗</div><div style={{fontSize:'11px'}}>Share</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'22px'}}>🔥</div><div style={{fontSize:'11px'}}>0</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:'16px', color:'#ff0000'}}>★</div><div style={{fontSize:'11px', color:'#ff0000', fontWeight:'bold'}}>Favorite</div></div>
</div>

<div style={{position:'absolute', left:'10px', bottom:'60px'}}>
<div style={{fontWeight:'bold', fontSize:'14px'}}>Katongole Rashid ✓</div>
</div>

<div style={{position:'absolute', right:'10px', bottom:'14px'}}>
<div style={{background:'white', color:'black', padding:'8px 18px', borderRadius:'20px', fontSize:'13px', fontWeight:'bold'}}>✓ Joined</div>
</div>
</div>

<div style={{display:'flex', justifyContent:'space-around', padding:'12px 0', borderTop:'1px solid #222', background:'black', alignItems:'center'}}>
<span style={{fontSize:'11px', textAlign:'center', color:'white', fontWeight:'bold'}}>⌂<br/>Home</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>Live</span>
<span style={{width:'52px', height:'36px', background:'#ff0000', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'bold', color:'white'}}>+</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>✉<br/>Inbox</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>You</span>
</div>
</div>
)
}
