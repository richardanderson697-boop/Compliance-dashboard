
"use client"
import { useState, useEffect } from "react"
import { Activity, Play, Terminal, Database, ShieldAlert } from "lucide-react"

export default function ProductionDashboard() {
  const [data, setData] = useState([])
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // These must be set in Railway -> Frontend -> Variables
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

  const addLog = (m: string) => setLogs(prev => [`${new Date().toLocaleTimeString()}: ${m}`, ...prev])

  const syncDatabase = async () => {
    setLoading(true)
    addLog(`Connecting to API...`)
    try {
      const res = await fetch(`${API_URL}/api/v1/public/regulations`, {
        headers: { "Authorization": `Bearer ${API_KEY}` }
      })
      if (res.ok) {
        const json = await res.json()
        setData(json)
        addLog(`✅ Sync Success: Found ${json.length} items.`)
      } else {
        addLog(`❌ Server Error: ${res.status}. Check API URL.`)
      }
    } catch (err: any) {
      addLog(`❌ Network Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if(API_URL) syncDatabase() }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-mono select-none">
      {/* Status Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Database className="text-blue-500" size={20} /> COMPLIANCE_CORE
          </h1>
          <p className="text-[10px] text-slate-500 italic">ENVIRONMENT: RAILWAY_PRODUCTION</p>
        </div>
        <button onClick={syncDatabase} className="bg-blue-600 active:bg-blue-700 px-4 py-2 rounded text-xs font-bold transition-all shadow-lg shadow-blue-900/20">
          RETRY_SYNC
        </button>
      </div>

      {/* Android Debug Console */}
      <div className="bg-black p-4 rounded-xl border border-slate-800 mb-6 h-44 overflow-y-auto shadow-inner">
        <div className="text-[10px] text-slate-500 uppercase mb-2 flex items-center gap-1">
          <Terminal size={12}/> System_Logs
        </div>
        {logs.map((log, i) => (
          <div key={i} className={`text-[11px] mb-1 ${log.includes('❌') ? 'text-red-400' : 'text-emerald-400'}`}>
            {`> ${log}`}
          </div>
        ))}
      </div>

      {/* Data Feed */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Live_Intelligence_Feed</h2>
        {data.length > 0 ? data.map((item: any) => (
          <div key={item.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 active:border-blue-500 transition-colors">
            <div className="text-sm font-bold text-white mb-1">{item.title}</div>
            <div className="flex justify-between items-center">
               <span className="text-[10px] text-blue-400 font-bold uppercase">{item.jurisdiction}</span>
               <span className="text-[10px] text-slate-600">{new Date(item.scraped_at).toLocaleDateString()}</span>
            </div>
          </div>
        )) : (
          <div className="py-16 text-center border-2 border-dashed border-slate-900 rounded-2xl flex flex-col items-center gap-3">
            <ShieldAlert className="text-slate-800" size={32} />
            <p className="text-slate-600 text-xs px-10">Database empty. Run the scraper command from the control panel to populate.</p>
          </div>
        )}
      </div>
    </div>
  )
}
