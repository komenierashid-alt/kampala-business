"use client"
import { useState, useEffect } from "react"

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
const [follows,setFollows]=useState({})
const [adFollows,setAdFollows]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [blueBoard,setBlueBoard]=useState([])
const [notifications,setNotifications]=useState([])
const [posts,setPosts]=useState([])
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [chatUser,setChatUser]=useState(null)
const [allUsers,setAllUsers]=useState([
{id:1,name:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true,followers:12400},
{id:2,name:'Sheilah G',username:'@sheilah',verified:false,followers:892},
{id:3,name:'DJ Nimrod',username:'@nimrod',verified:false,followers:2100},
])

const advertPost={
id:'AD001',isAd:true,user:'UPTOWN Official',username:'@uptown',verified:true,
caption:'UPTOWN GIRL CHATTIN\' WITH A UPTOWN GUY 🔥 Chattin\' on Uptown Chat, we fly! Connect, chat, city lights!',
mediaUrl:'/uptown-ad.jpg'
}

const defaultVideos=[
{id:1,user:'Katongole Rashid',username:'@katongole',verified:true,isOwner:true,caption:'Welcome to UPTOWN 🔥 Follow each other! #Uptown'},
]

useEffect(()=>{
const t=setTimeout(()=>{
setSplash(false)
const su=localStorage.getItem('uptown_user')
const sU=localStorage.getItem('uptown_all_users')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sAF=localStorage.getItem('uptown_ad_follows')
const sL=localStorage.getItem('uptown_likes')
const sB=localStorage.getItem('uptown_blue_board')
const sP=localStorage.getItem('uptown_posts')
if(sU) setAllUsers(JSON.parse(sU))
if(sF) setFollows(JSON.parse(sF))
if(sAF) setAdFollows(JSON.parse(sAF))
if(sL) setLikes(JSON.parse(sL))
if(sB) setBlueBoard(JSON.parse(sB))
if(sP) setPosts(JSON.parse(sP))
if(!su) setShowAuth(true)
else{setUser(JSON.parse(su)); if(sO==='true') setIsOwner(true)}
},1800)
return()=>clearTimeout(t)
},[])

const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const ownerCheck=email==='komenierashid@gmail.com'
let users=JSON.parse(localStorage.getItem('uptown_all_users')||JSON.stringify(allUsers))
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username) return
if(db.find(u=>u.email===email)){alert('Exists! Login'); setAuthMode('login'); return}
const newUser={id:Date.now(),name:authForm.name,username:'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:false,followers:0}
db.push(newUser); localStorage.setItem('uptown_users_db',JSON.stringify(db))
users.push(newUser); localStorage.setItem('uptown_all_users',JSON.stringify(users)); setAllUsers(users)
const lu={name:newUser.name,username:newUser.username,email}; localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setIsOwner(ownerCheck); setShowAuth(false)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!ownerCheck){alert('No account'); return}
const lu=ownerCheck?{name:'Katongole Rashid',username:'@katongole',email}:{name:found.name,username:found.username,email:found.email}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',ownerCheck?'true':'false')
setUser(lu); setIsOwner(ownerCheck); setShowAuth(false)
}
}

