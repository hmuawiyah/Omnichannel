"use client"

import * as React from "react"
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LuSettings, LuPencil, LuTrash2, LuArrowUpDown, LuChevronDown, LuChevronUp, LuSearch } from "react-icons/lu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn("h-8 hover:bg-transparent p-0 font-semibold text-foreground h-auto", className)}
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? (
        <LuChevronDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <LuChevronUp className="ml-2 h-4 w-4" />
      ) : (
        <LuArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/30" />
      )}
    </Button>
  )
}

const formatIDR = (value: any) => {
  const amount = parseFloat(value) || 0
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

interface DataTableProps<TData> {
  data: TData[]
}

export function DataTable<TData>({ data }: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const uniqueValues = React.useMemo(() => ({
    channels: Array.from(new Set(data.map((item: any) => item.channel))).filter(Boolean),
    statuses: Array.from(new Set(data.map((item: any) => item.order_status))).filter(Boolean)
  }), [data])

  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    { accessorKey: "order_id", header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" /> },
    { accessorKey: "buyer_user_id", header: ({ column }) => <DataTableColumnHeader column={column} title="Buyer User ID" /> },
    {
      accessorKey: "channel",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Channel" />,
      cell: ({ row }) => {
        const channel = row.getValue("channel") as string
        const config: Record<string, string> = {
          "Shopee": "bg-[#EE4D2D]/10 text-[#EE4D2D] hover:bg-[#EE4D2D]/20 border-[#EE4D2D]/20",
          "Tokopedia": "bg-[#03AC0E]/10 text-[#03AC0E] hover:bg-[#03AC0E]/20 border-[#03AC0E]/20",
          "Tiktok Shop": "bg-zinc-900/10 text-zinc-900 hover:bg-zinc-900/20 border-zinc-900/20",
        }
        return (
          <Badge variant="outline" className={cn("font-semibold rounded-md transition-colors", config[channel] || "bg-muted text-muted-foreground")}>
            {channel}
          </Badge>
        )
      }
    },
    {
      accessorKey: "order_status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("order_status") as string
        const statusConfig: Record<string, { variant: any, className?: string }> = {
          "COMPLETED": { variant: "success" },
          "CANCELLED": { variant: "destructive" },
          "SHIPPED": { variant: "secondary", className: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" },
          "PROCESSED": { variant: "outline", className: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200" },
          "TO_CONFIRM_RECEIVE": { variant: "outline", className: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200" },
          "TO_RETURN": { variant: "destructive", className: "bg-red-200 text-red-900 hover:bg-red-300 border-red-300" },
        }
        const current = statusConfig[status] || { variant: "outline" }
        return (
          <Badge
            variant={current.variant}
            className={cn("px-2 py-0.5 text-[0.625rem]", current.className)}
          >
            {status.replace(/_/g, ' ')}
          </Badge>
        )
      }
    },
    { accessorKey: "pay_time", header: ({ column }) => <DataTableColumnHeader column={column} title="Pay Time" /> },
    {
      accessorKey: "gross_amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Gross Amount" />,
      cell: ({ row }) => formatIDR(row.getValue("gross_amount"))
    },
    {
      accessorKey: "net_amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Net Amount" />,
      cell: ({ row }) => formatIDR(row.getValue("net_amount"))
    },
    { accessorKey: "item_count", header: ({ column }) => <DataTableColumnHeader column={column} title="Items" /> },
    {
      id: "actions",
      size: 80,
      header: () => <LuSettings className="size-4 mx-auto" />,
      cell: () => (
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="icon" className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <LuPencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50">
            <LuTrash2 className="size-4" />
          </Button>
        </div>
      )
    }
  ], [])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => {
      const search = filterValue.toLowerCase()
      return ["order_id", "buyer_user_id"].some(key => String(row.getValue(key)).toLowerCase().includes(search))
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 20 } }
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <LuSearch className="absolute left-2.5 top-3.25 h-4 w-4 text-muted-foreground/50" />
          <Input
            placeholder="Search Order ID or Buyer ID..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-white placeholder:text-muted-foreground/50 h-10"
          />
        </div>

        {["channel", "order_status"].map(key => (
          <Select
            key={key}
            value={(table.getColumn(key)?.getFilterValue() as string) ?? "all"}
            onValueChange={(val) => table.getColumn(key)?.setFilterValue(val === "all" ? undefined : val)}
          >
            <SelectTrigger className="w-[180px] bg-white capitalize">
              <SelectValue placeholder={`All ${key.split('_').pop()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {key.split('_').pop()}</SelectItem>
              {(key === "channel" ? uniqueValues.channels : uniqueValues.statuses).map(val => (
                <SelectItem key={val} value={val}>{val}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap px-6"
                      style={{ width: header.id === "actions" ? "80px" : "auto" }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex flex-1 items-center space-x-2 text-sm text-muted-foreground">
          <span>Page</span>
          <Input
            className="h-8 w-16 px-1 text-center bg-white"
            type="number"
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => table.setPageIndex(e.target.value ? Number(e.target.value) - 1 : 0)}
            min={1}
            max={table.getPageCount()}
          />
          <span>of {table.getPageCount()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="lg" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="bg-white px-6">
            Previous
          </Button>
          <Button variant="outline" size="lg" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="bg-white px-6">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
