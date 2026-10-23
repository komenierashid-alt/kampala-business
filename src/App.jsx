"use client"
export default function Home(){
return (
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', top:0, left:0, right:0, bottom:0}}>

  {/* TOP BAR WITH KB LOGO LIKE YOUR IMAGE */}
  <div style={{display:'flex', justifyContent:'space-between', padding:'10px 12px', borderBottom:'1px solid #222', alignItems:'center'}}>
    <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
      <img src="/icon-192.png" alt="KB" style={{width:'36px', height:'36px', borderRadius:'8px'}} />
      <span style={{color:'white', fontWeight:'bold', borderBottom:'2px solid white', fontSize:'13px', paddingBottom:'3px'}}>For You</span>
      <span style={{color:'#888', fontSize:'13px'}}>Muzika</span>
      <span style={{color:'#888', fontSize:'13px'}}>Following</span>
    </div>
    <span>🔍</span>
  </div>

  {/* VIDEO FEED FULL */}
  <div style={{flex:1, background:'black', position:'relative', width:'100%'}}>
    <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'#333', fontSize:'13px'}}>Video Feed Here</div>
    
    {/* RIGHT SIDE - + FOLLOW + FIRE AFTER SHARE */}
    <div style={{position:'absolute', right:'10px', bottom:'110px', display:'flex', flexDirection:'column', gap:'18px', alignItems:'center'}}>
      <div style={{position:'relative'}}>
        <div style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px solid white', overflow:'hidden', background:'black'}}>
          <img src="/icon-192.png" style={{width:'100%', height:'100%'}} alt="KB" />
        </div>
        <div style={{background:'#ff0000', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', position:'absolute', bottom:'-6px', left:'50%', transform:'translateX(-50%)', border:'2px solid black', fontWeight:'bold', fontSize:'14px', color:'white'}}>+</div>
      </div>
      <div style={{textAlign:'center'}}><div style={{fontSize:'26px'}}>♡</div><div style={{fontSize:'11px'}}>0</div></div>
      <div style={{textAlign:'center'}}><div style={{fontSize:'22px'}}>💬</div><div style={{fontSize:'11px'}}>0</div></div>
      <div style={{textAlign:'center'}}><div style={{fontSize:'20px'}}>↗</div><div style={{fontSize:'11px'}}>Share</div></div>
      <div style={{textAlign:'center'}}><div style={{fontSize:'22px'}}>🔥</div><div style={{fontSize:'11px'}}>0</div></div>
      <div style={{textAlign:'center'}}><div style={{fontSize:'18px'}}>☆</div><div style={{fontSize:'11px'}}>Save</div></div>
    </div>

    {/* HOME BUTTON LEFT DOWN CORNER */}
    <div style={{position:'absolute', left:'10px', bottom:'12px'}}>
      <div style={{background:'#222', padding:'5px 12px', borderRadius:'20px', display:'flex', gap:'5px', alignItems:'center', marginBottom:'8px', border:'1px solid #333'}}><span>⌂</span><span style={{fontSize:'12px', fontWeight:'bold'}}>Home</span></div>
      <div style={{fontWeight:'bold', fontSize:'14px'}}>Katongole Rashid ✓</div>
      <div style={{fontSize:'11px', color:'#777', marginTop:'2px'}}>Founder - Kampala Business</div>
    </div>
  </div>

  {/* BOTTOM NAV RED BLACK WHITE */}
  <div style={{display:'flex', justifyContent:'space-around', padding:'12px 0', borderTop:'1px solid #222', background:'black', alignItems:'center'}}>
    <span style={{fontSize:'11px', textAlign:'center', color:'white'}}>⌂<br/>For You</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>Live</span>
    <span style={{width:'50px', height:'34px', background:'#ff0000', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', fontWeight:'bold', color:'white'}}>+</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>✉<br/>Chat</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>You</span>
  </div>
</div>
)
}
