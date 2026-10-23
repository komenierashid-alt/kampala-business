"use client"
export default function Home(){
return(
<div style={{background:'black', color:'white', minHeight:'100dvh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'fixed', top:0, left:0, right:0, bottom:0}}>

<div style={{display:'flex', justifyContent:'space-between', padding:'10px 12px', borderBottom:'1px solid #222', alignItems:'center'}}>
<div style={{display:'flex', gap:'12px', alignItems:'center'}}>
<div style={{width:'32px', height:'32px', background:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', color:'black', fontSize:'12px'}}><span style={{color:'red'}}>K</span>B</div>
<span style={{color:'white', fontWeight:'bold', borderBottom:'2px solid white', fontSize:'13px', paddingBottom:'3px'}}>For You</span>
<span style={{color:'#888', fontSize:'13px'}}>Muzika</span>
<span style={{color:'#888', fontSize:'13px'}}>Following</span>
</div>
<span>🔍</span>
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
<div style={{textAlign:'center'}}><div style={{fontSize:'20px', color:'#ff0000'}}>★</div><div style={{fontSize:'11px', color:'#ff0000', fontWeight:'bold'}}>Favorite</div></div>
</div>

<div style={{position:'absolute', left:'10px', bottom:'12px'}}>
<div style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px'}}>
<div style={{background:'white', color:'black', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', display:'flex', gap:'5px', alignItems:'center'}}>✓ Joined</div>
<div style={{background:'#222', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', border:'1px solid #444', display:'flex', gap:'5px', alignItems:'center'}}>⌂ Home</div>
</div>
<div style={{fontWeight:'bold', fontSize:'14px'}}>Katongole Rashid ✓</div>
<div style={{fontSize:'11px', color:'#777', marginTop:'2px'}}>Founder - Kampala Business</div>
</div>
</div>

<div style={{display:'flex', justifyContent:'space-around', padding:'12px 0', borderTop:'1px solid #222', background:'black', alignItems:'center'}}>
<span style={{fontSize:'11px', textAlign:'center', color:'white'}}>⌂<br/>For You</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>Live</span>
<span style={{width:'52px', height:'36px', background:'#ff0000', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'bold', color:'white'}}>+</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>✉<br/>Chat</span>
<span style={{fontSize:'11px', textAlign:'center', color:'#666'}}>○<br/>You</span>
</div>
</div>
)
}
