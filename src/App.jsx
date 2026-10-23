"use client"
export default function Home(){
return (
<div style={{background:'black', color:'white', minHeight:'100vh', maxWidth:'430px', margin:'0 auto', display:'flex', flexDirection:'column', fontFamily:'sans-serif'}}>

  {/* TOP BAR - BLACK & WHITE */}
  <div style={{display:'flex', justifyContent:'space-between', padding:'14px 12px', borderBottom:'1px solid #222'}}>
    <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
      <div style={{background:'white', color:'black', width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>KB</div>
      <span style={{color:'white', fontWeight:'bold', borderBottom:'2px solid white', fontSize:'13px', paddingBottom:'3px'}}>For You</span>
      <span style={{color:'#888', fontSize:'13px'}}>Muzika</span>
      <span style={{color:'#888', fontSize:'13px'}}>Following</span>
    </div>
    <span style={{fontSize:'18px'}}>🔍</span>
  </div>

  {/* VIDEO FEED - NO FAKE BANNER */}
  <div style={{flex:1, background:'#111', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'600px'}}>
    <p style={{color:'#444', fontSize:'14px'}}>Video Feed Here</p>
    
    {/* RIGHT BUTTONS - WHITE */}
    <div style={{position:'absolute', right:'12px', bottom:'90px', display:'flex', flexDirection:'column', gap:'20px', textAlign:'center'}}>
      <div>
        <div style={{width:'50px', height:'50px', background:'white', borderRadius:'50%', color:'black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>K</div>
      </div>
      <div><span style={{fontSize:'28px'}}>♡</span><br/><span style={{fontSize:'11px'}}>0</span></div>
      <div><span style={{fontSize:'24px'}}>💬</span><br/><span style={{fontSize:'11px'}}>0</span></div>
      <div><span style={{fontSize:'24px'}}>↗</span><br/><span style={{fontSize:'11px'}}>0</span></div>
    </div>

    {/* USER INFO - BOTTOM LEFT */}
    <div style={{position:'absolute', left:'12px', bottom:'15px'}}>
      <div style={{fontWeight:'bold', fontSize:'15px'}}>Katongole Rashid</div>
      <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>Founder - Kampala Business</div>
    </div>
  </div>

  {/* BOTTOM NAV - RED BLACK WHITE */}
  <div style={{display:'flex', justifyContent:'space-around', padding:'14px 8px', borderTop:'1px solid #222', background:'black', alignItems:'center'}}>
    <span style={{fontSize:'11px', textAlign:'center', color:'white', fontWeight:'bold'}}>⌂<br/>For You</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#888'}}>○<br/>Live</span>
    
    {/* + BUTTON - RED COLOR */}
    <span style={{width:'48px', height:'36px', background:'#ff0000', color:'white', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', fontSize:'28px', fontWeight:'bold'}}>+</span>
    
    <span style={{fontSize:'11px', textAlign:'center', color:'#888'}}>✉<br/>Chat</span>
    <span style={{fontSize:'11px', textAlign:'center', color:'#888'}}>○<br/>You</span>
  </div>
</div>
)
}
