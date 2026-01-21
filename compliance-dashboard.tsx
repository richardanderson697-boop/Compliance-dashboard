import React, { useEffect, useState } from 'react';
import { Shield, ExternalLink, Calendar, Info } from 'lucide-react';

export const RegulationFeed = () => {
  const [regulations, setRegulations] = useState([]);

  useEffect(() => {
    // Fetching from the endpoint verified in your logs
    fetch('/api/v1/public/regulations')
      .then(res => res.json())
      .then(data => setRegulations(data));
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Regulatory Intelligence</h1>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Live Scanners Active
        </span>
      </div>

      <div className="grid gap-4">
        {regulations.map((reg) => (
          <div key={reg.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between start mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800">{reg.title}</h3>
              </div>
              <a href={reg.source_url} target="_blank" className="text-slate-400 hover:text-blue-600">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{reg.raw_text}</p>
            
            <div className="flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3" /> {reg.agency}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Published: {new Date(reg.publication_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
