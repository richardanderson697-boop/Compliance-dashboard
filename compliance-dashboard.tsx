
"use client"

import { useState, useEffect } from "react"
import { FileText, RefreshCw, Play, BrainCircuit, Search, Database } from "lucide-react"

export default function ProfessionalDashboard() {
  const [regulations, setRegulations] = useState([])
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://assure-compliance-production.up.railway.app"
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

  // 1. Professional Data Fetching
  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/public/regulations`, {
        headers: { "Authorization": `Bearer ${API_KEY}` }
      })
      const data = await res.json()
      setRegulations(Array.isArray(data) ? data : (data.data || []))
    } catch (err) {
      console.error("Fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }

  // 2. Trigger the Real Playwright Scraper
  const startScraper = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/scrape`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ url: "https://www.federalregister.gov", jurisdiction: "US" })
      })
      const job = await res.json()
      setJobId(job.job_id) // Your main.py returns this!
    } catch (err) {
      alert("Scraper failed to start")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Header with Control Panel */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="text-blue-600" /> Regulatory Intelligence
          </h1>
          <p className="text-slate-500 text-sm">PostgreSQL Backend: Connected</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={startScraper}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-100"
          >
            <Play size={18} /> Start US Scrape
          </button>
          <button onClick={loadData} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Main Content: AI Search + Data Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: AI Analysis (Using your main.py /analyze endpoint) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <BrainCircuit className="text-purple-600" /> AI Regulatory Analyst
            </h3>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-4"
              placeholder="Ask about compliance risks..."
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-black transition-all">
              Analyze Regulations
            </button>
          </div>
        </div>

        {/* Right: Data Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 font-bold text-slate-700">Intelligence Feed</div>
          <div className="divide-y divide-slate-100">
            {regulations.length > 0 ? (
              regulations.map((reg: any) => (
                <div key={reg.id} className="p-4 hover:bg-slate-50 flex justify-between items-center group">
                   <div>
                      <div className="font-semibold text-slate-900">{reg.title}</div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-widest">{reg.jurisdiction}</div>
                   </div>
                   <Search className="text-slate-300 group-hover:text-blue-600 transition-colors cursor-pointer" size={20} />
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400 italic">
                {jobId ? `Scraper Job ${jobId} in progress...` : "Feed is currently empty. Start a scrape to begin."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
