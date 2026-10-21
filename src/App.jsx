import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxYourRealKeyFromCloudHtml",
  authDomain: "kampala-business-175b7.firebaseapp.com",
  projectId: "kampala-business-175b7",
  storageBucket: "kampala-business-175b7.firebasestorage.app",
  messagingSenderId: "123456",
  appId: "1:123456:web:abcdef"
};

// 👉 REPLACE ABOVE WITH YOUR REAL CONFIG FROM CLOUD.html!

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('kampala_currentUser') || 'null'));
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('kampala_users') || '[]'));
  const [videos, setVideos] = useState([]);
  const [showAuth, setShowAuth] = useState(!currentUser);
  const [authMode, setAuthMode] = useState('signup');
  const [formName, setFormName] = useState('');
  const [formPass, setFormPass] = useState('');
  const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem('kampala_liked') || '[]'));
  const [following, setFollowing] = useState(() => JSON.parse(localStorage.getItem('kampala_following') || '[]'));
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('foryou');

  // ☁️ CLOUD LIVE - Get videos from Firebase
  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleSignup = async () => {
    if(!formName) return alert("Enter name");
    const user = { id: Date.now(), name: formName, pass: formPass, verified: formName.includes("Rashid") };
    const newUsers = [...users, user];
    setUsers(newUsers);
    localStorage.setItem('kampala_users', JSON.stringify(newUsers));
    setCurrentUser(user);
    localStorage.setItem('kampala_currentUser', JSON.stringify(user));
    setShowAuth(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    // For now save meta to cloud - video URL as local blob (we will add Storage later)
    const videoData = {
      id: Date.now(),
      username: currentUser.name,
      caption: "My new video 🔥",
      likes: 0,
      url: URL.createObjectURL(file),
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, "videos"), videoData);
    alert("Uploaded to CLOUD! Everyone can see now!");
  };

  const toggleLike = (id) => {
    const newLiked = liked.includes(id) ? liked.filter(x=>x!==id) : [...liked, id];
    setLiked(newLiked);
    localStorage.setItem('kampala_liked', JSON.stringify(newLiked));
  };

  const toggleFollow = (name) => {
    const newFollowing = following.includes(name) ? following.filter(x=>x!==name) : [...following, name];
    setFollowing(newFollowing);
    localStorage.setItem('kampala_following', JSON.stringify(newFollowing));
  };

  const filteredVideos = tab === 'following' ? videos.filter(v => following.includes(v.username)) : videos;

  if(showAuth){
    return (
      <div style={{background:"black",minHeight:"100vh",color:"white",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:20}}>
        <h1>KAMPALA BUSINESS</h1><p style={{color:"#00ff88"}}>● CLOUD LIVE</p>
        <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="Name (use Katongole Rashid for blue tick ✓)" style={{padding:12,width:"80%",margin:10,borderRadius:8}}/>
        <input value={formPass} onChange={e=>setFormPass(e.target.value)} type="password" placeholder="Password" style={{padding:12,width:"80%",margin:10,borderRadius:8}}/>
        <button onClick={handleSignup} style={{padding:12,background:"white",color:"black",width:"80%",borderRadius:8,fontWeight:"bold"}}>{authMode==='signup'?'Sign Up':'Login'}</button>
        <p onClick={()=>setAuthMode(authMode==='signup'?'login':'signup')} style={{marginTop:10,cursor:"pointer"}}>Switch to {authMode==='signup'?'Login':'Sign Up'}</p>
      </div>
    )
  }

  return (
    <div style={{background:"black",minHeight:"100vh",color:"white",display:"flex"}}>
      <div style={{flex:1,maxWidth:500,margin:"0 auto",borderLeft:"1px solid #222",borderRight:"1px solid #222",minHeight:"100vh"}}>
        <div style={{padding:15,borderBottom:"1px solid #222",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"black",zIndex:10}}>
          <div style={{display:"flex",gap:20}}>
            <span onClick={()=>setTab('foryou')} style={{fontWeight:tab==='foryou'?'bold':'normal',borderBottom:tab==='foryou'?'2px solid white':'none',cursor:"pointer"}}>For You</span>
            <span onClick={()=>setTab('following')} style={{fontWeight:tab==='following'?'bold':'normal',borderBottom:tab==='following'?'2px solid white':'none',cursor:"pointer"}}>Following</span>
          </div>
          <input type="file" accept="video/*" onChange={handleUpload} id="upload" style={{display:"none"}}/>
          <label htmlFor="upload" style={{background:"white",color:"black",padding:"6px 12px",borderRadius:6,cursor:"pointer"}}>+ Upload</label>
        </div>

        {filteredVideos.length===0 && <p style={{textAlign:"center",marginTop:50,opacity:0.5}}>No videos yet. Be first to upload! Cloud is live ☁️</p>}

        {filteredVideos.map(v=>(
          <div key={v.id} style={{borderBottom:"1px solid #222",paddingBottom:20}}>
            <div style={{padding:10,display:"flex",justifyContent:"space-between"}}>
              <span>@{v.username} {v.username?.includes("Rashid") && <span style={{color:"#1DA1F2"}}>✓</span>}</span>
              <button onClick={()=>toggleFollow(v.username)} style={{background:following.includes(v.username)?"white":"black",color:following.includes(v.username)?"black":"white",border:"1px solid white",padding:"4px 8px",borderRadius:4}}>{following.includes(v.username)?"Following":"Follow"}</button>
            </div>
            <video src={v.url} controls autoPlay muted loop style={{width:"100%",maxHeight:500,background:"#111"}}/>
            <div style={{padding:10,display:"flex",gap:20}}>
              <span onClick={()=>toggleLike(v.id)} style={{cursor:"pointer"}}>{liked.includes(v.id)?"❤️":"🤍"} {v.likes + (liked.includes(v.id)?1:0)}</span>
              <span>💬 Comment</span>
              <span>↗️ Share</span>
            </div>
            <p style={{padding:"0 10px"}}>{v.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}