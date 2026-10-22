import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('kb_posts');
    return saved ? JSON.parse(saved) : [
      { id: '1', user: 'Kayima Baker', username: 'kayima', video: 'https://www.w3schools.com/html/mov_bbb.mp4', likes: 12, comments: [{user: 'John', text: 'Nice!'}], caption: 'Fresh bread daily! 🍞' },
      { id: '2', user: 'Sarah Shop', username: 'sarah', video: 'https://www.w3schools.com/html/movie.mp4', likes: 8, comments: [], caption: 'New clothes in Kampala' }
    ];
  });
  const [currentUser] = useState('You');
  const [currentUsername] = useState('you');
  const [following, setFollowing] = useState(() => {
    const s = localStorage.getItem('kb_following');
    return s ? JSON.parse(s) : [];
  });
  const [showComments, setShowComments] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [showPost, setShowPost] = useState(false);
  const videoRefs = useRef({});

  useEffect(() => {
    localStorage.setItem('kb_posts', JSON.stringify(posts));
  }, [posts]);
  useEffect(() => {
    localStorage.setItem('kb_following', JSON.stringify(following));
  }, [following]);

  // AUTO-PLAY LOGIC: play when on screen, pause when off
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(()=>{});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.7 });

    Object.values(videoRefs.current).forEach(v => v && observer.observe(v));
    return () => observer.disconnect();
  }, [posts]);

  const toggleFollow = (username) => {
    if (username === currentUsername) return;
    setFollowing(prev => prev.includes(username) ? prev.filter(u=>u!==username) : [...prev, username]);
  };

  const handlePost = () => {
    if (!newVideoUrl) return alert('Add video link');
    const newPost = {
      id: Date.now().toString(),
      user: currentUser,
      username: currentUsername,
      video: newVideoUrl,
      likes: 0,
      comments: [],
      caption: newCaption
    };
    setPosts([newPost, ...posts]);
    setNewVideoUrl(''); setNewCaption(''); setShowPost(false);
  };

  const addComment = (postId) => {
    if (!commentText.trim()) return;
    setPosts(posts.map(p => p.id===postId ? {...p, comments: [...p.comments, {user: currentUser, text: commentText}]} : p));
    setCommentText('');
  };

  const addLike = (postId) => {
    setPosts(posts.map(p => p.id===postId ? {...p, likes: p.likes+1} : p));
  };

  return (
    <div style={{background: '#000', color: '#fff', minHeight: '100vh', maxWidth: '400px', margin: '0 auto', position: 'relative'}}>
      {/* HEADER WITH LOGO */}
      <div style={{position: 'fixed', top:0, width: '100%', maxWidth: '400px', zIndex:100, background: 'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 15px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <div style={{width:36, height:36, background:'#111', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>
            <span style={{color:'white'}}>K</span><span style={{color:'red'}}>B</span>
          </div>
          <span style={{fontWeight:'bold', fontSize:'18px'}}>Kampala Business</span>
        </div>
        <button onClick={()=>setShowPost(true)} style={{background:'#fff', color:'#000', border:0, padding:'6px 14px', borderRadius:'20px', fontWeight:'bold'}}>+ Post</button>
      </div>

      {/* FOR YOU FEED - TIKTOK SCROLL */}
      <div style={{paddingTop:'60px', height:'100vh', overflowY:'scroll', scrollSnapType:'y mandatory'}}>
        {posts.map(post => (
          <div key={post.id} style={{height:'100vh', scrollSnapAlign:'start', position:'relative', background:'#000'}}>
            <video
              ref={el => videoRefs.current[post.id]=el}
              src={post.video}
              loop
              muted
              playsInline
              style={{width:'100%', height:'100%', objectFit:'cover'}}
              onClick={e=> e.target.paused ? e.target.play() : e.target.pause()}
            />
            {/* Right side buttons */}
            <div style={{position:'absolute', right:'10px', bottom:'120px', display:'flex', flexDirection:'column', gap:'20px', alignItems:'center'}}>
              {/* FOLLOW BUTTON - ONLY IF NOT YOUR OWN VIDEO */}
              {post.username !== currentUsername && (
                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <div style={{width:50, height:50, borderRadius:'50%', background:'#444', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white', fontWeight:'bold'}}>
                    {post.user[0]}
                  </div>
                  <button
                    onClick={()=>toggleFollow(post.username)}
                    style={{marginTop:'-10px', width:24, height:24, borderRadius:'50%', background: following.includes(post.username) ? '#fff' : '#ff0050', color: following.includes(post.username) ? '#000' : '#fff', border:0, fontSize:'14px', fontWeight:'bold'}}
                  >
                    {following.includes(post.username) ? '✓' : '+'}
                  </button>
                  <span style={{fontSize:'11px', marginTop:'4px'}}>{following.includes(post.username) ? 'Following' : post.user.split(' ')[0]}</span>
                </div>
              )}

              <button onClick={()=>addLike(post.id)} style={{background:'transparent', border:0, color:'white', fontSize:'28px'}}>❤️<div style={{fontSize:'12px'}}>{post.likes}</div></button>
              <button onClick={()=>setShowComments(post.id)} style={{background:'transparent', border:0, color:'white', fontSize:'28px'}}>💬<div style={{fontSize:'12px'}}>{post.comments.length}</div></button>
            </div>

            {/* Caption bottom */}
            <div style={{position:'absolute', bottom:'20px', left:'10px', right:'80px'}}>
              <p style={{fontWeight:'bold', margin:0}}>@{post.username} {following.includes(post.username) && <span style={{color:'#ff0050'}}> • Following</span>}</p>
              <p style={{margin:'5px 0 0 0', fontSize:'14px'}}>{post.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* COMMENTS MODAL - NOW WORKING */}
      {showComments && (
        <div style={{position:'fixed', bottom:0, left:0, right:0, maxWidth:'400px', margin:'0 auto', background:'#1a1a1a', maxHeight:'60vh', borderTopLeftRadius:'15px', borderTopRightRadius:'15px', zIndex:200, display:'flex', flexDirection:'column'}}>
          <div style={{padding:'15px', borderBottom:'1px solid #333', display:'flex', justifyContent:'space-between'}}>
            <strong>{posts.find(p=>p.id===showComments)?.comments.length} Comments</strong>
            <button onClick={()=>setShowComments(null)} style={{background:'transparent', border:0, color:'white', fontSize:'20px'}}>✕</button>
          </div>
          <div style={{overflowY:'auto', flex:1, padding:'10px'}}>
            {posts.find(p=>p.id===showComments)?.comments.map((c,i)=>(
              <div key={i} style={{marginBottom:'12px'}}><strong style={{fontSize:'13px'}}>{c.user}</strong><p style={{margin:'2px 0', fontSize:'14px'}}>{c.text}</p></div>
            ))}
          </div>
          <div style={{padding:'10px', display:'flex', gap:'10px', borderTop:'1px solid #333'}}>
            <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment..." style={{flex:1, background:'#333', border:0, padding:'10px', borderRadius:'20px', color:'white'}}/>
            <button onClick={()=>addComment(showComments)} style={{background:'#ff0050', border:0, color:'white', padding:'8px 16px', borderRadius:'20px'}}>Post</button>
          </div>
        </div>
      )}

      {/* POST MODAL */}
      {showPost && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
          <div style={{background:'#222', padding:'20px', borderRadius:'15px', width:'100%'}}>
            <h3>Post Video to For You</h3>
            <p style={{fontSize:'12px', color:'#aaa'}}>Everyone will see your video!</p>
            <input value={newVideoUrl} onChange={e=>setNewVideoUrl(e.target.value)} placeholder="Paste video URL (mp4 link)" style={{width:'100%', padding:'10px', margin:'10px 0', borderRadius:'8px', border:0}}/>
            <input value={newCaption} onChange={e=>setNewCaption(e.target.value)} placeholder="Caption..." style={{width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'8px', border:0}}/>
            <div style={{display:'flex', gap:'10px'}}>
              <button onClick={()=>setShowPost(false)} style={{flex:1, padding:'10px', background:'#444', border:0, color:'white', borderRadius:'8px'}}>Cancel</button>
              <button onClick={handlePost} style={{flex:1, padding:'10px', background:'#ff0050', border:0, color:'white', borderRadius:'8px'}}>Post for Everyone</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
