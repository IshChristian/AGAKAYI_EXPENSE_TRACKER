"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./AuthProvider"
import Header from "./Header"
import AddTransactionForm from "./AddTransactionForm"
import TransactionList from "./TransactionList"
import SummaryCards from "./SummaryCards"
import TransactionChart from "./TransactionChart"
import axios from "axios"
import Cookies from "js-cookie"

export interface Transaction {
  id: string
  title: string
  amount: number
  date: string
  category: string
  type: "income" | "expense"
  userId: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Dashboard() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "date",
    sortOrder: "desc" as "asc" | "desc",
  })

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadTransactions = async () => {
    try {
      const token = Cookies.get("agakayi_token")
      const userId = Cookies.get("agakayi_id")
      if (!token || !userId) return

      const res = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // Map _id to id for frontend compatibility
      const mapped = res.data.map((t: any) => ({
      ...t,
      id: t._id || t.id,
      amount: typeof t.amount === "object" && t.amount.$numberDecimal
        ? Number(t.amount.$numberDecimal)
        : Number(t.amount),
    }))
      setTransactions(mapped)
    } catch (error) {
      setTransactions([])
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, "id" | "userId">) => {
    await loadTransactions()
    setShowAddForm(false)
  }

  const deleteTransaction = async (id: string) => {
    try {
      const token = Cookies.get("agakayi_token")
      if (!token) return

      await axios.delete(`${API_BASE_URL}/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      // handle error if needed
    }
  }

  const filteredTransactions = transactions
    .filter((transaction) => {
      if (filters.category && transaction.category !== filters.category) return false
      if (filters.dateFrom && transaction.date < filters.dateFrom) return false
      if (filters.dateTo && transaction.date > filters.dateTo) return false
      return true
    })
    .sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof Transaction]
      let bValue: any = b[filters.sortBy as keyof Transaction]

      if (filters.sortBy === "amount") {
        aValue = Math.abs(aValue)
        bValue = Math.abs(bValue)
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const exportToCSV = () => {
    const headers = ["Title", "Amount", "Date", "Category", "Type"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) => [t.title, t.amount, t.date, t.category, t.type].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "agakayi-transactions.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <SummaryCards transactions={transactions} />

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Expense Overview</h2>
            <TransactionChart transactions={transactions} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors animate-bounce-in"
            >
              Add Transaction
            </button>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters & Sort</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="title">Title</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortOrder: e.target.value as "asc" | "desc" }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showAddForm && <AddTransactionForm onAdd={addTransaction} onClose={() => setShowAddForm(false)} />}
    </div>
  )
}
