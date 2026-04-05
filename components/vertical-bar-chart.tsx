"use client"

import * as React from "react"
import { LuTrendingUp } from "react-icons/lu"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartConfig = {
    count: {
        label: "Orders",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

interface BarchartProps {
    className?: string
    data?: any[]
}

export function VerticalBarChart({ className, data = [] }: BarchartProps) {
    const chartData = React.useMemo(() => {
        if (!data || data.length === 0) return []

        const counts = data.reduce((acc: Record<string, number>, item: any) => {
            const status = item.order_status || "Unknown"
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {})

        return Object.entries(counts).map(([status, count]) => ({
            status: status.toLowerCase(),
            count,
        }))
    }, [data])

    return (
        <Card className={cn("w-full flex flex-col h-full", className)}>
            <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Real-time data from frontend-engineer-task.csv</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="h-full w-full aspect-auto!">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 12,
                            left: 12,
                            bottom: 12
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="status"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground font-bold"
                                fontSize={12}
                                formatter={(value: any) => value.toLocaleString("id-ID")}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
                <div className="flex gap-2 leading-none font-medium">
                    Total aggregated orders: {data.length.toLocaleString("id-ID")} <LuTrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground text-xs">
                    Aggregated status counts from marketplace data
                </div>
            </CardFooter>
        </Card>
    )
}
