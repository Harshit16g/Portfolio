import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AdminAuthContextType {
  isAuthenticated: boolean
  loading: boolean
  login: (password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", { credentials: "include" })
        setIsAuthenticated(response.ok)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      })
      if (response.ok) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    setIsAuthenticated(false)
    router.push("/admin")
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider")
  }
  return context
}