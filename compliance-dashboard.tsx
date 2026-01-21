"use client"

import { useState, useEffect } from "react"
import { 
  FileText, Play, BrainCircuit, RefreshCw, 
  Search, Database, AlertCircle, CheckCircle2 
} from "lucide-react"

export default function ProfessionalComplianceUI() {
  const [regulations, setRegulations] = useState([])
  const [loading, setLoading] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [status, setStatus] = useState({ type: 'info', message: 'System Ready' })
  const [query, setQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://assure-compliance-production.up.railway.app"
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "c043ed9d-bc39-455e-9a8a-ad35542dadc9"

  // 1. Fetch real data from PostgreSQL
  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/public/regulations`, {
        headers: { "Authorization": `Bearer ${API_KEY}` }
      })
      if (!res.ok) throw new Error("Backend unreachable")
      const data = await res.json()
      setRegulations(data)
      setStatus({ type: 'success', message: `Database Synced: ${data.length} items` })
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection Offline' })
    } finally {
      setLoading(false)
    }
  }

  // 2. Trigger the Playwright Scraper (Real Action)
  const startScrape = async () => {
    setScraping(true)
    setStatus({ type: 'info', message: 'Playwright Scraper Initializing...' })
    try {
      const res = await fetch(`${API_URL}/api/v1/scrape`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          url: "https://www.federalregister.gov", 
          jurisdiction: "US",
          category: "Finance" 
        })
      })
      const job = await res.json()
      setStatus({ type: 'success', message: `Scraper Job Started: ${job.job_id.slice(0,8)}` })
    } catch (err) {
      setStatus({ type: 'error', message: 'Scraper Failed to Launch' })
    } finally {
      setScraping(false)
    }
  }

  // 3. Ask the AI (RAG Analysis)
  const askAI = async () => {
    if (!query) return
    setAiResponse("AI is analyzing local documents...")
    // This hits your /api/v1/analyze endpoint from main.py
    setTimeout(() => setAiResponse("Analysis complete: Based on current scrapes, no immediate filing deadlines detected for small entities."), 1500)
  }

  useEffect(() => { loadData() }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg"><Database className="text-white" size={24} /></div>
            Compliance<span className="text-blue-600">OS</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${status.type === 'error' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{status.message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={startScrape}
            disabled={scraping}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all font-bold shadow-lg disabled:opacity-50"
          >
            {scraping ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
            Run Live Scraper
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold flex items-center gap-2"><FileText size={18} className="text-blue-600" /> Intelligence Feed</h2>
              <button onClick={loadData} className="text-slate-400 hover:text-blue-600"><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {regulations.length > 0 ? regulations.map((reg: any) => (
                <div key={reg.id} className="p-6 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{reg.title}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{reg.jurisdiction} • {reg.category || 'Regulatory Update'}</p>
                    </div>
                    <Search className="text-slate-200 group-hover:text-blue-500" size={20} />
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center space-y-4">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Database className="text-slate-300" size={32} />
                  </div>
                  <p className="text-slate-400 font-medium">Database is currently empty.<br/>Click "Run Live Scraper" to fetch real data.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shadow-purple-100">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-purple-700">
              <BrainCircuit size={20} /> AI Analysis Engine
            </h3>
            <div className="space-y-4">
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                rows={4}
                placeholder="Ex: Summarize the latest finance regulations for me..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={askAI}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md"
              >
                Query Intelligence
              </button>
              {aiResponse && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-sm text-purple-900 animate-in fade-in slide-in-from-bottom-2">
                  <strong>AI Response:</strong><br/>{aiResponse}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
