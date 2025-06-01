"use client"

import { useAuth } from "@/components/AuthProvider"
import AuthPage from "@/components/AuthPage"
import Dashboard from "@/components/Dashboard"

export default function Home() {
  const { user } = useAuth()

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  //     </div>
  //   )
  // }

  return user ? <Dashboard /> : <AuthPage />
}
