];

function App() {
  return (
    <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px'}}>
      <h1 style={{textAlign: 'center'}}>Kampala Business - Admin: Katongole Rashid +256778953685</h1>
      {SAMPLE_VIDEOS.map(v => (
        <div key={v.id} style={{border: '1px solid #444', margin: '15px', padding: '15px', borderRadius: '10px'}}>
          <h2>{v.user} {v.verified ? '✅ BLUE TICK' : '⏳ Not verified'}</h2>
          <p><b>{v.business}</b> - {v.phone}</p>
          <p>{v.caption}</p>
          <video src={v.video} controls width="300" style={{borderRadius: '10px'}} />
          <p>❤️ {v.likes} Likes</p>
        </div>
      ))}
    </div>
  );
}

export default App;
