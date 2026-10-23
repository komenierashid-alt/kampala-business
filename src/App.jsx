"use client"
export default function Home(){
return (
<div style={{background:'black', color:'white', minHeight:'100vh', maxWidth:'430px', margin:'0 auto', display:'flex', flexDirection:'column', fontFamily:'sans-serif'}}>

  {/* TOP BAR - WITH KB LOGO */}
  <div style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid #222'}}>
    <div style={{display:'flex', gap:'14px', alignItems:'center'}}>
      <img src="/icon-192.png" alt="KB" style={{width:'34px', height:'34px', borderRadius:'7px', background:'black'}} 
      onError={(e)=>{e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='flex'}} />
      {/* Fallback if logo not uploaded yet */}
      <div style={{display:'none', width:'34px', height:'34px', background:'white', borderRadius:'50%', color:'black', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'14px'}}><span style={{color:'red'}}>K</span>B</div>
      <span style={{color:'white', fontWeight:'bold', borderBottom:'2px solid white', fontSize:'13px', paddingBottom:'3px'}}>For You</span>
      <span style={{color:'#888', fontSize:'13px'}}>Muzika</span>
      <span style={{color:'#888', fontSize:'13px'}}>Following</span>
    </div>
    <span style={{fontSize:'18px'}}>🔍</span>
  </div>

  {/* VIDEO FEED */}
  <div style={{flex:1, background:'#111', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'620px'}}>
    <p style={{color:'#444', fontSize:'14px'}}>Video Feed Here</p>
    
    {/* RIGHT SIDE BUTTONS */}
    <div style={{position:'absolute', right:'10px', bottom:'100px', display:'flex', flexDirection:'column', gap:'18px', alignItems:'center', textAlign:'center'}}>
      
      {/* PROFILE + FOLLOW + SIGN */}
      <div style={{position:'relative'}}>
        <div style={{width:'50px', height:'50px', borderRadius:'50%', overflow:'hidden', border:'2px solid white', background:'black'}}>
          <img src="/icon-192.png" alt="K" style={{width:'100%', height:'100%', objectFit:'cover'}} />
        </div>
        <div style={{background:'#ff0000', color:'white', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'bold', position:'absolute', bottom:'-7px', left:'50%', transform:'translateX(-50%)', border:'2px solid black'}}>+</div>
      </div>

      <div style={{marginTop:'6px'}}><span style={{fontSize:'26px'}}>♡</span><br/><span style={{fontSize:'11px', color:'#ccc'}}>0</span></div>
      <div><span style={{fontSize:'22px'}}>💬</span><br/><span style={{fontSize:'11px', color:'#ccc'}}>0</span></div>
      <div><span style={{fontSize:'20px'}}>↗</span><br/><span style={{fontSize:'11px', color:'#ccc'}}>Share</span></div>
      {/* FIRE AFTER SHARE */}
      <div><span style={{fontSize:'22px'}}>🔥</span><br/><span style={{fontSize:'11px', color:'#ccc'}}>0</span></div>
      <div><span style={{fontSize:'20px'}}>☆</span><br/><span style={{fontSize:'11px', color:'#ccc'}}>Save</span></div>
    </div>

    {/* BOTTOM LEFT - HOME BUTTON + INFO */}
    <div style={{position:'absolute', left:'10px', bottom:'12px', display:'flex', flexDirection:'column', gap:'6px'}}>
      <div style={{display:'flex', alignItems:'center', gap:'5px', background:'rgba(0,0,0,0.7)', padding:'5px 10px', borderRadius:'20px', border:'1px solid #333', width:'fit-content'}}>
        <span style={{fontSize:'14px'}}>⌂</span><span style={{fontSize:'12px', fontWeight:'bold'}}>Home</span>
      </div>
      <div style={{fontWeight:'bold', fontSize:'14px', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px'}}>Katongole Rashid <span style={{background:'white', color:'black', borderRadius:'50%', width:'14px', height:'14px', fontSize:'9px', display:'flex', alignItems:'center', justifyContent:'center'}}>✓</span></div>
      <div style={{fontSize:'12px', color:'#888'}}>Founder - Kampala Business</div>
    </div>
  </div>

  {/* BOTTOM NAV - RED BLACK WHITE */}
  <div style={{display:'flex', justifyContent:'space-around', padding:'12px 8px', borderTop:'1px solid #222', background:'black', alignItems:'center'}}>
    <span style={{fontSize:'11px', textAlign:'center', color:'white', fontWeight:'bold'}}>⌂<br/>For You</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#777'}}>○<br/>Live</span>
    <span style={{width:'50px', height:'34px', background:'#ff0000', color:'white', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', fontSize:'26px', fontWeight:'bold'}}>+</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#777'}}>✉<br/>Chat</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#777'}}>○<br/>You</span>
  </div>
</div>
)
}
