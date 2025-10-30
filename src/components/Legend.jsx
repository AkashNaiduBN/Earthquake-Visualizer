import React from 'react'

export default function Legend() {
  const bins = [
    { label: '0–2', color: '#9CA3AF' },
    { label: '2–4', color: '#60A5FA' },
    { label: '4–5', color: '#34D399' },
    { label: '5–6', color: '#F59E0B' },
    { label: '6–7', color: '#F97316' },
    { label: '7+', color: '#EF4444' },
  ]
  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-soft">
      <h3 className="text-xs font-medium text-slate-300 mb-2">Magnitude Legend</h3>
      <div className="flex items-center gap-3 flex-wrap">
        {bins.map(b => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: b.color }}></span>
            <span className="text-xs text-slate-400">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

