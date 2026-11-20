import { useState } from 'react'

function App() {
  const [followed, setFollowed] = useState([])

  const businesses = [
    { id: 1, name: "MATOVU Electronics", location: "Kampala - Nasser Rd", category: "Electronics", icon: "📱" },
    { id: 2, name: "Swadaka Fashion", location: "Kawempe - Ttula", category: "Fashion", icon: "👗" },
    { id: 3, name: "Kampala Business Center", location: "Downtown - Kikuubo", category: "General", icon: "🏪" },
    { id: 4, name: "Rashid Tech Solutions", location: "Makerere - Kikoni", category: "Tech Services", icon: "💻" },
  ]

  const toggleFollow = (id) => {
    if (followed.includes(id)) {
      setFollowed(followed.filter(f => f !== id))
    } else {
      setFollowed([...followed, id])
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', fontFamily: 'Arial' }}>
      {/* HEADER - Like real app */}
      <div style={{ background: '#1a56ff', padding: '20px', color: 'white', textAlign: 'center', position: 'sticky', top: 0 }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>KAMPALA BUSINESS</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Discover • Follow • Connect</p>
        <div style={{ background: 'rgba(255,255,255,0.2)', marginTop: '15px', padding: '10px', borderRadius: '20px' }}>
          👋 Welcome Rashid! Following {followed.length}
        </div>
      </div>

      {/* BUSINESS CARDS - Beautiful */}
      <div style={{ padding: '15px', maxWidth: '500px', margin: '0 auto' }}>
        {businesses.map(biz => {
          const isFollowing = followed.includes(biz.id)
          return (
            <div key={biz.id} style={{ background: 'white', borderRadius: '16px', padding: '18px', marginBottom: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ fontSize: '40px', background: '#eef2ff', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{biz.icon}</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#111' }}>{biz.name}</h3>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '13px' }}>📍 {biz.location}</p>
                  <span style={{ background: '#eef2ff', color: '#1a56ff', fontSize: '11px', padding: '3px 8px', borderRadius: '10px' }}>{biz.category}</span>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(biz.id)}
                style={{
                  background: isFollowing ? '#00b050' : '#1a56ff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {isFollowing ? '✓ Following' : '+ Follow'}
              </button>
            </div>
          )
        })}

        <div style={{ background: '#d1fadf', color: '#065f46', padding: '15px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
          ✅ App is Working! {followed.length} Following
        </div>

        {/* DOWNLOAD SECTION */}
        <div style={{ background: 'white', marginTop: '20px', padding: '20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>📲 Download App</h3>
          <p style={{ fontSize: '13px', color: '#666', margin: '0 0 15px 0' }}>Install on your phone like real app!</p>
          <div style={{ background: '#f0f4ff', padding: '12px', borderRadius: '10px', fontSize: '12px', textAlign: 'left' }}>
            <b>On Chrome:</b><br/>
            1. Tap 3 dots ⋮ (top right)<br/>
            2. Tap "Add to Home screen"<br/>
            3. Tap "Install"<br/>
            → App icon will appear on phone!
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
