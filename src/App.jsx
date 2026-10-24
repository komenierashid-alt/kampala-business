"use client"
import { useState, useEffect } from "react"
import { supabase } from "./lib/supabaseClient.js"

export default function UptownApp(){
const [splash, setSplash] = useState(true)
const [authMode, setAuthMode] = useState('signup')
const [showAuth, setShowAuth] = useState(false)
const [user, setUser] = useState(null)
const [isOwner, setIsOwner] = useState(false)
const [page, setPage] = useState('foryou')
const [showUpload, setShowUpload] = useState(false)
const [follows, setFollows] = useState({})
const [blueBoard, setBlueBoard] = useState([])
const [chatUser, setChatUser] = useState(null)
const [authForm, setAuthForm] = useState({name:'', username:'', email:'', password:''})
const [showBlocked, setShowBlocked] = useState(false)
const [installPrompt, setInstallPrompt] = useState(null)
const [posts, setPosts] = useState([])
const [uploadCaption, setUploadCaption] = useState('')
const [uploadPreview, setUploadPreview] = useState(null)
const [uploading, setUploading] = useState(false)

const [allUsers, setAllUsers] = useState([
  {id:1, name:'Katongole Rashid', username:'@katongole', verified:true, isOwner:true},
])

const defaultVideos = [
  {id:'welcome1', user:'Katongole Rashid', username:'@katongole', verified:true, caption:'Welcome to UPTOWN 🔥 Now OPEN for everyone! Post your first video! #Uptown #Kampala', isOwner:true},
]
const [supabaseVideos, setSupabaseVideos] = useState([])
const [realLikes, setRealLikes] = useState([])
const [realFollows, setRealFollows] = useState([])

useEffect(()=>{
  window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); setInstallPrompt(e) })
  const t=setTimeout(()=>{
    setSplash(false)
    const savedUser = localStorage.getItem('uptown_user')
    const savedUsers = localStorage.getItem('uptown_all_users')
    const savedFollows = localStorage.getItem('uptown_follows')
    if(savedUsers) setAllUsers(JSON.parse(savedUsers))
    if(savedFollows) setFollows(JSON.parse(savedFollows))
    if(!savedUser) setShowAuth(true)
    else setUser(JSON.parse(savedUser))
    const ownerEmail = JSON.parse(savedUser || 'null')?.email
    if(ownerEmail === 'komenierashid@gmail.com') setIsOwner(true)
  }, 2200)
  return()=>clearTimeout(t)
},[])

useEffect(()=>{
  async function loadReal(){
    const { data: vids } = await supabase.from('videos').select('*').order('created_at',{ascending:false})
    if(vids){
      const real = vids.map(v=>({
        id: v.id,
        user: v.user_name || 'UPTOWN User',
        username: v.username || '@user',
        verified: false,
        caption: v.caption || v.video_url,
        mediaUrl: v.video_url,
        mediaType: v.video_url?.includes('.mp4') || v.video_url?.includes('video') ? 'video' : 'image',
        created_at: v.created_at
      }))
      setSupabaseVideos(real)
    }
    const { data: likes } = await supabase.from('likes').select('*')
    if(likes) setRealLikes(likes)
    const { data: follows } = await supabase.from('follows').select('*')
    if(follows) setRealFollows(follows)
    const { data: profiles } = await supabase.from('profiles').select('*')
    if(profiles && profiles.length>0){
      const mapped = profiles.map(p=>({id:p.id, name:p.name || p.username, username:p.username, verified: p.verified || false}))
      setAllUsers(prev=> [...prev, ...mapped.filter(m=> !prev.find(x=>x.username===m.username)) ])
    }
  }
  loadReal()
},[])

const handleInstall = async () => {
  if(!installPrompt){ alert('Tap browser menu ⋮ → Add to Home Screen'); return }
  installPrompt.prompt()
}

const handleAuth = async () => {
  if(!authForm.email || !authForm.password) return
  const email = authForm.email.toLowerCase().trim()
  const ownerCheck = email === 'komenierashid@gmail.com'
  if(authMode==='signup'){
    if(!authForm.name || !authForm.username) return
    // Save to supabase profiles (REAL USER LIST)
    const username = '@'+authForm.username.replace('@','')
    await supabase.from('profiles').insert([{id: Date.now().toString(), name: authForm.name, username, email, verified: ownerCheck}])
    const loginUser = {name: authForm.name, username, email}
    localStorage.setItem('uptown_user', JSON.stringify(loginUser))
    setUser(loginUser); setIsOwner(ownerCheck); setShowAuth(false)
    const newUser = {id:Date.now(), name: authForm.name, username, verified: ownerCheck}
    const updated = [...allUsers, newUser]
    setAllUsers(updated)
    localStorage.setItem('uptown_all_users', JSON.stringify(updated))
  } else {
    // Login - check if exists
    const { data } = await supabase.from('profiles').select('*').eq('email', email).single()
    const loginUser = data ? {name: data.name, username: data.username, email: data.email} : {name: authForm.name || 'My Page', username: '@user', email}
    localStorage.setItem('uptown_user', JSON.stringify(loginUser))
    setUser(loginUser); setIsOwner(ownerCheck); setShowAuth(false)
  }
}

