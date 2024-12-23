import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Column<T> {
  header: string
  accessorKey: keyof T
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit: (item: T) => void
  onDelete: (item: T) => void
}

export function DataTable<T extends { id: number | string }>({ 
  data, 
  columns, 
  onEdit, 
  onDelete 
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessorKey as string}>{column.header}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={column.accessorKey as string}>
                {String(item[column.accessorKey])}
              </TableCell>
            ))}
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="mr-2">
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(item)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

