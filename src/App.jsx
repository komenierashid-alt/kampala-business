import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://YOUR_PROJECT.supabase.co'
const supabaseKey = 'YOUR_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function App() {
  const [videos, setVideos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  
  useEffect(() => { fetchVideos() }, [])
  
  async function fetchVideos() {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    if (data) setVideos(data)
  }
  
  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return alert('Pick video!')
    setUploading(true)
    try {
      const fileName = Date.now() + '-' + file.name
      const { error: upErr } = await supabase.storage.from('videos').upload(fileName, file)
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName)
      const { error } = await supabase.from('videos').insert([{ title, video_url: urlData.publicUrl, likes: 0 }])
      if (error) throw error
      setTitle(''); setFile(null); alert('Uploaded! 🔥'); fetchVideos()
    } catch (err) { alert('Error: ' + err.message) }
    setUploading(false)
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'Arial' }}>
      <header style={{ padding: '15px', borderBottom: '1px solid #222', position: 'sticky', top: 0, background: '#000', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>🇺🇬 UG TikTok</h2>
        <span style={{ fontSize: '12px', color: '#888' }}> Uptown</span>
      </header>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <form onSubmit={handleUpload} style={{ background: '#111', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Upload Video 📤</h3>
          <input type="text" placeholder="Video title..." value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', marginBottom: '10px', background: '#222', color: '#fff' }} required />
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{ width: '100%', marginBottom: '10px', color: '#fff' }} required />
          <button type="submit" disabled={uploading} style={{ width: '100%', padding: '12px', background: '#fe2c55', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
            {uploading ? 'Uploading...' : 'POST 🔥'}
          </button>
        </form>
        {videos.length === 0 && <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>No videos yet. Be first to post! 🚀</p>}
        {videos.map(v => (
          <div key={v.id} style={{ background: '#111', borderRadius: '12px', marginBottom: '20px', overflow: 'hidden' }}>
            <video src={v.video_url} controls loop playsInline style={{ width: '100%', maxHeight: '600px', background: '#000' }} />
            <div style={{ padding: '12px' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{v.title}</p>
              <div style={{ display: 'flex', gap: '15px', color: '#888', fontSize: '14px' }}>
                <span>❤️ {v.likes || 0}</span>
                <span>🕒 {new Date(v.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
