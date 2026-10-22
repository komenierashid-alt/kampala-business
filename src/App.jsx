import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [posts] = useState([
    { id: '1', user: 'Kayima Baker', username: 'kayima', video: 'https://www.w3schools.com/html/mov_bbb.mp4', likes: 12, comments: [{user: 'John', text: 'Nice!'}], caption: 'Fresh bread daily!' },
    { id: '2', user: 'Sarah Shop', username: 'sarah', video: 'https://www.w3schools.com/html/movie.mp4', likes: 8, comments: [], caption: 'New clothes in Kampala' }
  ]);
  const [following, setFollowing] = useState([]);
  const [showComments, setShowComments] = useState(null);
  const [commentText, setCommentText] = useState('');
  const currentUsername = 'you';
  const videoRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.play().catch(()=>{});
        else entry.target.pause();
      });
    }, { threshold: 0.6 });
    Object.values(videoRefs.current).forEach(v => v && observer.observe(v));
    return () => observer.disconnect();
  }, [posts]);

  const toggleFollow = (username) => {
    if (following.includes(username)) setFollowing(following.filter(u => u !== username));
    else setFollowing([...following, username]);
  };

  return (
    <div style={{background:'#000', color:'#fff', maxWidth:'400px', margin:'0 auto', minHeight:'100vh'}}>
      <div style={{position:'fixed', top:0, width:'100%', maxWidth:'400px', zIndex:10, background:'rgba(0,0,0,0.9)', padding:'10px', display:'flex', alignItems:'center', gap:'8px'}}>
        <div style={{width:32, height:32, borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}><span>K</span><span style={{color:'red'}}>B</span></div>
        <b>Kampala Business</b>
      </div>

      <div style={{paddingTop:'50px', height:'100vh', overflowY:'scroll', scrollSnapType:'y mandatory'}}>
        {posts.map(post => (
          <div key={post.id} style={{height:'100vh', scrollSnapAlign:'start', position:'relative'}}>
            <video ref={el => videoRefs.current[post.id]=el} src={post.video} loop muted playsInline style={{width:'100%', height:'100%', objectFit:'cover'}} />
            <div style={{position:'absolute', right:'10px', bottom:'100px', display:'flex', flexDirection:'column', gap:'15px', alignItems:'center'}}>
              {post.username !== currentUsername && (
                <div style={{textAlign:'center'}}>
                  <div style={{width:45, height:45, borderRadius:'50%', background:'#444', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white'}}>{post.user[0]}</div>
                  <button onClick={()=>toggleFollow(post.username)} style={{marginTop:'-8px', width:22, height:22, borderRadius:'50%', background: following.includes(post.username) ? 'white' : '#ff0050', color: following.includes(post.username) ? 'black' : 'white', border:0}}>{following.includes(post.username) ? '✓' : '+'}</button>
                </div>
              )}
              <button onClick={()=>alert('Liked!')} style={{background:'none', border:0, color:'white', fontSize:'26px'}}>❤️<div style={{fontSize:'11px'}}>{post.likes}</div></button>
              <button onClick={()=>setShowComments(post.id)} style={{background:'none', border:0, color:'white', fontSize:'26px'}}>💬<div style={{fontSize:'11px'}}>{post.comments.length}</div></button>
            </div>
            <div style={{position:'absolute', bottom:'20px', left:'10px'}}><b>@{post.username}</b><p style={{margin:'4px 0', fontSize:'13px'}}>{post.caption}</p></div>
          </div>
        ))}
      </div>

      {showComments !== null && (
        <div style={{position:'fixed', bottom:0, left:0, right:0, maxWidth:'400px', margin:'0 auto', background:'#222', borderTopLeftRadius:'15px', borderTopRightRadius:'15px', padding:'15px', maxHeight:'50vh', zIndex:20}}>
          <div style={{display:'flex', justifyContent:'space-between'}}><b>Comments</b><button onClick={()=>setShowComments(null)} style={{background:'none', border:0, color:'white'}}>✕</button></div>
          <div style={{margin:'10px 0'}}>
            {posts.find(p=>p.id===showComments)?.comments.map((c,i)=><div key={i} style={{marginBottom:'8px'}}><b style={{fontSize:'12px'}}>{c.user}: </b><span style={{fontSize:'13px'}}>{c.text}</span></div>)}
          </div>
          <div style={{display:'flex', gap:'8px'}}><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add comment" style={{flex:1, padding:'8px', borderRadius:'20px', border:0}}/><button onClick={()=>{setCommentText(''); alert('Comment posted! Working!')}} style={{background:'#ff0050', border:0, color:'white', borderRadius:'20px', padding:'8px 12px'}}>Post</button></div>
        </div>
      )}
    </div>
  );
}
