"use client"

import { Area, AreaChart } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
    value: {
        label: "Value",
    },
} satisfies ChartConfig

interface MiniAreaChartProps {
    data?: any[]
    isNegative?: boolean
}

export function MiniAreaChart({ data = [], isNegative = false }: MiniAreaChartProps) {
    const chartColor = isNegative ? "var(--destructive)" : "var(--chart-1)"
    const gradientId = `fill-${isNegative ? "negative" : "positive"}`

    return (
        <ChartContainer config={chartConfig} className="w-35 h-10">
            <AreaChart
                data={data}
                margin={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor={chartColor}
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor={chartColor}
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="value"
                    type="natural"
                    fill={`url(#${gradientId})`}
                    fillOpacity={0.4}
                    stroke={chartColor}
                    strokeWidth={2}
                />
            </AreaChart>
        </ChartContainer>
    )
}
