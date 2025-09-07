import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

function bucketMagnitudes(data) {
  const buckets = {'0-1':0,'1-2':0,'2-3':0,'3-4':0,'4-5':0,'5-6':0,'6+':0}
  data.forEach(f => {
    const m = Math.floor(f.properties.mag ?? 0)
    if (m <= 0) buckets['0-1']++
    else if (m === 1) buckets['1-2']++
    else if (m === 2) buckets['2-3']++
    else if (m === 3) buckets['3-4']++
    else if (m === 4) buckets['4-5']++
    else if (m === 5) buckets['5-6']++
    else buckets['6+']++
  })
  return Object.entries(buckets).map(([k,v])=>({ name:k, count:v }))
}

export default function Charts({ earthquakes }) {
  const barData = useMemo(() => bucketMagnitudes(earthquakes || []), [earthquakes])
  const lineData = useMemo(() => {
    // sort by time ascending and map { time: human, mag }
    return (earthquakes || []).slice().sort((a,b)=> (a.properties.time||0)-(b.properties.time||0)).map(f=>({ time: new Date(f.properties.time).toLocaleTimeString(), mag: f.properties.mag || 0 }))
  }, [earthquakes])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-soft">
        <h3 className="text-sm font-medium text-slate-200 mb-2">Magnitude distribution</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} />
              <YAxis tick={{ fill: '#cbd5e1' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-soft">
        <h3 className="text-sm font-medium text-slate-200 mb-2">Magnitude timeline</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fill: '#cbd5e1' }} />
              <YAxis tick={{ fill: '#cbd5e1' }} />
              <Tooltip />
              <Line type="monotone" dataKey="mag" stroke="#34D399" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
