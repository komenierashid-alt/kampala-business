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
const [uploadMode,setUploadMode]=useState(null)
const [uploadCaption,setUploadCaption]=useState('')
const [universalLink,setUniversalLink]=useState('')
const [uploadPreview,setUploadPreview]=useState(null)
const [uploadBase64,setUploadBase64]=useState(null)
const [follows,setFollows]=useState({})
const [followCounts,setFollowCounts]=useState({})
const [likes,setLikes]=useState({})
const [favorites,setFavorites]=useState({})
const [comments,setComments]=useState({})
const [commentCounts,setCommentCounts]=useState({})
const [showComments,setShowComments]=useState(null)
const [commentInput,setCommentInput]=useState('')
const [posts,setPosts]=useState([])
const [pausedMap,setPausedMap]=useState({})
const [authForm,setAuthForm]=useState({name:'',username:'',email:'',password:''})
const [showBlocked,setShowBlocked]=useState(false)
const [blockedMsg,setBlockedMsg]=useState('')
const [notifications,setNotifications]=useState([])
const [verificationRequests,setVerificationRequests]=useState([])
const [profilePic,setProfilePic]=useState(null)
const [editName,setEditName]=useState('')
const [editBio,setEditBio]=useState('')
const [editUsername,setEditUsername]=useState('')
const [isEditing,setIsEditing]=useState(false)
const [isBanned,setIsBanned]=useState(false)
const [banInfo,setBanInfo]=useState(null)
const videoRefs=useRef({})

const officialVideos=[
{id:9001,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video', likes:15600, fires:520, comments:0, views:45200, isOfficial:true},
{id:9002,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video', likes:12400, fires:340, comments:0, views:32100, isOfficial:true},
]

useEffect(()=>{
const t=setTimeout(()=>{
setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sFC=localStorage.getItem('uptown_follow_counts')
const sL=localStorage.getItem('uptown_likes_v2')
const sFav=localStorage.getItem('uptown_fav_v3')
const sP=localStorage.getItem('uptown_posts_plus_fixed_final')
const sC=localStorage.getItem('uptown_comments_v1')
const sNot=localStorage.getItem('uptown_notifications_ban_system')
const sReq=localStorage.getItem('uptown_verification_requests')
const sPic=localStorage.getItem('uptown_profile_pic')
const sBio=localStorage.getItem('uptown_bio')
if(sF) setFollows(JSON.parse(sF))
if(sFC) setFollowCounts(JSON.parse(sFC))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
if(sP) setPosts(JSON.parse(sP))
if(sC) setCommentCounts(JSON.parse(sC))
if(sReq) setVerificationRequests(JSON.parse(sReq))
if(sPic) setProfilePic(sPic)
if(sBio) setEditBio(sBio)
let nots=[]
if(sNot) nots=JSON.parse(sNot)
else nots=[{id:1,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'2m ago',title:'Welcome ✓',message:'Welcome to UPTOWN ✓',read:false}]
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su)
setUser(u)
setEditName(u.name||'')
setEditUsername(u.username||'')
if(sO==='true') setIsOwner(true)
const banKey='uptown_ban_'+u.email
const banData=localStorage.getItem(banKey)
if(banData){
const ban=JSON.parse(banData)
if(ban.bannedUntil>Date.now()){setIsBanned(true); setBanInfo(ban)}
}
const today=new Date().getDate()
const isVerificationDay=today===10 || today===26 || true
const isNotVerified=!u.verified && !u.isOfficial && sO!=='true'
const monthKey=new Date().getMonth()+'-'+new Date().getFullYear()
const lastOfferKey=localStorage.getItem('uptown_last_verify_offer_'+u.email+'_'+monthKey+'_'+today)
if(isVerificationDay && isNotVerified && !lastOfferKey){
const alreadyHasOffer=nots.some(n=>n.type==='verification_offer' && !n.read)
if(!alreadyHasOffer){
nots=[{id:Date.now(),type:'verification_offer',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'Get Verified ✓ — Blue Tick?',message:'UPTOWN Official is asking if you want to be verified with blue tick ✓ — Tap here to request!',read:false},...nots]
localStorage.setItem('uptown_last_verify_offer_'+u.email+'_'+monthKey+'_'+today,'sent')
}
}
const congratsKey='uptown_congrats_'+u.email
const congratsData=localStorage.getItem(congratsKey)
if(congratsData){
const c=JSON.parse(congratsData)
nots=[c,...nots]
localStorage.removeItem(congratsKey)
u.verified=true
localStorage.setItem('uptown_user',JSON.stringify(u))
setUser(u)
}
setNotifications(nots)
localStorage.setItem('uptown_notifications_ban_system',JSON.stringify(nots))
}
},1800)
return()=>clearTimeout(t)
},[])

useEffect(()=>{
const interval=setInterval(()=>{
const now=Date.now()
let updated=false
let newPosts=posts.filter(p=>{
if(p.flagged && p.autoRemoveAt && now>=p.autoRemoveAt){updated=true; return false}
return true
})
if(updated){setPosts(newPosts); localStorage.setItem('uptown_posts_plus_fixed_final',JSON.stringify(newPosts))}
if(user){
const banKey='uptown_ban_'+user.email
const banData=localStorage.getItem(banKey)
if(banData){
const ban=JSON.parse(banData)
if(now>=ban.bannedUntil){localStorage.removeItem(banKey); setIsBanned(false); setBanInfo(null)}
}
}
}, 10000)
return()=>clearInterval(interval)
},[posts, user])

