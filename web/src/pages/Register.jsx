import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Register () {
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const [err,setErr]=useState(null); const nav=useNavigate()
  const onSubmit=async e=>{ e.preventDefault(); setErr(null)
    try{ await api.post('/auth/register',{name,email,password}); nav('/') }
    catch(e){ setErr(e.response?.data?.error||'Registration failed') }}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form onSubmit={onSubmit} className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-2 tracking-tight">Create account</h1>
        <p className="text-center text-gray-500 mb-4">Sign up to get started</p>
        {err && <div className="text-red-600 text-sm text-center">{err}</div>}
        <input
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          placeholder="Name"
          value={name}
          onChange={e=>setName(e.target.value)}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <button className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 font-semibold shadow hover:from-purple-700 hover:to-pink-600 transition">
          Create account
        </button>
        <div className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="underline text-purple-700 hover:text-pink-600 font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}