// FOLLOW BUTTON - WORKS NOW
const handleFollow=(username)=>{
if(username==='@katongole'&&!isOwner){setBlockedMsg('🔒 Owner private'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const nf={...follows,[username]:follows[username]==='following'?'follow':'following'}
setFollows(nf); localStorage.setItem('uptown_follows',JSON.stringify(nf))
}
const handleAdFollow=()=>{
const nv=adFollows['@uptown']==='following'?'follow':'following'
const na={...adFollows,'@uptown':nv}; setAdFollows(na); localStorage.setItem('uptown_ad_follows',JSON.stringify(na))
}

// POST BUTTON - WORKS NOW
const handleFileChange=(e)=>{
const file=e.target.files?.[0]; if(!file) return
setUploadPreview({url:URL.createObjectURL(file),type:file.type,file})
}
const handlePostNow=()=>{
if(!uploadPreview){setBlockedMsg('Choose image/video first'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const newPost={id:Date.now(),user:user?.name||'My Page',username:user?.username||'@me',verified:allUsers.find(u=>u.username===user?.username)?.verified||false,caption:uploadCaption||'UPTOWN 🔥',mediaUrl:uploadPreview.url,mediaType:uploadPreview.type.startsWith('video')?'video':'image'}
const newPosts=[newPost,...posts]; setPosts(newPosts); localStorage.setItem('uptown_posts',JSON.stringify(newPosts))
setUploadPreview(null); setUploadCaption(''); setShowUpload(false); setPage('foryou')
setBlockedMsg('Posted to For You ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}

const handleLike=(id)=>{
const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes',JSON.stringify(nl))
}
const handleFavorite=(id)=>{setFavorites({...favorites,[id]:!favorites[id]})}
const requestBlueTick=()=>{
if(blueBoard.find(r=>r.email===user?.email&&r.status==='pending')){setBlockedMsg('Already requested'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const req={id:Date.now(),name:user?.name,username:user?.username,email:user?.email,status:'pending',message:'Requesting blue tick'}
const nb=[...blueBoard,req]; setBlueBoard(nb); localStorage.setItem('uptown_blue_board',JSON.stringify(nb))
setBlockedMsg('Request sent to Board ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}
const acceptBlueTick=(id)=>{
const req=blueBoard.find(r=>r.id===id)
const nb=blueBoard.map(r=>r.id===id?{...r,status:'accepted'}:r); setBlueBoard(nb); localStorage.setItem('uptown_blue_board',JSON.stringify(nb))
const nu=allUsers.map(u=>u.username===req.username?{...u,verified:true}:u); setAllUsers(nu); localStorage.setItem('uptown_all_users',JSON.stringify(nu))
setBlockedMsg(`${req.name} verified ✓`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); setChatUser(null)
}
const openProfile=(v)=>{
if((v.username==='@katongole'||v.isOwner)&&!isOwner){setBlockedMsg('🔒 Katongole account private — Confidential'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return}
}

if(splash) return <div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}><div style={{fontWeight:'900',fontSize:'28px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#fff'}}>TOWN</span></div></div>

const feed=[advertPost,...posts,...defaultVideos]

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
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'700'}}>{authMode==='signup'?'Join UPTOWN':'Login'}</button>
</div>
</div>
)}

<div style={{display:'flex',padding:'12px 16px',gap:'20px',borderBottom:'1px solid #1a1a1a'}}>
{['For You','Muzika','Following','Inbox'].map(t=>{
const k=t.toLowerCase().replace(' ',''); const active=(page==='foryou'&&t==='For You')||page===k
return <button key={t} onClick={()=>setPage(k==='foryou'?'foryou':k)} style={{background:'none',border:'none',color:active?'#fff':'#666',fontSize:'13px',fontWeight:active?'700':'500'}}>{t} {isOwner&&k==='inbox'&&blueBoard.filter(b=>b.status==='pending').length>0?`(${blueBoard.filter(b=>b.status==='pending').length})`:''}</button>
})}
</div>

<div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
{page==='foryou'&&(
<div style={{flex:1,overflowY:'scroll',scrollSnapType:'y mandatory'}}>
{feed.map(v=>{
const isAd=v.isAd
const isFollowing=isAd?adFollows[v.username]==='following':follows[v.username]==='following'
const isLiked=likes[v.id]
return(
<div key={v.id} onClick={()=>openProfile(v)} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
{v.mediaUrl? (v.mediaType==='video'||v.mediaUrl.endsWith('.mp4')? <video src={v.mediaUrl} autoPlay loop muted style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={(e)=>{if(isAd) e.target.src='https://via.placeholder.com/720x1280/000/fff?text=UPTOWN+ADVERT'}}/> ) : <div style={{fontSize:'50px',color:'#222'}}>▶</div>}
{isAd&&<div style={{position:'absolute',top:'12px',left:'12px',background:'#FF0024',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'800',zIndex:2}}>ADVERT • UPTOWN CHAT</div>}
<div style={{position:'absolute',left:'14px',bottom:'20px',zIndex:2,maxWidth:'68%'}}>
<div style={{fontWeight:'700',display:'flex',gap:'6px',alignItems:'center'}}>{v.user} {v.verified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'13px',marginTop:'6px'}}>{v.caption}</div>
</div>
<div style={{position:'absolute',right:'10px',bottom:'80px',zIndex:2,display:'flex',flexDirection:'column',gap:'16px',alignItems:'center'}}>
<button onClick={(e)=>{e.stopPropagation(); isAd?handleAdFollow():handleFollow(v.username)}} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{width:'48px',height:'48px',borderRadius:'50%',background:isAd?'#FF0024':'#fff',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',border:isFollowing?'2px solid #00D632':'2px solid #fff'}}>
<span style={{fontWeight:'900',fontSize:'10px',color:isAd?'#fff':'#000'}}>{isAd?'AD':'UPTOWN'}</span>
<div style={{position:'absolute',bottom:'-5px',background:isFollowing?'#00D632':'#FF0024',color:'#fff',width:'18px',height:'18px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',border:'2px solid #000'}}>{isFollowing?'✓':'+'}</div>
</div>
<span style={{fontSize:'9px',color:'#fff',fontWeight:'700',marginTop:'4px',textAlign:'center'}}>{isFollowing? (isAd?'Following\nFollow Back ✓':'Following') : (isAd?'Follow\nFollow Back':'Follow')}</span>
</button>
<button onClick={(e)=>{e.stopPropagation(); handleLike(v.id)}} style={{background:'none',border:'none',color:isLiked?'#FF0024':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'22px'}}>{isLiked?'♥':'♡'}</span><span style={{fontSize:'10px'}}>{isLiked?'Liked':'Like'}</span></button>
<button onClick={(e)=>{e.stopPropagation(); setPage('inbox')}} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'18px'}}>💬</span><span style={{fontSize:'10px'}}>Inbox</span></button>
<button onClick={(e)=>{e.stopPropagation(); if(navigator.share) navigator.share({title:'UPTOWN',text:v.caption,url:location.href})}} style={{background:'none',border:'none',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'18px'}}>↗</span><span style={{fontSize:'10px'}}>Share</span></button>
<button onClick={(e)=>{e.stopPropagation(); handleFavorite(v.id)}} style={{background:'none',border:'none',color:favorites[v.id]?'#FFD700':'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}><span style={{fontSize:'20px'}}>{favorites[v.id]?'★':'☆'}</span><span style={{fontSize:'10px'}}>{favorites[v.id]?'Saved':'Fav'}</span></button>
</div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,overflowY:'auto',padding:'16px'}}>
<div style={{fontWeight:'700',fontSize:'18px'}}>Muzika — Watch & Post</div>
<button onClick={()=>setShowUpload(true)} style={{marginTop:'12px',background:'#FF0024',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontWeight:'700'}}> + Post to Muzika</button>
<div style={{marginTop:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
{posts.filter(p=>p.mediaUrl).map(p=>(
<div key={p.id} style={{background:'#121212',borderRadius:'12px',padding:'10px'}}><div style={{fontWeight:'600'}}>{p.user}</div><img src={p.mediaUrl} style={{width:'100%',borderRadius:'10px',marginTop:'8px'}}/><div style={{fontSize:'12px',marginTop:'6px'}}>{p.caption}</div></div>
))}
</div>
</div>
)}

{page==='following'&&(
<div style={{flex:1,overflowY:'auto',padding:'16px'}}>
<div style={{fontWeight:'700',fontSize:'18px',marginBottom:'12px'}}>People — Follow works now</div>
{allUsers.map(u=>{
if((u.username==='@katongole'||u.isOwner)&&!isOwner){
return <div key={u.id} style={{background:'#0a0a0a',border:'1px solid #222',borderRadius:'14px',padding:'14px',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}><div style={{display:'flex',gap:'10px',alignItems:'center'}}><div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#111',display:'flex',alignItems:'center',justifyContent:'center'}}>🔒</div><div><div style={{fontWeight:'600'}}>Private Account 🔒</div><div style={{fontSize:'11px',color:'#666'}}>Confidential — Owner only</div></div></div><div style={{fontSize:'11px',background:'#1a1a1a',padding:'6px 12px',borderRadius:'20px',color:'#555'}}>🔒 Private</div></div>
}
const foll=follows[u.username]==='following'
return(
<div key={u.id} style={{background:'#121212',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'14px',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
<div style={{display:'flex',gap:'10px',alignItems:'center'}}><div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#222',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700'}}>{u.name[0]}</div><div><div style={{fontWeight:'600',display:'flex',gap:'4px'}}>{u.name} {u.verified&&<span style={{width:'14px',height:'14px',background:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div><div style={{fontSize:'11px',color:'#888'}}>{u.username} {foll&&'• Following you'}</div></div></div>
<button onClick={()=>handleFollow(u.username)} style={{background:foll?'#fff':'#FF0024',color:foll?'#000':'#fff',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>{foll?'Following ✓':'Follow + Follow Back'}</button>
</div>
)
})}
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,overflowY:'auto',padding:'16px'}}>
<div style={{fontWeight:'700',textAlign:'center',marginBottom:'16px'}}>Inbox — Works Now ✉️</div>
{!isOwner&&(
<div style={{background:'#121212',border:'1px solid #1D9BF0',borderRadius:'14px',padding:'20px',textAlign:'center',marginBottom:'16px'}}>
<div style={{fontWeight:'700'}}>Blue Tick Verification</div>
<div style={{fontSize:'12px',color:'#888',marginTop:'6px'}}>Only Katongole Rashid approves — Tap to request</div>
<button onClick={requestBlueTick} style={{marginTop:'12px',background:'#1D9BF0',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'20px',fontWeight:'700'}}>✓ Request Blue Tick</button>
</div>
)}
{isOwner&&(
<div style={{background:'#121212',border:'1px solid #1D9BF0',borderRadius:'14px',padding:'14px',marginBottom:'16px'}}>
<div style={{fontWeight:'700',color:'#1D9BF0'}}>UPTOWN BOARD — Owner (komenierashid@gmail.com)</div>
<div style={{fontSize:'11px',color:'#888',marginTop:'4px'}}>Accept blue tick requests here — Inbox works</div>
</div>
)}
{blueBoard.length===0?<div style={{textAlign:'center',color:'#666',marginTop:'30px'}}>No blue tick requests yet — Inbox empty</div>:blueBoard.map(r=>(
<div key={r.id} style={{background:'#121212',border:'1px solid #222',borderRadius:'14px',padding:'14px',marginBottom:'10px'}}>
<div style={{display:'flex',gap:'10px'}}><div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#222',display:'flex',alignItems:'center',justifyContent:'center'}}>{r.name[0]}</div><div><div style={{fontWeight:'600'}}>{r.name} {r.status==='accepted'&&<span style={{color:'#00D632'}}>✓ Verified</span>}</div><div style={{fontSize:'11px',color:'#888'}}>{r.username} • {r.email}</div></div></div>
<div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
<button onClick={()=>setChatUser(r)} style={{flex:1,background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'8px',borderRadius:'10px',fontSize:'12px'}}>💬 Chat</button>
{r.status==='pending'?<button onClick={()=>acceptBlueTick(r.id)} style={{flex:1,background:'#1D9BF0',color:'#fff',border:'none',padding:'8px',borderRadius:'10px',fontWeight:'700'}}>✓ Accept</button>:<div style={{flex:1,background:'#00D632',color:'#000',padding:'8px',borderRadius:'10px',textAlign:'center',fontWeight:'700',fontSize:'12px'}}>✓ Verified</div>}
</div>
</div>
))}
</div>
)}

{page==='you'&&(
<div style={{padding:'20px'}}><div style={{display:'flex',gap:'14px',alignItems:'center'}}><div style={{width:'64px',height:'64px',borderRadius:'50%',background:'#fff',color:'#000',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900'}}>UP</div><div><div style={{fontWeight:'700'}}>{user?.name} {isOwner&&<span style={{background:'#00D632',color:'#000',fontSize:'10px',padding:'2px 8px',borderRadius:'10px'}}>OWNER</span>}</div><div style={{fontSize:'12px',color:'#888'}}>{user?.username} • {user?.email}</div></div></div>
<button onClick={()=>{localStorage.removeItem('uptown_user'); setShowAuth(true); setAuthMode('login')}} style={{marginTop:'20px',background:'#1a1a1a',border:'1px solid #333',color:'#fff',padding:'12px',borderRadius:'12px',width:'100%'}}>Switch Account / Logout</button>
</div>
)}

{showBlocked&&(
<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'16px 20px',borderRadius:'14px',zIndex:80,textAlign:'center'}}><div style={{fontWeight:'700',fontSize:'13px'}}>{blockedMsg}</div></div>
)}

{chatUser&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:70,display:'flex',flexDirection:'column'}}><div style={{padding:'14px',borderBottom:'1px solid #1a1a1a',display:'flex',gap:'12px',alignItems:'center'}}><button onClick={()=>setChatUser(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>←</button><div style={{fontWeight:'600'}}>{chatUser.name}</div></div><div style={{flex:1,padding:'16px'}}><div style={{background:'#1a1a1a',padding:'10px 14px',borderRadius:'14px',maxWidth:'80%',fontSize:'13px'}}>{chatUser.message}</div></div><div style={{padding:'12px'}}><button onClick={()=>acceptBlueTick(chatUser.id)} style={{width:'100%',background:'#1D9BF0',color:'#fff',border:'none',padding:'12px',borderRadius:'20px',fontWeight:'700'}}>✓ Accept & Verify</button></div></div>
)}
</div>

{/* POST MODAL - WORKS NOW */}
{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'24px',borderTopRightRadius:'24px',padding:'20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontWeight:'800',textAlign:'center',marginBottom:'12px'}}>Post to UPTOWN 🚀 — Works Now</div>
<input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
{uploadPreview&&<div style={{marginTop:'12px'}}>{uploadPreview.type.startsWith('video')?<video src={uploadPreview.url} style={{width:'100%',borderRadius:'12px',maxHeight:'220px'}} controls/>:<img src={uploadPreview.url} style={{width:'100%',borderRadius:'12px',maxHeight:'220px',objectFit:'cover'}}/>}</div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Write caption..." style={{marginTop:'12px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'12px',color:'#fff'}}/>
<button onClick={handlePostNow} style={{marginTop:'12px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'800'}}>POST NOW ✓</button>
</div>
</div>
)}

<div style={{display:'flex',justifyContent:'space-around',padding:'10px 0',borderTop:'1px solid #1a1a1a',background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',fontSize:'10px'}}>⌂<br/>For You</button>
<button onClick={()=>setPage('following')} style={{background:'none',border:'none',color:page==='following'?'#fff':'#666',fontSize:'10px'}}>👥<br/>People</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024',border:'none',width:'52px',height:'36px',borderRadius:'12px',color:'#fff',fontSize:'22px'}}>+</button>
<button onClick={()=>setPage('inbox')} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',fontSize:'10px',position:'relative'}}>✉<br/>Inbox {blueBoard.filter(b=>b.status==='pending').length>0&&isOwner&&<span style={{position:'absolute',top:'-4px',right:'-6px',background:'#FF0024',width:'14px',height:'14px',borderRadius:'50%',fontSize:'9px',display:'flex',alignItems:'center',justifyContent:'center'}}>{blueBoard.filter(b=>b.status==='pending').length}</span>}</button>
<button onClick={()=>setPage('you')} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',fontSize:'10px'}}>○<br/>You</button>
</div>
</div>
)
}
