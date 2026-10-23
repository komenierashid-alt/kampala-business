"use client"
export default function Home(){
return (
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', top:0, left:0, right:0, bottom:0}}>

  {/* TOP BAR - FULL WIDTH */}
  <div style={{display:'flex', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px solid #222', width:'100%', boxSizing:'border-box'}}>
    <div style={{display:'flex', gap:'14px', alignItems:'center'}}>
      <div style={{width:'34px', height:'34px', background:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', color:'black'}}><span style={{color:'red'}}>K</span>B</div>
      <span style={{color:'white', fontWeight:'bold', borderBottom:'2px solid white', fontSize:'14px', paddingBottom:'3px'}}>For You</span>
      <span style={{color:'#888', fontSize:'13px'}}>Muzika</span>
      <span style={{color:'#888', fontSize:'13px'}}>Following</span>
    </div>
    <span>🔍</span>
  </div>

  {/* VIDEO FEED - FULL SCREEN HEIGHT */}
  <div style={{flex:1, background:'#000', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'100%'}}>
    <p style={{color:'#333', fontSize:'14px'}}>Video Feed Here</p>
    
    {/* RIGHT BUTTONS - FULL EDGE */}
    <div style={{position:'absolute', right:'10px', bottom:'110px', display:'flex', flexDirection:'column', gap:'20px', alignItems:'center', textAlign:'center'}}>
      
      {/* PROFILE + RED PLUS */}
      <div style={{position:'relative'}}>
        <div style={{width:'52px', height:'52px', borderRadius:'50%', border:'2px solid white', background:'white', color:'black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>KB</div>
        <div style={{background:'#ff0000', color:'white', width:'22px', height:'22px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', fontWeight:'bold', position:'absolute', bottom:'-8px', left:'50%', transform:'translateX(-50%)', border:'2px solid black'}}>+</div>
      </div>

      <div style={{marginTop:'8px'}}><span style={{fontSize:'28px'}}>♡</span><br/><span style={{fontSize:'11px'}}>0</span></div>
      <div><span style={{fontSize:'26px'}}>💬</span><br/><span style={{fontSize:'11px'}}>0</span></div>
      <div><span style={{fontSize:'20px'}}>↗</span><br/><span style={{fontSize:'11px'}}>Share</span></div>
      <div><span style={{fontSize:'24px'}}>🔥</span><br/><span style={{fontSize:'11px'}}>0</span></div>
      <div><span style={{fontSize:'20px'}}>☆</span><br/><span style={{fontSize:'11px'}}>Save</span></div>
    </div>

    {/* BOTTOM LEFT - HOME + USER */}
    <div style={{position:'absolute', left:'12px', bottom:'16px'}}>
      <div style={{display:'flex', alignItems:'center', gap:'6px', background:'rgba(40,40,40,0.8)', padding:'6px 12px', borderRadius:'20px', width:'fit-content', marginBottom:'10px'}}>
        <span>⌂</span><span style={{fontSize:'12px', fontWeight:'bold'}}>Home</span>
      </div>
      <div style={{fontWeight:'bold', fontSize:'15px'}}>Katongole Rashid ✓</div>
      <div style={{fontSize:'12px', color:'#888', marginTop:'3px'}}>Founder - Kampala Business</div>
    </div>
  </div>

  {/* BOTTOM NAV - FULL WIDTH */}
  <div style={{display:'flex', justifyContent:'space-around', padding:'12px 0', borderTop:'1px solid #222', background:'black', alignItems:'center', width:'100%', boxSizing:'border-box'}}>
    <span style={{fontSize:'11px', textAlign:'center', color:'white', fontWeight:'bold'}}>⌂<br/>For You</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#777'}}>○<br/>Live</span>
    <span style={{width:'52px', height:'36px', background:'#ff0000', color:'white', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', fontSize:'28px', fontWeight:'bold'}}>+</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#777'}}>✉<br/>Chat</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#777'}}>○<br/>You</span>
  </div>
</div>
)
}
