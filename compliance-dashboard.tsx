"use client"
import { useState, useEffect } from "react"
import { Terminal, Activity, Play, RefreshCw } from "lucide-react"

export default function AndroidProductionUI() {
  const [logs, setLogs] = useState<string[]>([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

  const addLog = (msg: string) => setLogs(p => [`${new Date().toLocaleTimeString()}: ${msg}`, ...p].slice(0, 10))

  const runDiagnostics = async () => {
    setLoading(true)
    addLog(`Testing connection to: ${API_URL}`)
    try {
      const res = await fetch(`${API_URL}/api/v1/public/regulations`, {
        headers: { "Authorization": `Bearer ${API_KEY}` }
      })
      if (res.ok) {
        const json = await res.json()
        setData(json)
        addLog(`✅ Connected. Found ${json.length} records.`)
      } else {
        addLog(`❌ Server Error: ${res.status}. Check backend logs.`)
      }
    } catch (e: any) {
      addLog(`❌ Network Error: ${e.message}. Check if API_URL is correct.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if(API_URL) runDiagnostics() }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 font-mono text-sm">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h1 className="font-bold flex items-center gap-2 text-blue-400"><Activity size={18}/> SYSTEM_LIVE</h1>
        <button onClick={runDiagnostics} className="bg-blue-600 px-3 py-1 rounded text-xs">RETRY_SYNC</button>
      </div>

      {/* Terminal - This is your Android Inspector */}
      <div className="bg-black rounded-lg p-3 mb-6 border border-slate-800 h-48 overflow-y-auto">
        <p className="text-[10px] text-slate-500 mb-2 flex items-center gap-1"><Terminal size={12}/> DEBUG_CONSOLE</p>
        {logs.map((log, i) => <div key={i} className="text-[11px] text-emerald-500 mb-1">{`> ${log}`}</div>)}
      </div>

      <div className="space-y-4">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase">Database_Feed</h2>
        {data.length > 0 ? data.map((reg: any) => (
          <div key={reg.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="font-bold">{reg.title}</div>
            <div className="text-[10px] text-blue-500 mt-1 uppercase">{reg.jurisdiction}</div>
          </div>
        )) : (
          <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl text-slate-600 italic">
            No data found. Start scraper to populate database.
          </div>
        )}
      </div>
    </div>
  )
}
