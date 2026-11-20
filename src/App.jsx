import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('For You')
  const [user, setUser] = useState(null)
  const [businesses, setBusinesses] = useState([])

  // Load user from localStorage - user creates own profile
  useEffect(() => {
    const savedUser = localStorage.getItem('kba_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    const savedBiz = localStorage.getItem('kba_businesses')
    if (savedBiz) {
      setBusinesses(JSON.parse(savedBiz))
    }
  }, [])

  // First time - create profile
  const createProfile = (e) => {
    e.preventDefault()
    const form = e.target
    const newUser = {
      name: form.name.value,
      businessName: form.businessName.value,
      location: form.location.value,
      phone: form.phone.value,
      avatar: `https://ui-avatars.com/api/?name=${form.name.value}&background=16a34a&color=fff`,
      joined: new Date().toLocaleDateString()
    }
    localStorage.setItem('kba_user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const tabs = ['LIVE', 'EM', 'Community', 'Following', 'For You']

  if (!user) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <form onSubmit={createProfile} className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <img src="/logo.png" className="w-20 h-20 mx-auto rounded-full" />
          <h2 className="text-xl font-bold text-center">Create Your Business Profile</h2>
          <p className="text-sm text-gray-500 text-center">This replaces Matovu - it's YOUR profile</p>
          
          <input name="name" placeholder="Your Name (e.g. Rashid)" required className="w-full p-3 border rounded-xl" />
          <input name="businessName" placeholder="Business Name" required className="w-full p-3 border rounded-xl" />
          <input name="location" placeholder="Location (e.g. Kikoni, Makerere)" required className="w-full p-3 border rounded-xl" />
          <input name="phone" placeholder="WhatsApp Number" required className="w-full p-3 border rounded-xl" />
          
          <button className="w-full bg-green-600 text-white p-3 rounded-xl font-bold">Join Kampala Business App</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TikTok-style top tabs - like your screenshot */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3 overflow-x-auto">
          <div className="flex gap-5">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap text-[15px] font-semibold pb-1 border-b-2 transition ${
                  activeTab === tab 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-500'
                }`}
              >
                {tab === 'LIVE' ? '🔴 LIVE' : tab}
              </button>
            ))}
          </div>
          <button className="ml-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>

      {/* User Profile Header - DYNAMIC, not Matovu */}
      <div className="bg-white p-4 flex items-center gap-3">
        <img src={user.avatar} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.businessName} • {user.location}</p>
        </div>
        <button onClick={() => { localStorage.clear(); setUser(null)}} className="text-xs text-gray-400">Logout</button>
      </div>

      {/* For You Feed */}
      <div className="p-4">
        {activeTab === 'For You' && (
          <div className="space-y-3">
            <h4 className="font-bold">For You in Kampala</h4>
            <div className="grid gap-3">
              {businesses.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-500">
                  No businesses yet - Add your first business!
                </div>
              ) : businesses.map(b => (
                <div key={b.id} className="bg-white p-4 rounded-2xl shadow-sm">{b.name}</div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'Following' && <div className="p-8 text-center text-gray-500">Follow businesses to see them here</div>}
        {activeTab === 'Community' && <div className="p-8 text-center text-gray-500">Kikoni • Makerere • Wandegeya Community</div>}
      </div>
    </div>
  )
}
