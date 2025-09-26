import React, { useEffect, useState } from 'react'
import { getMe } from '../lib/api'

export default function Profile() {
  const [user, setUser] = useState(null)
  useEffect(() => { getMe().then(setUser) }, [])
  if (!user) return <div className="p-8">Chargement...</div>
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Mon profil</h1>
        <div className="space-y-2 text-gray-700">
          <div><span className="font-semibold">Nom :</span> {user.name}</div>
          <div><span className="font-semibold">Email :</span> {user.email}</div>
        </div>
      </div>
    </div>
  )
}