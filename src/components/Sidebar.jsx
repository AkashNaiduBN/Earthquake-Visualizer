import React, { useState } from 'react'
import axios from 'axios'

const feeds = [
  { id: 'all_hour', label: 'Last hour' },
  { id: 'all_day', label: 'Last 24 hours' },
  { id: 'all_week', label: 'Last 7 days' },
  { id: 'all_month', label: 'Last 30 days' },
]

export default function Sidebar({
  magMin, setMagMin,
  autoRefresh, setAutoRefresh,
  feed, setFeed,
  onRefresh, loading, error,
  onCountrySelect
}) {
  const [countryInput, setCountryInput] = useState('')
  const [searching, setSearching] = useState(false)
  const [countryName, setCountryName] = useState(null)
  const [countryError, setCountryError] = useState(null)

  const searchCountry = async (q) => {
    if (!q) {
      onCountrySelect(null)
      setCountryName(null)
      setCountryError(null)
      return
    }
    setSearching(true); setCountryError(null)
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { country: q, format: 'json', limit: 1 }
      })
      if (res.data && res.data.length > 0) {
        const item = res.data[0]
        // boundingbox: [south, north, west, east] as strings
        const bb = item.boundingbox.map(parseFloat)
        // convert to [south, west, north, east]
        const bounds = [bb[0], bb[2], bb[1], bb[3]]
        onCountrySelect(bounds)
        setCountryName(item.display_name)
      } else {
        setCountryError('Not found')
        onCountrySelect(null)
        setCountryName(null)
      }
    } catch (e) {
      setCountryError('Search failed')
      onCountrySelect(null)
      setCountryName(null)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-6 max-w-sm">
      <section>
        <h2 className="text-sm font-semibold text-slate-200">Filters</h2>
        <div className="mt-3 space-y-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-soft">
          <div>
            <label className="text-xs text-slate-400">Minimum magnitude: <span className="font-mono text-slate-200">{magMin.toFixed(1)}</span></label>
            <input
              type="range"
              min="0"
              max="8"
              step="0.1"
              value={magMin}
              onChange={e => setMagMin(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500"><span>0.0</span><span>8.0+</span></div>
          </div>

          <div>
            <label className="text-xs text-slate-400">Time window</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {feeds.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFeed(f.id)}
                  className={
                    'px-3 py-2 rounded-xl border text-sm ' +
                    (feed === f.id ? 'bg-green-400 text-slate-900 border-green-500' : 'bg-slate-950 border-slate-800 text-slate-200')
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-400">Auto refresh (5 min)</label>
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-200">Country Search</h2>
        <div className="mt-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-soft">
          <label className="text-xs text-slate-400">Enter country to zoom</label>
          <div className="mt-2 flex gap-2">
            <input value={countryInput} onChange={e=>setCountryInput(e.target.value)} placeholder="e.g. India" className="flex-1 px-3 py-2 rounded-lg bg-slate-800 text-slate-100 text-sm" />
            <button onClick={()=>searchCountry(countryInput)} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-900">Go</button>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {searching ? 'Searching…' : countryName ? `Found: ${countryName}` : countryError ? countryError : 'Type a country and press Go'}
          </div>
          <div className="mt-2 text-xs text-slate-400">Tip: Clear input and press Go to reset.</div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-200">Actions</h2>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-900 hover:bg-white transition"
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh now'}
          </button>
          {error && <span className="text-xs text-red-400">{String(error)}</span>}
        </div>
      </section>

      <section className="text-xs text-slate-400 leading-relaxed">
        <p>
          Data source: USGS Earthquake API (GeoJSON). Marker size and color scale with magnitude. 
          Click markers to view details like place, magnitude, depth, and time.
        </p>
      </section>
    </div>
  )
}
