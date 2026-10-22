import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment, arrayUnion, arrayRemove, where, getDocs, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "kampala-business.firebaseapp.com",
  projectId: "kampala-business",
  storageBucket: "kampala-business.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('kb_user') || 'null'));
  const [showUsers, setShowUsers] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("For You");
  const [followingIds, setFollowingIds] = useState(JSON.parse(localStorage.getItem('kb_following') || '[]'));
  const videoRefs = useRef({});

  // Load videos
  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // Load users
  useEffect(() => {
    return onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // AUTO-PLAY LOGIC - This fixes video play!
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.7 });

    Object.values(videoRefs.current).forEach(v => {
      if (v) observer.observe(v);
    });

    return () => observer.disconnect();
  }, [videos, activeTab]);

  const handleFollow = async (targetUser) => {
    if (!currentUser) return alert("Sign up first!");
    if (targetUser.id === currentUser.id) return;
    
    const isFollowing = followingIds.includes(targetUser.id);
    let newFollowing;
    if (isFollowing) {
      newFollowing = followingIds.filter(id => id !== targetUser.id);
    } else {
      newFollowing = [...followingIds, targetUser.id];
      // Add notification
      await addDoc(collection(db, "notifications"), {
        toUserId: targetUser.id,
        fromUserId: currentUser.id,
        fromName: currentUser.name,
        type: "follow",
        createdAt: serverTimestamp(),
        read: false
      });
    }
    setFollowingIds(newFollowing);
    localStorage.setItem('kb_following', JSON.stringify(newFollowing));
    
    // Update followers count
    const userRef = doc(db, "users", targetUser.id);
    await updateDoc(userRef, {
      followers: increment(isFollowing ? -1 : 1)
    });
  };

  const handleLike = async (video) => {
    if (!currentUser) return;
    const liked = video.likedBy?.includes(currentUser.id);
    await updateDoc(doc(db, "videos", video.id), {
      likes: increment(liked ? -1 : 1),
      likedBy: liked ? arrayRemove(currentUser.id) : arrayUnion(currentUser.id)
    });
  };

  const handleAddComment = async (video) => {
    if (!commentText.trim() || !currentUser) return;
    await updateDoc(doc(db, "videos", video.id), {
      comments: arrayUnion({
        id: Date.now(),
        text: commentText,
        userName: currentUser.name,
        userId: currentUser.id,
        createdAt: new Date().toISOString()
      })
    });
    await updateDoc(doc(db, "videos", video.id), {
      commentCount: increment(1)
    });
    setCommentText("");
  };

  const filteredVideos = activeTab === "Following" 
    ? videos.filter(v => followingIds.includes(v.userId))
    : videos;

  return (
    <div style={{ background: "black", color: "white", height: "100vh", overflow: "hidden", position: "relative" }}>
      {/* TOP BAR */}
      <div style={{ display: "flex", gap: "8px", padding: "10px", overflowX: "auto", position: "absolute", top: 0, zIndex: 10, width: "100%" }}>
        <button onClick={() => setShowUsers(true)} style={{ background: "#222", color: "white", borderRadius: "20px", padding: "6px 12px", whiteSpace: "nowrap" }}>
          👥 {users.length} Joined
        </button>
        <button onClick={() => setActiveTab("For You")} style={{ background: activeTab === "For You" ? "white" : "#222", color: activeTab === "For You" ? "black" : "white", borderRadius: "20px", padding: "6px 12px" }}>For You</button>
        <button style={{ background: "#222", borderRadius: "20px", padding: "6px 12px" }}>🎵 Music (0) 🔒</button>
        <button onClick={() => setActiveTab("Following")} style={{ background: activeTab === "Following" ? "white" : "#222", color: activeTab === "Following" ? "black" : "white", borderRadius: "20px", padding: "6px 12px" }}>Following</button>
        <button style={{ background: "#222", borderRadius: "20px", padding: "6px 12px" }}>Live</button>
      </div>

      {/* VIDEO FEED - VERTICAL SCROLL LIKE TIKTOK */}
      <div style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
        {filteredVideos.map((video) => {
          const isOwnVideo = currentUser && video.userId === currentUser.id;
          const isFollowing = followingIds.includes(video.userId);
          return (
            <div key={video.id} style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
              
              <video
                ref={el => videoRefs.current[video.id] = el}
                src={video.videoUrl}
                loop
                muted={false}
                playsInline
                style={{ height: "100%", width: "100%", objectFit: "contain" }}
                onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
                poster={video.thumbnail}
              />

              {/* RIGHT BUTTONS */}
              <div style={{ position: "absolute", right: "10px", bottom: "120px", display: "flex", flexDirection: "column", gap: "18px", alignItems: "center" }}>
                
                {/* PROFILE + FOLLOW BUTTON - ONLY SHOW IF NOT OWN VIDEO */}
                {!isOwnVideo && (
                  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", fontWeight: "bold" }}>
                      {video.userName?.charAt(0) || "K"}
                    </div>
                    <button
                      onClick={() => handleFollow({ id: video.userId, name: video.userName })}
                      style={{
                        position: "absolute",
                        bottom: "-8px",
                        background: isFollowing ? "white" : "red",
                        color: isFollowing ? "black" : "white",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        border: "2px solid white",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {isFollowing ? "✓" : "+"}
                    </button>
                  </div>
                )}

                <button onClick={() => handleLike(video)} style={{ background: "none", border: "none", color: "white", textAlign: "center" }}>
                  <div style={{ fontSize: "32px" }}>❤️</div>
                  <div style={{ fontSize: "13px" }}>{video.likes || 0}</div>
                </button>

                <button onClick={() => setShowComments(video)} style={{ background: "none", border: "none", color: "white", textAlign: "center" }}>
                  <div style={{ fontSize: "28px" }}>💬</div>
                  <div style={{ fontSize: "13px" }}>{video.commentCount || video.comments?.length || 0}</div>
                </button>

                <button style={{ background: "none", border: "none", color: "white", textAlign: "center" }}>
                  <div style={{ fontSize: "24px" }}>↗️</div>
                  <div style={{ fontSize: "12px" }}>Share</div>
                </button>

                <button style={{ background: "none", border: "none", color: "white", textAlign: "center" }}>
                  <div style={{ fontSize: "28px" }}>🔥</div>
                  <div style={{ fontSize: "13px" }}>{video.fires || 0}</div>
                </button>
              </div>

              {/* BOTTOM INFO */}
              <div style={{ position: "absolute", left: "10px", bottom: "80px", maxWidth: "70%" }}>
                <div style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                  {video.userName} {video.isVerified && <span style={{ color: "#1DA1F2" }}>✓</span>}
                </div>
                <div style={{ fontSize: "14px", marginTop: "4px" }}>{video.caption}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMMENTS MODAL - FIXED */}
      {showComments && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "15px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #333" }}>
            <span>{showComments.comments?.length || 0} comments</span>
            <button onClick={() => setShowComments(null)} style={{ background: "none", border: "none", color: "white", fontSize: "20px" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
            {showComments.comments?.map(c => (
              <div key={c.id} style={{ marginBottom: "15px" }}>
                <b>{c.userName}</b> <span style={{ marginLeft: "8px" }}>{c.text}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px", display: "flex", gap: "10px", borderTop: "1px solid #333" }}>
            <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add comment..." style={{ flex: 1, background: "#222", border: "none", borderRadius: "20px", padding: "10px 15px", color: "white" }} />
            <button onClick={() => handleAddComment(showComments)} style={{ background: "#ff0050", border: "none", borderRadius: "20px", padding: "10px 20px", color: "white" }}>Send</button>
          </div>
        </div>
      )}

      {/* USERS LIST */}
      {showUsers && (
        <div style={{ position: "fixed", inset: 0, background: "black", zIndex: 90, padding: "15px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <h3>👥 Joined ({users.length})</h3>
            <button onClick={() => setShowUsers(false)} style={{ background: "#222", border: "none", color: "white", borderRadius: "20px", padding: "8px 15px" }}>Close</button>
          </div>
          {users.map(u => (
            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #222" }}>
              <div><b>{u.name}</b> {u.name === "Katongole Rashid" && "✓"} <div style={{ fontSize: "12px", color: "#aaa" }}>{u.followers || 0} followers</div></div>
              {currentUser?.id !== u.id && <button onClick={() => handleFollow(u)} style={{ background: followingIds.includes(u.id) ? "white" : "#ff0050", color: followingIds.includes(u.id) ? "black" : "white", border: "none", borderRadius: "20px", padding: "6px 16px" }}>{followingIds.includes(u.id) ? "Following" : "Follow"}</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
