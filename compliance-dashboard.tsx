"use client"

import { useState, useEffect } from "react"
import { Play, Database, Activity, Terminal, AlertTriangle } from "lucide-react"

export default function ProfessionalMobileUI() {
  const [regulations, setRegulations] = useState([])
  const [logs, setLogs] = useState<string[]>([])
  const [isScraping, setIsScraping] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://assure-compliance-production.up.railway.app"
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "c043ed9d-bc39-455e-9a8a-ad35542dadc9"

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5))

  const runScraper = async () => {
    setIsScraping(true)
    addLog("🚀 Requesting Playwright launch...")
    try {
      const res = await fetch(`${API_URL}/api/v1/scrape`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://www.federalregister.gov", jurisdiction: "US" })
      })
      const data = await res.json()
      addLog(`✅ Job started: ${data.job_id.slice(0,8)}`)
    } catch (err) {
      addLog("❌ Connection Error: Backend unreachable")
    } finally {
      setIsScraping(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      {/* Mobile-Friendly Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-green-500" /> COMPLIANCE_OS
          </h1>
          <p className="text-[10px] text-zinc-500">ENGINE: PLAYWRIGHT + GPT-4</p>
        </div>
        <button 
          onClick={runScraper}
          disabled={isScraping}
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          {isScraping ? "RUNNING..." : "TRIGGER SCRAPE"}
        </button>
      </div>

      {/* Real-time Terminal Logs (Crucial for Android users) */}
      <div className="bg-zinc-900 rounded-lg p-3 mb-6 border border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] mb-2 uppercase font-bold">
          <Terminal size={12} /> System Logs
        </div>
        <div className="space-y-1">
          {logs.length > 0 ? logs.map((log, i) => (
            <div key={i} className="text-xs text-zinc-300">{`> ${log}`}</div>
          )) : <div className="text-xs text-zinc-600 italic underline">Waiting for trigger...</div>}
        </div>
      </div>

      {/* Data Results */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Database Records</h3>
        {regulations.length > 0 ? (
          regulations.map((reg: any) => (
            <div key={reg.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="text-sm font-bold text-white mb-1">{reg.title}</div>
              <div className="text-[10px] text-green-500 uppercase font-bold tracking-tighter">{reg.jurisdiction}</div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-30">
            <AlertTriangle size={40} />
            <p className="text-xs mt-2 italic">Database Empty: Run Scraper to begin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
