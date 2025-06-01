"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import Cookies from "js-cookie"

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = Cookies.get("agakayi_token")
    const email = Cookies.get("agakayi_email")
    const userData = localStorage.getItem("agakayi_user")
    if (token && email && userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
      if (res.data && res.data.token && res.data.user) {
        Cookies.set("agakayi_token", res.data.token)
        Cookies.set("agakayi_email", res.data.user.email)
        Cookies.set("agakayi_id", res.data.user.id)
        setUser(res.data.user)
        localStorage.setItem("agakayi_user", JSON.stringify(res.data.user))
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password })
      if (res.data && res.data.token && res.data.user) {
        Cookies.set("agakayi_token", res.data.token)
        Cookies.set("agakayi_email", res.data.user.email)
        Cookies.set("agakayi_id", res.data.user.id)

        setUser(res.data.user)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove("agakayi_token")
    Cookies.remove("agakayi_email")
    Cookies.remove("agakayi_id")
    localStorage.removeItem("agakayi_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