const handleFollow = async (username) => {
  if(!user) return
  const email = user.email
  const already = realFollows.find(f=>f.following_username===username && f.follower_email===email)
  if(already){
    await supabase.from('follows').delete().eq('id', already.id)
    setRealFollows(realFollows.filter(f=>f.id!==already.id))
  } else {
    const { data } = await supabase.from('follows').insert([{following_username: username, follower_email: email}]).select()
    if(data) setRealFollows([...realFollows, data[0]])
  }
  const newFollows = {...follows, [username]: follows[username]==='following' ? 'follow' : 'following'}
  setFollows(newFollows); localStorage.setItem('uptown_follows', JSON.stringify(newFollows))
}

const handleLike = async (videoId) => {
  if(!user) return
  const email = user.email
  const already = realLikes.find(l=>l.video_id==videoId && l.user_email===email)
  if(already){
    await supabase.from('likes').delete().eq('id', already.id)
    setRealLikes(realLikes.filter(l=>l.id!==already.id))
  } else {
    const { data } = await supabase.from('likes').insert([{video_id: String(videoId), user_email: email}]).select()
    if(data) setRealLikes([...realLikes, data[0]])
  }
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if(!file) return
  const url = URL.createObjectURL(file)
  setUploadPreview({url, type: file.type, file})
}

// REAL UPLOAD TO SUPABASE - UNLOCKED FOR ALL
const handlePostNow = async () => {
  if(!uploadPreview || !user) return
  setUploading(true)
  try{
    const file = uploadPreview.file
    const fileName = `${Date.now()}-${file.name}`
    // Upload to storage bucket 'videos'
    const { error: uploadError } = await supabase.storage.from('videos').upload(fileName, file)
    if(uploadError) throw uploadError
    const { data: publicData } = supabase.storage.from('videos').getPublicUrl(fileName)
    const publicUrl = publicData.publicUrl

    // Save to videos table - VISIBLE TO EVERYONE
    const { data, error } = await supabase.from('videos').insert([{
      video_url: publicUrl,
      caption: uploadCaption || 'UPTOWN 🔥 #Kampala',
      user_id: user.email,
      user_name: user.name,
      username: user.username
    }]).select()

    if(error) throw error

    // Add to feed instantly
    if(data){
      const newV = {
        id: data[0].id,
        user: user.name,
        username: user.username,
        verified: isOwner,
        caption: data[0].caption,
        mediaUrl: publicUrl,
        mediaType: file.type.startsWith('video') ? 'video' : 'image'
      }
      setSupabaseVideos([newV, ...supabaseVideos])
    }
    setUploadPreview(null)
    setUploadCaption('')
    setShowUpload(false)
    setPage('foryou')
    alert('Posted! Everyone can see it now 🚀')
  }catch(err){
    alert('Upload failed: '+err.message+' - Make sure you created public bucket "videos" in Storage')
  }
  setUploading(false)
}

if(splash){
return(<div style={{width:'100vw', height:'100dvh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', position:'fixed', inset:0, zIndex:99999}}><svg width="220" height="250" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>)
}

const feed = [...supabaseVideos, ...posts, ...defaultVideos]

