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
const [notifications,setNotifications]=useState([{id:1,type:'general',from:'UPTOWN Official',username:'@uptown',verified:true,time:'2m ago',title:'Welcome ✓',message:'Welcome to UPTOWN ✓ 978+ Family',read:false}])
const [profilePic,setProfilePic]=useState(null)
const [editName,setEditName]=useState('')
const [editBio,setEditBio]=useState('')
const [editUsername,setEditUsername]=useState('')
const [isEditing,setIsEditing]=useState(false)
const [postBtnState,setPostBtnState]=useState('green')
const [deferredPrompt,setDeferredPrompt]=useState(null)
const [isInstallable,setIsInstallable]=useState(false)
const [isInstalled,setIsInstalled]=useState(false)
const [showStorePanel,setShowStorePanel]=useState(false)
const [blockedUsers,setBlockedUsers]=useState({})
const [reportedVideos,setReportedVideos]=useState({})
const [isLive,setIsLive]=useState(false)
const videoRefs=useRef({})

const officialVideos=[
{id:9001,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓ 978+ Family', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType:'video', likes:15600, fires:520, comments:978, views:45200, isOfficial:true},
{id:9002,user:'UPTOWN Official',username:'@uptown',verified:true,caption:'UPTOWN Official ✓', mediaUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', mediaType:'video', likes:12400, fires:340, comments:0, views:32100, isOfficial:true},
]

const fetchPostsFromDB=async()=>{
try{
const res=await fetch('/api/posts').then(r=>r.json()).catch(()=>({posts:[]}))
if(res.posts && res.posts.length>0) setPosts(res.posts)
}catch(e){}
}
const savePostsToDB=async(newPosts)=>{
setPosts(newPosts)
try{ await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({posts:newPosts})}) }catch(e){}
}

useEffect(()=>{
const t=setTimeout(()=>{
setSplash(false)
const su=localStorage.getItem('uptown_user')
const sO=localStorage.getItem('uptown_is_owner')
const sF=localStorage.getItem('uptown_follows')
const sFC=localStorage.getItem('uptown_follow_counts')
const sL=localStorage.getItem('uptown_likes_v2')
const sFav=localStorage.getItem('uptown_fav_v3')
const sC=localStorage.getItem('uptown_comments_v1')
const sNot=localStorage.getItem('uptown_notifications_final_verified')
if(sF) setFollows(JSON.parse(sF))
if(sFC) setFollowCounts(JSON.parse(sFC))
if(sL) setLikes(JSON.parse(sL))
if(sFav) setFavorites(JSON.parse(sFav))
if(sC) setCommentCounts(JSON.parse(sC))
if(sNot) setNotifications(JSON.parse(sNot))
fetchPostsFromDB()
if(!su) setShowAuth(true)
else{
const u=JSON.parse(su)
setUser(u); setEditName(u.name||''); setEditUsername(u.username||'')
if(sO==='true') setIsOwner(true)
}
},1500)
return()=>clearTimeout(t)
},[])

const pauseAllVideos=()=>{Object.values(videoRefs.current).forEach(v=>{if(v) v.pause()})}
useEffect(()=>{ pauseAllVideos() },[page,showUpload,showComments])

useEffect(()=>{
if(typeof window!=='undefined' && 'serviceWorker' in navigator){
const swCode=`self.addEventListener('install',e=>{self.skipWaiting()}); self.addEventListener('activate',e=>{self.clients.claim()});`
const blob=new Blob([swCode],{type:'application/javascript'})
const swUrl=URL.createObjectURL(blob)
navigator.serviceWorker.register(swUrl).catch(()=>{})
}
const handleBeforeInstall=(e)=>
