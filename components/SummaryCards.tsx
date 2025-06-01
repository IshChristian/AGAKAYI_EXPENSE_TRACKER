"use client"

import type { Transaction } from "./Dashboard"

interface SummaryCardsProps {
  transactions: Transaction[]
}

export default function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const balance = totalIncome - totalExpenses

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white animate-bounce-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total Income</p>
            <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white animate-bounce-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Total Expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-red-400 bg-opacity-30 rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className={`bg-gradient-to-r ${balance >= 0 ? "from-blue-500 to-blue-600" : "from-orange-500 to-orange-600"} rounded-xl shadow-lg p-6 text-white animate-bounce-in`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Current Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
          </div>
          <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
