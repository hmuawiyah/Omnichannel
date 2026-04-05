"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { LuTrendingUp, LuTrendingDown } from "react-icons/lu"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { cn } from "@/lib/utils"

const chartConfig = {
  gross: {
    label: "Gross Revenue",
    color: "var(--chart-1)",
  },
  net: {
    label: "Net Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  className?: string
  data?: any[]
}

export function RevenueChart({ className, data = [] }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const { chartData, latestDate } = React.useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], latestDate: new Date() }

    const dailyStats = data.reduce((acc: Record<string, { gross: number, net: number }>, item: any) => {
      const dateStr = item.create_time?.split(" ")[0]
      if (!dateStr) return acc

      const gross = parseFloat(item.gross_amount) || 0
      const net = parseFloat(item.net_amount) || 0

      if (!acc[dateStr]) {
        acc[dateStr] = { gross: 0, net: 0 }
      }
      acc[dateStr].gross += gross
      acc[dateStr].net += net
      return acc
    }, {})

    const sortedData = Object.entries(dailyStats)
      .map(([date, values]) => ({
        date,
        gross: values.gross,
        net: values.net
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const lastDate = sortedData.length > 0 ? new Date(sortedData[sortedData.length - 1].date) : new Date()

    return { chartData: sortedData, latestDate: lastDate }
  }, [data])

  const filteredData = React.useMemo(() => {
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(latestDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [chartData, latestDate, timeRange])

  const summary = React.useMemo(() => {
    if (filteredData.length < 2) return null

    const half = Math.floor(filteredData.length / 2)
    const firstHalf = filteredData.slice(0, half)
    const secondHalf = filteredData.slice(half)

    const firstTotal = firstHalf.reduce((acc, curr) => acc + curr.net, 0)
    const secondTotal = secondHalf.reduce((acc, curr) => acc + curr.net, 0)

    if (firstTotal === 0) return { percentage: 0, isUp: true, period: timeRange }

    const percentage = ((secondTotal - firstTotal) / firstTotal) * 100
    return {
      percentage: Math.abs(percentage).toFixed(1),
      isUp: percentage >= 0,
      period: timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "3 months"
    }
  }, [filteredData, timeRange])

  return (
    <Card className={cn("@container/card", className)}>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>
          Daily gross vs net revenue tracking
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(val) => val && setTimeRange(val)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillGross" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gross)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gross)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-net)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-net)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="gross"
              type="monotone"
              fill="url(#fillGross)"
              stroke="var(--color-gross)"
              strokeWidth={2}
            />
            <Area
              dataKey="net"
              type="monotone"
              fill="url(#fillNet)"
              stroke="var(--color-net)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {summary && (
        <CardFooter className="flex-col items-start gap-2 text-sm pt-0 sm:px-6">
          <div className="flex gap-2 font-medium leading-none">
            {summary.isUp ? (
              <>
                Trending up by {summary.percentage}% in the last {summary.period}{" "}
                <LuTrendingUp className="h-4 w-4 text-emerald-500" />
              </>
            ) : (
              <>
                Trending down by {summary.percentage}% in the last {summary.period}{" "}
                <LuTrendingDown className="h-4 w-4 text-rose-500" />
              </>
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            {summary.isUp
              ? `Revenue showed a healthy positive trend during this period.`
              : `Revenue decreased compared to the start of the period.`}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
