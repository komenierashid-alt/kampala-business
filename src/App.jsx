import React, { useState, useRef } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('kb_logged') === 'yes');
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentPage, setCurrentPage] = useState('foryou');
  const [username, setUsername] = useState(localStorage.getItem('kb_user') || 'katongole rashid');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('kb_pic') || null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [duetVideo, setDuetVideo] = useState(null);
  const [followingIds, setFollowingIds] = useState(() => JSON.parse(localStorage.getItem('kb_following') || '[]'));
  const [followersCount, setFollowersCount] = useState(() => parseInt(localStorage.getItem('kb_followers') || '15400'));
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');
  const [chatUser, setChatUser] = useState(null);
  const [chats, setChats] = useState(() => JSON.parse(localStorage.getItem('kb_chats') || '{}'));
  const [chatInput, setChatInput] = useState('');
  const [showFollowersList, setShowFollowersList] = useState(null);
  const [videos, setVideos] = useState([
    { id: 1, name: 'Katongole Rashid', business: 'Kampala Business CEO', bio: 'CEO Kampala Business App! 5000+ Businesses! Founder!', country: 'UG 🇺🇬 CEO', verified: true, isCEO: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', likes: 9999, views: 15400, followers: 15400 },
    { id: 2, name: 'Mesach Ssemakula', business: 'Golden Production Legend', bio: 'Sigwe Onsimila! Golden Papa of Uganda! 🇺🇬 Legend!', country: 'UG 🇺🇬 Legend', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', likes: 32000, views: 88000, followers: 45000 },
    { id: 3, name: 'Haruna Mubiru', business: 'Kream Production', bio: 'Kiwuunya, Ekyaama! Kream!', country: 'UG 🇺🇬 Legend', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', likes: 28000, views: 75000, followers: 42000 },
    { id: 4, name: 'Bobi Wine', business: 'Ghetto President', bio: 'Kyarenga! People Power!', country: 'UG 🇺🇬', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', likes: 45000, views: 120000, followers: 92000 },
    { id: 5, name: 'Jose Chameleone', business: 'Leone Island Legend', bio: 'Baliwa, Valu Valu! Champion!', country: 'UG 🇺🇬 Legend', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', likes: 48000, views: 135000, followers: 78000 },
    { id: 6, name: 'King Saha', business: 'Kings Love Music', bio: 'Biri Biri, Zakayo! King of Love!', country: 'UG 🇺🇬', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', likes: 35000, views: 95000, followers: 62000 },
    { id: 7, name: 'Sia', business: 'USA Chandelier Queen', bio: 'Chandelier, Cheap Thrills!', country: 'USA 🇺🇸', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', likes: 180000, views: 650000, followers: 320000 },
    { id: 8, name: 'P!NK', business: 'USA Pop Rock Queen', bio: 'Just Give Me A Reason!', country: 'USA 🇺🇸', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', likes: 165000, views: 580000, followers: 290000 },
    { id: 9, name: 'Rihanna', business: 'USA Fenty Queen', bio: 'Diamonds, Umbrella!', country: 'USA 🇺🇸', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', likes: 250000, views: 900000, followers: 500000 },
    { id: 10, name: 'Drake', business: 'Canada OVO King', bio: 'Gods Plan! 6 God!', country: 'USA 🇺🇸', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', likes: 220000, views: 800000, followers: 450000 },
    { id: 11, name: 'Jay-Z', business: 'USA Roc Nation Legend', bio: 'Empire State! Brooklyn Legend!', country: 'USA 🇺🇸', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', likes: 190000, views: 700000, followers: 380000 },
    { id: 12, name: 'Lil Wayne', business: 'USA Young Money', bio: 'Lollipop, A Milli! Weezy!', country: 'USA 🇺🇸', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', likes: 140000, views: 520000, followers: 270000 },
    { id: 13, name: 'Burna Boy', business: 'Nigeria African Giant', bio: 'Ye, Last Last! African Giant!', country: 'NG 🇳🇬', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', likes: 130000, views: 480000, followers: 250000 },
    { id: 14, name: 'BTS', business: 'South Korea K-Pop Kings', bio: 'Dynamite, Butter! K-Pop!', country: 'ASIA 🇰🇷', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', likes: 300000, views: 1200000, followers: 600000 },
    { id: 15, name: 'Shakira', business: 'Colombia Waka Waka Queen', bio: 'Waka Waka, Hips Dont Lie!', country: 'SA 🇨🇴', verified: true, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', likes: 230000, views: 850000, followers: 440000 },
    { id: 16, name: 'AI Movie: Kampala 2050', business: 'AI Generated Movie', bio: 'AI movie Kampala 2050! Flying bodas! 🤖🎬', country: 'AI 🤖 Movie', verified: false, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', likes: 12000, views: 35000, followers: 8000 },
  ]);
  const fileRef = useRef(null);
  const picRef = useRef(null);

  const filtered = videos.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.business.toLowerCase().includes(search.toLowerCase()));
  const peopleToFollow = videos.filter(v => v.name !== username && !followingIds.includes(v.id)).slice(0,5);

  const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '36px', height: '36px', backgroundColor: 'black', border: '2px solid #00C853', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: 'rotate(45deg)', fontWeight: '900', fontSize: '14px' }}><span style={{ color: '#FF0000' }}>K</span><span style={{ color: 'white' }}>B</span></div>
      </div>
      <div style={{ lineHeight: '1' }}><div style={{ fontWeight: '900', fontSize: '12px', color: '#00C853' }}>KAMPALA</div><div style={{ fontWeight: '900', fontSize: '12px', color: 'white' }}>BUSINESS</div></div>
    </div>
  );

  const handleFollow = (id) => {
    let newFollowing;
    if (followingIds.includes(id)) {
      newFollowing = followingIds.filter(x => x !== id);
    } else {
      newFollowing = [...followingIds, id];
    }
    setFollowingIds(newFollowing);
    localStorage.setItem('kb_following', JSON.stringify(newFollowing));
  };

  const handleComment = (videoId) => {
    if (!commentText.trim()) return;
    const newComments = { ...comments };
    if (!newComments[videoId]) newComments[videoId] = [];
    newComments[videoId] = [...newComments[videoId], { user: username, text: commentText, time: 'Just now' }];
    setComments(newComments);
    setCommentText('');
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || !chatUser) return;
    const chatKey = chatUser.name;
    const currentChat = chats[chatKey] || [];
    
    // CHECK 2 MESSAGE RULE: If last 2 messages are from me and no reply from them, block
    const lastTwo = currentChat.slice(-2);
    if (lastTwo.length === 2 && lastTwo.every(m => m.from === username)) {
      // Check if they replied after those 2
      const hasReplied = currentChat.slice(-2).some(m => m.from !== username);
      if (!hasReplied && lastTwo.length >= 2) {
        alert('⚠️ You sent 2 messages. Wait for ' + chatUser.name + ' to reply before sending more! (Anti-spam rule)');
        return;
      }
    }
    // More strict: count consecutive messages from me without reply
    let consecutiveMine = 0;
    for (let i = currentChat.length - 1; i >= 0; i--) {
      if (currentChat[i].from === username) consecutiveMine++;
      else break;
    }
    if (consecutiveMine >= 2) {
      alert('⚠️ Wait for reply! You sent 2 messages already. ' + chatUser.name + ' must reply first.');
      return;
    }

    const newMsg = { from: username, text: chatInput, time: new Date().toLocaleTimeString() };
    const updatedChats = { ...chats, [chatKey]: [...currentChat, newMsg] };
    setChats(updatedChats);
    localStorage.setItem('kb_chats', JSON.stringify(updatedChats));
    setChatInput('');
  };

  const handleAuth = () => {
    if (username.trim().length < 2) { alert('Enter username!'); return; }
    if (password.length < 3) { alert('Password 3+ chars!'); return; }
    if (isSignUp && !email.includes('@')) { alert('Valid email!'); return; }
    localStorage.setItem('kb_logged', 'yes');
    localStorage.setItem('kb_user', username);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: '#000', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Arial' }}>
        <Logo /><div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #FF0000, white, #00C853)', marginTop: '8px', borderRadius: '2px' }}></div>
        <div style={{ backgroundColor: '#111', width: '100%', maxWidth: '340px', padding: '20px', borderRadius: '15px', marginTop: '15px', border: '2px solid #00C853' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>{isSignUp ? 'SIGN UP' : 'LOGIN'} - FINAL</h2>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username (e.g. katongole rashid)" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #00C853', backgroundColor: '#222', color: 'white', marginBottom: '10px', boxSizing: 'border-box' }} />
          {isSignUp && <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#222', color: 'white', marginBottom: '10px', boxSizing: 'border-box' }} />}
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #FF0000', backgroundColor: '#222', color: 'white', marginBottom: '12px', boxSizing: 'border-box' }} />
          <button onClick={handleAuth} style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #FF0000, white, #00C853)', color: 'black', border: 'none', borderRadius: '10px', fontWeight: '900' }}>{isSignUp ? 'SIGN UP' : 'LOGIN'} - TEST TOMORROW</button>
          <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px' }}>{isSignUp ? 'Have account? ' : 'No account? '}<span onClick={() => setIsSignUp(!isSignUp)} style={{ color: '#00C853', fontWeight: '900', cursor: 'pointer' }}>{isSignUp ? 'Login' : 'Sign Up'}</span></p>
        </div>
      </div>
    );
  }

  if (chatUser) {
    const chatKey = chatUser.name;
    const currentChat = chats[chatKey] || [];
    let consecutiveMine = 0;
    for (let i = currentChat.length - 1; i >= 0; i--) {
      if (currentChat[i].from === username) consecutiveMine++;
      else break;
    }
    const isBlocked = consecutiveMine >= 2;

    return (
      <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial' }}>
        <div style={{ padding: '10px', borderBottom: '2px solid #00C853', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#111' }}>
          <button onClick={() => setChatUser(null)} style={{ backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px' }}>←</button>
          <img src={`https://ui-avatars.com/api/?name=${chatUser.name}&background=00C853&color=000`} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          <div><b>{chatUser.name}</b><div style={{ fontSize: '10px', color: '#00C853' }}>{chatUser.business} • {isBlocked ? '🔒 Waiting for reply' : '🟢 Online'}</div></div>
        </div>
        <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
          {currentChat.length === 0 && <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Start chatting with {chatUser.name}! 👋<br/><span style={{ fontSize: '11px' }}>Rule: 2 messages max without reply</span></p>}
          {currentChat.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === username ? 'flex-end' : 'flex-start', marginTop: '8px' }}>
              <div style={{ backgroundColor: m.from === username ? '#00C853' : '#222', color: m.from === username ? 'black' : 'white', padding: '8px 12px', borderRadius: m.from === username ? '15px 15px 0 15px' : '15px 15px 15px 0', maxWidth: '70%', fontSize: '13px' }}>
                {m.text}<div style={{ fontSize: '9px', opacity: 0.7, marginTop: '3px' }}>{m.time}</div>
              </div>
            </div>
          ))}
          {isBlocked && <div style={{ backgroundColor: '#FF0000', color: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center', marginTop: '10px', fontSize: '12px', fontWeight: '900' }}>🔒 You sent 2 messages. Wait for {chatUser.name} to reply!</div>}
        </div>
        <div style={{ padding: '10px', borderTop: '1px solid #333', display: 'flex', gap: '8px', backgroundColor: '#111' }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={isBlocked ? 'Waiting for reply...' : 'Type message...'} disabled={isBlocked} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #00C853', backgroundColor: '#222', color: 'white', opacity: isBlocked ? 0.5 : 1 }} />
          <button onClick={handleSendChat} disabled={isBlocked} style={{ backgroundColor: isBlocked ? '#666' : '#00C853', color: 'black', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontWeight: '900' }}>➤</button>
        </div>
      </div>
    );
  }

  if (selectedProfile) {
    const isFollowing = followingIds.includes(selectedProfile.id);
    const profileComments = comments[selectedProfile.id] || [];
    return (
      <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', fontFamily: 'Arial', paddingBottom: '70px' }}>
        <div style={{ padding: '10px', borderBottom: '2px solid #00C853', display: 'flex', gap: '10px', alignItems: 'center' }}><button onClick={() => setSelectedProfile(null)} style={{ backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px' }}>←</button><Logo /></div>
        <div style={{ padding: '15px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <img src={`https://ui-avatars.com/api/?name=${selectedProfile.name}&background=000&color=fff`} style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #00C853' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>{selectedProfile.name} {selectedProfile.verified && '✓'}</h3>
              <p style={{ color: '#00C853', fontWeight: '900', fontSize: '12px', margin: '3px 0' }}>{selectedProfile.business}</p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', marginTop: '5px' }}>
                <span><b style={{ color: 'white' }}>{followingIds.filter(id => videos.find(v => v.id === id)?.name === selectedProfile.name ? false : true).length}</b> Following</span>
                <span><b style={{ color: '#00C853' }}>{selectedProfile.followers.toLocaleString()}</b> Followers</span>
                <span><b style={{ color: 'white' }}>{selectedProfile.views.toLocaleString()}</b> Views</span>
              </div>
            </div>
          </div>
          <p style={{ backgroundColor: '#111', borderLeft: '3px solid #FF0000', padding: '10px', borderRadius: '8px', marginTop: '12px', fontSize: '13px' }}>{selectedProfile.bio}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '10px' }}>
            <button onClick={() => handleFollow(selectedProfile.id)} style={{ padding: '10px', backgroundColor: isFollowing ? 'white' : '#00C853', color: isFollowing ? 'black' : 'black', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '11px' }}>{isFollowing ? '✓ FOLLOWING' : '+ FOLLOW'}</button>
            <button onClick={() => setChatUser(selectedProfile)} style={{ padding: '10px', backgroundColor: '#111', color: 'white', border: '1px solid white', borderRadius: '8px', fontWeight: '900', fontSize: '11px' }}>💬 CHAT (2 msg rule)</button>
            <button onClick={() => { const a = document.createElement('a'); a.href = selectedProfile.video; a.download = selectedProfile.name + '.mp4'; a.click(); }} style={{ padding: '10px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '11px' }}>⬇️ DOWNLOAD</button>
          </div>
          <video src={selectedProfile.video} controls style={{ width: '100%', borderRadius: '12px', marginTop: '12px', border: '2px solid white' }} />
          <div style={{ marginTop: '15px' }}>
            <h4 style={{ color: '#00C853', margin: '0 0 8px 0' }}>💬 Comments ({profileComments.length}) - GREEN</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={`Comment as ${username}...`} style={{ flex: 1, padding: '9px', borderRadius: '20px', border: '1px solid #00C853', backgroundColor: '#111', color: 'white' }} />
              <button onClick={() => handleComment(selectedProfile.id)} style={{ backgroundColor: '#00C853', color: 'black', border: 'none', borderRadius: '20px', padding: '8px 14px', fontWeight: '900' }}>Post</button>
            </div>
            {profileComments.map((c, i) => <div key={i} style={{ backgroundColor: '#111', padding: '8px 10px', borderRadius: '10px', marginTop: '6px', fontSize: '12px' }}><b style={{ color: '#00C853' }}>{c.user}</b> <span style={{ color: '#666', fontSize: '10px' }}>{c.time}</span><div>{c.text}</div></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', fontFamily: 'Arial', paddingBottom: '75px' }}>
      <div style={{ backgroundColor: 'black', padding: '10px', position: 'sticky', top: 0, zIndex: 20, borderBottom: '3px solid', borderImage: 'linear-gradient(90deg, #FF0000, white, #00C853) 1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo />
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', backgroundColor: '#00C853', color: 'black', padding: '3px 6px', borderRadius: '10px', fontWeight: '900' }}>{followingIds.length} Following</span>
            <span style={{ fontSize: '9px', backgroundColor: 'white', color: 'black', padding: '3px 6px', borderRadius: '10px', fontWeight: '900' }}>{followersCount.toLocaleString()} Followers</span>
            <img src={profilePic || `https://ui-avatars.com/api/?name=${username}&background=000&color=fff`} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white' }} />
          </div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search katongola rashid, Sia, Rihanna, Mesach..." style={{ width: '100%', padding: '10px', borderRadius: '20px', border: '1px solid white', backgroundColor: '#111', color: 'white', marginTop: '10px', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: '5px', marginTop: '8px', overflowX: 'auto' }}>
          <span style={{ backgroundColor: '#00C853', color: 'black', padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: '900' }}>UG 15</span>
          <span style={{ backgroundColor: '#FF0000', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: '900' }}>USA 19</span>
          <span style={{ backgroundColor: 'white', color: 'black', padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: '900' }}>FOLLOWERS GREEN</span>
          <span style={{ backgroundColor: '#FFCC00', color: 'black', padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: '900' }}>CHAT 2-MSG RULE</span>
        </div>
      </div>

      {currentPage === 'foryou' && (
        <div style={{ padding: '10px' }}>
          {/* PEOPLE TO FOLLOW */}
          <div style={{ backgroundColor: '#111', border: '1px solid #00C853', borderRadius: '12px', padding: '10px', marginBottom: '12px' }}>
            <div style={{ fontWeight: '900', fontSize: '12px', color: '#00C853', marginBottom: '8px' }}>👥 PEOPLE TO FOLLOW - Tap Follow</div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {peopleToFollow.map(p => (
                <div key={p.id} style={{ minWidth: '90px', backgroundColor: 'black', border: '1px solid #333', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
                  <img src={`https://ui-avatars.com/api/?name=${p.name}&background=000&color=fff`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div style={{ fontSize: '10px', fontWeight: '900', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: '8px', color: '#888' }}>{p.followers.toLocaleString()} followers</div>
                  <button onClick={() => handleFollow(p.id)} style={{ width: '100%', marginTop: '5px', padding: '4px', backgroundColor: '#00C853', color: 'black', border: 'none', borderRadius: '12px', fontSize: '9px', fontWeight: '900' }}>+ FOLLOW</button>
                </div>
              ))}
            </div>
          </div>

          {filtered.map(v => {
            const isFollowing = followingIds.includes(v.id);
            const vComments = comments[v.id] || [];
            return (
              <div key={v.id} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '14px', overflow: 'hidden', marginTop: '12px' }}>
                <div onClick={() => setSelectedProfile(v)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', backgroundColor: 'black' }}>
                  <img src={`https://ui-avatars.com/api/?name=${v.name}&background=000&color=fff`} style={{ width: '42px', height: '42px', borderRadius: '50%', border: v.verified ? '2px solid #00C853' : '1px solid #333' }} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: '900', fontSize: '13px' }}>{v.name} {v.verified && '✓'} <span style={{ fontSize: '8px', backgroundColor: v.isCEO ? '#FFCC00' : '#00C853', color: 'black', padding: '2px 5px', borderRadius: '8px' }}>{v.country}</span></div><div style={{ fontSize: '11px', color: '#00C853' }}>{v.business} • Tap to see account</div></div>
                  <button onClick={(e) => { e.stopPropagation(); handleFollow(v.id); }} style={{ backgroundColor: isFollowing ? 'white' : '#00C853', color: 'black', border: 'none', borderRadius: '15px', padding: '4px 10px', fontSize: '10px', fontWeight: '900' }}>{isFollowing ? '✓ FOLLOWING' : '+ FOLLOW'}</button>
                </div>
                <video src={v.video} controls style={{ width: '100%', maxHeight: '380px' }} />
                <div style={{ padding: '8px', backgroundColor: 'black', fontSize: '12px' }}>{v.bio}</div>
                <div style={{ padding: '8px 10px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#0a0a0a', borderTop: '1px solid #222' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#00C853', border: '1px solid #00C853', padding: '3px 7px', borderRadius: '12px', fontWeight: '900' }}>👁️ {v.views.toLocaleString()} GREEN</span>
                    <span style={{ fontSize: '11px', color: 'white', border: '1px solid white', padding: '3px 7px', borderRadius: '12px', fontWeight: '900' }}>💬 {vComments.length}</span>
                    <span style={{ fontSize: '11px', color: '#FFCC00', border: '1px solid #FFCC00', padding: '3px 7px', borderRadius: '12px', fontWeight: '900' }}>👥 {v.followers.toLocaleString()} FOLLOWERS</span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => setSelectedProfile(v)} style={{ backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '15px', padding: '4px 9px', fontSize: '10px', fontWeight: '900' }}>💬 COMMENT</button>
                    <button onClick={() => setChatUser(v)} style={{ backgroundColor: '#00C853', color: 'black', border: 'none', borderRadius: '15px', padding: '4px 9px', fontSize: '10px', fontWeight: '900' }}>💬 CHAT</button>
                  </div>
                </div>
                {vComments.slice(-2).map((c, i) => <div key={i} style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#0a0a0a', borderTop: '1px solid #111' }}><b style={{ color: '#00C853' }}>{c.user}:</b> {c.text}</div>)}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(90deg, #FF0000 0%, white 50%, #00C853 100%)', display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
        <div onClick={() => setCurrentPage('foryou')} style={{ textAlign: 'center', color: 'black', fontWeight: '900' }}><div>🏠</div><div style={{ fontSize: '8px' }}>FOR YOU<br/>{videos.length} VIDEOS</div></div>
        <div onClick={() => { setShowFollowersList(true); setCurrentPage('followers'); }} style={{ textAlign: 'center', color: 'black', fontWeight: '900' }}><div>👥</div><div style={{ fontSize: '8px' }}>FOLLOWERS<br/>GREEN</div></div>
        <div onClick={() => setCurrentPage('following')} style={{ textAlign: 'center', color: 'black', fontWeight: '900' }}><div style={{ backgroundColor: 'black', color: 'white', width: '28px', height: '20px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>{followingIds.length}</div><div style={{ fontSize: '8px' }}>FOLLOWING<br/>WHITE</div></div>
        <div onClick={() => setCurrentPage('chats')} style={{ textAlign: 'center', color: 'black', fontWeight: '900' }}><div>💬</div><div style={{ fontSize: '8px' }}>CHATS<br/>2-MSG RULE</div></div>
      </div>

      {currentPage === 'chats' && (
        <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: '60px', backgroundColor: 'black', zIndex: 15, padding: '10px', overflowY: 'auto' }}>
          <h3 style={{ color: '#00C853' }}>💬 Chats - 2 Message Rule</h3>
          <p style={{ fontSize: '11px', color: '#888' }}>Send 2 messages max if they don't reply. Then wait for reply.</p>
          {Object.keys(chats).length === 0 && <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>No chats yet. Start chatting from any video!</p>}
          {Object.entries(chats).map(([name, msgs]) => (
            <div key={name} onClick={() => { const v = videos.find(x => x.name === name); if(v) setChatUser(v); }} style={{ backgroundColor: '#111', padding: '10px', borderRadius: '10px', marginTop: '8px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
              <img src={`https://ui-avatars.com/api/?name=${name}&background=00C853&color=000`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div style={{ flex: 1 }}><b>{name}</b><div style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msgs[msgs.length-1]?.text}</div></div>
              <span style={{ fontSize: '10px', backgroundColor: '#00C853', color: 'black', padding: '3px 7px', borderRadius: '10px' }}>{msgs.length}</span>
            </div>
          ))}
          <button onClick={() => setCurrentPage('foryou')} style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '900' }}>← BACK TO FEED</button>
        </div>
      )}

      {(currentPage === 'following' || currentPage === 'followers') && (
        <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: '60px', backgroundColor: 'black', zIndex: 15, padding: '10px', overflowY: 'auto' }}>
          <h3 style={{ color: currentPage === 'following' ? 'white' : '#00C853' }}>{currentPage === 'following' ? `Following (${followingIds.length}) - WHITE` : `Followers (${followersCount}) - GREEN`}</h3>
          {(currentPage === 'following' ? videos.filter(v => followingIds.includes(v.id)) : videos.slice(0,8)).map(v => (
            <div key={v.id} onClick={() => setSelectedProfile(v)} style={{ backgroundColor: '#111', padding: '10px', borderRadius: '10px', marginTop: '8px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
              <img src={`https://ui-avatars.com/api/?name=${v.name}&background=000&color=fff`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div style={{ flex: 1 }}><b style={{ fontSize: '13px' }}>{v.name}</b><div style={{ fontSize: '11px', color: '#888' }}>{v.business}</div></div>
              <button onClick={(e) => { e.stopPropagation(); setChatUser(v); }} style={{ backgroundColor: '#00C853', color: 'black', border: 'none', borderRadius: '15px', padding: '5px 10px', fontSize: '10px', fontWeight: '900' }}>💬 CHAT</button>
            </div>
          ))}
          {currentPage === 'following' && followingIds.length === 0 && <p style={{ color: '#666', textAlign: 'center' }}>You are not following anyone yet. Tap + FOLLOW!</p>}
          <button onClick={() => setCurrentPage('foryou')} style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: currentPage === 'following' ? 'white' : '#00C853', color: 'black', border: 'none', borderRadius: '10px', fontWeight: '900' }}>← BACK</button>
        </div>
      )}
    </div>
  );
}

export default App;
