"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  loading: boolean
  error: string | null
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

const ADMIN_PASSWORD ="Amplify1601$"
NEXT_PUBLIC_ADMIN_PASSWORD
const SESSION_DURATION = 60 * 60 * 1000
const AUTH_KEY = "portfolio_admin_auth"

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  return ctx
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) {
      try {
        const { authenticated, timestamp } = JSON.parse(raw)
        if (authenticated && Date.now() - timestamp < SESSION_DURATION) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem(AUTH_KEY)
        }
      } catch {
        localStorage.removeItem(AUTH_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ authenticated: true, timestamp: Date.now() })
      )
      setError(null)
      return true
    }
    setError("Invalid password")
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem(AUTH_KEY)
  }

  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => {
      const raw = localStorage.getItem(AUTH_KEY)
      if (!raw) return logout()
      try {
        const { timestamp } = JSON.parse(raw)
        if (Date.now() - timestamp >= SESSION_DURATION) logout()
      } catch {
        logout()
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, error }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
