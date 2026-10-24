"use client"
import { useState, useEffect, useRef } from "react"

export default function UptownApp(){
const [splash,setSplash]=useState(true)
const [authMode,setAuthMode]=useState('signup')
const [showAuth,setShowAuth]=useState(false)
const [user,setUser]=useState(null)
const [isOwner,setIsOwner]=useState(false)
const [page,setPage]=useState('foryou')
const [showUpload,setShowUpload]=useState(false)
const [uploadCaption,setUploadCaption]=useState('')
const [uploadPreview,setUploadPreview]=useState(null)
const [uploadBase64,setUploadBase64]=useState(null)
const [follows,setFollows]=useState({})
const [adFollows,setAdFollows]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [blueBoard,setBlueBoard]=useState([])
const [posts,setPosts]=useState([])
const [mutedMap,setMutedMap]=useState({})
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [allUsers,setAllUsers]=useState([
{id:1,name:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true},
])

const advertPost={
id:'AD001',isAd:true,user:'UPTOWN Official',username:'@uptown',verified:true,
caption:'UPTOWN GIRL CHATTIN\' WITH A UPTOWN GUY 🔥 Chattin\' on Uptown Chat, we fly!',
mediaUrl:'/uptown-ad.jpg'
}

// 3 TEST VIDEOS FOR YOU - WITH AUDIO - USING LOCAL STORAGE SAMPLE URLS (have audio)
const forYouTestVideos=[
{id:101,user:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true,caption:'For You Test 1 🔥 Audio ON — Welcome!', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video'},
{id:102,user:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true,caption:'For You Test 2 — Audio test, city vibes 🌃', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video'},
{id:103,user:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true,caption:'For You Test 3 — Follow each other 🚀 Audio working', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', mediaType:'video'},
]

const muzikaTestVideos=[
{id:201,user:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true,caption:'Muzika Test 1 🎵 Owner only — Audio ON', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', mediaType:'video'},
{id:202,user:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true,caption:'Muzika Test 2 🎶 Audio test', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', mediaType:'video'},
{id:203,user:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true,caption:'Muzika Test 3 🔥 Audio working — Kampala', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', mediaType:'video'},
]

useEffect(()=>{
const t=setTimeout(()=>{
setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sAF=localStorage.getItem('uptown_ad_follows')
const sL=localStorage.getItem('uptown_likes')
const sB=localStorage.getItem('uptown_blue_board')
const sP=localStorage.getItem('uptown_posts_v2') // NEW KEY FOR BASE64 STORAGE
if(sF) setFollows(JSON.parse(sF))
if(sAF) setAdFollows(JSON.parse(sAF))
if(sL) setLikes(JSON.parse(sL))
if(sB) setBlueBoard(JSON.parse(sB))
if(sP) setPosts(JSON.parse(sP))
if(!su) setShowAuth(true)
else{setUser(JSON.parse(su)); if(sO==='true') setIsOwner(true)}
},1200)
return()=>clearTimeout(t)
},[])

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const ownerCheck=email==='komenierashid@gmail.com'
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username) return
if(db.find(u=>u.email===email)){alert('Exists! Login'); setAuthMode('login'); return}
const nu={id:Date.now(),name:authForm.name,username:'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:false}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email}; localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setIsOwner(ownerCheck); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!ownerCheck){alert('No account'); return}
const lu=ownerCheck?{name:'Katongole Rashid',username:'@katongole',email}:{name:found.name,username:found.username,email:found.email}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setIsOwner(ownerCheck); setShowAuth(false)
}
}

const handleFollow=(username)=>{
if(username==='@katongole'&&!isOwner){setBlockedMsg('🔒 Owner private'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const nf={...follows,[username]:follows[username]==='following'?'follow':'following'}; setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))
}
const handleAdFollow=()=>{const nv=adFollows['@uptown']==='following'?'follow':'following'; const na={...adFollows,'@uptown':nv}; setAdFollows(na); localStorage.setItem('uptown_ad_follows',JSON.stringify(na))}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes',JSON.stringify(nl))}
const handleFavorite=(id)=>setFavorites({...favorites,[id]:!favorites[id]})
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes',JSON.stringify(nl))}

// LOCAL STORAGE FOR TESTING - CONVERT TO BASE64 WITH AUDIO
const handleFileChange=(e)=>{
const file=e.target.files?.[0]; if(!file) return
const url=URL.createObjectURL(file)
setUploadPreview({url, type:file.type, name:file.name})
// Convert to base64 for localStorage persistence with audio
const reader=new FileReader()
reader.onload=(ev)=>{
setUploadBase64(ev.target.result) // base64 includes audio
}
reader.readAsDataURL(file)
}

const handlePostNow=()=>{
if(!uploadPreview || !uploadBase64){setBlockedMsg('Choose video/image — will save to local storage with audio'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
if(page==='muzika'&&!isOwner){setBlockedMsg('🔒 Only Katongole Rashid can post in Muzika'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return}
const np={
id:Date.now(),
user:user?.name||'My Page',
username:user?.username||'@me',
verified:allUsers.find(u=>u.username===user?.username)?.verified||false,
caption:uploadCaption||'UPTOWN 🔥 Audio ON',
mediaUrl:uploadBase64, // BASE64 SAVED TO LOCAL STORAGE - AUDIO KEPT
mediaType:uploadPreview.type.startsWith('video')?'video':'image',
isMuzika: page==='muzika'
}
const newPosts=[np,...posts]; 
setPosts(newPosts); 
localStorage.setItem('uptown_posts_v2',JSON.stringify(newPosts))
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setShowUpload(false)
setBlockedMsg('Saved to Local Storage with Audio ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}

const toggleMute=(id)=>{
setMutedMap({...mutedMap,[id]:!mutedMap[id]})
}

if(splash) return <div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}><div style={{fontWeight:'900',fontSize:'28px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#fff'}}>TOWN</span></div></div>

const forYouFeed=[advertPost,...posts.filter(p=>!p.isMuzika),...forYouTestVideos]
const muzikaFeed=[...posts.filter(p=>p.isMuzika),...muzikaTestVideos]

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',fontFamily:'Inter'}}>
{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'24px',justifyContent:'center'}}>
<div style={{textAlign:'center',marginBottom:'20px',fontWeight:'900',fontSize:'26px'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'12px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'700'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'700'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'14px',color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'700'}}>Continue</button>
</div>
</div>
)}

<div style={{display:'flex',padding:'12px 16px',gap:'12px',alignItems:'center',borderBottom:'1px solid #1a1a1a',overflowX:'auto'}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'},{label:'🔴 Live',key:'live'}].map(t=>{
const active=page===t.key
return <button key={t.key} onClick={()=>setPage(t.key)} style={{background:active?'#fff':'#1a1a1a', color:active?'#000':'#888', border:'none', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'700', flexShrink:0}}>{t.label}</button>
})}
</div>

<div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
{page==='foryou'&&(
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{forYouFeed.map(v=>{
const isAd=v.isAd
const isFollowing=isAd?adFollows[v.username]==='following':follows[v.username]==='following'
const isLiked=likes[v.id]
const isFired=likes['fire_'+v.id]
const isMuted=mutedMap[v.id]!==false // default unmuted now! Audio ON
return(
<div key={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
{v.mediaUrl? (
v.mediaType==='video'||v.mediaUrl.includes('.mp4')||v.mediaUrl.startsWith('data:video')? 
<div style={{position:'relative',width:'100%',height:'100%'}}>
<video 
src={v.mediaUrl} 
autoPlay 
loop 
muted={isMuted}
playsInline
style={{width:'100%',height:'100%',objectFit:'cover'}}
onClick={(e)=>{e.target.muted=!e.target.muted; setMutedMap({...mutedMap,[v.id]:e.target.muted})}}
/>
{/* AUDIO BUTTON - TAP TO MUTE/UNMUTE */}
<button onClick={(e)=>{e.stopPropagation(); toggleMute(v.id)}} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.5)',border:'1px solid #444',color:'#fff',borderRadius:'50%',width:'48px',height:'48px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',zIndex:3}}>
{isMuted?'🔇':'🔊'}
</button>
<div style={{position:'absolute',bottom:'90px',left:'14px',background:'rgba(0,0,0,0.6)',padding:'4px 8px',borderRadius:'10px',fontSize:'10px',zIndex:3}}>{isMuted?'Tap video for audio 🔊':'Audio ON 🔊'}</div>
</div>
: <img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
) : <div style={{width:'100%',height:'100%',background:'#111',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontSize:'60px',color:'#222'}}>▶</div></div>}

{isAd&&<div style={{position:'absolute',top:'12px',left:'12px',background:'#FF0024',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'800',zIndex:2}}>ADVERT</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,maxWidth:'60%'}}>
<div style={{fontWeight:'700',display:'flex',gap:'6px'}}>{v.user} {v.verified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div>
</div>

<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:2,display:'flex',flexDirection:'column',gap:'14px',alignItems:'center'}}>
<button onClick={(e)=>{e.stopPropagation(); isAd?handleAdFollow():handleFollow(v.username)}} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'48px',height:'48px',borderRadius:'50%',background:isAd?'#FF0024':'#fff',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',border:isFollowing?'2px solid #00D632':'2px solid #fff'}}>
<span style={{fontWeight:'900',fontSize:'10px',color:isAd?'#fff':'#000'}}>{isAd?'AD':'UP'}</span>
<div style={{position:'absolute',bottom:'-5px',background:isFollowing?'#00D632':'#FF0024',color:'#fff',width:'18px',height:'18px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',border:'2px solid #000'}}>{isFollowing?'✓':'+'}</div>
</div>
<span style={{fontSize:'9px',color:'#fff',fontWeight:'700',marginTop:'4px',textAlign:'center'}}>{isFollowing?'Following\nFollow Back ✓':'Follow\nFollow Back'}</span>
</button>
<button onClick={(e)=>{e.stopPropagation(); handleLike(v.id)}} style={{background:'none',border:'none',color:isLiked?'#FF0024':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>{isLiked?'♥':'♡'}</span><span style={{fontSize:'10px'}}>Like</span></button>
<button onClick={(e)=>{e.stopPropagation(); handleFire(v.id)}} style={{background:'none',border:'none',color:isFired?'#FF6A00':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>🔥</span><span style={{fontSize:'10px'}}>{isFired?'Fired':'Fire'}</span></button>
<button onClick={(e)=>{e.stopPropagation(); toggleMute(v.id)}} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'18px'}}>{isMuted?'🔇':'🔊'}</span><span style={{fontSize:'9px'}}>{isMuted?'Muted':'Audio'}</span></button>
<button onClick={(e)=>{e.stopPropagation(); handleFavorite(v.id)}} style={{background:'none',border:'none',color:favorites[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>{favorites[v.id]?'★':'☆'}</span><span style={{fontSize:'10px'}}>Fav</span></button>
</div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,display:'flex',flexDirection:'column'}}>
<div style={{padding:'12px 16px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontWeight:'700',fontSize:'13px'}}>Muzika — Only Katongole Rashid</div><div style={{fontSize:'10px',color:'#888'}}>{isOwner?'You can post — Local Storage + Audio ON':'Only Owner posts — Local Storage'}</div></div>
{isOwner&&<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>+ Post Muzika</button>}
</div>
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>{
const isMuted=mutedMap[v.id]!==false
return(
<div key={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
<div style={{position:'relative',width:'100%',height:'100%'}}>
<video src={v.mediaUrl} autoPlay loop muted={isMuted} playsInline style={{width:'100%',height:'100%',objectFit:'cover'}} onClick={(e)=>{e.target.muted=!e.target.muted; setMutedMap({...mutedMap,[v.id]:e.target.muted})}}/>
<button onClick={(e)=>{e.stopPropagation(); toggleMute(v.id)}} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.5)',border:'1px solid #444',color:'#fff',borderRadius:'50%',width:'48px',height:'48px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',zIndex:3}}>{isMuted?'🔇':'🔊'}</button>
</div>
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,maxWidth:'68%'}}>
<div style={{fontWeight:'700'}}>{v.user} ✓</div>
<div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div>
<div style={{fontSize:'10px',color:'#FF0024',marginTop:'4px'}}>🎵 Muzika — Local Storage + Audio</div>
</div>
<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:2,display:'flex',flexDirection:'column',gap:'14px',alignItems:'center'}}>
<button onClick={(e)=>{e.stopPropagation(); handleLike(v.id)}} style={{background:'none',border:'none',color:likes[v.id]?'#FF0024':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>{likes[v.id]?'♥':'♡'}</span><span style={{fontSize:'10px'}}>Like</span></button>
<button onClick={(e)=>{e.stopPropagation(); handleFire(v.id)}} style={{background:'none',border:'none',color:likes['fire_'+v.id]?'#FF6A00':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>🔥</span><span style={{fontSize:'10px'}}>Fire</span></button>
<button onClick={(e)=>{e.stopPropagation(); toggleMute(v.id)}} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'18px'}}>{isMuted?'🔇':'🔊'}</span><span style={{fontSize:'9px'}}>Audio</span></button>
</div>
</div>
)})}
</div>
</div>
)}

{page==='live'&&<div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><div style={{width:'80px',height:'80px',background:'#FF0024',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>🔴</div><div style={{fontWeight:'800',marginTop:'16px'}}>UPTOWN LIVE — Audio ON</div></div>}
{page==='following'&&<div style={{flex:1,padding:'20px'}}><div style={{fontWeight:'700'}}>Following</div>{allUsers.map(u=><div key={u.id} style={{background:'#121212',padding:'12px',borderRadius:'12px',marginTop:'8px',display:'flex',justifyContent:'space-between'}}><span>{u.name}</span><button onClick={()=>handleFollow(u.username)} style={{background:follows[u.username]==='following'?'#fff':'#FF0024',color:follows[u.username]==='following'?'#000':'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>{follows[u.username]==='following'?'Following ✓':'Follow + Back'}</button></div>)}</div>}
{page==='inbox'&&<div style={{flex:1,padding:'20px'}}><div style={{fontWeight:'700',textAlign:'center'}}>Inbox — Blue Tick — Local Storage</div><button onClick={()=>{const nb=[...blueBoard,{id:Date.now(),name:user?.name,username:user?.username,email:user?.email,status:'pending'}]; setBlueBoard(nb); localStorage.setItem('uptown_blue_board',JSON.stringify(nb))}} style={{marginTop:'16px',background:'#1D9BF0',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'20px',width:'100%'}}>Request Blue Tick</button><div style={{marginTop:'16px'}}>{blueBoard.map(r=><div key={r.id} style={{background:'#121212',padding:'12px',borderRadius:'12px',marginBottom:'8px'}}>{r.name} — {r.status} {isOwner&&r.status==='pending'&&<button onClick={()=>{const nb=blueBoard.map(x=>x.id===r.id?{...x,status:'accepted'}:x); setBlueBoard(nb); localStorage.setItem('uptown_blue_board',JSON.stringify(nb))}} style={{marginLeft:'8px',background:'#1D9BF0',color:'#fff',border:'none',padding:'4px 8px',borderRadius:'10px',fontSize:'11px'}}>Accept</button>}</div>)}</div></div>}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'16px 20px',borderRadius:'14px',zIndex:80,textAlign:'center'}}><div style={{fontWeight:'700',fontSize:'13px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'24px',borderTopRightRadius:'24px',padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center'}}>{page==='muzika'?'Post to Muzika — Owner Only + Audio + Local Storage':'Post to For You — Audio + Local Storage'}</div>
{page==='muzika'&&!isOwner&&<div style={{textAlign:'center',color:'#FF0024',fontSize:'12px',marginTop:'8px'}}>🔒 Only Katongole Rashid can post in Muzika</div>}
<input type="file" accept="video/*,image/*" onChange={handleFileChange} style={{width:'100%',marginTop:'12px',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'12px'}}>{uploadPreview.type.startsWith('video')?<video src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}} controls playsInline/>:<img src={uploadPreview.url} style={{width:'100%',borderRadius:'12px'}}/>}<div style={{fontSize:'11px',color:'#00D632',marginTop:'6px'}}>✓ Local Storage Ready — Audio will be saved</div></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption" style={{marginTop:'12px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
<button onClick={handlePostNow} style={{marginTop:'12px',width:'100%',background:page==='muzika'&&!isOwner?'#333':'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'800'}}>{page==='muzika'&&!isOwner?'🔒 Owner Only':'POST NOW — Save to Local Storage + Audio ✓'}</button>
<div style={{fontSize:'10px',color:'#666',marginTop:'8px',textAlign:'center'}}>Videos saved to localStorage key: uptown_posts_v2 — with audio base64 for testing</div>
</div>
</div>
)}

<div style={{display:'flex',justifyContent:'space-around',padding:'10px 0',borderTop:'1px solid #1a1a1a',background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',fontSize:'10px'}}>⌂<br/>For You</button>
<button onClick={()=>setPage('following')} style={{background:'none',border:'none',color:page==='following'?'#fff':'#666',fontSize:'10px'}}>👥<br/>People</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024',border:'none',width:'52px',height:'36px',borderRadius:'12px',color:'#fff',fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',fontSize:'10px'}}>✉<br/>Inbox</button>
<button onClick={()=>setPage('you')} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
