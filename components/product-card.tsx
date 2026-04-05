import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from "./ui/card"
import { Badge } from "./ui/badge"
import { LuTrendingUp, LuTrendingDown } from "react-icons/lu"
import { cn } from "@/lib/utils"

export function Productcard({ title, value, badge, netSales, className }: { title: string, value: string, badge: string, netSales: string, className?: string }) {
    const isNegative = badge?.startsWith("-");

    return (
        <Card className={cn("@container/card gap-8", className)}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardAction>
                    <Badge variant={isNegative ? "destructive" : "success"} className="text-xs">
                        {isNegative ? <LuTrendingDown strokeWidth={2} /> : <LuTrendingUp strokeWidth={2} />}
                        {badge}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {value}
                </CardTitle>
                <div className="text-muted-foreground">
                    Total Net Sales <span className="font-semibold">{netSales}</span>
                </div>
            </CardFooter>
        </Card>
    )
}