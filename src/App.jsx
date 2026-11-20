import React, { useState, useRef } from 'react';

const BlueTick = () => (
  <span style={{ display: 'inline-flex', backgroundColor: '#1DA1F2', color: 'white', borderRadius: '50%', width: '16px', height: '16px', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', marginLeft: '5px' }}>✓</span>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('kb_logged') === 'yes');
  const [currentPage, setCurrentPage] = useState('foryou');
  const [username, setUsername] = useState(localStorage.getItem('kb_user') || '');
  const [password, setPassword] = useState('');
  const [videos, setVideos] = useState([
    { id: 1, user: 'Katongole Rashid', handle: '@kampala_ceo', verified: true, business: 'CEO - Kampala Business', likes: 9999, followers: '15.4K', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isCEO: true },
    { id: 2, user: 'Aisha Fashion', handle: '@aisha_fashion', verified: false, business: 'Owino Boutique', likes: 1289, followers: '2.3K', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 3, user: 'Musa Electronics', handle: '@musa_electronics', verified: false, business: 'Kikuubo Electronics', likes: 856, followers: '1.2K', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  ]);
  const [followingIds, setFollowingIds] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleLogin = () => {
    if (username.trim().length < 2) { alert('Enter username Boss!'); return; }
    localStorage.setItem('kb_logged', 'yes');
    localStorage.setItem('kb_user', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('kb_logged');
    setIsLoggedIn(false);
    setCurrentPage('foryou');
  };

  const toggleFollow = (id) => {
    if (followingIds.includes(id)) setFollowingIds(followingIds.filter(i => i !== id));
    else setFollowingIds([...followingIds, id]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) { alert('Camera permission needed Boss! Allow camera.'); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const saveRecordedVideo = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const newVideo = { id: Date.now(), user: username, handle: '@' + username.replace(/\s/g, '_'), verified: username.toLowerCase().includes('rashid'), business: 'Kampala Business', likes: 0, followers: '0', video: url, isCEO: username.toLowerCase().includes('rashid') };
      setVideos([newVideo, ...videos]);
      setRecordedBlob(null);
      setCurrentPage('foryou');
      alert('Video posted to For You Page! 🔥');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newVideo = { id: Date.now(), user: username, handle: '@' + username.replace(/\s/g, '_'), verified: username.toLowerCase().includes('rashid'), business: 'My Business', likes: 0, followers: '0', video: url, isCEO: username.toLowerCase().includes('rashid') };
      setVideos([newVideo, ...videos]);
      setCurrentPage('foryou');
      alert('Video uploaded! 🔥');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Arial' }}>
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>📍</div>
        <h1 style={{ fontSize: '28px', margin: '0', textAlign: 'center' }}>Kampala Business</h1>
        <p style={{ color: '#FE2C55', fontWeight: 'bold', letterSpacing: '2px', marginTop: '5px' }}>DIRECTORY PRO</p>
        <div style={{ backgroundColor: '#111', width: '100%', maxWidth: '340px', padding: '25px', borderRadius: '20px', marginTop: '25px', border: '1px solid #222' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>Login Boss 👑</h2>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username (e.g. Katongole Rashid)" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#222', color: 'white', marginBottom: '12px', boxSizing: 'border-box' }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password (any)" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#222', color: 'white', marginBottom: '18px', boxSizing: 'border-box' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '14px', backgroundColor: '#FE2C55', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px' }}>Log In</button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '15px' }}>5000+ Businesses in Kampala • Owino • Kikuubo</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', fontFamily: 'Arial', paddingBottom: '70px' }}>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'black', zIndex: 10, display: 'flex', justifyContent: 'center', gap: '25px', padding: '12px', borderBottom: '1px solid #222', fontWeight: 'bold' }}>
        <span onClick={() => setCurrentPage('foryou')} style={{ color: currentPage === 'foryou' ? 'white' : '#888', borderBottom: currentPage === 'foryou' ? '2px solid white' : 'none', paddingBottom: '4px', cursor: 'pointer' }}>For You</span>
        <span onClick={() => setCurrentPage('following')} style={{ color: currentPage === 'following' ? 'white' : '#888', borderBottom: currentPage === 'following' ? '2px solid white' : 'none', paddingBottom: '4px', cursor: 'pointer' }}>Following</span>
        <span onClick={() => setCurrentPage('upload')} style={{ color: currentPage === 'upload' ? 'white' : '#888', cursor: 'pointer' }}>Upload</span>
      </div>

      {currentPage === 'foryou' && (
        <div>
          {videos.map(v => {
            const isFollowing = followingIds.includes(v.id);
            return (
              <div key={v.id} style={{ borderBottom: '1px solid #111', paddingBottom: '15px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
                  <div style={{ width: '45px', height: '45px', backgroundColor: '#222', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: v.isCEO ? '2px solid #FE2C55' : 'none' }}>{v.isCEO ? '👑' : '👤'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>{v.user} {v.verified && <BlueTick />}</div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{v.business} • {v.followers} followers</div>
                  </div>
                  <button onClick={() => toggleFollow(v.id)} style={{ backgroundColor: isFollowing ? 'transparent' : '#FE2C55', color: 'white', border: isFollowing ? '1px solid #444' : 'none', borderRadius: '6px', padding: '6px 16px', fontWeight: 'bold' }}>{isFollowing ? 'Following' : 'Follow'}</button>
                </div>
                <video src={v.video} controls loop style={{ width: '100%', maxHeight: '70vh', backgroundColor: '#111' }} />
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '22px' }}><span>❤️ {v.likes}</span><span>💬</span><span>↗️</span></div>
                  <p style={{ fontSize: '14px', marginTop: '6px' }}><b>{v.handle}</b> {v.business} - Kampala Business App. #Kampala #Owino #Kikuubo</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {currentPage === 'following' && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Following ({followingIds.length})</h2>
          {followingIds.length === 0 ? <p style={{ color: '#888' }}>You are not following anyone yet. Go to For You and Follow businesses!</p> :
            videos.filter(v => followingIds.includes(v.id)).map(v => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#111', padding: '12px', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#222', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{v.isCEO ? '👑' : '👤'}</div>
                <div style={{ textAlign: 'left' }}><b>{v.user}</b><div style={{ fontSize: '12px', color: '#888' }}>{v.business}</div></div>
              </div>
            ))
          }
        </div>
      )}

      {currentPage === 'upload' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ textAlign: 'center' }}>Upload Video 🎥</h2>
          <div style={{ backgroundColor: '#111', borderRadius: '15px', padding: '20px', marginTop: '20px' }}>
            <button onClick={() => fileInputRef.current.click()} style={{ width: '100%', padding: '16px', backgroundColor: '#1DA1F2', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>📁 Upload from Gallery</button>
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            <div style={{ textAlign: 'center', color: '#555', margin: '10px 0' }}>— OR —</div>
            <div style={{ backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', display: isRecording || recordedBlob ? 'block' : 'none', maxHeight: '400px' }} />
              {!isRecording && !recordedBlob && <div style={{ color: '#666' }}>Camera preview will appear here</div>}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              {!isRecording ? <button onClick={startRecording} style={{ flex: 1, padding: '14px', backgroundColor: '#FE2C55', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>🔴 Start Recording</button> :
                <button onClick={stopRecording} style={{ flex: 1, padding: '14px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>⏹️ Stop Recording</button>}
            </div>
            {recordedBlob && <button onClick={saveRecordedVideo} style={{ width: '100%', marginTop: '12px', padding: '14px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>✅ Post Video to For You</button>}
            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '15px' }}>Videos up to 1 minute • MP4, WebM supported</p>
          </div>
          <div style={{ backgroundColor: '#111', borderRadius: '15px', padding: '15px', marginTop: '20px' }}>
            <h3 style={{ marginTop: 0 }}>My Profile: {username}</h3>
            <p style={{ fontSize: '13px', color: '#888' }}>Videos Posted: {videos.filter(v => v.user === username).length}</p>
            <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: '#222', color: 'white', border: '1px solid #333', borderRadius: '10px', marginTop: '10px' }}>Logout</button>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'black', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', padding: '8px 0', fontFamily: 'Arial' }}>
        <div onClick={() => setCurrentPage('foryou')} style={{ textAlign: 'center', color: currentPage === 'foryou' ? 'white' : '#888', cursor: 'pointer' }}><div style={{ fontSize: '22px' }}>🏠</div><div style={{ fontSize: '10px' }}>Home</div></div>
        <div onClick={() => setCurrentPage('following')} style={{ textAlign: 'center', color: currentPage === 'following' ? 'white' : '#888', cursor: 'pointer' }}><div style={{ fontSize: '22px' }}>👥</div><div style={{ fontSize: '10px' }}>Following</div></div>
        <div onClick={() => setCurrentPage('upload')} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ backgroundColor: 'white', color: 'black', width: '40px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', margin: '0 auto' }}>+</div><div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>Upload</div></div>
        <div onClick={() => setCurrentPage('upload')} style={{ textAlign: 'center', color: currentPage === 'upload' ? 'white' : '#888', cursor: 'pointer' }}><div style={{ fontSize: '22px' }}>🎥</div><div style={{ fontSize: '10px' }}>Record</div></div>
        <div onClick={() => setCurrentPage('upload')} style={{ textAlign: 'center', color: '#888', cursor: 'pointer' }}><div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#333', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div><div style={{ fontSize: '10px' }}>{username.split(' ')[0]}</div></div>
      </div>
    </div>
  );
}

export default App;
