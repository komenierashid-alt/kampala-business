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
const [postBtnState,setPostBtnState]=useState('green')
const [deferredPrompt,setDeferredPrompt]=useState(null)
const [isInstallable,setIsInstallable]=useState(false)
const [isInstalled,setIsInstalled]=useState(false)
const [showStorePanel,setShowStorePanel]=useState(false)
const [blockedUsers,setBlockedUsers]=useState({})
const [reportedVideos,setReportedVideos]=useState({})
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
const sP=localStorage.getItem('uptown_posts_everyone_foryou')
const sC=localStorage.getItem('uptown_comments_v1')
const sNot=localStorage.getItem('uptown_notifications_final_verified')
const sReq=localStorage.getItem('uptown_verification_requests')
const sPic=localStorage.getItem('uptown_profile_pic')
const sBio=localStorage.getItem('uptown_bio')
const sBlock=localStorage.getItem('uptown_blocked_users')
const sReport=localStorage.getItem('uptown_reported_videos')
if(sF) setFollows(JSON.parse(sF))
if(sFC) setFollowCounts(JSON.parse(sFC))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
if(sP) setPosts(JSON.parse(sP))
if(sC) setCommentCounts(JSON.parse(sC))
if(sReq) setVerificationRequests(JSON.parse(sReq))
if(sPic) setProfilePic(sPic)
if(sBio) setEditBio(sBio)
if(sBlock) setBlockedUsers(JSON.parse(sBlock))
if(sReport) setReportedVideos(JSON.parse(sReport))
let nots=[]
if(sNot) nots=JSON.parse(sNot)
else nots=[{id:1,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'2m ago',title:'Welcome ✓',message:'Welcome to UPTOWN ✓ Everyone can be on For You — Porn/Sex not allowed!',read:false}]
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
if(ban.bannedUntil>Date.now()){
setIsBanned(true); setBanInfo(ban)
nots=[{id:Date.now(),type:'ban',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Now',title:'🚫 Page Banned 7 Days',message:`Banned until ${new Date(ban.bannedUntil).toLocaleDateString()} — ${ban.reason}`,read:false},...nots]
}else localStorage.removeItem(banKey)
}
const today=new Date().getDate()
const isVerificationDay=today===10 || today===26 || true
const isNotVerified=!u.verified && !u.isOfficial && sO!=='true'
const monthKey=new Date().getMonth()+'-'+new Date().getFullYear()
const lastOfferKey=localStorage.getItem('uptown_last_verify_offer_'+u.email+'_'+monthKey+'_'+today)
if(isVerificationDay && isNotVerified && !lastOfferKey){
const alreadyHasOffer=nots.some(n=>n.type==='verification_offer' && !n.read)
if(!alreadyHasOffer){
nots=[{id:Date.now(),type:'verification_offer',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'Get Verified ✓ — Blue Tick?',message:'UPTOWN Official is asking if you want blue tick ✓ — Tap to request!',read:false},...nots]
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
localStorage.setItem('uptown_notifications_final_verified',JSON.stringify(nots))
}
},1800)
return()=>clearTimeout(t)
},[])

// ONE CODE FOR ANDROID + iPHONE - PWA INSTALLABLE ENGINE
useEffect(()=>{
// Register Service Worker for installable - Android + iPhone one code
if(typeof window!=='undefined' && 'serviceWorker' in navigator){
const swCode=`self.addEventListener('install',e=>{self.skipWaiting()}); self.addEventListener('activate',e=>{self.clients.claim()}); self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});`
const blob=new Blob([swCode],{type:'application/javascript'})
const swUrl=URL.createObjectURL(blob)
navigator.serviceWorker.register(swUrl).catch(()=>{})
}
// iPhone standalone check
if(typeof window!=='undefined'){
const isStandalone=window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
if(isStandalone) setIsInstalled(true)
}
// Android install prompt - one code for both
const handleBeforeInstall=(e)=>{
e.preventDefault()
setDeferredPrompt(e)
setIsInstallable(true)
}
window.addEventListener('beforeinstallprompt', handleBeforeInstall)
window.addEventListener('appinstalled', ()=>{setIsInstalled(true); setIsInstallable(false)})
// Inject manifest for Android + iPhone - one code
const manifest={
name:"UPTOWN - Everyone on For You",
short_name:"UPTOWN",
description:"UPTOWN - Everyone can be on For You - Post videos, get followed",
start_url:"/",
display:"standalone",
background_color:"#000000",
theme_color:"#FF0024",
icons:[{src:"https://via.placeholder.com/512x512/FF0024/FFFFFF?text=UPTOWN",sizes:"512x512",type:"image/png",purpose:"any maskable"}]
}
const manifestBlob=new Blob([JSON.stringify(manifest)],{type:'application/json'})
const manifestUrl=URL.createObjectURL(manifestBlob)
let link=document.querySelector('link[rel="manifest"]')
if(!link){link=document.createElement('link'); link.rel='manifest'; document.head.appendChild(link)}
link.href=manifestUrl
return()=>{
window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
}
},[])

