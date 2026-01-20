"use client"
import { useState, useEffect } from "react"
import { Terminal, Database, Activity, WifiOff, AlertTriangle } from "lucide-react"

export default function AndroidProductionUI() {
  const [logs, setLogs] = useState<string[]>([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

  const addLog = (msg: string) => setLogs(p => [`${new Date().toLocaleTimeString()}: ${msg}`, ...p].slice(0, 8))

  const loadData = async () => {
    if (!API_URL) {
      addLog("❌ API_URL is missing in Railway Variables")
      return
    }

    setLoading(true)
    // We try the 'public' route which is defined in your main.py
    const targetUrl = `${API_URL}/api/v1/public/regulations`
    addLog(`Testing: ${targetUrl}`)

    try {
      const res = await fetch(targetUrl, {
        headers: { 
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      })
      
      if (res.ok) {
        const json = await res.json()
        setData(json)
        addLog(`✅ Connected! Found ${json.length} items.`)
      } else {
        addLog(`❌ Error ${res.status}: Check if /public/ route is live.`)
      }
    } catch (e: any) {
      addLog(`❌ Network Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 font-mono text-sm">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h1 className="font-bold flex items-center gap-2 text-blue-400"><Activity size={18}/> SYSTEM_OS</h1>
        <button onClick={loadData} className="bg-blue-600 px-4 py-2 rounded text-xs font-bold active:bg-blue-800 transition-all">RETRY_SYNC</button>
      </div>

      {/* Debug Console - Essential for Android Troubleshooting */}
      <div className="bg-black rounded-lg p-3 mb-6 border border-slate-800 h-40 overflow-y-auto shadow-inner">
        <p className="text-[10px] text-slate-500 mb-2 flex items-center gap-1"><Terminal size={12}/> DEBUG_CONSOLE</p>
        {logs.map((log, i) => (
          <div key={i} className={`text-[11px] mb-1 ${log.includes('❌') ? 'text-red-400' : 'text-emerald-500'}`}>{`> ${log}`}</div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase px-1">PostgreSQL_Feed</h2>
        {data.length > 0 ? data.map((reg: any) => (
          <div key={reg.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
            <div className="font-bold text-white">{reg.title}</div>
            <div className="text-[10px] text-blue-500 mt-1 uppercase font-bold tracking-tighter">{reg.jurisdiction}</div>
          </div>
        )) : (
          <div className="py-16 text-center border-2 border-dashed border-slate-900 rounded-2xl flex flex-col items-center gap-3 opacity-50">
             <AlertTriangle size={32} />
             <p className="text-[11px] px-10 italic">Backend is running, but database is empty. You must trigger a scrape to see data.</p>
          </div>
        )}
      </div>
    </div>
  )
}
