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
    <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '0', fontFamily: 'Arial'}}>

      {/* PROFILE HEADER - COVER */}
      <div style={{background: 'linear-gradient(135deg, #1DA1F2 0%, #0a4a7a 100%)', height: '120px'}}></div>

      {/* PROFILE SECTION */}
      <div style={{padding: '0 15px', marginTop: '-50px'}}>
        
        {/* Profile Pic */}
        <div style={{display: 'flex', alignItems: 'flex-end', gap: '15px'}}>
          <div style={{width: '90px', height: '90px', backgroundColor: '#222', borderRadius: '50%', border: '3px solid #1DA1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px'}}>👑</div>
          <div style={{paddingBottom: '10px'}}>
            <h1 style={{fontSize: '20px', margin: '0', display: 'flex', alignItems: 'center'}}>
              Kampala Business CEO <BlueTick />
            </h1>
            <p style={{margin: '2px 0', color: '#1DA1F2', fontSize: '14px'}}>@kampala_ceo_official</p>
          </div>
        </div>

        {/* BIO - EDIT HERE */}
        <div style={{marginTop: '15px'}}>
          <h2 style={{fontSize: '16px', margin: '0'}}>Katongole Rashid | CEO</h2>
          
          <div style={{marginTop: '10px', fontSize: '14px', lineHeight: '1.5'}}>
            <p style={{margin: '5px 0'}}>👑 Founder & CEO - Kampala Business App</p>
            <p style={{margin: '5px 0'}}>📍 Kampala, Uganda | Owino | Kikuubo | Nakawa</p>
            <p style={{margin: '5px 0'}}>💼 Helping 5000+ Businesses Grow Online</p>
            <p style={{margin: '5px 0'}}>✅ Verified Business Owner</p>
          </div>

          {/* CONTACT BIO BOX - YOUR NUMBERS INSIDE */}
          <div style={{marginTop: '15px', backgroundColor: '#111', border: '1px solid #333', padding: '12px', borderRadius: '12px'}}>
            <p style={{margin: '5px 0', fontSize: '13px', color: '#888'}}>CONTACT INFO - BIO</p>
            <p style={{margin: '8px 0'}}><b>Name:</b> Katongole Rashid</p>
            <p style={{margin: '8px 0'}}><b>CEO Number:</b> +256778953685</p>
            <p style={{margin: '8px 0'}}><b>Business WA:</b> +256778953685</p>
            <p style={{margin: '8px 0', fontSize: '12px', color: '#aaa'}}>📧 Email: CEO@kampalabusiness.ug</p>
          </div>

          {/* BUTTONS */}
          <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
            <a href="tel:+256778953685" style={{flex: 1, backgroundColor: '#1DA1F2', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold'}}>📞 Call CEO</a>
            <a href="https://wa.me/256778953685" style={{flex: 1, backgroundColor: '#25D366', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold'}}>💬 WhatsApp</a>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '15px', borderTop: '1px solid #222', paddingTop: '10px'}}>
            <div style={{textAlign: 'center'}}><b>5K+</b><br/><span style={{fontSize: '12px', color: '#888'}}>Businesses</span></div>
            <div style={{textAlign: 'center'}}><b>9999</b><br/><span style={{fontSize: '12px', color: '#888'}}>Likes</span></div>
            <div style={{textAlign: 'center'}}><b>CEO</b><br/><span style={{fontSize: '12px', color: '#888'}}>Verified</span></div>
          </div>
        </div>
      </div>

      {/* VIDEOS */}
      <div style={{margin: '20px 15px', border: '1px solid #333', padding: '12px', borderRadius: '12px'}}>
        <h3 style={{margin: '0 0 10px 0'}}>🔥 Latest Business Videos</h3>
        <video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls width="100%" style={{borderRadius: '10px'}} />
        <p style={{marginTop: '10px', fontSize: '13px', color: '#888'}}>CEO Approved Business</p>
      </div>

    </div>
  );
}

export default App;
