import React, { useMemo, useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import Legend from './components/Legend'
import Charts from './components/Charts'
import useEarthquakes from './hooks/useEarthquakes'

export default function App() {
  const [magMin, setMagMin] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [feed, setFeed] = useState('all_day') // all_hour, all_day, all_week, all_month
  const [countryBounds, setCountryBounds] = useState(null)
  const [viewMode, setViewMode] = useState('map') // 'map' or 'charts'

  const { data, loading, error, refetch, lastUpdated } = useEarthquakes({ feed, autoRefresh })

  // Filter by magnitude first
  const filteredByMag = useMemo(() => {
    if (!data) return []
    return data.features.filter(f => (f.properties.mag ?? 0) >= magMin)
  }, [data, magMin])

  // If countryBounds set, further filter points inside bbox [south, west, north, east]
  const filtered = useMemo(() => {
    if (!countryBounds) return filteredByMag
    const [south, west, north, east] = countryBounds
    return filteredByMag.filter(f => {
      const [lon, lat] = f.geometry.coordinates
      return lat >= south && lat <= north && lon >= west && lon <= east
    })
  }, [filteredByMag, countryBounds])

  return (
    <div className="min-h-screen grid md:grid-cols-[380px_1fr] grid-rows-[auto_1fr] md:grid-rows-1 bg-slate-950 text-slate-100">
      <header className="md:col-span-2 px-4 py-3 md:py-4 border-b border-slate-800 sticky top-0 z-30 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="size-9 rounded-xl bg-green-400/10 grid place-items-center">
            <span className="font-bold text-green-400">EQ</span>
          </div>
          <h1 className="text-lg md:text-xl font-semibold">Earthquake Visualizer</h1>
          <div className="ml-4 space-x-2 text-sm">
            <button onClick={() => setViewMode('map')} className={'px-3 py-1 rounded-lg ' + (viewMode==='map' ? 'bg-green-400 text-slate-900' : 'bg-slate-800 text-slate-300') }>Map</button>
            <button onClick={() => setViewMode('charts')} className={'px-3 py-1 rounded-lg ' + (viewMode==='charts' ? 'bg-green-400 text-slate-900' : 'bg-slate-800 text-slate-300') }>Charts</button>
          </div>
          <div className="ml-auto text-xs md:text-sm text-slate-400">
            {lastUpdated ? <>Last update: {new Date(lastUpdated).toLocaleString()}</> : '—'}
          </div>
        </div>
      </header>

      <aside className="md:row-span-1 md:h-[calc(100vh-64px)] p-4 md:p-6 border-r border-slate-800">
        <Sidebar
          magMin={magMin}
          setMagMin={setMagMin}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          feed={feed}
          setFeed={setFeed}
          onRefresh={refetch}
          loading={loading}
          error={error}
          onCountrySelect={setCountryBounds}
        />
        <div className="mt-6">
          <Legend />
        </div>
      </aside>

      <main className="md:h-[calc(100vh-64px)]">
        {viewMode === 'map' ? (
          <MapView earthquakes={filtered} loading={loading} countryBounds={countryBounds} />
        ) : (
          <div className="p-4 md:p-6">
            <Charts earthquakes={filtered} />
          </div>
        )}
      </main>
    </div>
  )
}

