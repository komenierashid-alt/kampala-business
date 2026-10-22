import React, { useState, useEffect } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("For You");
  const [muted, setMuted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [currentUser] = useState({ name: "Katongole Rashid", verified: true });

  // Helper to check blue tick - Kayima NO tick
  const hasBlueTick = (name) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    if (lower.includes("kayima")) return false;
    if (lower.includes("baker")) return false;
    return true; // Everyone else can have tick if verified
  };

  return (
    <div style={{ background: "black", minHeight: "100vh", color: "white", position: "relative", paddingBottom: "60px" }}>
      
      {/* TOP TABS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "10px", borderBottom: "1px solid #222", position: "sticky", top: 0, background: "black", zIndex: 10 }}>
        <span onClick={() => setActiveTab("For You")} style={{ fontWeight: activeTab === "For You" ? "bold" : "400", color: activeTab === "For You" ? "white" : "#777", cursor: "pointer" }}>For You</span>
        <span onClick={() => setActiveTab("Following")} style={{ fontWeight: activeTab === "Following" ? "bold" : "400", color: activeTab === "Following" ? "white" : "#777", cursor: "pointer" }}>Following</span>
        <span onClick={() => setActiveTab("Joined")} style={{ fontWeight: activeTab === "Joined" ? "bold" : "400", color: activeTab === "Joined" ? "white" : "#777", cursor: "pointer" }}>👥 Joined</span>
      </div>

      {/* CENTER CONTENT */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        
        {activeTab === "For You" && (
          <div>
            <p style={{ color: "#777" }}>Double tap ❤️ Like &nbsp;&nbsp; Triple tap 🔥 Fire</p>
            <div style={{ marginTop: "50px" }}>
              <p style={{ fontSize: "14px" }}>{currentUser.name} {hasBlueTick(currentUser.name) && <span style={{ background: "#1DA1F2", borderRadius: "50%", color: "white", fontSize: "10px", padding: "1px 4px" }}>✓</span>}</p>
              <p style={{ color: "#777", fontSize: "12px" }}>1 Views • | Content Creator and film actor</p>
            </div>
          </div>
        )}

        {activeTab === "Live" && (
          <div style={{ padding: "30px 20px" }}>
            <div style={{ fontSize: "60px" }}>🔴</div>
            <h2>Live Now</h2>
            <p style={{ color: "#777" }}>No one is live at the moment</p>
            <p style={{ color: "#777", fontSize: "12px" }}>Be the first to go live in Kampala!</p>
            <button onClick={() => setShowUpload(true)} style={{ background: "red", color: "white", padding: "12px 24px", borderRadius: "25px", border: "none", marginTop: "15px", fontWeight: "bold", fontSize: "16px" }}>
              Go LIVE 🔴
            </button>
            <div style={{ marginTop: "20px", background: "#111", padding: "10px", borderRadius: "10px" }}>
              <p style={{ fontSize: "12px", color: "#aaa" }}>Live streaming is ready! Your followers will get notification when you go live.</p>
            </div>
          </div>
        )}

        {activeTab === "Joined" && (
          <div>
            <h3>👥 People Joined</h3>
            <p style={{ color: "#777", fontSize: "12px" }}>Everyone who signed up appears here</p>
          </div>
        )}

        {activeTab === "Chat" && (
          <div style={{ padding: "20px" }}>
            <h3>💬 Chat</h3>
            <div style={{ background: "#111", borderRadius: "10px", padding: "15px", marginTop: "10px" }}>
              <p style={{ color: "#777" }}>No messages yet</p>
              <p style={{ fontSize: "12px", color: "#555" }}>Start chatting with people from Joined list</p>
            </div>
            <button style={{ background: "#1DA1F2", color: "white", padding: "10px 20px", borderRadius: "20px", border: "none", marginTop: "15px" }}>Open Messages</button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV - FIXED */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "black", borderTop: "1px solid #222", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0", zIndex: 20 }}>
        
        <div onClick={() => setActiveTab("For You")} style={{ textAlign: "center", color: activeTab === "For You" ? "white" : "#777", cursor: "pointer" }}>
          <div style={{ fontSize: "18px" }}>🏠</div>
          <div style={{ fontSize: "9px", fontWeight: activeTab === "For You" ? "bold" : "400", color: "white" }}>Home</div>
        </div>

        <div onClick={() => setActiveTab("Live")} style={{ textAlign: "center", color: activeTab === "Live" ? "red" : "#777", cursor: "pointer" }}>
          <div style={{ fontSize: "18px", background: activeTab === "Live" ? "red" : "#222", color: "white", padding: "2px 8px", borderRadius: "4px" }}>Live</div>
          <div style={{ fontSize: "9px", fontWeight: activeTab === "Live" ? "bold" : "400", color: "white" }}>Live</div>
        </div>

        <div onClick={() => setShowUpload(true)} style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontSize: "24px", background: "white", color: "black", width: "35px", height: "25px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</div>
        </div>

        <div onClick={() => setActiveTab("Chat")} style={{ textAlign: "center", color: activeTab === "Chat" ? "white" : "#777", cursor: "pointer" }}>
          <div style={{ fontSize: "18px" }}>💬</div>
          <div style={{ fontSize: "9px", fontWeight: "bold", color: "white" }}>Chat</div>
        </div>

        <div onClick={() => setActiveTab("Profile")} style={{ textAlign: "center", color: "#777", cursor: "pointer" }}>
          <div style={{ fontSize: "18px" }}>👤</div>
          <div style={{ fontSize: "9px", color: "white" }}>Katongole</div>
        </div>

      </div>
    </div>
  );
}

export default App;
