'use client'
import { useEffect, useState } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = document.cookie.includes('token') || localStorage.getItem('token')
    setIsAuthenticated(token)
  }, [])

  return isAuthenticated
}
