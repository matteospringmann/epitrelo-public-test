import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center border border-gray-100">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4 tracking-tight">Bienvenue sur EpiTrello</h1>
        <p className="text-lg text-gray-600 mb-8">Gérez vos projets facilement, collaborez et organisez vos tâches.</p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow hover:from-purple-700 hover:to-pink-600 transition">
            Se connecter
          </Link>
          <Link to="/register" className="px-6 py-3 rounded-lg border border-purple-500 text-purple-700 font-semibold bg-white hover:bg-purple-50 transition">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  )
}