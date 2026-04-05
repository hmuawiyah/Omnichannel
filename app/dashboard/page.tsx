import { AppSidebar } from "@/components/app-sidebar"
import { RevenueChart } from "@/components/revenue-chart"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { Bigstatcard } from "@/components/big-stat-card"
import { Smallstatcard } from "@/components/small-stat-card"
import { VerticalBarChart } from "@/components/vertical-bar-chart"
import { Productcard } from "@/components/product-card"
import { FaGithub } from "react-icons/fa";

import * as fs from "fs"
import * as path from "path"
import Papa from "papaparse"
import { Piechart } from "@/components/pie-chart"
import * as React from "react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const csvPath = path.join(process.cwd(), "public", "frontend-engineer-task.csv")
  const csvFile = fs.readFileSync(csvPath, "utf8")

  const { data: csvData } = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
  })

  const channelStats = (csvData as any[]).reduce((acc: Record<string, number>, row) => {
    const channel = row.channel || "Unknown"
    const netAmount = parseFloat(row.net_amount) || 0
    acc[channel] = (acc[channel] || 0) + netAmount
    return acc
  }, {})

  const sortedChannels = Object.entries(channelStats)
    .map(([name, total]) => ({ name, total: total as number }))
    .sort((a, b) => b.total - a.total)

  const bestChannel = sortedChannels[0] || { name: "N/A", total: 0 }
  const lowestChannel = sortedChannels[sortedChannels.length - 1] || { name: "N/A", total: 0 }

  const totalNetRevenue = sortedChannels.reduce((acc, curr) => acc + curr.total, 0)
  const totalGrossRevenue = (csvData as any[]).reduce((acc, row) => acc + (parseFloat(row.gross_amount) || 0), 0)
  const totalItemsSold = (csvData as any[]).reduce((acc, row) => acc + (parseInt(row.item_count) || 0), 0)
  const totalCancelled = (csvData as any[]).filter(row => row.order_status === "CANCELLED").length
  const cancelRate = csvData.length > 0 ? (totalCancelled / csvData.length) * 100 : 0
  const avgOrderValue = csvData.length > 0 ? totalNetRevenue / csvData.length : 0
  const totalMarketplaceFee = totalGrossRevenue - totalNetRevenue

  // Sparkline calculations
  const dailyMetrics = (csvData as any[]).reduce((acc: Record<string, { revenue: number, cancels: number }>, row) => {
    const date = row.create_time?.split(" ")[0]
    if (!date) return acc
    if (!acc[date]) acc[date] = { revenue: 0, cancels: 0 }
    acc[date].revenue += parseFloat(row.net_amount) || 0
    if (row.order_status === "CANCELLED") acc[date].cancels += 1
    return acc
  }, {})

  const sortedDates = Object.keys(dailyMetrics).sort()
  const last7Days = sortedDates.slice(-7)
  const revenueTrend = last7Days.map(date => ({ value: dailyMetrics[date].revenue }))
  const cancelTrend = last7Days.map(date => ({ value: dailyMetrics[date].cancels }))

  const formatMiliar = (val: number) => {
    if (val >= 1000000000) return `Rp${(val / 1000000000).toFixed(1)} Miliar`
    if (val >= 1000000) return `Rp${(val / 1000000).toFixed(1)} Juta`
    return `Rp${Math.round(val).toLocaleString("id-ID")}`
  }

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `Rp${(val / 1000000).toFixed(1)} Juta`
    return `Rp${Math.round(val).toLocaleString("id-ID")}`
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              <div className="grid grid-cols-1 gap-4 px-2 lg:px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <div className="grid grid-cols-2 gap-4 p-2 lg:p-4 @xl/main:grid-cols-2 col-span-2 bg-gray-200 rounded-lg">
                  <Bigstatcard
                    title="Total Revenue"
                    value={formatMiliar(totalNetRevenue)}
                    badge="-12.5%"
                    chartData={revenueTrend}
                    description="Net revenue trend (7d)"
                  />
                  <Smallstatcard title="Marketplace fee" value={formatMiliar(totalMarketplaceFee)} />
                  <Smallstatcard title="Total Orders" value={csvData.length.toLocaleString("id-ID")} />
                </div>
                <div className="grid grid-cols-2 gap-4 p-2 lg:p-4 @xl/main:grid-cols-2 col-span-2 bg-gray-200 rounded-lg">
                  <Bigstatcard
                    title="Cancel Rate"
                    value={`${cancelRate.toFixed(1)}%`}
                    badge="+0.2%"
                    chartData={cancelTrend}
                    description="Cancellation trend (7d)"
                    isLowerBetter
                  />
                  <Smallstatcard title="Average Order Value" value={formatCurrency(avgOrderValue)} />
                  <Smallstatcard title="Items Sold" value={totalItemsSold.toLocaleString("id-ID")} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-4 @5xl/main:grid-cols-12">
                <RevenueChart data={csvData} className="col-span-8" />
                <Piechart data={csvData} className="col-span-4" />
              </div>

              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-4 @5xl/main:grid-cols-12">
                <VerticalBarChart data={csvData} className="col-span-8 h-full" />
                <div className="flex flex-col gap-4 col-span-4">
                  <Productcard
                    title="Best Channel"
                    value={bestChannel.name}
                    badge="+15.2%"
                    netSales={formatCurrency(bestChannel.total)}
                    className=""
                  />
                  <Productcard
                    title="Lowest Performance Channel"
                    value={lowestChannel.name}
                    badge="-5.4%"
                    netSales={formatCurrency(lowestChannel.total)}
                    className=""
                  />
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <DataTable data={csvData} />
              </div>

              <footer className="px-4 lg:px-6">
                <p className="text-center text-sm text-muted-foreground">
                  <a href="https://github.com/hmuawiyah16"
                    target="_blank"
                    className="flex items-center gap-2 justify-center">
                    <Button variant="link">
                      <FaGithub /> Created by hmuawiyah16
                    </Button>
                  </a>
                </p>
              </footer>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
