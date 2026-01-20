"use client"

import { useState, useEffect } from "react"
import {
  FileText, Download, Search, Filter, Calendar, Building2,
  AlertCircle, CheckCircle2, Clock, TrendingUp, BarChart3,
  ExternalLink, RefreshCw, Send,
} from "lucide-react"

export default function ComplianceDashboard() {
  // Use Environment Variables (no more hardcoded keys for GitHub to block)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

  const [regulations, setRegulations] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const loadData = async () => {
    if (!API_URL) {
      setStatus({ type: "error", message: "API URL not configured in Railway" })
      return
    }
    
    setLoading(true)
    setStatus({ type: "loading", message: "Syncing..." })
    
    try {
      const res = await fetch(`${API_URL}/api/v1/regulations`, {
        headers: { 
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!res.ok) throw new Error(`Status: ${res.status}`)
      
      const data = await res.json()
      const extracted = Array.isArray(data) ? data : (data.regulations || data.data || [])
      setRegulations(extracted)
      setStatus({ type: "success", message: `Loaded ${extracted.length} items` })
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Connection Failed" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-blue-200 shadow-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium">Railway Backend Status: {status?.message}</p>
          </div>
        </div>
        <button 
          onClick={loadData} 
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <RefreshCw size={20} className={loading ? "animate-spin text-blue-600" : "text-gray-400"} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <TrendingUp className="text-blue-600 mb-4 w-8 h-8" />
          <div className="text-3xl font-bold text-gray-900">{regulations.length}</div>
          <div className="text-sm font-medium text-gray-500">Regulations Tracked</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <CheckCircle2 className="text-green-600 mb-4 w-8 h-8" />
          <div className="text-3xl font-bold text-gray-900">Active</div>
          <div className="text-sm font-medium text-gray-500">Scraper Status</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Building2 className="text-purple-600 mb-4 w-8 h-8" />
          <div className="text-3xl font-bold text-gray-900">Multi</div>
          <div className="text-sm font-medium text-gray-500">Jurisdiction Sync</div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-gray-50/50">
          <h2 className="font-bold text-gray-800">Regulatory Intelligence Feed</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {regulations.length > 0 ? (
            regulations.map((reg: any) => (
              <div key={reg.id} className="p-5 hover:bg-blue-50/30 transition-colors flex justify-between items-center group">
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {reg.title || "Legislative Update"}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {reg.agency || "Agency Pending Review"} • {reg.jurisdiction || "Global"}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    <Search size={18} />
                  </button>
                  <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <RefreshCw className={`w-10 h-10 mx-auto mb-4 text-gray-200 ${loading ? "animate-spin" : ""}`} />
              <p className="text-gray-400 font-medium">
                {loading ? "Establishing secure connection to Railway..." : "Intelligence feed is currently empty."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
