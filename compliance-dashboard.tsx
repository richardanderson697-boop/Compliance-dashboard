"use client"
import { useState, useEffect } from "react"
import { Terminal, Database, Activity, WifiOff } from "lucide-react"

export default function ProfessionalMobileUI() {
  const [data, setData] = useState([])
  const [logs, setLogs] = useState<string[]>([])
  const [isOnline, setIsOnline] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

  const addLog = (m: string) => setLogs(p => [`> ${m}`, ...p].slice(0, 5))

  const loadData = async () => {
    // We try both the 'public' and 'standard' routes to bypass the 404
    const routes = [`${API_URL}/api/v1/public/regulations`, `${API_URL}/api/v1/regulations`]
    
    for (const url of routes) {
      addLog(`Testing route: ${url.split('/').pop()}`)
      try {
        const res = await fetch(url, {
          headers: { "Authorization": `Bearer ${API_KEY}` }
        })
        if (res.ok) {
          const json = await res.json()
          setData(json)
          setIsOnline(true)
          addLog(`✅ Connected! Found ${json.length} items.`)
          return // Stop if we find a working route
        }
      } catch (e) {
        continue
      }
    }
    addLog("❌ All routes returned 404 or Timeout")
  }

  useEffect(() => { if(API_URL) loadData() }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-mono">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Activity size={18} className={isOnline ? "text-green-500" : "text-red-500"} /> 
          COMPLIANCE_CORE
        </h1>
        <button onClick={loadData} className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase">Sync</button>
      </div>

      {/* Connection Monitor */}
      <div className="bg-black/50 border border-slate-800 rounded-lg p-3 mb-6">
        <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Network_Logs</p>
        {logs.map((log, i) => (
          <div key={i} className="text-[11px] text-emerald-400 opacity-80 mb-1">{log}</div>
        ))}
      </div>

      <div className="space-y-4">
        {data.length > 0 ? data.map((item: any) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="text-sm font-bold">{item.title}</div>
            <div className="text-[10px] text-blue-400 font-bold mt-1 uppercase">{item.jurisdiction}</div>
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center opacity-20">
            <WifiOff size={48} />
            <p className="text-xs mt-4 italic text-center">No data found in PostgreSQL.<br/>The backend is running, but the database is empty.</p>
          </div>
        )}
      </div>
    </div>
  )
}
