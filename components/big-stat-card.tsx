import { LuTrendingUp, LuTrendingDown } from "react-icons/lu"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MiniAreaChart } from "./mini-area-chart"
import { cn } from "@/lib/utils"

export function Bigstatcard({
    title,
    value,
    badge,
    chartData = [],
    description = "Trending vs last month",
    isLowerBetter = false
}: {
    title: string,
    value: string,
    badge?: string,
    chartData?: any[],
    description?: string,
    isLowerBetter?: boolean
}) {
    const isNegative = badge?.startsWith("-");
    // If lower is better (like cancel rate), then a negative trend is good (success)
    const badgeVariant = isLowerBetter
        ? (isNegative ? "success" : "destructive")
        : (isNegative ? "destructive" : "success");

    return (
        <Card className="@container/card col-span-2 flex flex-col justify-between" >
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardAction>
                    <Badge variant={badgeVariant} className="text-xs">
                        {isNegative ? <LuTrendingDown strokeWidth={2} /> : <LuTrendingUp strokeWidth={2} />}
                        {badge}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex justify-between items-end gap-x-4">
                <div className="flex-col items-start gap-1">
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mb-1 flex items-baseline gap-1">
                        {value}
                    </CardTitle>
                    <div className={cn(
                        "line-clamp-1 flex gap-2 font-semibold text-xs",
                        badgeVariant === "success" ? "text-emerald-600" : "text-rose-600"
                    )}>
                        {isNegative ? "Trending down" : "Trending up"}
                        {isNegative ? <LuTrendingDown strokeWidth={2} className="size-3" /> : <LuTrendingUp strokeWidth={2} className="size-3" />}
                    </div>
                    <div className="text-muted-foreground text-[10px]">
                        {description}
                    </div>
                </div>
                <div className="flex flex-1 w-40 justify-end">
                    <MiniAreaChart data={chartData} isNegative={badgeVariant === "destructive"} />
                </div>
            </CardFooter>
        </Card>
    )
}