import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Ferme le menu si clic en dehors
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <nav className="w-full bg-white/90 backdrop-blur shadow flex items-center px-8 py-3">
      {/* Left */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-extrabold text-purple-700 tracking-tight hover:text-pink-600 transition">
          EpiTrello
        </Link>
      </div>
      {/* Center */}
      <div className="flex gap-8 justify-center flex-1">
        <Link to="/" className="text-gray-700 font-medium hover:text-purple-700 transition">Home</Link>
        <Link to="/boards" className="text-gray-700 font-medium hover:text-purple-700 transition">Workspaces</Link>
        <a href="#" className="text-gray-700 font-medium hover:text-purple-700 transition">Get started</a>
        <a href="#" className="text-gray-700 font-medium hover:text-purple-700 transition">Help</a>
      </div>
      {/* Right */}
      <div className="flex-1 flex justify-end">
        <div className="relative" ref={menuRef}>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow hover:from-purple-700 hover:to-pink-600 transition"
            onClick={() => setOpen(v => !v)}
          >
            Account
            <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
              <Link
                to="/login"
                className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-t-xl transition"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-b-xl transition"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}