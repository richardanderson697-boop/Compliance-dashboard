import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [laws, setLaws] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  // 1. Fetch real data from your scraper's output
  const loadData = async () => {
    try {
      const res = await fetch('/api/v1/public/regulations');
      const data = await res.json();
      setLaws(data);
    } catch (e) {
      console.log("Database recovering...");
    }
  };

  useEffect(() => { loadData(); }, []);

  // 2. Trigger the Scraper Agent (The "Run" part of your idea)
  const runScraper = async () => {
    setIsScraping(true);
    try {
      await fetch('/api/v1/scrape', { method: 'POST' });
      // Wait a few seconds for the agent to work, then refresh
      setTimeout(loadData, 5000);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Assure Intelligence</h1>
          <p style={{ color: '#666' }}>Query real-time regulatory changes</p>
        </div>
        <button 
          onClick={runScraper}
          disabled={isScraping}
          style={{ padding: '10px 20px', borderRadius: '8px', background: isScraping ? '#ccc' : '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {isScraping ? 'Agent Scraping...' : 'Run New Discovery'}
        </button>
      </header>

      {/* 3. Search Bar for real queries */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search laws (e.g. 'GDPR' or 'Privacy')..." 
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {laws.filter(l => l.title?.toLowerCase().includes(searchQuery.toLowerCase())).map((law: any) => (
          <div key={law.id} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{law.title}</div>
            <div style={{ color: '#0070f3', fontSize: '12px', margin: '5px 0' }}>{law.agency} • Article {law.article_number}</div>
            <p style={{ fontSize: '14px', color: '#444' }}>{law.content?.substring(0, 250)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
