import React from 'react';

const BlueTick = () => (
  <span style={{
    display: 'inline-flex',
    backgroundColor: '#1DA1F2',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '6px'
  }}>✓</span>
);

function App() {
  return (
    <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '15px', fontFamily: 'Arial'}}>

      {/* CEO PROFILE - PUBLIC ONLY */}
      <div style={{textAlign: 'center', border: '2px solid #1DA1F2', borderRadius: '16px', padding: '20px', marginBottom: '20px', backgroundColor: '#111'}}>
        <div style={{width: '80px', height: '80px', backgroundColor: '#333', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px'}}>👑</div>
        
        <h1 style={{fontSize: '22px', margin: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          Kampala Business CEO <BlueTick />
        </h1>

        {/* THIS IS YOUR BIO INSIDE - PUT YOUR NAMES AND NUMBERS HERE */}
        <div style={{marginTop: '15px', backgroundColor: '#222', padding: '12px', borderRadius: '10px', textAlign: 'left'}}>
          <p style={{margin: '5px 0', fontSize: '16px'}}><b>Name:</b> Katongole Rashid</p>
          <p style={{margin: '5px 0', fontSize: '16px'}}><b>CEO Number:</b> +256778953685</p>
          <p style={{margin: '5px 0', fontSize: '14px', color: '#aaa'}}>Verified CEO - Kampala Business Owner</p>
        </div>
      </div>

      {/* VIDEOS - CLEAN, NO GREEN TICK */}
      <div style={{border: '1px solid #333', padding: '12px', borderRadius: '12px'}}>
        <h3 style={{margin: '0 0 10px 0'}}>🔥 Latest Business Videos</h3>
        <video 
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
          controls 
          width="100%" 
          style={{borderRadius: '10px'}} 
        />
        <p style={{marginTop: '10px'}}>❤️ 9999 Likes</p>
        <p style={{color: '#888', fontSize: '13px'}}>CEO Approved Business</p>
      </div>

    </div>
  );
}

export default App;
