"use client"
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('For You');
  const tabs = ['For You', 'Muzika', 'Following', 'Live'];
  
  return (
    <div className="bg-black text-white min-h-screen flex flex-col max-w-[430px] mx-auto">
      {/* TOP BAR */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center font-bold">KB</div>
          <div className="flex gap-3 ml-2">
            {tabs.map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)} 
                className={`${activeTab===tab ? 'text-white font-bold border-b-2 border-white' : 'text-gray-400'} text-sm pb-1`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="text-gray-400">🔍</div>
      </div>

      {/* LIVE BANNER - from your 3rd design */}
      <div className="bg-red-600 flex items-center justify-between px-4 py-2 m-2 rounded-full">
        <span className="text-sm font-bold flex items-center gap-2">
          <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
          @Katongole is LIVE NOW
        </span>
        <button className="bg-white text-red-600 px-4 py-1 rounded-full text-xs font-bold">WATCH</button>
      </div>

      {/* VIDEO FEED AREA */}
      <div className="flex-1 relative bg-zinc-900 flex items-center justify-center">
        {/* Video placeholder */}
        <div className="text-gray-500">Video Feed Here</div>
        
        {/* RIGHT SIDE ACTION BUTTONS - from your 3rd design */}
        <div className="absolute right-3 bottom-20 flex flex-col gap-5 items-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">K</div>
            <div className="w-5 h-5 bg-blue-500 rounded-full -mt-2 border-2 border-black flex items-center justify-center text-xs">✓</div>
          </div>
          <button className="flex flex-col items-center"><span className="text-3xl">❤️</span><span className="text-xs">0</span></button>
          <button className="flex flex-col items-center"><span className="text-2xl">🕒</span><span className="text-xs">0</span></button>
          <button className="flex flex-col items-center"><span className="text-2xl">💬</span><span className="text-xs">0</span></button>
          <button className="flex flex-col items-center"><span className="text-2xl">↗️</span><span className="text-xs">0</span></button>
          <button className="flex flex-col items-center"><span className="text-2xl">🔥</span><span className="text-xs">0</span></button>
        </div>

        {/* BOTTOM USER INFO - from your 1st design */}
        <div className="absolute left-3 bottom-3">
          <p className="font-bold flex items-center gap-1">Katongole Rashid <span className="bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">✓</span></p>
          <p className="text-sm text-gray-300">Founder - Kampala Business #business</p>
        </div>
      </div>

      {/* BOTTOM NAVIGATION - Combined best */}
      <div className="bg-black border-t border-gray-800 flex justify-around items-center py-2">
        <button className="flex flex-col items-center text-white"><span>🏠</span><span className="text-[10px]">For You</span></button>
        <button className="flex flex-col items-center text-gray-400"><span className="bg-zinc-800 px-3 py-1 rounded">Live (1)</span></button>
        <button className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center text-2xl font-bold">+</button>
        <button className="flex flex-col items-center text-gray-400"><span>💬</span><span className="text-[10px]">Chat</span></button>
        <button className="flex flex-col items-center text-gray-400"><span>👤</span><span className="text-[10px]">You</span></button>
      </div>
    </div>
  )
}
