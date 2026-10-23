"use client"
export default function Home(){
return(
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', top:0, left:0, right:0, bottom:0}}>

{/* TOP - KB REMOVED, LIVE AT LEFT */}
<div style={{display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px', borderBottom:'1px solid #222', background:'black', overflowX:'auto', whiteSpace:'nowrap'}}>
<div style={{background:'#222', color:'white', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', border:'1px solid #333', display:'flex', alignItems:'center', gap:'5px', flexShrink:0}}><span style={{width:'7px', height:'7px', background:'#ff0000', borderRadius:'50%', display:'inline-block'}}></span>Live</div>
<span style={{color:'white', fontWeight:'bold', borderBottom:'2px solid white', fontSize:'13px', paddingBottom:'3px'}}>For You</span>
<span style={{color:'#888', fontSize:'13px'}}>Muzika</span>
<span style={{color:'#888', fontSize:'13px'}}>Following</span>
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

<div style={{position:'absolute', left:'10px', bottom:'12px', display:'flex', alignItems:'center', gap:'10px'}}>
<div>
<div style={{fontWeight:'bold', fontSize:'14px'}}>Katongole Rashid ✓</div>
<div style={{fontSize:'11px', color:'#777', marginTop:'3px'}}>Founder - Kampala Business</div>
</div>
</div>

<div style={{position:'absolute', right:'10px', bottom:'12px'}}>
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
