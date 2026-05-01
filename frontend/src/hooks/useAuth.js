import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Load user info
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const login = (user, token) => {
    localStorage.setItem('auth_token', token)
    setUser({ ...user, token })
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return { user, loading, login, logout, isAuthenticated: !!user }
}
