import { useEffect, useState } from 'react'
import { authService } from '../services/apiService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const syncAuthenticatedUser = async () => {
      const token = localStorage.getItem('auth_token')

      if (!token) {
        if (isMounted) {
          setLoading(false)
        }
        return
      }

      try {
        const response = await authService.getMe()

        if (isMounted) {
          setUser({
            ...response.data.data,
            token,
          })
        }
      } catch (error) {
        localStorage.removeItem('auth_token')

        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    const handleUnauthorizedLogout = () => {
      localStorage.removeItem('auth_token')

      if (isMounted) {
        setUser(null)
      }
    }

    window.addEventListener('auth:logout', handleUnauthorizedLogout)
    syncAuthenticatedUser()

    return () => {
      isMounted = false
      window.removeEventListener('auth:logout', handleUnauthorizedLogout)
    }
  }, [])

  const login = (authenticatedUser, token) => {
    localStorage.setItem('auth_token', token)
    setUser({ ...authenticatedUser, token })
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return { user, loading, login, logout, isAuthenticated: !!user }
}
