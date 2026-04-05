import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LuTrendingUp } from "react-icons/lu"

export function Smallstatcard({ title, value }: { title: string, value: string }) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {value}
                </CardTitle>
            </CardFooter>
        </Card>
    )
}