return(
<div style={{background:'#000', color:'#fff', width:'100vw', height:'100dvh', position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:'Inter, sans-serif'}}>
{showAuth && (
<div style={{position:'fixed', inset:0, background:'#000', zIndex:100, display:'flex', flexDirection:'column', padding:'24px', justifyContent:'center'}}>
<div style={{textAlign:'center', marginBottom:'28px'}}><svg width="110" height="130" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg><div style={{fontWeight:'800', fontSize:'22px', marginTop:'14px'}}>UPTOWN — OPEN</div><div style={{fontSize:'13px', color:'#00D632', marginTop:'6px'}}>Now unlocked for everyone!</div></div>
<div style={{display:'flex', background:'#121212', borderRadius:'20px', padding:'4px', marginBottom:'16px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1, background: authMode==='signup'?'#fff':'transparent', color: authMode==='signup'?'#000':'#888', border:'none', padding:'10px', borderRadius:'16px', fontWeight:'700', fontSize:'13px'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1, background: authMode==='login'?'#fff':'transparent', color: authMode==='login'?'#000':'#888', border:'none', padding:'10px', borderRadius:'16px', fontWeight:'700', fontSize:'13px'}}>Login</button>
</div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
{authMode==='signup' && <><input value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} placeholder="Your Name" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm, username:e.target.value})} placeholder="Username (no @)" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} placeholder="Email" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212', border:'1px solid #222', borderRadius:'12px', padding:'14px', color:'#fff'}}/>
<button onClick={handleAuth} style={{background:'#FF0024', color:'#fff', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'800'}}>{authMode==='signup' ? 'Join UPTOWN 🚀' : 'Login'}</button>
</div>
</div>
)}
<div style={{display:'flex', padding:'12px 16px', gap:'20px', alignItems:'center', borderBottom:'1px solid #1a1a1a'}}>
{['For You','Muzika','Following'].map(t=>{
  const key = t.toLowerCase().replace(' ',''); const active = (page==='foryou' && t==='For You') || page===key
  return <button key={t} onClick={()=>setPage(key==='foryou'?'foryou':key)} style={{background:'none', border:'none', color: active?'#fff':'#717171', fontSize:'14px', fontWeight: active?'700':'500'}}>{t}</button>
})}
<button onClick={()=>setPage('live')} style={{marginLeft:'auto', background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'6px 12px', borderRadius:'20px', fontSize:'12px'}}>● Live</button>
</div>
<div style={{flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>
{page==='foryou' && (
<div style={{flex:1, overflowY:'scroll', scrollSnapType:'y mandatory'}}>
{feed.map(v=>{
  const likeCount = realLikes.filter(l=>l.video_id==v.id).length
  const isLiked = realLikes.find(l=>l.video_id==v.id && l.user_email===user?.email)
  return (
<div key={v.id} style={{width:'100%', height:'100%', scrollSnapAlign:'start', position:'relative', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
{v.mediaUrl ? (v.mediaType==='video' ? <video src={v.mediaUrl} autoPlay loop muted playsInline style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <img src={v.mediaUrl} style={{width:'100%', height:'100%', objectFit:'cover'}}/>) : null}
<div style={{position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 50%)', zIndex:1}}></div>
{!v.mediaUrl && <div style={{color:'#333', fontSize:'60px'}}>▶</div>}
<div style={{position:'absolute', left:'16px', bottom:'20px', zIndex:2, maxWidth:'75%'}}>
<div style={{display:'flex', alignItems:'center', gap:'8px'}}><span style={{fontWeight:'700', fontSize:'16px'}}>{v.user}</span>{v.verified && <span style={{width:'20px', height:'20px', background:'#1D9BF0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'14px', color:'#fff', marginTop:'8px'}}>{v.caption}</div>
</div>
<div style={{position:'absolute', right:'12px', bottom:'90px', zIndex:2, display:'flex', flexDirection:'column', gap:'18px', alignItems:'center'}}>
<button onClick={(e)=>{e.stopPropagation(); handleFollow(v.username)}} style={{background:'none', border:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
<div style={{width:'48px', height:'48px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border: follows[v.username] ? '2px solid #00D632' : '2px solid #fff', position:'relative'}}>
<span style={{fontWeight:'900', fontSize:'11px', color:'#000'}}><span style={{color:'#FF0024'}}>UP</span>TOWN</span>
<div style={{position:'absolute', bottom:'-6px', background: follows[v.username]?'#00D632':'#FF0024', color:'#fff', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #000', fontSize:'12px'}}>{follows[v.username]? '✓' : '+'}</div>
</div>
<span style={{fontSize:'10px', color:'#fff', fontWeight:'600'}}>{follows[v.username] ? 'Following' : 'Follow'}</span>
</button>
<div style={{display:'flex', flexDirection:'column', gap:'16px', marginTop:'10px'}}>
<button onClick={(e)=>{e.stopPropagation(); handleLike(v.id)}} style={{background:'none', border:'none', color: isLiked ? '#FF0024' : '#fff', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'24px'}}>{isLiked ? '♥' : '♡'}</span><span style={{fontSize:'11px', color:'#fff'}}>{likeCount}</span></button>
<button style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'20px'}}>💬</span><span style={{fontSize:'11px'}}>0</span></button>
<button onClick={(e)=>{e.stopPropagation(); if(navigator.share) navigator.share({title:'UPTOWN', text:v.caption, url: location.href})}} style={{background:'none', border:'none', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center'}}><span style={{fontSize:'20px'}}>↗</span><span style={{fontSize:'11px'}}>Share</span></button>
</div>
</div>
</div>
)})}
</div>
)}
{page==='following' && (
<div style={{flex:1, overflowY:'auto', padding:'16px'}}>
<div style={{fontWeight:'700', fontSize:'18px', marginBottom:'16px'}}>People on UPTOWN — REAL</div>
<div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
{allUsers.map(u=>{
  const followerCount = realFollows.filter(f=>f.following_username===u.username).length
  return (
<div key={u.id} style={{background:'#121212', border:'1px solid #1e1e1e', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div style={{display:'flex', gap:'12px', alignItems:'center'}}>
<div style={{width:'44px', height:'44px', borderRadius:'50%', background:'#FF0024', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700'}}>{u.name[0]}</div>
<div><div style={{fontWeight:'600', fontSize:'14px'}}>{u.name} {u.verified && <span style={{color:'#1D9BF0'}}>✓</span>}</div><div style={{fontSize:'11px', color:'#888'}}>{u.username} • {followerCount} followers</div></div>
</div>
<button onClick={()=>handleFollow(u.username)} style={{background: follows[u.username]==='following' ? '#fff' : '#FF0024', color: follows[u.username]==='following' ? '#000' : '#fff', border:'none', padding:'8px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>
{follows[u.username]==='following' ? 'Following ✓' : 'Follow +'}
</button>
</div>
)})}
</div>
</div>
)}
{page==='you' && (
<div style={{padding:'20px', overflowY:'auto', height:'100%'}}>
<div style={{display:'flex', gap:'16px', alignItems:'center'}}>
<div style={{width:'72px', height:'72px', borderRadius:'50%', background:'#FF0024', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'22px'}}>UP</div>
<div><div style={{fontWeight:'700'}}>{user?.name} {isOwner && <span style={{background:'#00D632', color:'#000', fontSize:'10px', padding:'2px 8px', borderRadius:'10px'}}>OWNER</span>}</div><div style={{fontSize:'12px', color:'#888'}}>{user?.username} • {user?.email}</div></div>
</div>
<div style={{marginTop:'20px', display:'flex', flexDirection:'column', gap:'10px'}}>
<button onClick={handleInstall} style={{background:'#fff', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700'}}>📲 Install UPTOWN App</button>
<button onClick={()=>{localStorage.removeItem('uptown_user'); setShowAuth(true); setAuthMode('login')}} style={{background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', padding:'12px', borderRadius:'12px'}}>Logout / Switch Phone</button>
</div>
<div style={{marginTop:'20px', background:'#121212', padding:'14px', borderRadius:'12px'}}><div style={{fontWeight:'700', color:'#00D632'}}>✅ UNLOCKED MODE</div><div style={{fontSize:'12px', color:'#aaa', marginTop:'6px'}}>Everyone can post, like, follow, share. No more owner-only. Your app is now real TikTok for Kampala!</div></div>
</div>
)}
</div>
{showUpload && (
<div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:50, display:'flex', alignItems:'flex-end'}} onClick={()=>setShowUpload(false)}>
<div style={{background:'#121212', width:'100%', borderTopLeftRadius:'24px', borderTopRightRadius:'24px', padding:'24px 20px'}} onClick={e=>e.stopPropagation()}>
<div style={{fontSize:'18px', fontWeight:'800', textAlign:'center'}}>Post to UPTOWN — Open to All 🚀</div>
<div style={{marginTop:'16px'}}>
<input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{background:'#1a1a1a', border:'1px solid #333', borderRadius:'10px', padding:'12px', color:'#fff', width:'100%'}} />
{uploadPreview && (
  <div style={{marginTop:'12px'}}>
    {uploadPreview.type.startsWith('video') ? <video src={uploadPreview.url} style={{width:'100%', borderRadius:'12px', maxHeight:'220px'}} controls/> : <img src={uploadPreview.url} style={{width:'100%', borderRadius:'12px', maxHeight:'220px', objectFit:'cover'}}/>}
  </div>
)}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Write caption... #Uptown #Kampala" style={{marginTop:'12px', background:'#1a1a1a', border:'1px solid #333', borderRadius:'10px', padding:'12px', color:'#fff', width:'100%'}}/>
<button onClick={handlePostNow} disabled={uploading} style={{marginTop:'12px', background: uploading?'#555':'#FF0024', color:'#fff', border:'none', width:'100%', padding:'14px', borderRadius:'12px', fontWeight:'800'}}>{uploading ? 'Uploading...' : 'POST NOW 🚀 Everyone will see it'}</button>
</div>
</div>
</div>
)}
<div style={{display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #1a1a1a', background:'#000'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none', border:'none', color: page==='foryou'?'#fff':'#666', fontSize:'11px', fontWeight:'600'}}>⌂<br/>For You</button>
<button onClick={()=>setPage('following')} style={{background:'none', border:'none', color: page==='following'?'#fff':'#666', fontSize:'11px'}}>👥<br/>People</button>
<button onClick={()=>setShowUpload(true)} style={{background:'#FF0024', border:'none', width:'56px', height:'36px', borderRadius:'12px', color:'#fff', fontSize:'24px', fontWeight:'900'}}>+</button>
<button onClick={()=>setPage('you')} style={{background:'none', border:'none', color:'#666', fontSize:'11px'}}>○<br/>You</button>
</div>
</div>
)
}