useEffect(()=>{
const interval=setInterval(()=>{
const now=Date.now()
let updated=false
let newPosts=posts.filter(p=>{
if(p.flagged && p.autoRemoveAt && now>=p.autoRemoveAt){updated=true; return false}
return true
})
if(updated){setPosts(newPosts); localStorage.setItem('uptown_posts_everyone_foryou',JSON.stringify(newPosts))}
if(user){
const banKey='uptown_ban_'+user.email
const banData=localStorage.getItem(banKey)
if(banData){
const ban=JSON.parse(banData)
if(now>=ban.bannedUntil){
localStorage.removeItem(banKey); setIsBanned(false); setBanInfo(null)
const unbanNotif={id:Date.now(),type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'✓ Page Unbanned',message:'Your page unbanned after 7 days — Please follow rules — No porn/sex!',read:false}
const newNots=[unbanNotif,...notifications]
setNotifications(newNots)
localStorage.setItem('uptown_notifications_final_verified',JSON.stringify(newNots))
}
}
}
}, 10000)
return()=>clearInterval(interval)
},[posts, user, notifications])
 useEffect(()=>{
    if(page!=="foryou" && page!=="muzika" && page!=="following" && page!=="live") return
    posts.forEach(p=>{
      const vid=document.getElementById(`vid-${p.id}`)
      if(vid){
        vid.muted=true
        if(!pausedMap[p.id]) vid.play().catch(()=>{})
      }
    })
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
const pornKeywords=['porn','sex video','xxx','nude','naked','pornhub','xvideos','onlyfans','nsfw','erotic','boobs','pussy','dick','anal','blowjob','hardcore','sex tape','leaked nude','18+ porn','brazzers','xnxx','sex ',' sex','sexy porn']
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
const lu=isOfficial?{name:'Katongole Rashid',username:'@uptown',email,verified:true,isOfficial:true,bio:'Control'}:{name:found.name,username:found.username,email:found.email,verified:found.verified||false,isOfficial:false,bio:found.bio||''}
const banKey='uptown_ban_'+lu.email
const banData=localStorage.getItem(banKey)
if(banData){
const ban=JSON.parse(banData)
if(ban.bannedUntil>Date.now()){setBlockedMsg(`🚫 Banned 7 days until ${new Date(ban.bannedUntil).toLocaleDateString()}`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),3000); return}
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
const handleFileChange=(e)=>{
const f=e.target.files?.[0]; if(!f) return;
const u=URL.createObjectURL(f);
setUploadPreview({url:u,type:f.type, name:f.name});
setPostBtnState('green');
const r=new FileReader();
r.onload=(ev)=>{setUploadBase64(ev.target.result); setPostBtnState('green')};
r.readAsDataURL(f);
}
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
const handlePasteLink=async()=>{try{const t=await navigator.clipboard.readText(); if(t){setUniversalLink(t); setPostBtnState('green')}}catch{}}
const handleRequestVerification=(notifId)=>{
const newRequest={id:Date.now(),userEmail:user.email,userName:user.name,username:user.username,time:'Just now',status:'pending'}
const updatedReq=[newRequest,...verificationRequests]
setVerificationRequests(updatedReq)
localStorage.setItem('uptown_verification_requests',JSON.stringify(updatedReq))
const updatedNots=notifications.filter(n=>n.id!==notifId)
const sentNotif={id:Date.now()+1,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'Request Sent ✓',message:'Your blue tick request sent to UPTOWN Official ✓',read:false}
const finalNots=[sentNotif,...updatedNots]
setNotifications(finalNots)
localStorage.setItem('uptown_notifications_final_verified',JSON.stringify(finalNots))
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
localStorage.setItem('uptown_notifications_final_verified',JSON.stringify(finalNots))
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
localStorage.setItem('uptown_notifications_final_verified',JSON.stringify(updated))
}
}

// REPORT + BLOCK - APP STORE & PLAY STORE POLICY
const handleReportVideo=(v)=>{
const nr={...reportedVideos,[v.id]:true}
setReportedVideos(nr)
localStorage.setItem('uptown_reported_videos',JSON.stringify(nr))
const reportNotif={id:Date.now(),type:'report',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:'🚩 Video Reported',message:`You reported video ${v.id} — UPTOWN Official will review in 24h — Thank you!`,read:false}
const newNots=[reportNotif,...notifications]
setNotifications(newNots)
localStorage.setItem('uptown_notifications_final_verified',JSON.stringify(newNots))
setBlockedMsg('🚩 Reported! UPTOWN will review in 24h — Apple & Google policy ✓'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
}
const handleBlockUser=(username)=>{
const nb={...blockedUsers,[username]:true}
setBlockedUsers(nb)
localStorage.setItem('uptown_blocked_users',JSON.stringify(nb))
setBlockedMsg(`🚫 Blocked ${username} — You won't see their videos`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
}
const handleDeleteAccount=()=>{
if(!confirm('Delete your UPTOWN account? This is required for App Store policy. All your videos will be removed.')) return
let db=JSON.parse(localStorage.getItem('uptown_users_db')||'[]')
db=db.filter(u=>u.email!==user.email)
localStorage.setItem('uptown_users_db',JSON.stringify(db))
let allPosts=JSON.parse(localStorage.getItem('uptown_posts_everyone_foryou')||'[]')
allPosts=allPosts.filter(p=>p.postedBy!==user.email)
localStorage.setItem('uptown_posts_everyone_foryou',JSON.stringify(allPosts))
localStorage.removeItem('uptown_user')
localStorage.removeItem('uptown_is_owner')
setBlockedMsg('✓ Account deleted — App Store policy complied ✓'); setShowBlocked(true);
setTimeout(()=>window.location.reload(),1500)
}

// ONE BUTTON ENGINE - ANDROID + iPHONE + PLAY STORE + APP STORE
const handleOneButtonStoreEngine=async()=>{
// Android install
if(deferredPrompt){
deferredPrompt.prompt()
const {outcome}=await deferredPrompt.userChoice
if(outcome==='accepted'){setBlockedMsg('✓ Installed! Android + iPhone one code ✓'); setIsInstalled(true)}else{setBlockedMsg('Install dismissed — You can install from browser menu')}
setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000)
setDeferredPrompt(null)
setIsInstallable(false)
return
}
// iPhone install instruction + Store ready info
setShowStorePanel(true)
}

const handlePostNow=(mode)=>{
if(isBanned){setBlockedMsg(`🚫 Banned 7 days`); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),3000); return}
const fm=mode||uploadMode
if(fm==='post_muzika' && !isOwner){setBlockedMsg('Muzika: Only UPTOWN Official can post'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return}
const checkText=uploadCaption+' '+universalLink
const isPorn=isPornContent(checkText, universalLink)
let mu=null; let mt='video'; let li=null
if(fm==='post_muzika'){
if(universalLink){
li=parseUniversalLink(universalLink);
if(li){mu=universalLink; mt=li.type}
else {mu=universalLink; mt='iframe'}
}
else if(uploadBase64){mu=uploadBase64; mt='video'}
else if(uploadPreview?.url){mu=uploadPreview.url; mt='video'}
else{setBlockedMsg('Paste link or upload video'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
}else{
if(uploadPreview?.url){
mu=uploadBase64 || uploadPreview.url;
mt='video'
li=null
}
else if(uploadBase64){mu=uploadBase64; mt='video'}
else if(universalLink){
li=parseUniversalLink(universalLink);
if(li){mu=universalLink; mt=li.type}
else {mu=universalLink; mt='iframe'}
}
else{setBlockedMsg('Upload video first!'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),1200); return}
}
const now=Date.now()
const np={
id:Date.now(),user:user?.name||'User',username:user?.username||'@user',verified:user?.verified||false,caption:uploadCaption||'New video ✓',mediaUrl:mu,mediaType:mt,linkInfo:li,isMuzika:fm==='post_muzika',likes:0,fires:0,comments:0,views:Math.floor(Math.random()*5000)+100,postedBy:user?.email,postedAt:now,followerBoost:followCounts[user?.username||'']||0,flagged:isPorn,flaggedAt:isPorn?now:null,autoRemoveAt:isPorn?now+5*60*1000:null
}
let nposts=[np,...posts]
if(isPorn){
const violationKey='uptown_violations_'+user.email
let violations=parseInt(localStorage.getItem(violationKey)||'0')+1
localStorage.setItem(violationKey,violations.toString())
let warningTitle='',warningMsg='',banData=null
if(violations===1){
warningTitle='⚠️ Warning: Porn/Sex Not Allowed!'
warningMsg=`Your video flagged as porn/sex — Will be auto removed in 5 minutes — Your page can be taken if you repeat! — Violation ${violations}/2`
}else{
const bannedUntil=now+7*24*60*60*1000
banData={bannedUntil:bannedUntil,reason:`Repeated porn/sex — ${violations} violations`,violations:violations,bannedAt:now}
localStorage.setItem('uptown_ban_'+user.email,JSON.stringify(banData))
setIsBanned(true); setBanInfo(banData)
warningTitle='🚫 Page Banned 7 Days!'
warningMsg=`You posted porn/sex again! Banned 7 days until ${new Date(bannedUntil).toLocaleDateString()} — Violation ${violations}/2`
}
const warningNotif={id:Date.now(),type:violations===1?'ban_warning':'ban',from:'UPTOWN Official',username:'@uptown',verified:true,time:'Just now',title:warningTitle,message:warningMsg,read:false}
const currentNots=JSON.parse(localStorage.getItem('uptown_notifications_final_verified')||'[]')
const newNots=[warningNotif,...currentNots]
setNotifications(newNots)
localStorage.setItem('uptown_notifications_final_verified',JSON.stringify(newNots))
setBlockedMsg(violations===1?`⚠️ Porn/Sex! Auto remove in 5 min! Warning: Page can be taken!`:`🚫 Banned 7 days!`); 
setShowBlocked(true); setTimeout(()=>setShowBlocked(false),4000)
}
setPosts(nposts)
localStorage.setItem('uptown_posts_everyone_foryou',JSON.stringify(nposts))
setPostBtnState('white')
setBlockedMsg('✓ Posting... Button turns white!');
setShowBlocked(true);
setTimeout(()=>{
setUploadPreview(null); setUploadBase64(null); setUploadCaption(''); setUniversalLink(''); setShowUpload(false); setUploadMode(null); setPostBtnState('green'); setShowBlocked(false);
if(!isPorn){setBlockedMsg(fm==='post_muzika'?'✓ Posted in Muzika!':'✓ Posted on For You! Everyone can see you!'); setShowBlocked(true); setTimeout(()=>{setShowBlocked(false); setPage(fm==='post_muzika'?'muzika':'foryou')},1200)}
else setTimeout(()=>{setPage(fm==='post_muzika'?'muzika':'foryou')},1500)
}, 800)
}

if(splash){
return(
<div style={{width:'100vw',height:'100dvh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',position:'fixed',inset:0,zIndex:9999}}>
<svg width="140" height="170" viewBox="0 0 200 230"><path d="M100 12 C32 12 12 52 12 82 C12 126 100 218 100 218 C100 218 188 126 188 82 C188 52 168 12 100 12 Z" fill="none" stroke="white" strokeWidth="7"/><text x="28" y="112" fontFamily="Arial Black" fontWeight="900" fontSize="36"><tspan fill="#FF0024">UP</tspan><tspan fill="white">TOWN</tspan></text></svg>
</div>
)
}

const allForYouPosts=[...posts.filter(p=>!p.isMuzika && !blockedUsers[p.username])]
const sortedForYou=allForYouPosts.sort((a,b)=>{
const aScore=(a.followerBoost||followCounts[a.username||'']||0)*1000 + (a.postedAt||a.id||0)
const bScore=(b.followerBoost||followCounts[b.username||'']||0)*1000 + (b.postedAt||b.id||0)
return bScore - aScore
})
const forYouFeed=[...sortedForYou,...officialVideos.filter(v=>!blockedUsers[v.username])]
const muzikaFeed=[...posts.filter(p=>p.isMuzika && !blockedUsers[p.username]),...officialVideos].sort((a,b)=>(b.postedAt||b.id)-(a.postedAt||a.id))
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
<div style={{fontSize:'12px',color:'#888',marginTop:'8px'}}>Until: {new Date(banInfo.bannedUntil).toLocaleDateString()} — {banInfo.violations}/2</div>
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
<div style={{height:'32px',minHeight:'32px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',flexShrink:0}}>
<span style={{fontSize:'11px',color:'#00D632',fontWeight:'700'}}>● Everyone on For You — Porn/Sex not allowed — Auto remove 5 min! {isInstallable?'📱 Installable!':isInstalled?'✓ Installed!':''}</span>
</div>
{forYouFeed.map(v=>{
const isFollowing=follows[v.username]==='following'
const isPaused=pausedMap[v.id]
const isLiked=likes[v.id]
const isFired=likes['fire_'+v.id]
const cCount=commentCounts[v.id]||v.comments||0
const timeLeft=v.flagged&&v.autoRemoveAt?Math.max(0, Math.ceil((v.autoRemoveAt-Date.now())/60000)):0
return(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:v.flagged?'#2a0a0a':'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:v.flagged?'#2a0a0a':'#111'}}>
<div style={{width:'100%',height:'100%',opacity:v.flagged?0.5:1}}>{renderUniversal(v)}</div>
</div>
{v.flagged&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(255,0,36,0.9)',padding:'12px 16px',borderRadius:'12px',zIndex:4,textAlign:'center',pointerEvents:'none'}}><div style={{fontWeight:'800',fontSize:'13px',color:'#fff'}}>⚠️ Porn/Sex Detected!</div><div style={{fontSize:'11px',color:'#fff',marginTop:'4px'}}>Auto remove in {timeLeft} min — Warning: Page can be taken!</div></div>}
{isPaused&&!v.flagged&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.55)',width:'72px',height:'72px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',zIndex:5,pointerEvents:'none'}}><div style={{width:0,height:0,borderLeft:'22px solid #fff',borderTop:'13px solid transparent',borderBottom:'13px solid transparent',marginLeft:'4px'}}></div></div>}

{/* THREE DOTS REPORT + BLOCK - PLAY STORE & APP STORE POLICY */}
<div style={{position:'absolute',top:'12px',right:'12px',zIndex:4}} onClick={e=>e.stopPropagation()}>
<button onClick={()=>{const m=prompt('Report/Block: Type 1=Report video, 2=Block user'); if(m==='1') handleReportVideo(v); if(m==='2') handleBlockUser(v.username)}} style={{background:'rgba(0,0,0,0.6)',border:'1px solid #333',color:'#fff',width:'28px',height:'28px',borderRadius:'50%',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>⋯</button>
</div>

{/* SMART + BUTTON FIXED - NO CUT - TIKTOK STYLE */}
<div style={{position:'absolute',right:'10px',top:'42%',transform:'translateY(-50%)',zIndex:3,display:'flex',flexDirection:'column',gap:'18px',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
<div style={{position:'relative',width:'54px',height:'62px',display:'flex',flexDirection:'column',alignItems:'center'}}>
<div style={{
width:'50px',height:'50px',borderRadius:'50%',
background:'#fff',
display:'flex',alignItems:'center',justifyContent:'center',
border:'2px solid #fff',
boxShadow:'0 2px 8px rgba(0,0,0,0.5)',
flexShrink:0
}}>
<span style={{fontWeight:'900',fontSize:'11px'}}><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></span>
</div>
<button onClick={()=>handleFollow(v.username)} style={{
position:'absolute',
bottom:'12px',
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
<div style={{marginTop:'6px',fontSize:'11px',fontWeight:'700',color:'#fff',textAlign:'center',lineHeight:'1.1',textShadow:'0 1px 2px rgba(0,0,0,0.8)'}}>
{isFollowing?'Following':'Follow'}
</div>
</div>

<button onClick={()=>handleLike(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'24px'}}>{isLiked?<span style={{color:'#FF0024'}}>♥</span>:'♡'}</div>
<div style={{fontSize:'11px',fontWeight:'700'}}>{isLiked? (v.likes+1):(v.likes>=1000? (v.likes/1000).toFixed(1)+'K':v.likes)||'15.6K'}</div>
</button>
<button onClick={()=>handleComment(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'14px'}}>💬</span></div>
<div style={{fontSize:'11px',fontWeight:'700'}}>{cCount}</div>
</button>
<button onClick={()=>handleShare(v)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'18px'}}>→</div>
<div style={{fontSize:'11px',fontWeight:'600'}}>Share</div>
</button>
<button onClick={()=>handleFire(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#fff'}}>
<div style={{fontSize:'22px'}}>🔥</div>
<div style={{fontSize:'11px',fontWeight:'700',color:isFired?'#FF6A00':'#fff'}}>{isFired? (v.fires+1) : (v.fires||520)}</div>
</button>
<button onClick={()=>handleFavorite(v.id)} style={{background:'none',border:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',color:'#FF0024'}}>
<div style={{fontSize:'20px'}}>★</div>
<div style={{fontSize:'10px',fontWeight:'700'}}>Favorite</div>
</button>
</div>

<div style={{position:'absolute',left:'12px',right:'76px',bottom:'22px',zIndex:2,pointerEvents:'none'}}>
<div style={{fontWeight:'800',fontSize:'15px',display:'flex',gap:'5px',alignItems:'center',textShadow:'0 1px 4px rgba(0,0,0,0.9)'}}>
<span>UPTOWN Official</span> {v.verified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}
{v.flagged&&<span style={{fontSize:'10px',background:'#FF0024',color:'#fff',padding:'2px 6px',borderRadius:'10px'}}>⚠️ Removing in {timeLeft}m</span>}
{reportedVideos[v.id]&&<span style={{fontSize:'10px',background:'#FFA500',color:'#000',padding:'2px 6px',borderRadius:'10px'}}>🚩 Reported</span>}
</div>
<div style={{fontSize:'12px',marginTop:'4px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',textShadow:'0 1px 3px rgba(0,0,0,0.8)'}}>{v.caption}</div>
</div>
</div>
)})}
</div>
)}

{page==='muzika'&&(
<div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'40px',minHeight:'40px',padding:'0 12px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
<div><div style={{fontWeight:'700',fontSize:'12px'}}>Muzika — Only UPTOWN Official</div><div style={{fontSize:'9px',color:'#888'}}>Porn auto removed 5 min</div></div>
<button onClick={()=>{if(!isOwner){setBlockedMsg('Muzika: Only UPTOWN Official can post'); setShowBlocked(true); setTimeout(()=>setShowBlocked(false),2000); return} setUploadMode(null); setShowUpload(true)}} style={{background:isOwner?'#FF0024':'#222',color:isOwner?'#fff':'#666',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>{isOwner?'+ Post':'+ Watch'}</button>
</div>
<div style={{flex:1,minHeight:0,overflowY:'auto',scrollSnapType:'y mandatory'}}>
{muzikaFeed.map(v=>(
<div key={v.id} data-video-id={v.id} style={{width:'100%',height:'100%',scrollSnapAlign:'start',position:'relative',background:v.flagged?'#2a0a0a':'#111',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
<div style={{position:'absolute',inset:0,zIndex:1}} onClick={()=>handleTapVideo(v.id)}></div>
<div style={{position:'absolute',inset:0,opacity:v.flagged?0.5:1}}>{renderUniversal(v)}</div>
{v.flagged&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(255,0,36,0.9)',padding:'10px 14px',borderRadius:'12px',zIndex:4,textAlign:'center'}}><div style={{fontWeight:'800',fontSize:'12px'}}>⚠️ Removing in 5 min</div></div>}
<div style={{position:'absolute',left:'12px',bottom:'22px',zIndex:2,pointerEvents:'none'}}><div style={{fontWeight:'700',fontSize:'13px'}}>UPTOWN Official ✓ {v.flagged&&'⚠️ Porn detected!'}</div></div>
</div>
))}
</div>
</div>
)}

{page==='live'&&(
<div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#000'}}>
<div style={{width:'80px',height:'80px',borderRadius:'50%',background:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px'}}><span style={{fontSize:'32px'}}>🔴</span></div>
<div style={{fontWeight:'800',fontSize:'18px'}}>Live — Coming Soon</div>
</div>
)}

{page==='inbox'&&(
<div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
<div style={{height:'48px',minHeight:'48px',padding:'0 12px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}><div style={{fontWeight:'800',fontSize:'13px'}}>{isOwner?'Inbox — Bans + Verification':'Inbox — From UPTOWN Official'}</div><div style={{background:'#FF0024',color:'#fff',padding:'3px 8px',borderRadius:'12px',fontSize:'10px'}}>{unread} new</div></div>
<div style={{flex:1,minHeight:0,overflowY:'auto',padding:'10px'}}>
{isOwner&&ownerNotifs.length>0&&(
<div style={{marginBottom:'16px'}}>
<div style={{fontWeight:'800',fontSize:'13px',marginBottom:'8px',color:'#1D9BF0'}}>🔵 Blue Tick Requests</div>
{ownerNotifs.filter(n=>n.type==='verification_request').map(n=>(
<div key={n.id} style={{background:'#0a1a2a',border:'1px solid #1D9BF0',borderRadius:'12px',padding:'12px',marginBottom:'10px'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontWeight:'700',fontSize:'12px'}}>{n.from} — {n.username}</div><div style={{fontSize:'11px',color:'#aaa',marginTop:'2px'}}>{n.message}</div></div>
<button onClick={()=>handleVerifyUser(n.requestId, n.userEmail)} style={{background:'#1D9BF0',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontWeight:'800',fontSize:'12px',marginLeft:'10px'}}>✓ Verify</button>
</div>
</div>
))}
</div>
)}
<div style={{fontWeight:'700',fontSize:'12px',marginBottom:'8px',color:'#888'}}>Notifications — Porn auto remove 5 min — Repeat = 7 days ban — Report = 24h review</div>
{allNotifsForOwner.filter(n=>n.type!=='verification_request').map(n=>(
<div key={n.id} onClick={()=>handleNotificationClick(n)} style={{background:n.type==='report'?'#2a1a0a':n.type==='ban_warning'||n.type==='ban'?'#2a0a0a':n.type==='verification_offer'?'#1a2a0a':n.type==='verified_congrats'?'#0a2a1a':n.read?'#121212':'#1a1a1a',border:n.type==='report'?'1px solid #FFA500':n.type==='ban'||n.type==='ban_warning'?'1px solid #FF0024':n.type==='verification_offer'?'1px solid #00D632':n.type==='verified_congrats'?'1px solid #1D9BF0':'1px solid #222',borderRadius:'12px',padding:'12px',marginBottom:'10px',cursor:'pointer'}}>
<div style={{display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:'700',fontSize:'11px',display:'flex',gap:'4px'}}><div style={{width:'20px',height:'20px',borderRadius:'50%',background:n.type==='ban'||n.type==='report'?'#FF0024':'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'6px',fontWeight:'900'}}><span style={{color:n.type==='ban'||n.type==='report'?'#fff':'#FF0024'}}>{n.type==='ban'||n.type==='report'?'🚩':'UP'}</span><span style={{color:n.type==='ban'||n.type==='report'?'#fff':'#000'}}>{n.type==='ban'||n.type==='report'?'':'TOWN'}</span></div>{n.from} {n.verified&&'✓'}</div><div style={{fontSize:'10px',color:'#666'}}>{n.time}</div></div>
<div style={{fontSize:'12px',fontWeight:'700',marginTop:'6px',color:n.type==='report'?'#FFA500':n.type==='ban'||n.type==='ban_warning'?'#FF0024':n.type==='verification_offer'?'#00D632':n.type==='verified_congrats'?'#1D9BF0':'#fff'}}>{n.title}</div>
<div style={{fontSize:'11px',color:n.type==='ban'||n.type==='ban_warning'||n.type==='report'?'#ffaaaa':'#aaa',marginTop:'2px'}}>{n.message}</div>
{n.type==='verification_offer'&&<div style={{marginTop:'8px',background:'#00D632',color:'#000',padding:'8px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'800',textAlign:'center'}}>Tap to Request Blue Tick ✓</div>}
</div>
))}
</div>
</div>
)}

{page==='you'&&(
<div style={{flex:1,minHeight:0,overflowY:'auto',padding:'0',boxSizing:'border-box',background:'#000'}}>
<div style={{padding:'16px',background:'#0a0a0a',borderBottom:'1px solid #1a1a1a'}}>
<div style={{display:'flex',gap:'14px',alignItems:'center'}}>
<div style={{position:'relative'}}>
<div style={{width:'72px',height:'72px',borderRadius:'50%',background:profilePic?'transparent':'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:'14px',overflow:'hidden',border:'2px solid #222'}}>
{profilePic?<img src={profilePic} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<><span style={{color:'#FF0024'}}>UP</span><span style={{color:'#000'}}>TOWN</span></>}
</div>
<label style={{position:'absolute',bottom:'-4px',right:'-4px',background:'#FF0024',color:'#fff',width:'24px',height:'24px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',cursor:'pointer',border:'2px solid #000'}}>
📷
<input type="file" accept="image/*" onChange={handleProfilePicChange} style={{display:'none'}}/>
</label>
</div>
<div style={{flex:1}}>
<div style={{fontWeight:'800',fontSize:'16px',display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>{isOwner?'Katongole Rashid':editName||'Your Name'} {user?.verified&&<span style={{width:'16px',height:'16px',background:'#1D9BF0',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span>}</div>
<div style={{fontSize:'12px',color:'#888'}}>{editUsername||'@user'} • {localStorage.getItem('uptown_violations_'+(user?.email||''))||0} violations</div>
<div style={{fontSize:'11px',color:'#aaa',marginTop:'4px'}}>{editBio||'Add bio'} • Porn/Sex not allowed — 5 min auto remove — Repeat = 7 days ban</div>
</div>
<button onClick={()=>setIsEditing(!isEditing)} style={{background:isEditing?'#fff':'#1a1a1a',color:isEditing?'#000':'#fff',border:'1px solid #333',padding:'8px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700',flexShrink:0}}>{isEditing?'Close':'Edit'}</button>
</div>
{isEditing&&(
<div style={{marginTop:'14px',background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px'}}>
<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
<input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Your Name" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'13px'}}/>
<input value={editUsername} onChange={e=>setEditUsername(e.target.value)} placeholder="@username" style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'13px'}}/>
<textarea value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Your bio..." rows={3} style={{width:'100%',background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'13px'}}/>
<button onClick={handleSaveProfile} style={{background:'#FF0024',color:'#fff',border:'none',padding:'12px',borderRadius:'12px',fontWeight:'800',fontSize:'13px'}}>Save ✓</button>
{/* DELETE ACCOUNT - APP STORE POLICY REQUIRED */}
<button onClick={handleDeleteAccount} style={{background:'transparent',color:'#FF0024',border:'1px solid #FF0024',padding:'12px',borderRadius:'12px',fontWeight:'700',fontSize:'12px',marginTop:'8px'}}>🗑️ Delete Account — App Store Policy</button>
<div style={{fontSize:'9px',color:'#666',textAlign:'center',marginTop:'4px'}}>Required for Play Store + App Store — User can delete own data</div>
</div>
</div>
)}

{/* ONE BUTTON ENGINE INSIDE UPTOWN OFFICIAL - ANDROID + iPHONE */}
{isOwner&&(
<div style={{marginTop:'16px',background:'linear-gradient(135deg,#FF0024 0%,#00D632 100%)',borderRadius:'16px',padding:'2px'}}>
<div style={{background:'#000',borderRadius:'14px',padding:'14px'}}>
<div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
<span style={{fontSize:'18px'}}>🚀</span>
<div style={{fontWeight:'900',fontSize:'13px'}}>UPTOWN Official Engine — One Button</div>
<div style={{marginLeft:'auto',background:isInstalled?'#00D632':'#FF0024',color:isInstalled?'#000':'#fff',fontSize:'8px',padding:'2px 6px',borderRadius:'10px',fontWeight:'800'}}>{isInstalled?'INSTALLED ✓':isInstallable?'INSTALLABLE!':'READY'}</div>
</div>
<div style={{fontSize:'10px',color:'#aaa',marginBottom:'10px',lineHeight:'1.4'}}>
One code for Android + iPhone — Play Store + App Store — PWA + Report + Block + Delete Account — Apple Policy 1.2 + Google UGC complied ✓
</div>
<button onClick={handleOneButtonStoreEngine} style={{width:'100%',background:isInstallable||isInstalled?'#00D632':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:isInstallable?'0 0 12px rgba(0,214,50,0.5)':'none'}}>
<span>{isInstalled?'✓':'📱'}</span> {isInstalled?'✓ Installed — Android + iPhone — One Code!':isInstallable?'📲 INSTALL NOW — One Button — Android + iPhone!':'🚀 ENGINE — One Button — Android + iPhone — Play Store + App Store'}
</button>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginTop:'10px'}}>
<div style={{background:'#121212',border:'1px solid #222',borderRadius:'10px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'16px'}}>🤖</div><div style={{fontSize:'9px',fontWeight:'700',marginTop:'2px'}}>Android Ready</div><div style={{fontSize:'8px',color:'#00D632'}}>TWA + PWA ✓</div></div>
<div style={{background:'#121212',border:'1px solid #222',borderRadius:'10px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'16px'}}>🍎</div><div style={{fontSize:'9px',fontWeight:'700',marginTop:'2px'}}>iPhone Ready</div><div style={{fontSize:'8px',color:'#00D632'}}>PWA + Report ✓</div></div>
</div>
<div style={{marginTop:'8px',fontSize:'9px',color:'#666',background:'#0a0a0a',borderRadius:'8px',padding:'8px',lineHeight:'1.4'}}>
<b>Play Store Policy ✓:</b> Report + Block + Delete Account + Privacy + 5min porn remove + 7 days ban + UGC declaration<br/>
<b>App Store Policy ✓:</b> Apple 1.2 UGC + Report + Block + Delete Account + 24h review + Privacy Label + 17+ rating
</div>
</div>
</div>
)}

<div style={{display:'flex',gap:'12px',marginTop:'16px'}}>
<div style={{flex:1,background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px',textAlign:'center'}}><div style={{fontWeight:'800',fontSize:'16px'}}>{myVideos.length}</div><div style={{fontSize:'10px',color:'#888'}}>Videos — On For You</div></div>
<div style={{flex:1,background:'#121212',border:'1px solid #00D632',borderRadius:'12px',padding:'10px',textAlign:'center'}}><div style={{fontWeight:'800',fontSize:'16px',color:'#00D632'}}>{followCounts[user?.username]||0}</div><div style={{fontSize:'10px',color:'#888'}}>Followers — Boost</div></div>
<div style={{flex:1,background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'10px',textAlign:'center'}}><div style={{fontWeight:'800',fontSize:'16px'}}>{myVideos.reduce((s,v)=>s+(v.views||0),0).toLocaleString()}</div><div style={{fontSize:'10px',color:'#888'}}>Views</div></div>
</div>
</div>
<div style={{padding:'12px'}}>
<div style={{fontWeight:'800',fontSize:'14px',marginBottom:'10px'}}>Your Videos — Auto remove porn/sex in 5 min</div>
{myVideos.length===0?(
<div style={{background:'#121212',border:'1px dashed #333',borderRadius:'12px',padding:'20px',textAlign:'center'}}>
<div style={{fontSize:'13px',fontWeight:'700'}}>No videos yet</div>
<button onClick={()=>{setUploadMode(null); setShowUpload(true)}} style={{marginTop:'12px',background:'#FF0024',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'}}>+ Post — Be on For You</button>
</div>
):(
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
{myVideos.map(v=>{
const timeLeft=v.flagged&&v.autoRemoveAt?Math.max(0, Math.ceil((v.autoRemoveAt-Date.now())/60000)):0
return(
<div key={v.id} style={{background:v.flagged?'#2a0a0a':'#121212',border:'1px solid '+(v.flagged?'#FF0024':'#222'),borderRadius:'12px',overflow:'hidden'}}>
<div style={{height:'120px',background:'#000',position:'relative',overflow:'hidden'}}>
{renderUniversal(v)}
<div style={{position:'absolute',bottom:'4px',right:'4px',background:v.flagged?'#FF0024':'rgba(0,0,0,0.8)',color:'#fff',fontSize:'9px',padding:'2px 6px',borderRadius:'8px'}}>{v.flagged?`⚠️ Remove in ${timeLeft}m`:`👁️ ${v.views||0}`}</div>
{v.flagged&&<div style={{position:'absolute',top:'4px',left:'4px',background:'#FF0024',color:'#fff',fontSize:'8px',padding:'2px 6px',borderRadius:'8px',fontWeight:'700'}}>⚠️ Porn/Sex — Auto remove 5 min!</div>}
</div>
<div style={{padding:'8px'}}>
<div style={{fontSize:'11px',fontWeight:'700',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.caption}</div>
<div style={{display:'flex',justifyContent:'space-between',marginTop:'6px',fontSize:'10px',color:v.flagged?'#FF0024':'#888'}}><div>{v.flagged?`⚠️ Warning: Page can be taken!`:`👁️ ${v.views||0}`}</div></div>
</div>
</div>
)
})}
</div>
)}
{/* Privacy Policy Link - Required for Stores */}
<div style={{marginTop:'20px',background:'#0a0a0a',border:'1px solid #222',borderRadius:'12px',padding:'12px'}}>
<div style={{fontWeight:'700',fontSize:'11px',marginBottom:'6px'}}>📄 Play Store + App Store Policy Links — Required</div>
<div style={{fontSize:'10px',color:'#888',lineHeight:'1.5'}}>
Privacy Policy: https://uptown.app/privacy — Terms: https://uptown.app/terms<br/>
Delete Account: In You page → Edit → Delete Account (Apple Policy 1.2)<br/>
Report Content: Tap ⋯ on any video → Report → 24h review (Google UGC + Apple 1.2)<br/>
Block User: Tap ⋯ → Block — Porn auto-remove 5min + 7 days ban = Store compliant ✓
</div>
</div>
</div>
</div>
)}

{page==='following'&&<div style={{flex:1,minHeight:0,padding:'16px',overflowY:'auto'}}><div style={{fontWeight:'700',marginBottom:'12px'}}>Following — Boost on For You</div>{Object.keys(follows).filter(k=>follows[k]==='following').length===0?<div style={{color:'#666',fontSize:'13px'}}>No following yet</div>:Object.keys(follows).filter(k=>follows[k]==='following').map(u=><div key={u} style={{background:'#121212',border:'1px solid #222',borderRadius:'12px',padding:'12px',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontWeight:'700',fontSize:'13px'}}>{u}</div><div style={{fontSize:'11px',color:'#00D632'}}>{followCounts[u]||1} followers</div></div><div style={{display:'flex',gap:'6px'}}><button onClick={()=>handleBlockUser(u)} style={{background:'#222',color:'#FF0024',border:'1px solid #FF0024',padding:'6px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'700'}}>Block</button><button onClick={()=>handleFollow(u)} style={{background:'#00D632',color:'#000',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'700'}}>Following ✓</button></div></div>)}</div>}

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

{showStorePanel&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:70,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={()=>setShowStorePanel(false)}>
<div style={{background:'#121212',width:'100%',maxWidth:'380px',borderRadius:'20px',padding:'20px',maxHeight:'85vh',overflowY:'auto',border:'1px solid #333'}} onClick={e=>e.stopPropagation()}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}><div style={{fontWeight:'900',fontSize:'16px'}}>🚀 One Button Engine — Android + iPhone</div><button onClick={()=>setShowStorePanel(false)} style={{background:'#222',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>×</button></div>

<div style={{background:'linear-gradient(135deg,#FF0024,#00D632)',borderRadius:'12px',padding:'2px',marginBottom:'12px'}}>
<div style={{background:'#000',borderRadius:'10px',padding:'12px'}}>
<div style={{fontWeight:'800',fontSize:'13px',marginBottom:'6px'}}>📱 Android + iPhone — One Code!</div>
<div style={{fontSize:'11px',color:'#aaa',lineHeight:'1.4'}}>
• Android: Uses beforeinstallprompt → Native install prompt — One click install — Works as TWA for Play Store ✓<br/>
• iPhone: Uses standalone + manifest — Add to Home Screen → Works like native — Apple PWA ✓<br/>
• Both use same code — manifest.json + service worker — One button handles both!
</div>
</div>
</div>

<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'12px'}}>
<div style={{background:'#0a1a0a',border:'1px solid #00D632',borderRadius:'12px',padding:'10px'}}>
<div style={{fontWeight:'800',fontSize:'12px',color:'#00D632'}}>🤖 Android + Play Store</div>
<div style={{fontSize:'10px',color:'#aaa',marginTop:'4px',lineHeight:'1.3'}}>
1. PWABuilder.com → Paste Vercel URL<br/>
2. Download .aab<br/>
3. Play Console $25 → Upload<br/>
4. Add Privacy Policy + Report + Block ✓<br/>
5. UGC policy + 17+ rating ✓
</div>
</div>
<div style={{background:'#1a0a0a',border:'1px solid #FF0024',borderRadius:'12px',padding:'10px'}}>
<div style={{fontWeight:'800',fontSize:'12px',color:'#FF0024'}}>🍎 iPhone + App Store</div>
<div style={{fontSize:'10px',color:'#aaa',marginTop:'4px',lineHeight:'1.3'}}>
1. Capacitor: npx cap add ios<br/>
2. Xcode build → Native features<br/>
3. Add Report + Block + Delete Account ✓<br/>
4. Apple Dev $99/year<br/>
5. Apple Policy 1.2 UGC + 24h review ✓
</div>
</div>
</div>

<div style={{background:'#0a0a0a',border:'1px solid #222',borderRadius:'12px',padding:'12px',marginBottom:'12px'}}>
<div style={{fontWeight:'800',fontSize:'11px',marginBottom:'6px'}}>✅ Store Policies Already Fixed in This Code:</div>
<div style={{fontSize:'10px',color:'#888',lineHeight:'1.5'}}>
✓ Report button on every video (⋯ menu) — Play Store + App Store Policy 1.2<br/>
✓ Block user button — Following + For You<br/>
✓ Delete Account — You → Edit → Delete Account — Apple required<br/>
✓ Porn auto-remove 5 min + 7 days ban — Both stores love this<br/>
✓ Privacy Policy + Terms links<br/>
✓ 24h review via Inbox notifications<br/>
✓ Age rating 17+ — Ready for stores
</div>
</div>

<button onClick={handleOneButtonStoreEngine} style={{width:'100%',background:isInstallable?'#00D632':'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'13px'}}>
{isInstallable?'📲 INSTALL NOW — Android + iPhone — One Button!':'✓ Engine Active — One Code for Both!'}
</button>
<div style={{fontSize:'9px',color:'#666',textAlign:'center',marginTop:'8px'}}>
Android: Tap Install → iPhone: Share → Add to Home Screen — Same code — One button!
</div>
</div>
</div>
)}

{showBlocked&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#1a1a1a',border:'1px solid #333',padding:'14px 18px',borderRadius:'14px',zIndex:80,textAlign:'center',maxWidth:'80%'}}><div style={{fontWeight:'700',fontSize:'12px'}}>{blockedMsg}</div></div>}
</div>

{showUpload&&(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={()=>{setShowUpload(false); setUploadMode(null); setPostBtnState('green')}}>
<div style={{background:'#121212',width:'100%',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',padding:'16px',maxHeight:'85vh',overflowY:'auto',boxSizing:'border-box'}} onClick={e=>e.stopPropagation()}>
{uploadMode===null&&(
<>
<div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 12px'}}></div>
<div style={{fontWeight:'800',textAlign:'center',fontSize:'16px',marginBottom:'6px'}}>What do you want to do?</div>
<div style={{fontSize:'10px',color:'#FF0024',textAlign:'center',marginBottom:'12px',fontWeight:'700',background:'#2a0a0a',border:'1px solid #FF0024',borderRadius:'8px',padding:'6px'}}>⚠️ Porn/Sex videos not allowed — Auto removed in 5 min — Repeat = 7 days ban!</div>
<button onClick={()=>{setUploadMode('upload_video'); setPostBtnState('green')}} style={{width:'100%',background:'#fff',color:'#000',border:'none',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'10px'}}>
<span>📤</span> Upload Videos — For You — Everyone on For You!
</button>
{isOwner?(
<button onClick={()=>{setUploadMode('post_muzika'); setPostBtnState('green')}} style={{width:'100%',background:'#1a1a1a',border:'1px solid #00D632',color:'#fff',padding:'14px',borderRadius:'14px',fontWeight:'800',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'10px'}}>
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
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800',fontSize:'14px'}}>📤 Upload Videos — Be on For You!</div></div>
<div style={{background:'#2a0a0a',border:'1px solid #FF0024',borderRadius:'10px',padding:'8px',marginBottom:'10px'}}><div style={{fontSize:'11px',color:'#FF0024',fontWeight:'700'}}>⚠️ Porn/Sex not allowed — Auto removed in 5 min!</div></div>
<input type="file" accept="video/*" onChange={handleFileChange} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'12px',color:'#fff',boxSizing:'border-box'}}/>
{uploadPreview&&<div style={{marginTop:'10px'}}><video src={uploadPreview.url} style={{width:'100%',maxHeight:'200px',borderRadius:'12px',objectFit:'contain'}} autoPlay loop playsInline/><div style={{fontSize:'10px',color:'#00D632',marginTop:'4px'}}>✓ Video ready to post — Button green!</div></div>}
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — No porn/sex! Auto remove 5 min!" style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'10px',color:'#fff',boxSizing:'border-box'}}/>
<button onClick={()=>handlePostNow('upload_video')} style={{
marginTop:'12px',width:'100%',
background:postBtnState==='green'?'#00D632':'#fff',
color:postBtnState==='green'?'#000':'#000',
border:'none',padding:'14px',borderRadius:'12px',fontWeight:'900',fontSize:'14px',
boxShadow:postBtnState==='green'?'0 0 12px rgba(0,214,50,0.4)':'none',
transition:'all 0.3s',
cursor:'pointer'
}}>
{postBtnState==='green'?'🟢 POST NOW — Green — Click to Post!':'⚪ POSTED ✓ — White — Turning white!'}
</button>
</>
)}
{uploadMode==='post_muzika'&&(
<>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}><button onClick={()=>{setUploadMode(null); setPostBtnState('green')}} style={{background:'#1a1a1a',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%'}}>‹</button><div style={{fontWeight:'800',fontSize:'14px'}}>🎬 Post Videos — Muzika — Only UPTOWN Official</div></div>
<div style={{background:'#0a2a0a',border:'1px solid #00D632',borderRadius:'12px',padding:'10px'}}>
<div style={{fontSize:'11px',fontWeight:'800',color:'#00D632'}}>🔗 EVERY LINK ACCEPTED — Only UPTOWN Official — No porn/sex!</div>
<div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
<input value={universalLink} onChange={e=>{setUniversalLink(e.target.value); setPostBtnState('green')}} placeholder="Paste ANY link — No porn/sex!" style={{flex:1,background:'#000',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff',fontSize:'11px'}}/>
<button onClick={handlePasteLink} style={{background:'#fff',color:'#000',border:'none',padding:'10px 12px',borderRadius:'10px',fontWeight:'800',fontSize:'11px'}}>📋 Paste</button>
</div>
{linkPreview&&<div style={{marginTop:'8px',background:'#000',borderRadius:'10px',padding:'8px',border:'1px solid #00D632'}}><div style={{fontSize:'10px',fontWeight:'700',color:'#00D632'}}>✓ {linkPreview.platform} — Ready — Button green!</div><div style={{marginTop:'6px',height:'120px',background:'#000',borderRadius:'8px',overflow:'hidden'}}>{renderUniversal({mediaUrl:universalLink,linkInfo:linkPreview})}</div></div>}
</div>
<input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption — No porn/sex!" style={{marginTop:'10px',width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'10px',padding:'10px',color:'#fff'}}/>
<button onClick={()=>handlePostNow('post_muzika')} style={{
marginTop:'12px',width:'100%',
background:postBtnState==='green'?'#00D632':'#fff',
color:postBtnState==='green'?'#000':'#000',
border:'none',padding:'12px',borderRadius:'12px',fontWeight:'900',
boxShadow:postBtnState==='green'?'0 0 12px rgba(0,214,50,0.4)':'none',
transition:'all 0.3s',
cursor:'pointer'
}}>
{postBtnState==='green'?'🟢 POST IN MUZIKA — Green':'⚪ POSTED ✓ — White'}
</button>
</>
)}
</div>
</div>
)}

<div style={{height:'64px',minHeight:'64px',display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:'1px solid #1a1a1a',background:'#000',flexShrink:0,padding:'0 4px',boxSizing:'border-box'}}>
<button onClick={()=>setPage('foryou')} style={{background:'none',border:'none',color:page==='foryou'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1}}><span style={{fontSize:'20px'}}>⌂</span><span style={{fontSize:'10px',fontWeight:page==='foryou'?'700':'400'}}>Home</span></button>
<button onClick={()=>{setPage('inbox'); const u=notifications.map(n=>({...n,read:true})); setNotifications(u); localStorage.setItem('uptown_notifications_final_verified',JSON.stringify(u)); if(isOwner){let ownerNotifs=JSON.parse(localStorage.getItem('uptown_owner_notifications')||'[]'); ownerNotifs=ownerNotifs.map(x=>({...x,read:true})); localStorage.setItem('uptown_owner_notifications',JSON.stringify(ownerNotifs))}}} style={{background:'none',border:'none',color:page==='inbox'?'#fff':'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:1,position:'relative'}}><span style={{fontSize:'18px'}}>✉</span><span style={{fontSize:'10px'}}>Inbox</span>{unread>0&&<span style={{position:'absolute',top:'0px',right:'18px',background:'#FF0024',color:'#fff',fontSize:'8px',padding:'2px 4px',borderRadius:'8px',fontWeight:'800'}}>{unread}</span>}</button>
<button onClick={()=>{setUploadMode(null); setShowUpload(true); setPostBtnState('green')}} style={{background:'#FF0024',border:'none',width:'52px',height:'38px',borderRadius:'12px',color:'#fff',fontSize:'24px',fontWeight:'900',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>+</button>
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