useEffect(()=>{
if(page!=='foryou' && page!=='muzika' && page!=='live') return
const observer=new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
const id=entry.target.getAttribute('data-video-id')
const video=videoRefs.current[id]
if(!video) return
if(entry.isIntersecting){
Object.keys(videoRefs.current).forEach(k=>{if(k!==id && videoRefs.current[k]) videoRefs.current[k].pause()})
if(!pausedMap[id]) video.play().catch(()=>{})
}else video.pause()
})
},{threshold:0.5})
const els=document.querySelectorAll('[data-video-id]')
els.forEach(el=>observer.observe(el))
return()=>observer.disconnect()
},[page,posts,pausedMap])

const parseUniversalLink=(url)=>{
if(!url) return null
url=url.trim()
const lower=url.toLowerCase()
const ytReg=/(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/
const ytMatch=url.match(ytReg)
if(ytMatch) return {type:'youtube', id:ytMatch[1], embed:`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&controls=1&playsinline=1&rel=0`, original:url, platform:'YouTube'}
if(lower.match(/\.(mp4|mov|webm|m3u8)(\?|$)/)) return {type:'direct', embed:url, original:url, platform:'Direct'}
if(lower.startsWith('http')) return {type:'iframe', embed:url, original:url, platform:'Link'}
return null
}
const isPornContent=(text, url)=>{
if(!text && !url) return false
const combined=(text+' '+(url||'')).toLowerCase()
const pornKeywords=['porn','sex video','xxx','nude','naked','pornhub','xvideos','onlyfans','nsfw','erotic','boobs','pussy','dick','anal','blowjob','hardcore','sex tape','leaked nude','18+ porn','brazzers','sex.com','xnxx','sex ',' sex','sexy porn']
return pornKeywords.some(k=>combined.includes(k))
}
const handleAuth=()=>{
if(!authForm.email||!authForm.password) return
const email=authForm.email.toLowerCase().trim()
const isOfficial=email==='komenierashid@gmail.com'
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
if(authMode==='signup'){
if(!authForm.name||!authForm.username){setBlockedMsg('Fill name'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
if(db.find(u=>u.email===email)){setAuthMode('login'); return}
const nu={id:Date.now(),name:isOfficial?'Katongole Rashid':authForm.name,username:isOfficial?'@uptown':'@'+authForm.username.replace('@',''),email,password:authForm.password,verified:isOfficial,isOfficial:isOfficial,bio:'New on UPTOWN ✓'}
db.push(nu); localStorage.setItem('uptown_users_db',JSON.stringify(db))
const lu={name:nu.name,username:nu.username,email,verified:nu.verified,isOfficial:nu.isOfficial,bio:nu.bio}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
setUser(lu); setEditName(lu.name); setEditUsername(lu.username); setIsOwner(isOfficial); setShowAuth(false)
setTimeout(()=>window.location.reload(),500)
}else{
const found=db.find(u=>u.email===email&&u.password===authForm.password)
if(!found&&!isOfficial){setBlockedMsg('No account'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return}
const lu=isOfficial?{name:'Katongole Rashid',username:'@uptown',email,verified:true,isOfficial:true,bio:'Control account'}:{name:found.name,username:found.username,email:found.email,verified:found.verified||false,isOfficial:false,bio:found.bio||''}
const banKey='uptown_ban_'+lu.email
const banData=localStorage.getItem(banKey)
if(banData){
const ban=JSON.parse(banData)
if(ban.bannedUntil>Date.now()){setBlockedMsg(`🚫 Page banned for 7 days until ${new Date(ban.bannedUntil).toLocaleDateString()}`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),3000); return}
else localStorage.removeItem(banKey)
}
localStorage.setItem('uptown_user',JSON.stringify(lu)); localStorage.setItem('uptown_is_owner',isOfficial?'true':'false')
setUser(lu); setEditName(lu.name); setEditUsername(lu.username); setIsOwner(isOfficial); setShowAuth(false)
setTimeout(()=>window.location.reload(),500)
}
}
const handleFollow=(username)=>{
const isCurrentlyFollowing=follows[username]==='following'
const nf={...follows,[username]:isCurrentlyFollowing?'follow':'following'}
setFollows(nf)
localStorage.setItem('uptown_follows',JSON.stringify(nf))
const newCounts={...followCounts}
newCounts[username]=(newCounts[username]||0)+(isCurrentlyFollowing?-1:1)
if(newCounts[username]<0) newCounts[username]=0
setFollowCounts(newCounts)
localStorage.setItem('uptown_follow_counts',JSON.stringify(newCounts))
setBlockedMsg(isCurrentlyFollowing?'Unfollowed':'✓ Following!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)
}
const handleLike=(id)=>{const nl={...likes,[id]:!likes[id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFire=(id)=>{const nl={...likes,['fire_'+id]:!likes['fire_'+id]}; setLikes(nl); localStorage.setItem('uptown_likes_v2',JSON.stringify(nl))}
const handleFavorite=(id)=>{const nf={...favorites,[id]:!favorites[id]}; setFavorites(nf); localStorage.setItem('uptown_fav_v3',JSON.stringify(nf)); setBlockedMsg(nf[id]?'★ Favorite':'★ Removed'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)}
const handleShare=async(v)=>{const url=v.mediaUrl?.startsWith('http')?v.mediaUrl:location.href; if(navigator.share){try{await navigator.share({title:'UPTOWN',url})}catch{}}else{try{await navigator.clipboard.writeText(url); setBlockedMsg('🔗 Copied!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)}catch{}}}
const handleComment=(id)=>setShowComments(id)
const handlePostComment=(id)=>{
if(!commentInput.trim()) return
setComments(prev=>({...prev,[id]:[...(prev[id]||[]),{id:Date.now(),text:commentInput,user:user?.name||'User'}]}))
const nc={...commentCounts,[id]:(commentCounts[id]||0)+1}
setCommentCounts(nc); localStorage.setItem('uptown_comments_v1',JSON.stringify(nc)); setCommentInput(''); setBlockedMsg('💬 Posted!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1000)
}
const handleTapVideo=(id)=>{const v=videoRefs.current[id]; if(!v) return; if(v.paused){v.play(); setPausedMap({...pausedMap,[id]:false})}else{v.pause(); setPausedMap({...pausedMap,[id]:true})}}
const handleFileChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setUploadPreview({url:u,type:f.type}); const r=new FileReader(); r.onload=(ev)=>setUploadBase64(ev.target.result); r.readAsDataURL(f)}
const handleProfilePicChange=(e)=>{const f=e.target.files?.[0]; if(!f) return; const u=URL.createObjectURL(f); setProfilePic(u); const r=new FileReader(); r.onload=(ev)=>{localStorage.setItem('uptown_profile_pic',ev.target.result); setBlockedMsg('✓ Profile changed!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200)}; r.readAsDataURL(f)}
const handleSaveProfile=()=>{
if(!editName.trim()){setBlockedMsg('Name required'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
const updated={...user,name:editName,username:editUsername,bio:editBio}
setUser(updated); localStorage.setItem('uptown_user',JSON.stringify(updated)); localStorage.setItem('uptown_bio',editBio)
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
const idx=db.findIndex(u=>u.email===user.email)
if(idx>=0){db[idx].name=editName; db[idx].username=editUsername; db[idx].bio=editBio; localStorage.setItem('uptown_users_db',JSON.stringify(db))}
setIsEditing(false); setBlockedMsg('✓ Account updated!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500)
}
const handlePasteLink=async()=>{try{const t=await navigator.clipboard.readText(); if(t) setUniversalLink(t)}catch{}}
const handleRequestVerification=(notifId)=>{
const newRequest={id:Date.now(),userEmail:user.email,userName:user.name,username:user.username,time:'Just now',status:'pending'}
const updatedReq=[newRequest,...verificationRequests]
setVerificationRequests(updatedReq)
localStorage.setItem('uptown_verification_requests',JSON.stringify(updatedReq))
const updatedNots=notifications.filter(n=>n.id!==notifId)
const sentNotif={id:Date.now()+1,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'Request Sent ✓',message:'Your blue tick request sent to UPTOWN Official ✓',read:false}
const finalNots=[sentNotif,...updatedNots]
setNotifications(finalNots)
localStorage.setItem('uptown_notifications_ban_system',JSON.stringify(finalNots))
const ownerNotif={id:Date.now()+2,type:'verification_request',from:user.name,username:user.username,verified:false,time:'Just now',title:'🔵 Blue Tick Request',message:`${user.name} (${user.username}) requested blue tick — Tap Verify!`,read:false,requestId:newRequest.id,userEmail:user.email}
let ownerNotifs=JSON.parse(localStorage.getItem('uptown_owner_notifications')||'[]')
ownerNotifs=[ownerNotif,...ownerNotifs]
localStorage.setItem('uptown_owner_notifications',JSON.stringify(ownerNotifs))
setBlockedMsg('✓ Request sent!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
}
const handleVerifyUser=(requestId, userEmail)=>{
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
const idx=db.findIndex(u=>u.email===userEmail)
if(idx>=0){db[idx].verified=true; localStorage.setItem('uptown_users_db',JSON.stringify(db))}
const updatedReq=verificationRequests.map(r=>r.id===requestId?{...r,status:'verified'}:r)
setVerificationRequests(updatedReq)
localStorage.setItem('uptown_verification_requests',JSON.stringify(updatedReq))
const congratsNotif={id:Date.now(),type:'verified_congrats',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'🎉 Congratulations! You are Verified ✓',message:'Congratulations! You are now verified with blue tick ✓',read:false}
localStorage.setItem('uptown_congrats_'+userEmail,JSON.stringify(congratsNotif))
if(user && user.email===userEmail){
const updatedUser={...user,verified:true}
setUser(updatedUser)
localStorage.setItem('uptown_user',JSON.stringify(updatedUser))
const finalNots=[congratsNotif,...notifications]
setNotifications(finalNots)
localStorage.setItem('uptown_notifications_ban_system',JSON.stringify(finalNots))
}
let ownerNotifs=JSON.parse(localStorage.getItem('uptown_owner_notifications')||'[]')
ownerNotifs=ownerNotifs.filter(n=>n.requestId!==requestId)
localStorage.setItem('uptown_owner_notifications',JSON.stringify(ownerNotifs))
setBlockedMsg('✓ Verified!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
}
const handleNotificationClick=(n)=>{
if(n.type==='verification_offer'){handleRequestVerification(n.id)}
else{
const updated=notifications.map(x=>x.id===n.id?{...x,read:true}:x)
setNotifications(updated)
localStorage.setItem('uptown_notifications_ban_system',JSON.stringify(updated))
}
}
const handlePostNow=(mode)=>{
if(isBanned){setBlockedMsg(`🚫 Banned 7 days`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),3000); return}
const fm=mode||uploadMode
if(fm==='post_muzika' && !isOwner){setBlockedMsg('Muzika: Only UPTOWN Official can post'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return}
const checkText=uploadCaption+' '+universalLink
const isPorn=isPornContent(checkText, universalLink)
let mu=null; let mt='video'; let li=null
if(fm==='post_muzika'){
if(universalLink){li=parseUniversalLink(universalLink); if(!li){setBlockedMsg('Invalid link'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1500); return} mu=universalLink; mt=li.type}
else if(uploadBase64){mu=uploadBase64; mt='video'}
else{setBlockedMsg('Paste link or upload'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
}else{
if(uploadBase64){mu=uploadBase64; mt='video'}
else if(universalLink){li=parseUniversalLink(universalLink); if(li){mu=universalLink; mt=li.type}else{setBlockedMsg('Upload file'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}}
else{setBlockedMsg('Upload file'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
}
const now=Date.now()
const np={id:Date.now(),user:user?.name||'User',username:user?.username||'@user',verified:user?.verified||false,caption:uploadCaption||'New video ✓',mediaUrl:mu,mediaType:mt,linkInfo:li,isMuzika:fm==='post_muzika',likes:0,fires:0,comments:0,views:Math.floor(Math.random()*5000)+100,postedBy:user?.email,postedAt:now,followerBoost:followCounts[user?.username||'']||0,flagged:isPorn,flaggedAt:isPorn?now:null,autoRemoveAt:isPorn?now+5*60*1000:null}
let nposts=[np,...posts]
if(isPorn){
const violationKey='uptown_violations_'+user.email
let violations=parseInt(localStorage.getItem(violationKey)||'0')+1
localStorage.setItem(violationKey,violations.toString())
let warningTitle='',warningMsg='',banData=null
if(violations===1){
warningTitle='⚠️ Warning: Porn/Sex Not Allowed!'
warningMsg=`Your video flagged — Will be auto removed in 5 minutes — Your page can be taken if you repeat! — Violation ${violations}/2`
}else{
const bannedUntil=now+7*24*60*60*1000
banData={bannedUntil:bannedUntil,reason:`Repeated porn/sex videos — ${violations} violations`,violations:violations,bannedAt:now}
localStorage.setItem('uptown_ban_'+user.email,JSON.stringify(banData))
setIsBanned(true); setBanInfo(banData)
warningTitle='🚫 Page Banned 7 Days!'
warningMsg=`You posted porn/sex videos again! Your page banned for 7 days until ${new Date(bannedUntil).toLocaleDateString()} — Violation ${violations}/2`
}
const warningNotif={id:Date.now(),type:isPorn?'ban_warning':'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:warningTitle,message:warningMsg,read:false}
const currentNots=JSON.parse(localStorage.getItem('uptown_notifications_ban_system')||'[]')
const newNots=[warningNotif,...currentNots]
setNotifications(newNots)
localStorage.setItem('uptown_notifications_ban_system',JSON.stringify(newNots))
setBlockedMsg(violations===1?`⚠️ Porn/Sex! Auto remove in 5 min! Warning!`:`🚫 Page banned 7 days!`); 
setShowBlocked(true); setTimeout(()=>setShowBlocked(false),4000)
}
setPosts(nposts)
localStorage.setItem('uptown_posts_plus_fixed_final',JSON.stringify(nposts))
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUniversalLink(''); setShowUpload(false); setUploadMode(null)
if(!isPorn){setBlockedMsg(fm==='post_muzika'?'✓ Posted in Muzika!':'✓ Posted on For You!'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage(fm==='post_muzika'?'muzika':'foryou')},1200)}
else setTimeout(()=>{setPage(fm==='post_muzika'?'muzika':'foryou')},2000)
}

if(splash){
return(
<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="140" height="170" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>
)
}

const allForYouPosts=[...posts.filter(p=>!p.isMuzika)]
const sortedForYou=allForYouPosts.sort((a,b)=>{
const aScore=(a.followerBoost||followCounts[a.username||'']||0)*1000 + (a.postedAt||a.id||0)
const bScore=(b.followerBoost||followCounts[b.username||'']||0)*1000 + (b.postedAt||b.id||0)
return bScore - aScore
})
const forYouFeed=[...sortedForYou,...officialVideos]
const muzikaFeed=[...posts.filter(p=>p.isMuzika),...officialVideos].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
const myVideos=[...posts.filter(p=>p.postedBy===user?.email)].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))

const renderUniversal=(v)=>{
const info=v.linkInfo || parseUniversalLink(v.mediaUrl)
if(!info){
if(v.mediaType==='image' || v.mediaUrl?.startsWith('data:image')) return <img src={v.mediaUrl} style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={v.mediaUrl} loop playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'contain',background:'#111'}}/>
}
if(info.type==='youtube') return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%',border:'none'}}/>
if(info.type==='direct') return <video ref={el=>{if(el) videoRefs.current[v.id]=el}} src={info.embed} loop playsInline autoPlay controls style={{width:'100%',height:'100%',objectFit:'contain',background:'#000'}}/>
return <iframe width="100%" height="100%" src={info.embed} frameBorder="0" allowFullScreen style={{width:'100%',height:'100%',border:'none'}}/>
}
const linkPreview=parseUniversalLink(universalLink)
const ownerNotifs=JSON.parse(localStorage.getItem('uptown_owner_notifications')||'[]')
const allNotifsForOwner=isOwner?[...ownerNotifs,...notifications]:notifications
const unread=allNotifsForOwner.filter(n=>!n.read).length

if(isBanned && banInfo){
return(
<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px',textAlign:'center'}}>
<div style={{width:'80px',height:'80px',borderRadius:'50%',background:'#FF0024',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px',marginBottom:'20px'}}>🚫</div>
<div style={{fontWeight:'900',fontSize:'20px',color:'#FF0024'}}>Page Banned 7 Days</div>
<div style={{fontSize:'12px',color:'#888',marginTop:'8px'}}>Until: {new Date(banInfo.bannedUntil).toLocaleDateString()}</div>
<button onClick={()=>{localStorage.removeItem('uptown_user'); localStorage.removeItem('uptown_is_owner'); window.location.reload()}} style={{marginTop:'20px',background:'#222',color:'#fff',border:'1px solid #333',padding:'10px 20px',borderRadius:'20px',fontSize:'12px'}}>Logout</button>
</div>
)
}

return(
<div style={{background:'#000',color:'#fff',width:'100vw',height:'100dvh',maxHeight:'100dvh',position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden',boxSizing:'border-box'}}>
<div style={{height:'52px',minHeight:'52px',display:'flex',alignItems:'center',padding:'0 12px',gap:'8px',borderBottom:'1px solid #1a1a1a',background:'#000',flexShrink:0}}>
<div style={{display:'flex',gap:'8px',overflowX:'auto',flex:1}}>
{[{label:'For You',key:'foryou'},{label:'Muzika',key:'muzika'},{label:'Following',key:'following'}].map(t=>{
const a=page===t.key
return <button key={t.key} onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage(t.key)}} style={{background:a?'#fff':'#222',color:a?'#000':'#888',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'700',flexShrink:0,height:'32px'}}>{t.label}</button>
})}
</div>
<button onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage('live')}} style={{background:page==='live'?'#FF0024':'#1a1a1a',color:page==='live'?'#fff':'#FF0024',border:page==='live'?'none':'1px solid #FF0024',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'800',flexShrink:0,height:'32px',display:'flex',alignItems:'center',gap:'4px',marginLeft:'auto'}}>
<span style={{width:'6px',height:'6px',background:page==='live'?'#fff':'#FF0024',borderRadius:'50%'}}></span>Live
</button>
</div>

<div style={{flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column',position:'relative',background:'#000'}}>

{page==='foryou'&&(
<div style={{flex:1,minHeight:0,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
const isPaused=pausedMap[v.id]
const isLiked=likes[v.id]
const isFired=likes['fire_'+v.id]
const cCount=commentCounts[v.id]||v.comments||0
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:v.flagged?'#2a0a0a':'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:v.flagged?'#2a0a0a':'#111'}}>
<div style={{width:'100%',height:'100%',opacity:v.flagged?0.5:1}}>{renderUniversal(v)}</div>
</div>
{isPaused&&!v.flagged&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.55)',width:'72px',height:'72px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',zIndex:5,pointerEvents:'none'}}><div style={{width:0,height:0,borderLeft:'22px solid #fff',borderTop:'13px solid transparent',borderBottom:'13px solid transparent',marginLeft:'4px'}}></div></div>}

{/* + BUTTON FIXED SMART ONLY - TIKTOK STYLE - NOT CUT - AS YOUR GREEN ARROW */}
<div style={{position:'absolute',right:'10px',top:'40%',transform:'translateY(-50%)',zIndex:3,display:'flex',flexDirection:'column',gap:'18px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{position:'relative',width:'54px',height:'54px',display:'flex',justifyContent:'center'}}>
<div style={{
width:'50px',height:'50px',borderRadius:'50%',
background:'#fff',
display:'flex',alignItems:'center',justifyContent:'center',
border:'2px solid #fff',
boxShadow:'0 2px 8px rgba(0,0,0,0.4)',
flexShrink:0
}}>
<span style={{fontWeight:'900',fontSize:'10px',letterSpacing:'-0.3px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></span>
</div>
<button onClick={()=>handleFollow(v.username)} style={{
position:'absolute',
bottom:'-8px',
left:'50%',
transform:'translateX(-50%)',
width:'22px',
height:'22px',
borderRadius:'50%',
background:isFollowing?'#00D632':'#FF0024',
border:'2px solid #000',
color:'#fff',
display:'flex',
alignItems:'center',
justifyContent:'center',
fontSize:isFollowing?'10px':'14px',
fontWeight:'900',
padding:0,
lineHeight:'1',
boxShadow:'0 2px 6px rgba(0,0,0,0.9)',
cursor:'pointer',
zIndex:10
}}>
{isFollowing?'✓':'+'}
</button>
</div>

<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'26px'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div>
<div style={{fontSize:'11px',fontWeight:'700'}}>{isLiked? (v.likes+1):(v.likes>=1000? (v.likes/1000).toFixed(1)+'K':v.likes)||'2.4K'}</div>
</button>
<button onClick={()=>handleComment(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'15px'}}>💬</span></div>
<div style={{fontSize:'11px',fontWeight:'700'}}>{cCount}</div>
</button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'18px'}}>→</div>
<div style={{fontSize:'11px',fontWeight:'600'}}>Share</div>
</button>
<button onClick={()=>handleFire(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'22px'}}>🔥</div>
<div style={{fontSize:'11px',fontWeight:'700',color:isFired?'#FF6A00':'#fff'}}>{isFired? (v.fires+1) : (v.fires||340)}</div>
</button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#FF0024'}}>
<div style={{fontSize:'20px'}}>★</div>
<div style={{fontSize:'10px',fontWeight:'700'}}>Favorite</div>
</button>
</div>

{/* REMOVED WORD UNDER UPTOWN - ONLY ONE LINE - NO 0:00 NO DUPLICATE - AS YOUR ARROW DOWN */}
<div style={{position:'absolute',left:'12px',right:'76px',bottom:'22px',zIndex:2,pointerEvents:'none'}}>
<div style={{fontWeight:'800',fontSize:'15px',display:'flex',gap:'5px',alignItems:'center',textShadow:'0 1px 4px rgba(0,0,0,0.9)'}}>
<span>UPTOWN Official</span>
{v.verified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
</div>
</div>

</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'40px',minHeight:'40px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
<div><div style={{fontWeight:'700',fontSize:'12px'}}>Muzika — Only UPTOWN Official</div></div>
<button onClick={()=>{if(!isOwner){setBlockedMsg('Only UPTOWN Official can post'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return} setUploadMode(null); setShowUpload(true)}} style={{background:isOwner?'#FF0024':'#222',color:isOwner?'#fff':'#666',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>{isOwner?'+ Post':'+ Watch'}</button>
</div>
<div style={{flex:1,minHeight:0,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0}}>{renderUniversal(v)}</div>
<div style={{position:'absolute',left:'12px',bottom:'22px',zIndex:2,pointerEvents:'none'}}><div style={{fontWeight:'800',fontSize:'14px',display:'flex',gap:'4px',alignItems:'center'}}>UPTOWN Official <span style={{width:'14px',height:'14px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span></div></div>
</div>
))}
</div>
</div>
)}

{page==='live'&&<div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#000'}}><div style={{width:'80px',height:'80px',borderRadius:'50%',background:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px'}}><span style={{fontSize:'32px'}}>🔴</span></div><div style={{fontWeight:'800',fontSize:'18px'}}>Live — Coming Soon</div></div>}

{page==='inbox'&&(
<div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'48px',minHeight:'48px',padding:'0 12px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}><div style={{fontWeight:'800',fontSize:'13px'}}>Inbox</div><div style={{background:'#FF0024',color:'#fff',padding:'3px 8px',borderRadius:'12px',fontSize:'10px'}}>{unread} new</div></div>
<div style={{flex:1,minHeight:0,overflowY:'auto',padding:'10px'}}>
{isOwner&&ownerNotifs.length>0&&(
<div style={{marginBottom:'16px'}}>
<div style={{fontWeight:'800',fontSize:'13px',marginBottom:'8px',color:'#1D9BF0'}}>🔵 Blue Tick Requests</div>
{ownerNotifs.filter(n=>n.type==='verification_request').map(n=>(
<div key={n.id} style={{background:'#0a1a2a',border:'1px solid #1D9BF0',borderRadius:'12px',padding:'12px',marginBottom:'10px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontWeight:'700',fontSize:'12px'}}>{n.from}</div><div style={{fontSize:'11px',color:'#aaa'}}>{n.message}</div></div>
<button onClick={()=>handleVerifyUser(n.requestId, n.userEmail)} style={{background:'#1D9BF0',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontWeight:'800',fontSize:'12px',marginLeft:'10px'}}>✓ Verify</button>
</div>
</div>
))}
</div>
)}
{allNotifsForOwner.filter(n=>n.type!=='verification_request').map(n=>(
<div key={n.id} onClick={()=>handleNotificationClick(n)} style={{background:n.type==='ban_warning'||n.type==='ban'?'#2a0a0a':n.type==='verification_offer'?'#1a2a0a':n.read?'#121212':'#1a1a1a',border:n.type==='ban'?'1px solid #FF0024':'1px solid #222',borderRadius:'12px',padding:'12px',marginBottom:'10px',cursor:'pointer'}}>
<div style={{fontWeight:'700',fontSize:'11px'}}>{n.from} {n.verified&&'✓'}</div>
<div style={{fontSize:'12px',fontWeight:'700',marginTop:'4px'}}>{n.title}</div>
<div style={{fontSize:'11px',color:'#aaa'}}>{n.message}</div>
{n.type==='verification_offer'&&<div style={{marginTop:'8px',background:'#00D632',color:'#000',padding:'8px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'800',textAlign:'center'}}>Tap to Request Blue Tick ✓</div>}
</div>
))}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,minHeight:0,overflowY:'auto',padding:'0',background:'#000'}}>
<div style={{padding:'16px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{position:'relative'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:profilePic?'transparent':'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'14px',overflow:'hidden',border:'2px solid #222'}}>
{profilePic?<img src={profilePic} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></>}
</div>
<label style={{position:'absolute',bottom:'-4px',right:'-4px',background:'#FF0024',color:'#fff',width:'24px',height:'24px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',cursor:'pointer',border:'2px solid #000'}}>📷<input type="file" accept="image/*" onChange={handleProfilePicChange} style={{display:'none'}}/></label>
</div>
<div style={{flex:1}}>
<div style={{fontWeight:'800',fontSize:'16px',display:'flex',gap:'6px',alignItems:'center'}}>{isOwner?'Katongole Rashid':editName||'Your Name'} {user?.verified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'12px',color:'#888'}}>{editUsername||'@user'}</div>
</div>
<button onClick={()=>setIsEditing(!isEditing)} style={{background:isEditing?'#fff':'#1a1a1a',color:isEditing?'#000':'#fff',border:'1px solid #333',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>{isEditing?'Close':'Edit'}</button>
</div>
{isEditing&&(
<div style={{marginTop:'14px',background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px'}}>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
<input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Your Name" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'13px'}}/>
<input value={editUsername} onChange={e=>setEditUsername(e.target.value)} placeholder="@username" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'13px'}}/>
<textarea value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Your bio..." rows={3} style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'13px'}}/>
<button onClick={handleSaveProfile} style={{background:'#FF0024',color:'#fff',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'800',fontSize:'13px'}}>Save ✓</button>
</div>
</div>
)}
</div>
<div style={{padding:'12px'}}>
<div style={{fontWeight:'800',fontSize:'14px',marginBottom:'10px'}}>Your Videos</div>
{myVideos.length===0?<div style={{background:'#121212',border:'1px dashed #333',borderRadius:'12px',padding:'20px',textAlign:'center'}}><div style={{fontSize:'13px',fontWeight:'700'}}>No videos yet</div><button onClick={()=>{setUploadMode(null); setShowUpload(true)}} style={{marginTop:'12px',background:'#FF0024',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>+ Post</button></div>:<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>{myVideos.map(v=><div key={v.id} style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',overflow:'hidden'}}><div style={{height:'120px',background:'#000',position:'relative'}}>{renderUniversal(v)}<div style={{position:'absolute',bottom:'4px',right:'4px',background:'rgba(0,0,0,0.8)',color:'#fff',fontSize:'9px',padding:'2px 6px',borderRadius:'8px'}}>👁️ {v.views||0}</div></div><div style={{padding:'8px'}}><div style={{fontSize:'11px',fontWeight:'700'}}>{v.caption}</div></div></div>)}</div>}
</div>
</div>
)}

{page==='following'&&<div style={{flex:1,minHeight:0,padding:'16px',overflowY:'auto'}}><div style={{fontWeight:'700',marginBottom:'12px'}}>Following</div>{Object.keys(follows).filter(k=>follows[k]==='following').length===0?<div style={{color:'#666',fontSize:'13px'}}>No following yet</div>:Object.keys(follows).filter(k=>follows[k]==='following').map(u=><div key={u} style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontWeight:'700',fontSize:'13px'}}>{u}</div><div style={{fontSize:'11px',color:'#00D632'}}>{followCounts[u]||1} followers</div></div><button onClick={()=>handleFollow(u)} style={{background:'#00D632',color:'#000',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Following ✓</button></div>)}</div>}

{showComments!==null&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:60,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowComments(null)}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'14px',maxHeight:'60vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div style={{fontWeight:'700',fontSize:'13px'}}>Comments — {commentCounts[showComments]||0}</div><button onClick={()=>setShowComments(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px'}}>×</button></div>
<div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px',minHeight:0}}>
{(comments[showComments]||[]).map(c=>(
<div key={c.id} style={{display:'flex',gap:'8px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#333',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px'}}>U</div><div><div style={{fontSize:'11px',fontWeight:'700'}}>{c.user}</div><div style={{fontSize:'12px'}}>{c.text}</div></div></div>
))}
{(comments[showComments]||[]).length===0&&<div style={{color:'#666',textAlign:'center',padding:'16px',fontSize:'12px'}}>No comments</div>}
</div>
<div style={{display:'flex',gap:'8px',marginTop:'10px',borderTop:'1px solid #222',paddingTop:'10px'}}>
<input value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder="Add comment..." style={{flex:1,background:'#1a1a1a',border:'1px solid #333',borderRadius:'20px',padding:'8px 12px',color:'#fff',fontSize:'13px'}}/>
<button onClick={()=>handlePostComment(showComments)} style={{background:'#FF0024',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:'700',fontSize:'12px'}}>Post</button>
</div>
</div>
</div>
)}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80,textAlign:'center',maxWidth:'80%'}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{setShowUpload(false); setUploadMode(null)}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px',maxHeight:'85vh',overflowY:'auto',boxSizing:'border-box'}} onClick={e=>e.stopPropagation()}>
{uploadMode===null&&(
<>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'16px',marginBottom:'12px'}}>What do you want to do?</div>
<button onClick={()=>setUploadMode('upload_video')} style={{width:'100%',background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'10px'}}>
<span>📤</span> Upload Videos — For You
</button>
{isOwner?(
<button onClick={()=>setUploadMode('post_muzika')} style={{width:'100%',background:'#1a1a1a',border:'1px solid #00D632',color:'#fff',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'10px'}}>
<span>🎬</span> Post Videos — Muzika — Only UPTOWN Official
</button>
):(
<div style={{width:'100%',background:'#0a0a0a',border:'1px solid #222',padding:'14px',borderRadius:'14px',marginBottom:'10px',textAlign:'center'}}>
<div style={{fontSize:'12px',fontWeight:'700',color:'#888'}}>🎬 Muzika — Only UPTOWN Official posts</div>
</div>
)}
<button onClick={()=>{setShowUpload(false); setUploadMode(null)}} style={{width:'100%',background:'transparent',color:'#666',border:'none',padding:'10px',marginTop:'6px',fontSize:'12px'}}>Cancel</button>
</>
)}
{uploadMode==='upload_video'&&(
<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>setUploadMode(null)} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800',fontSize:'14px'}}>📤 Upload Videos — Be on For You!</div></div>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',boxSizing:'border-box'}}/>
{uploadPreview&&<div style={{marginTop:'10px'}}><video src={uploadPreview.url} style={{width:'100%',maxHeight:'200px',borderRadius:'12px',objectFit:'contain'}} autoPlay loop playsInline/></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — No porn/sex!" style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'10px',color:'#fff',boxSizing:'border-box'}}/>
<button onClick={()=>handlePostNow('upload_video')} style={{marginTop:'12px',width:'100%',background:'#fff',color:'#000',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900'}}>Post on For You ✓</button>
</>
)}
{uploadMode==='post_muzika'&&(
<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>setUploadMode(null)} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800',fontSize:'14px'}}>🎬 Post Videos — Muzika — Only UPTOWN Official</div></div>
<div style={{background:'#0a2a0a',border:'1px solid #00D632',borderRadius:'12px',padding:'10px'}}>
<div style={{fontSize:'11px',fontWeight:'800',color:'#00D632'}}>🔗 EVERY LINK ACCEPTED — Only UPTOWN Official — No porn/sex!</div>
<div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
<input value={universalLink} onChange={e=>setUniversalLink(e.target.value)} placeholder="Paste ANY link — No porn/sex!" style={{flex:1,background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'11px'}}/>
<button onClick={handlePasteLink} style={{background:'#fff',color:'#000',border:'none',padding:'10px 12px',borderRadius:'10px',fontWeight:'800',fontSize:'11px'}}>📋 Paste</button>
</div>
{linkPreview&&<div style={{marginTop:'8px',background:'#000',borderRadius:'10px',padding:'8px',border:'1px solid #00D632'}}><div style={{fontSize:'10px',fontWeight:'700',color:'#00D632'}}>✓ {linkPreview.platform}</div><div style={{marginTop:'6px',height:'120px',background:'#000',borderRadius:'8px',overflow:'hidden'}}>{renderUniversal({mediaUrl:universalLink,linkInfo:linkPreview})}</div></div>}
</div>
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — No porn/sex!" style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('post_muzika')} style={{marginTop:'12px',width:'100%',background:'#FF0024',color:'#fff',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900'}}>Post Videos in Muzika ✓ — Only UPTOWN Official</button>
</>
)}
</div>
</div>
)}

<div style={{height:'64px',minHeight:'64px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0,padding:'0 4px',boxSizing:'border-box'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px',fontWeight:page==='foryou'?'700':'400'}}>Home</span></button>
<button onClick={()=>{setPage('inbox'); const u=notifications.map(n=>({...n,read:true})); setNotifications(u); localStorage.setItem('uptown_notifications_ban_system',JSON.stringify(u)); if(isOwner){let ownerNotifs=JSON.parse(localStorage.getItem('uptown_owner_notifications')||'[]'); ownerNotifs=ownerNotifs.map(x=>({...x,read:true})); localStorage.setItem('uptown_owner_notifications',JSON.stringify(ownerNotifs))}}} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1,position:'relative'}}><span style={{fontSize:'18px'}}>✉</span><span style={{fontSize:'10px'}}>Inbox</span>{unread>0&&<span style={{position:'absolute',top:'0px',right:'18px',background:'#FF0024',color:'#fff',fontSize:'8px',padding:'2px 4px',borderRadius:'8px',fontWeight:'800'}}>{unread}</span>}</button>
<button onClick={()=>{setUploadMode(null); setShowUpload(true)}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>+</button>
<button onClick={()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()}); setPage('live')}} style={{background:'none',border:'none',color:page==='live'?'#FF0024':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1}}><span style={{fontSize:'18px',color:page==='live'?'#FF0024':'#666'}}>🔴</span><span style={{fontSize:'10px',fontWeight:page==='live'?'700':'400',color:page==='live'?'#FF0024':'#666'}}>Live</span></button>
<button onClick={()=>setPage('you')} style={{background:'none',border:'none',color:page==='you'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1}}><span style={{fontSize:'18px'}}>○</span><span style={{fontSize:'10px',fontWeight:page==='you'?'700':'400'}}>You</span></button>
</div>

{showAuth&&(
<div style={{position:'fixed',inset:0,background:'#000',zIndex:100,display:'flex',flexDirection:'column',padding:'20px',justifyContent:'center',boxSizing:'border-box'}}>
<div style={{textAlign:'center',marginBottom:'16px'}}><svg width="100" height="120" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg></div>
<div style={{display:'flex',background:'#121212',borderRadius:'20px',padding:'4px',marginBottom:'12px'}}>
<button onClick={()=>setAuthMode('signup')} style={{flex:1,background:authMode==='signup'?'#fff':'transparent',color:authMode==='signup'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800',fontSize:'13px'}}>Sign Up</button>
<button onClick={()=>setAuthMode('login')} style={{flex:1,background:authMode==='login'?'#fff':'transparent',color:authMode==='login'?'#000':'#888',border:'none',padding:'10px',borderRadius:'16px',fontWeight:'800',fontSize:'13px'}}>Login</button>
</div>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
{authMode==='signup'&&<><input value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} placeholder="Your Name" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',fontSize:'14px'}}/><input value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} placeholder="Username" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',fontSize:'14px'}}/></>}
<input value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="Email" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',fontSize:'14px'}}/>
<input value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} type="password" placeholder="Password" style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',color:'#fff',fontSize:'14px'}}/>
<button onClick={handleAuth} style={{background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'14px'}}>Continue</button>
</div>
</div>
)}
</div>
)
}
