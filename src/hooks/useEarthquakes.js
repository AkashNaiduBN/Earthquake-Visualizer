import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'

const FEED_URL = (feed='all_day') => `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${feed}.geojson`
// feeds: all_hour, all_day, all_week, all_month

export default function useEarthquakes({ feed='all_day', autoRefresh=true }={}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const timerRef = useRef(null)

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await axios.get(FEED_URL(feed), { timeout: 15000 })
      setData(res.data)
      setLastUpdated(Date.now())
    } catch (e) {
      setError(e?.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }, [feed])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!autoRefresh) return
    timerRef.current = setInterval(fetchData, 5 * 60 * 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [autoRefresh, fetchData])

  return { data, loading, error, refetch: fetchData, lastUpdated }
}

