import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login () {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(null)
  const nav=useNavigate()
  const onSubmit=async e=>{ e.preventDefault(); setErr(null)
    try{ await api.post('/auth/login',{email,password}); nav('/') }
    catch(e){ setErr(e.response?.data?.error||'Login failed') }}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form onSubmit={onSubmit} className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-2 tracking-tight">EpiTrello</h1>
        <p className="text-center text-gray-500 mb-4">Sign in to your account</p>
        {err && <div className="text-red-600 text-sm text-center">{err}</div>}
        <input
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 font-semibold shadow hover:from-purple-700 hover:to-pink-600 transition">
          Sign in
        </button>
        <div className="text-sm text-center text-gray-600">
          No account?{' '}
          <Link to="/register" className="underline text-purple-700 hover:text-pink-600 font-medium">
            Create one
          </Link>
        </div>
      </form>
    </div>
  )
}