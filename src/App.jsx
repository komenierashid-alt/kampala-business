<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>UPTOWN</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}
body{background:#000;color:#fff;overflow:hidden;height:100vh}
button{cursor:pointer;border:none;outline:none}
input,select,textarea{width:100%;padding:13px;border-radius:14px;border:1px solid #2a2a2a;background:#161616;color:#fff;margin:8px 0;font-size:14px}
input:focus{border-color:#ff0000}
.top{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(0,0,0,.85);display:flex;justify-content:center;gap:16px;padding:14px 6px 10px;font-size:15px;font-weight:800}
.top span{color:#888;cursor:pointer;padding-bottom:4px;white-space:nowrap}
.top span.active{color:#fff;border-bottom:3px solid #ff0000}
.bottom{position:fixed;bottom:0;left:0;right:0;z-index:100;background:#000;border-top:1px solid #222;display:flex;justify-content:space-around;align-items:center;padding:8px 0 14px}
.bottom div{text-align:center;font-size:11px;color:#888;cursor:pointer;flex:1;font-weight:600}
.bottom div.active{color:#fff}
.plus{width:56px;height:38px;background:#ff0000;border-radius:12px;color:#fff;font-size:30px;line-height:38px;margin-top:-20px;box-shadow:0 4px 15px rgba(255,0,0,.5)}
.btnRed{background:#ff0000;color:#fff;padding:14px;border-radius:14px;width:100%;font-weight:800;font-size:15px}
.btnWhite{background:#fff;color:#000;padding:12px;border-radius:14px;width:100%;font-weight:700;margin-top:8px}
.btnBlue{background:#1da1f2;color:#fff;padding:12px;border-radius:14px;width:100%;font-weight:700;margin-top:8px}
.box{background:#121212;border:1px solid #222;border-radius:18px;padding:16px;margin:12px}
.small{font-size:12px;color:#999;line-height:1.6}
.center{text-align:center;padding:20px}
.hidden{display:none}
.page{display:none;height:100vh;padding:56px 0 74px;overflow-y:auto}
.page.active{display:block}
#pageHome{padding:56px 0 74px}
.card{background:#000;border-radius:0;margin:0;padding:0;border:none;display:flex;position:relative;height:calc(100vh - 130px);overflow:hidden}
.card .left{flex:1;position:relative}
.card video{width:100%;height:100%;object-fit:cover;background:#111}
.videoInfo{position:absolute;left:12px;bottom:42px;right:78px;z-index:5;text-shadow:0 1px 6px #000}
.author{font-weight:800;font-size:16px;cursor:pointer}
.desc{font-size:14px;margin:6px 0;color:#eee;line-height:1.4}
.avatar{width:84px;height:84px;border-radius:50%;background:#ff0000;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:800;margin:0 auto;cursor:pointer}
/* FIX - UPTOWN OFFICIAL TICK = BLUE AGAIN */
.blueTick{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;background:#1DA1F2 !important;border-radius:50%;color:#fff;font-size:13px;font-weight:900;vertical-align:middle;margin-left:5px}
.blueTick::after{content:"✓"}
.rightBar{width:56px;display:flex;flex-direction:column;align-items:center;gap:10px;position:absolute;right:8px;bottom:90px;top:105px;z-index:6}
.rightLogo{width:46px;height:46px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;color:#000;font-size:10px;text-align:center;position:relative;line-height:1.1;cursor:pointer}
.rightLogo span{color:#ff0000}
/* FIX - FOLLOW + BUTTON = RED ALWAYS, NEVER BLUE */
.rightPlus{position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:22px;height:22px;background:#FF0000 !important;border:2px solid #fff;border-radius:50%;color:#fff !important;font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:10}
.rightItem{text-align:center;cursor:pointer;text-shadow:0 1px 6px #000}
.rightItem .icon{font-size:24px;line-height:1}
.rightItem .num{font-size:12px;font-weight:800;margin-top:2px}
.rightItem.fav{color:#ff0000}
.rightItem.fav .num{color:#ff0000}
.statsRow{display:flex;justify-content:space-around;background:#121212;border:1px solid #222;border-radius:16px;padding:14px 6px;margin:12px;text-align:center}
.statsRow b{display:block;font-size:17px}
.statsRow span{font-size:12px;color:#999}
#splash{position:fixed;inset:0;background:#0a0a0a;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:splashOut .8s ease 2.5s forwards}
#splash h1{font-size:42px;letter-spacing:6px}
#splash h1 span{color:#ff0000}
@keyframes splashOut{to{opacity:0;visibility:hidden}}
</style>
</head>
<body>
<div id="splash"><h1>UP<span>TOWN</span></h1></div>
<div class="top"><span class="active" onclick="topTab(this,'pageHome')">For You</span><span onclick="topTab(this,'pageHome')">Muzika</span><span onclick="topTab(this,'pageHome')">Following</span><span onclick="topTab(this,'pageHome')">Live</span><span onclick="openSearch()">Search</span></div>

<div id="pageHome" class="page active">
  <div class="box" id="bigSearchBox" style="display:none"><input id="searchInput" placeholder="🔍 Search..."><button class="btnRed" onclick="doSearch()">Search</button></div>
  <div id="feed"></div>
  <div class="card" id="mainCard">
    <div class="left">
      <video id="mainVideo" controls src="" style="display:none"></video>
      <div class="videoInfo">
        <div class="author" onclick="openUserPage('uptown official')">uptown official <span class="blueTick"></span></div>
        <p class="desc" id="mainCaption"></p>
      </div>
    </div>
    <div class="rightBar">
      <!-- FOLLOW BUTTON - ONLY RED + , NO BLUE TICK HERE -->
      <div class="rightItem"><div class="rightLogo" onclick="openUserPage('uptown official')">UP<span>TOWN</span><div class="rightPlus" onclick="event.stopPropagation();followUser(this)">+</div></div><div class="num" style="margin-top:10px">Follow</div></div>
      <div class="rightItem" onclick="likeBtn(this)"><div class="icon">❤️</div><div class="num">0</div></div>
      <div class="rightItem" onclick="commentBtn(this)"><div class="icon" style="background:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px">💬</div><div class="num">0</div></div>
      <div class="rightItem" onclick="shareBtn(this)"><div class="icon">→</div><div class="num">Share</div></div>
      <div class="rightItem" onclick="fireBtn(this)"><div class="icon">🔥</div><div class="num">0</div></div>
      <div class="rightItem fav" onclick="favBtn(this)"><div class="icon">★</div><div class="num">Favorite</div></div>
    </div>
  </div>
  <div id="muzikaFeed"></div>
</div>

<div id="pageCreate" class="page">
  <div class="box"><h3>+ New Post</h3><select id="postType"><option>Video</option><option>Photo</option></select><select id="postCat"><option value="general">Category: General</option><option value="Muzika">🎵 Muzika</option><option value="food">Food</option><option value="comedy">Comedy</option><option value="dance">Dance</option></select><input id="postFile" type="file" accept="video/*,image/*"><input id="postLink" placeholder="🔗 Paste Link - YouTube / TikTok / Facebook link..."><textarea id="postCaption" placeholder="Write caption..."></textarea><button class="btnRed" onclick="createPost()">POST NOW</button><button class="btnWhite" onclick="postToMuzika()">🎵 POST LINK / VIDEO TO MUZIKA</button><p class="small">Muzika: Paste link OR upload video, then tap MUZIKA button.</p></div>
</div>

<div id="pageInbox" class="page">
  <div class="box" style="border:2px solid #1DA1F2"><h3>👑 Blue Tick Control - Admin Only</h3><p class="small">Auto sends on 10th & 26th to everyone without blue tick</p><button class="btnRed" onclick="sendBlueTickToAll()">📩 Send Blue Tick Request To Everyone Without Tick</button><p class="small" id="blueTickStatus">Auto: Will send on 10th & 26th</p><div id="blueTickRequests"></div></div>
  <div class="box"><h3>Inbox</h3><p class="small">No messages yet.</p><div id="inboxList"></div></div>
</div>

<div id="pageProfile" class="page">
  <div class="center"><div class="avatar" id="myAvatar">U</div><h2 id="myName">uptown official <span class="blueTick"></span></h2><p class="small" id="myBio">Katongole Rashid</p></div>
  <div class="statsRow"><div><b>0</b><span>Following</span></div><div><b>0</b><span>Followers</span></div><div><b>0</b><span>Views</span></div><div><b>0</b><span>Likes</span></div></div>
  <div class="center" style="padding-top:0"><button class="btnRed" onclick="toggleEdit()">✏️ Edit My Account</button><button class="btnWhite" onclick="requestBlueTick()">🔵 Request Blue Tick</button><button class="btnWhite" onclick="logout()">Logout</button></div>
  <div id="editBox" class="box hidden"><h3>Edit Everything</h3><input id="editName" placeholder="Page Name / Your Name"><input id="editBio" placeholder="Bio"><input id="editPic" type="file" accept="image/*" onchange="changePic(event)"><button class="btnRed" onclick="saveProfile()">Save Changes</button><button class="btnWhite" onclick="alert('Password Changed!')">Change Password</button><button class="btnWhite" onclick="alert('Account set to Private')">Make Private</button><button class="btnWhite" style="color:red" onclick="alert('Account Deleted')">Delete Account</button><button class="btnWhite" onclick="toggleEdit()">Cancel</button></div>
  <div id="adminPanel" class="box hidden" style="border:2px solid #ff0000"><h3>👑 ADMIN PANEL - BOSS ONLY</h3><button class="btnRed" onclick="alert('All Users')">👥 See All Users</button><button class="btnWhite" onclick="alert('All Videos')">🎥 See All Videos</button><button class="btnWhite" onclick="alert('User Verified ✅')">✅ Verify User</button><button class="btnWhite" onclick="alert('User Banned!')">🚫 Ban User</button></div>
  <div class="box"><h3>Your Posts</h3><div id="myVideos"></div></div>
</div>

<div id="pageUser" class="page">
  <div class="center"><div class="avatar" id="userAvatar">U</div><h2 id="userName">uptown official <span class="blueTick"></span></h2></div>
  <div class="statsRow"><div><b>0</b><span>Following</span></div><div><b>0</b><span>Followers</span></div><div><b>0</b><span>Views</span></div><div><b>0</b><span>Likes</span></div></div>
  <div class="box"><button class="btnRed" onclick="alert('Followed!')">+ Follow</button><button class="btnWhite" onclick="showPage('pageHome')">⬅ Back to Home</button></div>
</div>

<div id="pageLogin" class="page">
  <div class="box"><h2 style="text-align:center">UPTOWN</h2><p class="small" style="text-align:center">Sign Up Once - Then Just Open & Watch</p><input id="signupName" placeholder="Your Name / Page Name"><input id="signupPass" type="password" placeholder="Password"><button class="btnRed" onclick="doSignup()">Sign Up / Login</button><button class="btnWhite" onclick="showAdminLogin()">👑 Login as Admin</button><div id="adminLoginBox" class="box hidden"><h3>Admin Login</h3><input id="adminUser" placeholder="Username - uptown official"><input id="adminEmail" placeholder="Secret Email"><input id="adminPass" type="password" placeholder="Password"><button class="btnRed" onclick="loginAdmin()">Login as Admin</button></div></div>
</div>

<div class="bottom"><div class="active" onclick="showPage('pageHome',this)">🏠<br>Home</div><div onclick="showPage('pageInbox',this)">📩<br>Inbox</div><div onclick="showPage('pageCreate',this)"><div class="plus">+</div></div><div onclick="alert('Live coming - Go Live')">🔴<br>Live</div><div onclick="showPage('pageProfile',this)">👤<br>You</div></div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
const SUPABASE_URL = "https://epnchivyhadenqxsktck.supabase.co";
const SUPABASE_KEY = "sb_publishable_fe-fxkd9S5KM9dchFIxBYw_G0jM42DU";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("UPTOWN Connected to Supabase ✅", SUPABASE_URL);
</script>
<script>
function showPage(id,el){ document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); document.getElementById(id).classList.add('active'); if(el){ document.querySelectorAll('.bottom div').forEach(d=>d.classList.remove('active')); el.classList.add('active'); } }
function topTab(el,page){ document.querySelectorAll('.top span').forEach(s=>s.classList.remove('active')); el.classList.add('active'); showPage(page); }
function openSearch(){ document.getElementById('bigSearchBox').style.display='block'; showPage('pageHome'); }
function doSearch(){ alert('Searching for: '+document.getElementById('searchInput').value); }
function openUserPage(name){ document.getElementById('userName').innerHTML=name+' <span class="blueTick"></span>'; document.getElementById('userAvatar').innerText=name.charAt(0).toUpperCase(); showPage('pageUser'); }
function createPost(){
  let cap=document.getElementById('postCaption').value || '';
  let link=document.getElementById('postLink').value || '';
  let cat=document.getElementById('postCat').value || 'general';
  let file=document.getElementById('postFile').files[0];
  if(cat==='Muzika'){ postToMuzika(); return; }
  if(!file && !link){ alert('Choose REAL video OR paste Link first'); return; }
  if(link){ document.getElementById('mainCaption').innerText=cap+' 🔗 '+link; alert('Link Posted! ✅'); showPage('pageHome'); return; }
  let url=URL.createObjectURL(file); let v=document.getElementById('mainVideo'); v.src=url; v.style.display='block'; document.getElementById('mainCaption').innerText=cap; alert('Posted REAL! ✅'); showPage('pageHome');
}
function postToMuzika(){
  let cap=document.getElementById('postCaption').value || 'New Muzika 🎵';
  let link=document.getElementById('postLink').value || '';
  let file=document.getElementById('postFile').files[0];
  if(!file && !link){ alert('For Muzika: Paste Link OR upload Video first'); return; }
  let media=''; if(file){ let url=URL.createObjectURL(file); media=file.type.includes('video')?'<video controls src="'+url+'" style="width:100%;border-radius:14px"></video>':'<img src="'+url+'" style="width:100%;border-radius:14px">'; }
  if(link){ media+='<div class="box" style="background:#fff;color:#000"><b>🔗 Muzika Link</b><br><a href="'+link+'" target="_blank" style="color:#ff0000;word-break:break-all">'+link+'</a><br><button class="btnRed" style="margin-top:10px" onclick="window.open(\''+link+'\')">▶ Open Link</button></div>'; }
  let html='<div class="box" style="border:2px solid #ff0000"><h3>🎵 MUZIKA - '+(localStorage.getItem('uptown_user')||'You')+' <span class="blueTick"></span></h3><p>'+cap+'</p>'+media+'</div>';
  document.getElementById('muzikaFeed').innerHTML+=html; document.getElementById('myVideos').innerHTML+=html; alert('Posted to MUZIKA! 🎵✅'); showPage('pageHome');
}
// FIX - FOLLOW + STAYS RED, NEVER TURNS BLUE
function followUser(el){ if(el.innerText==='✓'){el.innerText='+'; el.style.background='#FF0000';}else{el.innerText='✓'; el.style.background='#FF0000';} }
function likeBtn(el){ let n=el.querySelector('.num'); let v=parseInt(n.innerText)||0; if(el.style.opacity==='0.6'){el.style.opacity='1'; n.innerText=v-1;}else{el.style.opacity='0.6'; n.innerText=v+1;} }
function commentBtn(el){ let c=prompt('Write comment:'); if(c) alert('Comment posted: '+c); }
function favBtn(el){ if(el.style.opacity==='0.6'){el.style.opacity='1';}else{el.style.opacity='0.6'; alert('Saved to Favourites ⭐');} }
function fireBtn(el){ let n=el.querySelector('.num'); let v=parseInt(n.innerText)||0; if(el.style.opacity==='0.6'){el.style.opacity='1'; n.innerText=v-1;}else{el.style.opacity='0.6'; n.innerText=v+1;} }
function shareBtn(el){ alert('Link copied! Share to WhatsApp, TikTok, Facebook ↗️'); }
function toggleEdit(){ document.getElementById('editBox').classList.toggle('hidden'); }
function saveProfile(){ let n=document.getElementById('editName').value; let b=document.getElementById('editBio').value; if(n) document.getElementById('myName').innerHTML=n+' <span class="blueTick"></span>'; if(b) document.getElementById('myBio').innerText=b; toggleEdit(); alert('Saved ✅'); }
function changePic(e){ let f=e.target.files[0]; if(!f) return; let r=new FileReader(); r.onload=function(){ document.getElementById('myAvatar').innerHTML='<img src="'+r.result+'" style="width:100%;height:100%;border-radius:50%;object-fit:cover">'; }; r.readAsDataURL(f); }
function showAdminLogin(){ document.getElementById('adminLoginBox').classList.remove('hidden'); }
function loginAdmin(){
  let u=document.getElementById('adminUser').value.trim().toLowerCase();
  let em=document.getElementById('adminEmail').value.trim().toLowerCase();
  let p=document.getElementById('adminPass').value;
  if(u==='uptown official' && em==='komenierashid@gmail.com' && p==='komenie283410'){ alert('Welcome Boss Katongole Rashid! 👑'); document.getElementById('adminPanel').classList.remove('hidden'); saveLogin('uptown official'); showPage('pageProfile'); } else { alert('Wrong Admin!'); }
}
function checkBlueTickDate(){ let d=new Date().getDate(); if(d===10||d===26){ document.getElementById('blueTickStatus').innerText='✅ Today is '+d+' - Notification sent!'; } }
checkBlueTickDate();
function sendBlueTickToAll(){ alert('Sent!'); document.getElementById('blueTickRequests').innerHTML+='<div class="box"><b>@user123</b> wants Blue Tick <button class="btnRed" onclick="approveTick(this)">Accept ✅</button></div>'; }
function approveTick(btn){ btn.parentElement.innerHTML='<b>@user123</b> <span class="blueTick"></span> Approved!'; }
function requestBlueTick(){ alert('Request Sent for Blue Tick!'); }
function saveLogin(name){ localStorage.setItem('uptown_user',name); localStorage.setItem('uptown_logged','yes'); }
function doSignup(){ let n=document.getElementById('signupName').value; if(!n){alert('Enter your name');return;} saveLogin(n); document.getElementById('myName').innerHTML=n+' <span class="blueTick"></span>'; alert('Welcome '+n+'!'); showPage('pageHome'); }
function checkAutoLogin(){ let logged=localStorage.getItem('uptown_logged'); let user=localStorage.getItem('uptown_user'); if(logged==='yes' && user){ document.getElementById('myName').innerHTML=user+' <span class="blueTick"></span>'; showPage('pageHome'); }else{ showPage('pageLogin'); } }
window.addEventListener('load',checkAutoLogin);
function logout(){ localStorage.removeItem('uptown_logged'); localStorage.removeItem('uptown_user'); alert('Logged out'); location.reload(); }


// ===== UPTOWN FULL SYSTEM =====
let currentTab = 'foryou';
let myName = localStorage.getItem('uptown_user') || 'Guest';

async function loadRealPosts(){
  let r = await supabase.from('posts').select('*').order('created_at',{ascending:false});
  let posts = r.data || [];
  let feed = document.querySelector('main'); if(!feed) return;

  // TOP BAR: Search + Notifications + Tabs + Upload
  let topBar = document.getElementById('uptownTop');
  if(!topBar){
    topBar = document.createElement('div'); topBar.id='uptownTop';
    topBar.style.cssText='position:sticky;top:0;background:#000;padding:10px;z-index:99';
    topBar.innerHTML = `
    <div style="display:flex;gap:8px">
      <input id="searchInput" oninput="searchPosts()" placeholder="🔍 Search UPTOWN..." style="flex:1;padding:10px;border-radius:20px;border:none;background:#222;color:white">
      <button onclick="showNotifications()" style="background:#222;color:white;border:none;padding:10px;border-radius:50%">🔔<span id="notifCount"></span></button>
      <button onclick="openAdmin()" style="background:#222;color:white;border:none;padding:10px;border-radius:20px">⚙️ Admin</button>
    </div>
    <div style="display:flex;gap:10px;margin-top:10px">
      <button id="tabForyou" onclick="setTab('foryou')" style="flex:1;padding:10px;border:none;border-radius:20px;background:#ff0050;color:white">For You</button>
      <button id="tabFollowing" onclick="setTab('following')" style="flex:1;padding:10px;border:none;border-radius:20px;background:#222;color:white">Following</button>
      <button onclick="showUpload()" style="flex:1;padding:10px;border:none;border-radius:20px;background:#222;color:white">+ Upload</button>
    </div>
    <div id="uploadBox" style="display:none;background:#111;padding:12px;border-radius:12px;margin-top:10px">
      <input id="upCaption" placeholder="Caption..." style="width:100%;padding:10px;border-radius:10px;background:#222;color:white;border:none;margin-bottom:8px">
      <input id="upLink" placeholder="Paste Video / Muzika / YouTube Link..." style="width:100%;padding:10px;border-radius:10px;background:#222;color:white;border:none;margin-bottom:8px">
      <input type="file" id="upFile" accept="video/*,image/*" style="color:white">
      <button onclick="doUpload()" style="width:100%;margin-top:8px;background:#ff0050;color:white;border:none;padding:12px;border-radius:10px">Post Video / Muzika / Link</button>
    </div>
    <div id="notifBox" style="display:none;background:#111;padding:10px;border-radius:12px;margin-top:10px;color:white"></div>`;
    feed.parentNode.insertBefore(topBar, feed);
  }

  window.allPosts = posts;
  renderPosts(posts);
}

function renderPosts(posts){
  let feed = document.querySelector('main');
  feed.innerHTML = posts.map(p=>`
  <div class="post-card" style="background:#111;color:white;padding:12px;margin:12px;border-radius:16px" data-caption="${(p.caption||'').toLowerCase()}">
    <div style="display:flex;justify-content:space-between"><b>@${p.profiles?.username||'uptown'}</b>
    <button onclick="toggleFollow(this,'${p.user_id}')" style="background:#ff0050;color:white;border:none;padding:6px 14px;border-radius:20px">+ Follow</button></div>
    <p>${p.caption||''}</p>
    ${p.media_url ? (p.media_url.includes('.mp4')||p.media_url.includes('video') ? `<video src="${p.media_url}" controls style="width:100%;border-radius:12px"></video>` : `<img src="${p.media_url}" style="width:100%;border-radius:12px">`) : ''}
    <div style="display:flex;gap:14px;font-size:18px;margin-top:10px;flex-wrap:wrap">
      <span onclick="doLike('${p.id}',this,'like')">❤️ <b>${p.likes_count||0}</b></span>
      <span onclick="doLike('${p.id}',this,'fire')">🔥 <b>0</b></span>
      <span onclick="doComment('${p.id}')">💬 ${p.comments_count||0} Comment</span>
      <span onclick="doShare('${p.id}')">↗️ Share</span>
      <span onclick="doFav(this)">⭐ Favorite</span>
      <span onclick="reportViolation('${p.id}')">🚩 Report</span>
    </div>
    <button onclick="goLive()" style="width:100%;margin-top:10px;background:red;color:white;border:none;padding:10px;border-radius:10px">🔴 GO LIVE</button>
    <div id="comments-${p.id}" style="margin-top:8px"></div>
  </div>`).join('') || '<p style="color:white;text-align:center">No posts yet. Upload first!</p>';
}

function setTab(t){ currentTab=t;
  document.getElementById('tabForyou').style.background = t=='foryou' ? '#ff0050' : '#222';
  document.getElementById('tabFollowing').style.background = t=='following' ? '#ff0050' : '#222';
  if(t=='following'){ renderPosts((window.allPosts||[]).filter(p=> localStorage.getItem('follow_'+p.user_id)=='yes')); }
  else renderPosts(window.allPosts||[]);
}
function searchPosts(){ let q=document.getElementById('searchInput').value.toLowerCase(); renderPosts((window.allPosts||[]).filter(p=> (p.caption||'').toLowerCase().includes(q))); }
function showUpload(){ let b=document.getElementById('uploadBox'); b.style.display = b.style.display=='none'?'block':'none'; }
async function doUpload(){
  let caption=document.getElementById('upCaption').value;
  let link=document.getElementById('upLink').value;
  let file=document.getElementById('upFile').files[0];
  let media_url=link;
  if(file){ media_url = URL.createObjectURL(file); alert('Video selected from phone - for real upload we will use Supabase Storage next step'); }
  if(!caption && !media_url) return alert('Add caption or link/video');
  await supabase.from('posts').insert([{caption, media_url, media_type: link?'link':'video'}]);
  alert('Posted!'); loadRealPosts();
}
async function toggleFollow(btn, uid){
  let isFollowing = localStorage.getItem('follow_'+uid)=='yes';
  if(isFollowing){ localStorage.removeItem('follow_'+uid); btn.innerText='+ Follow'; btn.style.background='#ff0050'; }
  else{ localStorage.setItem('follow_'+uid,'yes'); btn.innerText='✓ Following'; btn.style.background='#333'; await supabase.from('notifications').insert([{message: myName+' started following you'}]); }
}
async function doLike(postId, el, type){
  let b=el.querySelector('b'); b.innerText=parseInt(b.innerText)+1;
  await supabase.from('likes').insert([{post_id:postId, type}]);
  await supabase.from('notifications').insert([{message: myName+' liked your post ❤️'}]);
}
function doFav(el){ el.innerText = el.innerText.includes('Favorited') ? '⭐ Favorite' : '⭐ Favorited!'; el.style.color='gold'; }
async function doComment(postId){
  let text=prompt('Write comment:'); if(!text) return;
  await supabase.from('comments').insert([{post_id:postId, text}]);
  document.getElementById('comments-'+postId).innerHTML += `<p style="background:#222;padding:8px;border-radius:10px">💬 <b>${myName}:</b> ${text}</p>`;
  await supabase.from('notifications').insert([{message: myName+' commented: '+text}]);
}
function doShare(id){ navigator.clipboard.writeText(location.href+'#post-'+id); alert('Link copied! Share on WhatsApp / TikTok!'); }
async function reportViolation(postId){ let r=prompt('Why report? (spam, hate, nude, fake)'); if(!r) return; await supabase.from('violations').insert([{post_id:postId, reason:r}]); alert('Reported to Admin. Admin will review.'); }
async function showNotifications(){
  let box=document.getElementById('notifBox'); box.style.display = box.style.display=='none'?'block':'none';
  let {data} = await supabase.from('notifications').select('*').order('created_at',{ascending:false}).limit(10);
  box.innerHTML = (data||[]).map(n=>`<p>🔔 ${n.message}</p>`).join('') || '<p>No notifications yet</p>';
}
function goLive(){ alert('🔴 LIVE: Allow camera in browser. Next step we add real live with camera + viewers.'); }
function openAdmin(){ let code=prompt('Admin Code?'); if(code=='uptown123'){ alert('Welcome Admin! Check Supabase > violations table for reports.'); } else alert('Not admin'); }
loadRealPosts();
</script>
</body>
</html>
