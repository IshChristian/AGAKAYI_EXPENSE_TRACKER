"use client"

import type { Transaction } from "./Dashboard"
import { useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingDown, PieChartIcon, BarChart3 } from "lucide-react"

interface TransactionChartProps {
  transactions: Transaction[]
}

export default function TransactionChart({ transactions }: TransactionChartProps) {
  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {}

    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        const amount = Math.abs(transaction.amount)
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + amount
      }
    })

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        fill: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb",
    "#dda0dd",
    "#98fb98",
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">{`${label || payload[0].payload.category}`}</p>
          <p className="text-primary">{`Amount: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-muted-foreground text-sm">{`${payload[0].payload.percentage?.toFixed(1)}% of total`}</p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">{payload[0].payload.category}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
          <p className="text-muted-foreground text-sm">{`${payload[0].payload.percentage.toFixed(1)}%`}</p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <TrendingDown className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Expense Data</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Start adding some expense transactions to see your spending breakdown here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Expense Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pie" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Pie Chart
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Bar Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pie" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="amount"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="bar" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} className="hover:opacity-80 transition-opacity">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {chartData.slice(0, 3).map((item, index) => (
            <Card key={item.category} className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundColor: colors[index % colors.length] }} />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.category}</p>
                    <p className="text-2xl font-bold">{formatCurrency(item.amount)}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className="w-3 h-3 rounded-full mb-1"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <p className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
