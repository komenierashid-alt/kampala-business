"use client"
import { useState, useEffect } from "react"
import { supabase } from "./lib/supabaseClient.js"

export default function UptownApp(){
  const [splash, setSplash] = useState(true)
  const [authMode, setAuthMode] = useState('signup')
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [allowPosting, setAllowPosting] = useState(false)
  const [page, setPage] = useState('foryou')
  const [showUpload, setShowUpload] = useState(false)
  const [follows, setFollows] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [blueBoard, setBlueBoard] = useState([])
  const [myVerified, setMyVerified] = useState(false)
  const [chatUser, setChatUser] = useState(null)
  const [authForm, setAuthForm] = useState({name:"", username:"", email:"", password:""})
  const [uploadCaption, setUploadCaption] = useState("")
  const [uploadUrl, setUploadUrl] = useState("")

  // Splash
  useEffect(()=>{
    setTimeout(()=>setSplash(false), 1500)
  },[])

  // Get current user
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setUser(data.session?.user || null)
    })
  },[])

  // LOAD REAL VIDEOS FROM SUPABASE - THIS FIXES YOUR PROBLEM!
  useEffect(()=>{
    async function loadVideos(){
      setLoading(true)
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if(error){
        console.error("Supabase error:", error)
      } else {
        console.log("REAL VIDEOS:", data)
        setVideos(data || [])
      }
      setLoading(false)
    }
    loadVideos()

    // Realtime - auto refresh when new video posted
    const channel = supabase.channel('videos-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, ()=>{
        loadVideos()
      }).subscribe()
    
    return ()=>{ supabase.removeChannel(channel) }
  },[])

  // POST REAL VIDEO TO SUPABASE
  async function handlePost(){
    if(!uploadCaption && !uploadUrl){
      alert("Add caption or video url")
      return
    }
    if(!user){
      alert("Please login first!")
      setShowAuth(true)
      return
    }
    const { data, error } = await supabase.from('videos').insert([{
      caption: uploadCaption || "hell kampala this is tes post",
      video_url: uploadUrl || "https://example.com/test-video",
      user_id: user.id
    }]).select()

    if(error){
      alert("Post failed: "+error.message)
    } else {
      alert("Posted! ✅")
      setUploadCaption("")
      setUploadUrl("")
      setShowUpload(false)
    }
  }

  if(splash){
    return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'black', color:'white', fontSize:30, fontWeight:'bold'}}>UPTOWN</div>
  }

  return (
    <div style={{background:'black', color:'white', minHeight:'100vh', maxWidth:500, margin:'0 auto'}}>
      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', padding:15, borderBottom:'1px solid #222', position:'sticky', top:0, background:'black', zIndex:10}}>
        <h1 style={{fontWeight:'bold', fontSize:20}}>UPTOWN</h1>
        <div style={{display:'flex', gap:10}}>
          <button onClick={()=>setPage('foryou')} style={{color: page==='foryou'?'white':'#888'}}>For You</button>
          <button onClick={()=>setPage('following')} style={{color: page==='following'?'white':'#888'}}>Following</button>
        </div>
        <button onClick={()=> user ? setShowUpload(true) : setShowAuth(true)} style={{background:'white', color:'black', padding:'5px 15px', borderRadius:20, fontWeight:'bold'}}>+ Post</button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
          <div style={{background:'#111', padding:20, borderRadius:15, width:'100%'}}>
            <h2>New Post</h2>
            <input value={uploadCaption} onChange={e=>setUploadCaption(e.target.value)} placeholder="Caption: hell kampala this is tes post" style={{width:'100%', padding:10, marginTop:10, background:'#222', border:'none', color:'white', borderRadius:8}} />
            <input value={uploadUrl} onChange={e=>setUploadUrl(e.target.value)} placeholder="Video URL (or leave empty)" style={{width:'100%', padding:10, marginTop:10, background:'#222', border:'none', color:'white', borderRadius:8}} />
            <div style={{display:'flex', gap:10, marginTop:15}}>
              <button onClick={()=>setShowUpload(false)} style={{flex:1, padding:10, background:'#333', borderRadius:10}}>Cancel</button>
              <button onClick={handlePost} style={{flex:1, padding:10, background:'white', color:'black', borderRadius:10, fontWeight:'bold'}}>Post to Supabase</button>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      <div>
        {loading && <div style={{padding:20, textAlign:'center', color:'#888'}}>Loading real videos from Supabase...</div>}
        {!loading && videos.length===0 && <div style={{padding:40, textAlign:'center', color:'#888'}}>No videos yet. Be first to post! Your 1 record has user_id NULL so it won't show - post new one with login.</div>}
        {videos.map((v)=>(
          <div key={v.id} style={{borderBottom:'1px solid #222', paddingBottom:20}}>
            <div style={{padding:15}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{width:40, height:40, background:'#333', borderRadius:20}}></div>
                <div>
                  <div style={{fontWeight:'bold'}}>{user?.email || 'Kampala User'}</div>
                  <div style={{fontSize:12, color:'#888'}}>{new Date(v.created_at).toLocaleString()}</div>
                </div>
                <button style={{marginLeft:'auto', border:'1px solid white', padding:'4px 12px', borderRadius:20, fontSize:12}}>Follow</button>
              </div>
              <div style={{marginTop:10, fontSize:15}}>{v.caption}</div>
              <div style={{marginTop:5, fontSize:12, color:'#0af'}}>{v.video_url}</div>
            </div>
            <div style={{background:'#111', height:400, display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>
              VIDEO PLAYER - {v.video_url?.slice(0,30)}
            </div>
            <div style={{display:'flex', gap:20, padding:'10px 15px', fontSize:14, color:'#888'}}>
              <span>❤️ 0 Likes</span><span>💬 0 Comments</span><span>↗️ Share</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{position:'fixed', bottom:0, left:0, right:0, maxWidth:500, margin:'0 auto', background:'black', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', padding:12}}>
        <button onClick={()=>setPage('foryou')}>🏠</button>
        <button onClick={()=>setPage('search')}>🔍</button>
        <button onClick={()=>setShowUpload(true)}>➕</button>
        <button>💬</button>
        <button onClick={()=>setShowAuth(true)}>👤</button>
      </div>
    </div>
  )
}
