import React, { useState, useRef, useEffect } from 'react';

function App() {
  const APP_VERSION = "1.0.0";
  const LATEST_VERSION = "1.0.0"; // Change to 1.0.1 when you update - people must update
  
  const [screen, setScreen] = useState(() => localStorage.getItem('kb_screen') || 'login');
  const [needsUpdate, setNeedsUpdate] = useState(() => {
    const saved = localStorage.getItem('kb_version');
    return saved && saved !== LATEST_VERSION;
  });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [business, setBusiness] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('For You');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatWith, setChatWith] = useState(null);
  const [chatText, setChatText] = useState('');
  const [showLive, setShowLive] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveViewers, setLiveViewers] = useState(0);
  const [liveRequests, setLiveRequests] = useState([]);
  const [liveChats, setLiveChats] = useState([]);
  const [liveComment, setLiveComment] = useState('');
  const [postText, setPostText] = useState('');
  
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('kb_users') || '[]'));
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('kb_current') || 'null'));
  const [videos, setVideos] = useState(() => JSON.parse(localStorage.getItem('kb_allvideos') || '[]'));
  const [chats, setChats] = useState(() => JSON.parse(localStorage.getItem('kb_chats') || '{}'));
  const [following, setFollowing] = useState(() => JSON.parse(localStorage.getItem('kb_following') || '[]'));
  const [blocked, setBlocked] = useState(() => JSON.parse(localStorage.getItem('kb_blocked') || '[]'));
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editBusiness, setEditBusiness] = useState('');
  
  const videoRefs = useRef({});
  const currentPlayingRef = useRef(null);
  const picRef = useRef(null);
  const uploadRef = useRef(null);
  const cameraRef = useRef(null);
  const liveVideoRef = useRef(null);
  const streamRef = useRef(null);

  const isCEO = currentUser && currentUser.name.toLowerCase().includes('katongole rashid');

  useEffect(() => {
    if (videos.length === 0) {
      const demo = [
        { id: 1, owner: 'Katongole Rashid', name: 'Katongole Rashid', business: 'CEO & Owner', bio: 'Founder - Kampala Business', verified: true, isBoss: true, cat: 'For You', video: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video', likes: 15400, views: 15400, isImage: false, hidden: false, followers: 120 },
        { id: 2, owner: 'Bobi Wine', name: 'Bobi Wine', business: 'Ghetto President', bio: 'Kyarenga!', verified: true, cat: 'Music', video: 'https://www.w3schools.com/html/movie.mp4', type: 'video', likes: 45000, views: 120000, isImage: false, hidden: false, followers: 92000 },
      ];
      setVideos(demo);
      localStorage.setItem('kb_allvideos', JSON.stringify(demo));
    }
    localStorage.setItem('kb_version', APP_VERSION);
    // PWA install prompt
    if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(()=>{}); }
  }, []);

  // Auto play with audio mute logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        const id = vid.dataset.id;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          if (currentPlayingRef.current && currentPlayingRef.current !== vid) currentPlayingRef.current.muted = true;
          vid.muted = false;
          vid.play().catch(() => { vid.muted = true; vid.play().catch(()=>{}); });
          currentPlayingRef.current = vid;
          setVideos(prev => {
            const upd = prev.map(v => v.id == id ? { ...v, views: (v.views||0)+1 } : v);
            localStorage.setItem('kb_allvideos', JSON.stringify(upd));
            return upd;
          });
        } else if (entry.intersectionRatio < 0.3) vid.muted = true;
      });
    }, { threshold: [0.3, 0.6] });
    Object.values(videoRefs.current).forEach(v => { if (v) observer.observe(v); });
    return () => observer.disconnect();
  }, [activeTab, search, videos]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLiveViewers(v => v + Math.floor(Math.random()*3));
      if (Math.random() > 0.7) setLiveRequests(r => [...r.slice(-4), { id: Date.now(), name: ['Bobi Wine','Mesach'][Math.floor(Math.random()*2)], text: 'Request to join!' }]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const handleSignUp = () => {
    if (username.length < 2 || password.length < 3 || !email.includes('@')) { alert('Fill name, email, password'); return; }
    if (users.find(u => u.email === email)) { alert('Email exists - Login'); return; }
    const newUser = { id: Date.now(), name: username, email, password, bio: bio || 'Kampala Business User', business: business || 'Business User', pic: null, verified: username.toLowerCase().includes('katongole'), isBoss: username.toLowerCase().includes('katongole'), followers: 0, isCEO: username.toLowerCase().includes('katongole rashid') };
    const upd = [...users, newUser];
    setUsers(upd); setCurrentUser(newUser);
    localStorage.setItem('kb_users', JSON.stringify(upd));
    localStorage.setItem('kb_current', JSON.stringify(newUser));
    localStorage.setItem('kb_screen', 'app');
    setScreen('app');
  };
  const handleLogin = () => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) { alert('Wrong - Sign up first'); return; }
    setCurrentUser(found);
    localStorage.setItem('kb_current', JSON.stringify(found));
    localStorage.setItem('kb_screen', 'app');
    setScreen('app');
  };
  const startLive = async () => {
    const myFollowerCount = videos.filter(v => v.owner === currentUser.name).reduce((s,v)=> s + (v.followers||0), 0) + (currentUser.followers||0) + following.length*5;
    const canGoLive = isCEO || myFollowerCount >= 20 || users.length < 5; // 20 followers rule
    if (!canGoLive) { alert(`Need 20 followers to go live! You have ${myFollowerCount}. Get more followers first.`); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      streamRef.current = stream;
      if (liveVideoRef.current) liveVideoRef.current.srcObject = stream;
      setIsLive(true); setLiveViewers(1);
      setLiveChats([{ name: 'System', text: `🔴 ${currentUser.name} is live!` }]);
      setShowLive(true);
    } catch { alert('Allow camera for live'); }
  };
  const stopLive = () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); setIsLive(false); setShowLive(false); setLiveViewers(0); };
  const handleEditSave = () => {
    const updUser = { ...currentUser, name: editName || currentUser.name, bio: editBio || currentUser.bio, business: editBusiness || currentUser.business };
    const updUsers = users.map(u => u.id === currentUser.id ? updUser : u);
    setUsers(updUsers); setCurrentUser(updUser);
    localStorage.setItem('kb_users', JSON.stringify(updUsers));
    localStorage.setItem('kb_current', JSON.stringify(updUser));
    const updVideos = videos.map(v => v.owner === currentUser.name ? { ...v, name: updUser.name, owner: updUser.name, business: updUser.business, bio: updUser.bio } : v);
    setVideos(updVideos); localStorage.setItem('kb_allvideos', JSON.stringify(updVideos));
    setShowEdit(false);
  };
  const handlePicChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updUser = { ...currentUser, pic: ev.target.result };
      const updUsers = users.map(u => u.id === currentUser.id ? updUser : u);
      setUsers(updUsers); setCurrentUser(updUser);
      localStorage.setItem('kb_users', JSON.stringify(updUsers));
      localStorage.setItem('kb_current', JSON.stringify(updUser));
    };
    reader.readAsDataURL(file);
  };
  const handleVideoUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const isImage = file.type.startsWith('image/');
    const url = URL.createObjectURL(file);
    const newVideo = { id: Date.now(), owner: currentUser.name, name: currentUser.name, business: currentUser.business, bio: currentUser.bio, verified: currentUser.verified, isBoss: currentUser.isBoss, cat: 'For You', video: url, type: isImage ? 'image' : 'video', isImage, likes: 0, views: 1, pic: currentUser.pic, hidden: false, isText: false };
    const upd = [newVideo, ...videos];
    setVideos(upd); localStorage.setItem('kb_allvideos', JSON.stringify(upd));
    setShowUpload(false); setActiveTab('My Account');
  };
  const handleTextPost = () => {
    if (!postText.trim()) return;
    const newPost = { id: Date.now(), owner: currentUser.name, name: currentUser.name, business: currentUser.business, bio: postText, verified: currentUser.verified, isBoss: currentUser.isBoss, cat: 'For You', video: null, type: 'text', isImage: false, isText: true, likes: 0, views: 1, pic: currentUser.pic, hidden: false, text: postText };
    const upd = [newPost, ...videos];
    setVideos(upd); localStorage.setItem('kb_allvideos', JSON.stringify(upd));
    setPostText(''); setShowUpload(false); setActiveTab('My Account');
  };
  const toggleFollow = (ownerName) => {
    const upd = following.includes(ownerName) ? following.filter(f => f !== ownerName) : [...following, ownerName];
    setFollowing(upd); localStorage.setItem('kb_following', JSON.stringify(upd));
  };
  const toggleBlock = (ownerName) => {
    if (ownerName === currentUser.name) return;
    const upd = blocked.includes(ownerName) ? blocked.filter(f => f !== ownerName) : [...blocked, ownerName];
    setBlocked(upd); localStorage.setItem('kb_blocked', JSON.stringify(upd));
    alert(upd.includes(ownerName) ? `Blocked ${ownerName} - won't appear again` : `Unblocked ${ownerName}`);
  };
  const toggleHide = (id) => {
    const upd = videos.map(v => v.id === id ? { ...v, hidden: !v.hidden } : v);
    setVideos(upd); localStorage.setItem('kb_allvideos', JSON.stringify(upd));
  };
  const deleteContent = (id) => {
    if (!confirm('Delete? Still stays in your account trash?')) return;
    const upd = videos.map(v => v.id === id ? { ...v, deleted: true, hidden: true } : v);
    setVideos(upd); localStorage.setItem('kb_allvideos', JSON.stringify(upd));
  };
  const sendMessage = () => {
    if (!chatText.trim() || !chatWith) return;
    const key = [currentUser.name, chatWith].sort().join('_');
    const newChats = { ...chats, [key]: [...(chats[key] || []), { from: currentUser.name, to: chatWith, text: chatText, time: new Date().toLocaleTimeString() }] };
    setChats(newChats); localStorage.setItem('kb_chats', JSON.stringify(newChats)); setChatText('');
  };

  const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: '26px', height: '26px', backgroundColor: 'black', border: '1.5px solid white', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: 'rotate(45deg)', fontWeight: '900', fontSize: '10px' }}><span style={{ color: '#FF0000' }}>K</span><span style={{ color: 'white' }}>B</span></div>
      </div>
      <div style={{ lineHeight: '1' }}><div style={{ fontWeight: '900', fontSize: '9px', color: 'white' }}>KAMPALA</div><div style={{ fontWeight: '900', fontSize: '9px', color: '#888' }}>BUSINESS</div></div>
    </div>
  );
  const BlueTick = () => <span style={{ backgroundColor: '#1DA1F2', color: 'white', borderRadius: '50%', width: '13px', height: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', marginLeft: '3px' }}>✓</span>;

  // UPDATE SCREEN - Must update before using
  if (needsUpdate) {
    return (
      <div style={{ backgroundColor: '#000', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Arial' }}>
        <Logo />
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', maxWidth: '300px', textAlign: 'center', marginTop: '15px' }}>
          <div style={{ fontSize: '30px' }}>🔄</div>
          <h3 style={{ fontSize: '14px' }}>New Update Available!</h3>
          <p style={{ fontSize: '11px', color: '#888' }}>We changed lot of things - You must update to continue. Old version won't work.</p>
          <p style={{ fontSize: '9px', color: '#555' }}>Version {localStorage.getItem('kb_version')} → {LATEST_VERSION}</p>
          <button onClick={() => { localStorage.setItem('kb_version', LATEST_VERSION); setNeedsUpdate(false); window.location.reload(); }} style={{ width: '100%', marginTop: '12px', padding: '10px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '11px' }}>UPDATE NOW</button>
        </div>
      </div>
    );
  }

  if (screen !== 'app' || !currentUser) {
    return (
      <div style={{ backgroundColor: '#000', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '15px', fontFamily: 'Arial' }}>
        <Logo />
        <div style={{ backgroundColor: '#111', width: '100%', maxWidth: '320px', padding: '18px', borderRadius: '12px', marginTop: '14px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            <button onClick={() => setScreen('login')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: screen==='login' ? 'white' : '#1a1a1a', color: screen==='login' ? 'black' : '#888', fontWeight: '900', fontSize: '11px' }}>LOGIN</button>
            <button onClick={() => setScreen('signup')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: screen==='signup' ? 'white' : '#1a1a1a', color: screen==='signup' ? 'black' : '#888', fontWeight: '900', fontSize: '11px' }}>SIGN UP</button>
          </div>
          {screen === 'signup' && (<><input value={username} onChange={e => setUsername(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '7px', fontSize: '11px', boxSizing: 'border-box' }} /><input value={business} onChange={e => setBusiness(e.target.value)} placeholder="Business Title" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '7px', fontSize: '11px', boxSizing: 'border-box' }} /><input value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '7px', fontSize: '11px', boxSizing: 'border-box' }} /></>)}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '7px', fontSize: '11px', boxSizing: 'border-box' }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '12px', fontSize: '11px', boxSizing: 'border-box' }} />
          {screen === 'signup' ? <button onClick={handleSignUp} style={{ width: '100%', padding: '10px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '11px' }}>SIGN UP</button> : <button onClick={handleLogin} style={{ width: '100%', padding: '10px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '11px' }}>LOGIN</button>}
          <div style={{ marginTop: '10px', textAlign: 'center' }}><button onClick={() => { if (confirm('Install Kampala Business App to your phone?')) alert('Tap Share button in browser → Add to Home Screen → Install'); }} style={{ backgroundColor: 'transparent', color: '#1DA1F2', border: '1px solid #1DA1F2', borderRadius: '15px', padding: '6px 12px', fontSize: '10px' }}>📲 Install App (Before Play Store)</button></div>
        </div>
      </div>
    );
  }

  const filtered = videos.filter(v => {
    if (blocked.includes(v.owner)) return false;
    if (v.hidden && activeTab !== 'My Account') return false;
    if (v.deleted && v.owner !== currentUser.name) return false;
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || (v.text||'').toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'Live') return false;
    const matchCat = activeTab === 'For You' ? true : activeTab === 'My Account' ? v.owner === currentUser.name : v.cat === activeTab;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', fontFamily: 'Arial', paddingBottom: '65px' }}>
      <div style={{ backgroundColor: 'black', padding: '8px 10px', position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid #111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isCEO && <span style={{ fontSize: '7px', backgroundColor: '#FF0000', color: 'white', padding: '2px 5px', borderRadius: '8px' }}>CEO VIEW</span>}
            <button onClick={() => setShowChat(true)} style={{ backgroundColor: '#111', border: '1px solid #222', color: 'white', borderRadius: '50%', width: '26px', height: '26px', fontSize: '12px' }}>💬</button>
            <img onClick={() => { setEditName(currentUser.name); setEditBio(currentUser.bio); setEditBusiness(currentUser.business); setShowEdit(true); }} src={currentUser.pic || `https://ui-avatars.com/api/?name=${currentUser.name}&background=222&color=fff&size=100`} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #333', objectFit: 'cover', cursor: 'pointer' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" style={{ width: '55px', padding: '5px 8px', borderRadius: '15px', border: '1px solid #222', backgroundColor: '#111', color: 'white', fontSize: '10px' }} />
          <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', flex: 1 }}>
            {['For You','Music','Movies','Live','My Account'].map(tab => (
              <button key={tab} onClick={() => { if(tab==='Live'){ setActiveTab('Live'); setShowLive(true); startLive(); } else setActiveTab(tab); }} style={{ padding: '5px 8px', borderRadius: '15px', border: 'none', backgroundColor: activeTab === tab ? 'white' : '#111', color: activeTab === tab ? 'black' : '#888', fontSize: '9px', fontWeight: '900', whiteSpace: 'nowrap' }}>{tab}{tab==='Live' ? ' 🔴' : ''}{tab==='My Account' ? ` (${videos.filter(v=>v.owner===currentUser.name && !v.deleted).length})` : ''}</button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'Live' && !showLive ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #222' }}>
            <div style={{ fontSize: '30px' }}>🔴</div>
            <h3 style={{ fontSize: '13px', margin: '8px 0' }}>Live Streaming - 20 Followers Needed</h3>
            <p style={{ fontSize: '10px', color: '#666' }}>You have {following.length*5 + (currentUser.followers||0)} followers • Need 20 to go live</p>
            <button onClick={startLive} style={{ marginTop: '12px', padding: '10px 20px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '11px' }}>🔴 START LIVE</button>
            {isCEO && <p style={{ fontSize: '8px', color: '#FF0000', marginTop: '8px' }}>CEO Bypass: You can live anytime</p>}
          </div>
        </div>
      ) : (
        <div style={{ padding: '0 8px' }}>
          {filtered.map(v => (
            <div key={v.id} style={{ backgroundColor: '#0a0a0a', border: '1px solid #111', borderRadius: '10px', overflow: 'hidden', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px' }}>
                <img onClick={() => setSelectedProfile(v)} src={v.pic || `https://ui-avatars.com/api/?name=${v.name}&background=111&color=fff&size=100`} style={{ width: '32px', height: '32px', borderRadius: '50%', border: v.isBoss ? '1.5px solid #1DA1F2' : '1px solid #222', objectFit: 'cover', cursor: 'pointer' }} />
                <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setSelectedProfile(v)}>
                  <div style={{ fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center' }}>{v.name} {v.isBoss ? <BlueTick /> : v.verified && <span style={{ color: '#1DA1F2', marginLeft: '2px', fontSize: '9px' }}>✓</span>} {v.hidden && <span style={{ fontSize: '7px', backgroundColor: '#333', padding: '1px 4px', borderRadius: '6px', marginLeft: '4px' }}>HIDDEN</span>}</div>
                  <div style={{ fontSize: '9px', color: '#666' }}>{v.business}</div>
                </div>
                <button onClick={() => toggleFollow(v.owner)} style={{ backgroundColor: following.includes(v.owner) ? 'white' : 'transparent', color: following.includes(v.owner) ? 'black' : 'white', border: `1px solid ${following.includes(v.owner) ? 'white' : '#333'}`, borderRadius: '15px', padding: '4px 10px', fontSize: '9px', fontWeight: '700' }}>{following.includes(v.owner) ? 'Following' : '+ Follow'}</button>
              </div>
              {v.isText ? (
                <div style={{ padding: '14px', backgroundColor: '#111', fontSize: '13px', lineHeight: '1.4' }}>{v.text}</div>
              ) : v.isImage ? <img src={v.video} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: 'black' }} /> : <video ref={el => videoRefs.current[v.id] = el} data-id={v.id} src={v.video} muted loop playsInline preload="metadata" style={{ width: '100%', maxHeight: '380px', backgroundColor: 'black', display: 'block' }} onClick={e => e.target.muted = !e.target.muted} />}
              <div style={{ padding: '6px 10px' }}>
                {!v.isText && <div style={{ fontSize: '10px', color: '#ccc' }}>{v.bio}</div>}
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '10px', color: '#666', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>👁️ {v.views} views</span><span>❤️ {v.likes}</span>
                  <button onClick={() => { setChatWith(v.owner); setShowChat(true); }} style={{ backgroundColor: 'transparent', border: 'none', color: '#1DA1F2', fontSize: '10px' }}>💬 Message</button>
                  {v.owner === currentUser.name && (
                    <>
                      <button onClick={() => toggleHide(v.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#888', fontSize: '9px' }}>{v.hidden ? '👁️ Show Public' : '🙈 Hide from Public'}</button>
                      <button onClick={() => deleteContent(v.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#FF0000', fontSize: '9px' }}>🗑️ Delete</button>
                    </>
                  )}
                  {v.owner !== currentUser.name && <button onClick={() => toggleBlock(v.owner)} style={{ backgroundColor: 'transparent', border: 'none', color: '#555', fontSize: '9px' }}>🚫 Block</button>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length===0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666', fontSize: '11px' }}>No content - Upload video, picture or text message!</div>}
        </div>
      )}

      {showLive && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
            <button onClick={() => { stopLive(); setActiveTab('For You'); }} style={{ backgroundColor: '#111', color: 'white', border: '1px solid #222', borderRadius: '15px', padding: '5px 10px', fontSize: '10px' }}>← Exit</button>
            <div style={{ display: 'flex', gap: '6px' }}><span style={{ backgroundColor: '#FF0000', padding: '3px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: '900' }}>🔴 LIVE</span><span style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: '10px', fontSize: '9px' }}>👁️ {liveViewers}</span></div>
            <button onClick={stopLive} style={{ backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '15px', padding: '5px 10px', fontSize: '10px', fontWeight: '900' }}>End</button>
          </div>
          <video ref={liveVideoRef} autoPlay muted playsInline style={{ flex: 1, objectFit: 'cover', backgroundColor: '#111' }} />
          <div style={{ position: 'absolute', bottom: '70px', left: '8px', right: '8px' }}>
            <div style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '6px' }}>
              {liveRequests.map(r => <div key={r.id} style={{ backgroundColor: 'rgba(29,161,242,0.9)', padding: '5px 8px', borderRadius: '8px', fontSize: '9px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}><span>{r.name}: {r.text}</span><button onClick={() => setLiveRequests(req => req.filter(x=>x.id!==r.id))} style={{ backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '10px', padding: '2px 6px', fontSize: '8px' }}>Accept</button></div>)}
              {liveChats.slice(-3).map((c,i) => <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '8px', fontSize: '9px', marginBottom: '3px' }}><b>{c.name}:</b> {c.text}</div>)}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}><input value={liveComment} onChange={e => setLiveComment(e.target.value)} placeholder="Chat live..." style={{ flex: 1, padding: '8px 10px', borderRadius: '20px', border: '1px solid #333', backgroundColor: 'rgba(20,20,20,0.9)', color: 'white', fontSize: '11px' }} /><button onClick={() => { if(liveComment.trim()){ setLiveChats([...liveChats, { name: currentUser.name, text: liveComment }]); setLiveComment(''); } }} style={{ backgroundColor: '#1DA1F2', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 14px', fontSize: '11px' }}>Send</button></div>
          </div>
        </div>
      )}

      {showChat && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 40, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px', borderBottom: '1px solid #111', display: 'flex', gap: '8px', alignItems: 'center' }}><button onClick={() => setShowChat(false)} style={{ backgroundColor: '#111', color: 'white', border: '1px solid #222', borderRadius: '50%', width: '28px', height: '28px' }}>←</button><Logo /><span style={{ fontSize: '11px', flex: 1, textAlign: 'center' }}>{chatWith ? `Chat ${chatWith}` : 'Messages'}</span></div>
          {!chatWith ? (
            <div style={{ padding: '10px', overflowY: 'auto', flex: 1 }}>{users.filter(u => u.name !== currentUser.name && !blocked.includes(u.name)).map(u => { const key = [currentUser.name, u.name].sort().join('_'); const last = chats[key]?.slice(-1)[0]; return (<div key={u.id} onClick={() => setChatWith(u.name)} style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#0a0a0a', borderRadius: '8px', marginBottom: '6px', border: '1px solid #111', cursor: 'pointer' }}><img src={u.pic || `https://ui-avatars.com/api/?name=${u.name}&background=111&color=fff&size=100`} style={{ width: '36px', height: '36px', borderRadius: '50%' }} /><div style={{ flex: 1 }}><div style={{ fontSize: '11px', fontWeight: '700' }}>{u.name}</div><div style={{ fontSize: '9px', color: '#666' }}>{last ? last.text.slice(0,30) : u.business}</div></div></div>); })}</div>
          ) : (
            <><div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>{(chats[[currentUser.name, chatWith].sort().join('_')] || []).map((m,i) => (<div key={i} style={{ display: 'flex', justifyContent: m.from===currentUser.name ? 'flex-end' : 'flex-start', marginBottom: '6px' }}><div style={{ backgroundColor: m.from===currentUser.name ? 'white' : '#111', color: m.from===currentUser.name ? 'black' : 'white', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', maxWidth: '70%', border: '1px solid #222' }}>{m.text}<div style={{ fontSize: '7px', color: '#666', marginTop: '2px' }}>{m.time}</div></div></div>))}</div><div style={{ padding: '8px', borderTop: '1px solid #111', display: 'flex', gap: '6px' }}><button onClick={() => setChatWith(null)} style={{ backgroundColor: '#111', color: '#888', border: '1px solid #222', borderRadius: '15px', padding: '8px 10px', fontSize: '10px' }}>Back</button><input value={chatText} onChange={e => setChatText(e.target.value)} placeholder={`Message ${chatWith}...`} style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #222', backgroundColor: '#111', color: 'white', fontSize: '11px' }} onKeyDown={e => e.key==='Enter' && sendMessage()} /><button onClick={sendMessage} style={{ backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '20px', padding: '8px 14px', fontSize: '11px', fontWeight: '900' }}>Send</button></div></>
          )}
        </div>
      )}

      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: '#111', width: '100%', maxWidth: '320px', padding: '16px', borderRadius: '12px', border: '1px solid #222' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', textAlign: 'center' }}>Upload - Video, Picture or Text</h3>
            <textarea value={postText} onChange={e => setPostText(e.target.value)} placeholder="Write text message post..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', fontSize: '11px', minHeight: '60px', boxSizing: 'border-box', marginBottom: '8px' }} />
            <button onClick={handleTextPost} style={{ width: '100%', padding: '10px', backgroundColor: '#1DA1F2', color: 'white', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '900', marginBottom: '8px' }}>📝 Post Written Message</button>
            <button onClick={() => cameraRef.current.click()} style={{ width: '100%', padding: '12px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', borderRadius: '8px', fontSize: '11px', marginBottom: '8px' }}>📷 Camera - Video/Picture</button>
            <input ref={cameraRef} type="file" accept="video/*,image/*" capture="environment" onChange={handleVideoUpload} style={{ display: 'none' }} />
            <button onClick={() => uploadRef.current.click()} style={{ width: '100%', padding: '12px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '900', marginBottom: '8px' }}>📁 Gallery - Video/Picture</button>
            <input ref={uploadRef} type="file" accept="video/*,image/*" onChange={handleVideoUpload} style={{ display: 'none' }} />
            <button onClick={() => setShowUpload(false)} style={{ width: '100%', padding: '8px', backgroundColor: 'transparent', color: '#666', border: 'none', fontSize: '11px' }}>Cancel</button>
          </div>
        </div>
      )}

      {showEdit && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: '#111', width: '100%', maxWidth: '320px', padding: '16px', borderRadius: '12px', border: '1px solid #222' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', textAlign: 'center' }}>Edit Account</h3>
            <img onClick={() => picRef.current.click()} src={currentUser.pic || `https://ui-avatars.com/api/?name=${currentUser.name}&background=222&color=fff&size=200`} style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 10px', display: 'block', border: '2px solid #333', cursor: 'pointer', objectFit: 'cover' }} />
            <input ref={picRef} type="file" accept="image/*" onChange={handlePicChange} style={{ display: 'none' }} />
            <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '7px', fontSize: '11px', boxSizing: 'border-box' }} />
            <input value={editBusiness} onChange={e => setEditBusiness(e.target.value)} placeholder="Business" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '7px', fontSize: '11px', boxSizing: 'border-box' }} />
            <input value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Bio" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '10px', fontSize: '11px', boxSizing: 'border-box' }} />
            {isCEO && <div style={{ backgroundColor: '#FF0000', color: 'white', padding: '6px', borderRadius: '6px', fontSize: '8px', marginBottom: '8px', textAlign: 'center' }}>CEO MODE: You see builder info - Others don't see</div>}
            <button onClick={handleEditSave} style={{ width: '100%', padding: '9px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '11px' }}>SAVE</button>
            <button onClick={() => setShowEdit(false)} style={{ width: '100%', padding: '7px', backgroundColor: 'transparent', color: '#666', border: 'none', fontSize: '11px', marginTop: '4px' }}>Cancel</button>
            <button onClick={() => { localStorage.removeItem('kb_current'); localStorage.removeItem('kb_screen'); setScreen('login'); setCurrentUser(null); }} style={{ width: '100%', padding: '7px', backgroundColor: '#1a1a1a', color: '#FF0000', border: '1px solid #222', borderRadius: '8px', fontSize: '10px', marginTop: '8px' }}>Logout</button>
          </div>
        </div>
      )}

      {selectedProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 30, overflowY: 'auto' }}>
          <div style={{ padding: '10px', display: 'flex', gap: '8px', alignItems: 'center', borderBottom: '1px solid #111' }}><button onClick={() => setSelectedProfile(null)} style={{ backgroundColor: '#111', color: 'white', border: '1px solid #222', borderRadius: '50%', width: '28px', height: '28px' }}>←</button><Logo /></div>
          <div style={{ padding: '12px', textAlign: 'center' }}>
            <img src={selectedProfile.pic || `https://ui-avatars.com/api/?name=${selectedProfile.name}&background=111&color=fff&size=200`} style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '8px' }}>{selectedProfile.name} {selectedProfile.isBoss && <BlueTick />}</div>
            <div style={{ fontSize: '10px', color: '#666' }}>{selectedProfile.business}</div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>{selectedProfile.bio}</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
              <button onClick={() => toggleFollow(selectedProfile.owner)} style={{ backgroundColor: following.includes(selectedProfile.owner) ? 'white' : 'transparent', color: following.includes(selectedProfile.owner) ? 'black' : 'white', border: `1px solid ${following.includes(selectedProfile.owner) ? 'white' : '#333'}`, borderRadius: '15px', padding: '6px 14px', fontSize: '10px', fontWeight: '700' }}>{following.includes(selectedProfile.owner) ? 'Following ✓' : '+ Follow'}</button>
              <button onClick={() => { setChatWith(selectedProfile.owner); setSelectedProfile(null); setShowChat(true); }} style={{ backgroundColor: '#111', color: 'white', border: '1px solid #222', borderRadius: '15px', padding: '6px 14px', fontSize: '10px' }}>💬 Message</button>
              <button onClick={() => toggleBlock(selectedProfile.owner)} style={{ backgroundColor: blocked.includes(selectedProfile.owner) ? '#FF0000' : '#111', color: 'white', border: '1px solid #222', borderRadius: '15px', padding: '6px 14px', fontSize: '10px' }}>{blocked.includes(selectedProfile.owner) ? 'Unblock' : 'Block'}</button>
            </div>
            <div style={{ marginTop: '12px' }}>{selectedProfile.isText ? <div style={{ padding: '14px', backgroundColor: '#111', borderRadius: '10px', fontSize: '13px' }}>{selectedProfile.text}</div> : selectedProfile.isImage ? <img src={selectedProfile.video} style={{ width: '100%', borderRadius: '10px' }} /> : <video src={selectedProfile.video} autoPlay controls playsInline style={{ width: '100%', borderRadius: '10px', backgroundColor: 'black' }} />}</div>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'black', borderTop: '1px solid #111', display: 'flex', justifyContent: 'space-around', padding: '6px 0' }}>
        <div onClick={() => setActiveTab('For You')} style={{ textAlign: 'center', color: activeTab==='For You' ? 'white' : '#666', cursor: 'pointer' }}><div style={{ fontSize: '16px' }}>🏠</div><div style={{ fontSize: '7px', fontWeight: '900' }}>For You</div></div>
        <div onClick={() => { setActiveTab('Live'); setShowLive(true); startLive(); }} style={{ textAlign: 'center', color: '#666', cursor: 'pointer' }}><div style={{ fontSize: '16px' }}>🔴</div><div style={{ fontSize: '7px', fontWeight: '900' }}>Live</div></div>
        <div onClick={() => setShowUpload(true)} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ backgroundColor: 'white', color: 'black', width: '32px', height: '20px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900', margin: '0 auto' }}>+</div><div style={{ fontSize: '7px', fontWeight: '900', color: 'white' }}>Upload</div></div>
        <div onClick={() => setShowChat(true)} style={{ textAlign: 'center', color: '#666', cursor: 'pointer' }}><div style={{ fontSize: '16px' }}>💬</div><div style={{ fontSize: '7px', fontWeight: '900' }}>Chat</div></div>
        <div onClick={() => setActiveTab('My Account')} style={{ textAlign: 'center', color: activeTab==='My Account' ? 'white' : '#666', cursor: 'pointer' }}><div style={{ fontSize: '16px' }}>👤</div><div style={{ fontSize: '7px', fontWeight: '900' }}>My Account</div></div>
      </div>
    </div>
  );
}
export default App;
