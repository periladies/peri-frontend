import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

// Initialize Supabase (replace with YOUR values)
const SUPABASE_URL = 'https://bzdgbyzqfclmwpazrywl.supabase.co'  // From Supabase Settings
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZGdieXpxZmNsbXdwYXpyeXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NDY5NzYsImV4cCI6MjA5NDAyMjk3Nn0.1PGyLI67gbeq-n-fXAYegRYZfVZwRcG3ZDQeysMydJE'      // From Supabase API keys
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  // Check if user already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data?.session?.user || null)
    }
    checkUser()

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => data?.subscription?.unsubscribe()
  }, [])

  // Handle signup
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      alert('Check your email for verification!')
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>✨ Peri</h1>
          <p>Perimenopause wellness for women</p>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
            </button>
          </form>

          <p>
            {isSignUp ? 'Already have account? ' : 'No account? '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="link-btn"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>✨ Peri</h1>
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </nav>
      <div className="main">
        <p>🎉 You're logged in! Dashboard coming soon...</p>
      </div>
    </div>
  )
}