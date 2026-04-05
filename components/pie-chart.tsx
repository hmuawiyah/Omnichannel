"use client"

import * as React from "react"
import { LuTrendingUp } from "react-icons/lu"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface PiechartProps {
    className?: string
    data?: any[]
}

const chartConfig = {
    orders: {
        label: "Orders",
    },
    shopee: {
        label: "Shopee",
        color: "var(--chart-1)",
    },
    tokopedia: {
        label: "Tokopedia",
        color: "var(--chart-2)",
    },
    "tiktok shop": {
        label: "Tiktok Shop",
        color: "var(--chart-3)",
    },
    other: {
        label: "Other",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig

export function Piechart({ className, data = [] }: PiechartProps) {
    const { chartData, totalOrders } = React.useMemo(() => {
        if (!data || data.length === 0) return { chartData: [], totalOrders: 0 }

        const channelCounts = data.reduce((acc: Record<string, number>, item: any) => {
            const channel = (item.channel || "Other").toLowerCase()
            acc[channel] = (acc[channel] || 0) + 1
            return acc
        }, {})

        const formattedData = Object.entries(channelCounts).map(([channel, count], index) => ({
            channel,
            orders: count,
            fill: `var(--chart-${(index % 5) + 1})`
        }))

        const total = formattedData.reduce((acc, curr) => acc + (curr.orders as number), 0)

        return { chartData: formattedData, totalOrders: total }
    }, [data])

    return (
        <Card className={cn("flex flex-col h-full", className)}>
            <CardHeader className="items-center pb-0">
                <CardTitle>Orders Channel</CardTitle>
                <CardDescription>All-time distribution by marketplace</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="orders"
                            nameKey="channel"
                            innerRadius={50}
                            strokeWidth={5}
                        >
                            {/* <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 8}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalOrders.toLocaleString("id-ID")}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 16}
                                                    className="fill-muted-foreground"
                                                >
                                                    Orders
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            /> */}
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="channel" />}
                            className="-translate-y-2 flex-wrap gap-4 *:justify-center *:whitespace-nowrap"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm mt-auto">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Total aggregated rows: {data.length.toLocaleString("id-ID")} <LuTrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground text-xs text-center">
                    Snapshot from frontend-engineer-task.csv
                </div>
            </CardFooter>
        </Card>
    )
}
