"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import type { Transaction } from "./Dashboard"

interface AddTransactionFormProps {
  onAdd: (transaction: Omit<Transaction, "id" | "userId">) => void
  onClose: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function AddTransactionForm({ onAdd, onClose }: AddTransactionFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Other",
    type: "expense" as "income" | "expense",
    note: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount = Number.parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    const token = Cookies.get("agakayi_token")
    if (!token) {
      alert("You must be logged in to add a transaction.")
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: formData.title,
        amount: amount,
        type: formData.type,
        category: formData.category,
        date: formData.date,
        note: formData.note,
      }

      const res = await axios.post(
        `${API_BASE_URL}/transactions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      onAdd({
        ...payload,
        amount: formData.type === "expense" ? -Math.abs(amount) : Math.abs(amount),
      })

      setFormData({
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "Other",
        type: "expense",
        note: "",
      })
      onClose()
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to add transaction")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Transaction</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "expense" }))}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    formData.type === "expense" ? "bg-red-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    formData.type === "income"
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Grocery, Salary"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="e.g., Bought vegetables"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}