import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { formatDateTime } from '../utils/format'

const FitBounds = ({ bounds }) => {
  const map = useMap()
  useEffect(() => {
    if (!bounds) return
    try {
      // bounds: [south, west, north, east] -> [[south, west], [north, east]]
      const bb = [[bounds[0], bounds[1]], [bounds[2], bounds[3]]]
      map.fitBounds(bb, { padding: [50,50] })
    } catch (e) { console.warn(e) }
  }, [bounds, map])
  return null
}

const colorForMag = (m) => {
  if (m >= 7) return '#EF4444'
  if (m >= 6) return '#F97316'
  if (m >= 5) return '#F59E0B'
  if (m >= 4) return '#34D399'
  if (m >= 2) return '#60A5FA'
  return '#9CA3AF'
}

const radiusForMag = (m) => Math.max(4, m * 3 + 2)

export default function MapView({ earthquakes, loading, countryBounds }) {
  const bounds = useMemo(() => [[-85, -180], [85, 180]], [])

  return (
    <div className="h-[60vh] md:h-full relative">
      <MapContainer
        bounds={bounds}
        worldCopyJump
        className="rounded-none md:rounded-l-2xl"
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {countryBounds ? <FitBounds bounds={countryBounds} /> : null}

        {earthquakes && earthquakes.map((f) => {
          const [lon, lat, depth] = f.geometry.coordinates
          const { mag, place, time, url, tsunami } = f.properties
          const color = colorForMag(mag ?? 0)
          const radius = radiusForMag(mag ?? 0)
          return (
            <CircleMarker
              key={f.id}
              center={[lat, lon]}
              radius={radius}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{place || 'Unknown location'}</div>
                  <div>Magnitude: <span className="font-mono">{mag?.toFixed(1) ?? '—'}</span></div>
                  <div>Depth: <span className="font-mono">{typeof depth === 'number' ? depth.toFixed(0) : depth} km</span></div>
                  <div>Time: {formatDateTime(time)}</div>
                  {tsunami ? <div>⚠️ Tsunami alert</div> : null}
                  {url ? <div className="mt-1"><a className="underline" href={url} target="_blank" rel="noreferrer">USGS details</a></div> : null}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
      {loading && (
        <div className="absolute inset-x-0 bottom-4 md:bottom-6 flex justify-center pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 backdrop-blur">
            Loading latest earthquakes…
          </span>
        </div>
      )}
    </div>
  )
}
