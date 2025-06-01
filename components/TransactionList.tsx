"use client"

import type { Transaction } from "./Dashboard"

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      Food: "🍽️",
      Transport: "🚗",
      Entertainment: "🎬",
      Salary: "💰",
      Freelance: "💼",
      Other: "📝",
    }
    return icons[category] || "📝"
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center animate-fade-in">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Start by adding your first income or expense transaction.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction History</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="p-6 transaction-item animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getCategoryIcon(transaction.category)}</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{transaction.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(transaction.date)}</span>
                    <span>•</span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{transaction.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div
                    className={`text-lg font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      transaction.type === "income"
                        ? "text-green-500 dark:text-green-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {transaction.type.toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
                  title="Delete transaction"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
