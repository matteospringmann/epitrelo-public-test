import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../lib/api'

export default function Protected ({ children }) {
  const [loading, setLoading] = useState(true)
  const [ok, setOk] = useState(false)
  const nav = useNavigate()
  useEffect(() => {
    (async () => {
      const u = await getMe()
      if (u) setOk(true)
      else nav('/login')
      setLoading(false)
    })()
  }, [])
  if (loading) return <div className="p-8">Loading...</div>
  if (!ok) return null
  return <>{children}</>
}