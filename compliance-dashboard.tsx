
import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('Connecting to Engine...');

  useEffect(() => {
    // We use the exact path verified in your logs
    fetch('/api/v1/public/regulations')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(json => {
        setData(json);
        setStatus('Live Intelligence Feed');
      })
      .catch(() => setStatus('Waiting for Database Recovery...'));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#334' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: '10px' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Assure Code Dashboard</h2>
        <div style={{ color: data.length > 0 ? 'green' : 'orange', fontSize: '12px' }}>
          ● {status}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {data.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9' }}>
            {status === 'Live Intelligence Feed' ? 'No regulations found in workspace.' : 'Engine Warming Up... Check logs in 30s.'}
          </div>
        ) : (
          data.map((item: any) => (
            <div key={item.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>{item.title || 'Regulatory Update'}</strong>
              <p style={{ fontSize: '13px', color: '#666' }}>{item.content?.substring(0, 150)}...</p>
              <button style={{ background: '#0070f3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>
                Analyze with RAG
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
