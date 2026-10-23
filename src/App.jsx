"use client"
export default function Home(){
return(
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', top:0, left:0, right:0, bottom:0}}>

<div style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 10px', borderBottom:'1px solid #222', background:'black', overflowX:'auto', whiteSpace:'nowrap'}}>
<div style={{width:'32px', height:'32px', background:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', color:'black', fontSize:'12px', flexShrink:0}}><span style={{color:'red'}}>K</span>B</div>
<span style={{color:'white', fontWeight:'bold', borderBottom:'2px solid white', fontSize:'13px', paddingBottom:'3px'}}>For You</span>
<span style={{color:'#888', fontSize:'13px'}}>Muzika</span>
<span style={{color:'#888', fontSize:'13px'}}>Following</span>
<div style={{background:'white', color:'black', padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'bold', marginLeft:'4px'}}>✓ Joined</div>
<div style={{background:'#222', color:'white', padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'bold', border:'1px solid #333', display:'flex', alignItems:'center', gap:'4px'}}><span style={{width:'6px', height:'6px', background:'#ff0000', borderRadius:'50%', display:'inline-block'}}></span>Live</div>
<div style={{marginLeft:'auto', fontSize:'18px'}}>🔍</div>
</div>

<div style={{flex:1, background:'black', position:'relative', width:'100%'}}>
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

{/* REMOVED HOME BUTTON HERE - ONLY NAME NOW */}
<div style={{position:'absolute', left:'10px', bottom:'12px'}}>
<div style={{fontWeight:'bold', fontSize:'14px'}}>Katongole Rashid ✓</div>
<div style={{fontSize:'11px', color:'#777', marginTop:'3px'}}>Founder - Kampala Business</div>
</div>
</div>

{/* BOTTOM NAV - NOW HOME AT LEFT CORNER, NOT FOR YOU */}
<div style={{display:'flex', justifyContent:'space-around', padding:'12px 0', borderTop:'1px solid #222', background:'black', alignItems:'center'}}>
<span style={{fontSize:'11px', textAlign:'center', color:'white', fontWeight:'bold'}}>⌂<br/>Home</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>Live</span>
<span style={{width:'52px', height:'36px', background:'#ff0000', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'bold', color:'white'}}>+</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>✉<br/>Chat</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>You</span>
</div>
</div>
)
}
