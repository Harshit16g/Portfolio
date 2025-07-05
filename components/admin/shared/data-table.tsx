"use client"

import { useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  title: string
  description: string
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  searchTerm: string
  onSearchChange: (term: string) => void
  onAdd?: () => void
  addButtonText?: string
  renderActions?: (item: T) => ReactNode
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  loading = false,
  searchTerm,
  onSearchChange,
  onAdd,
  addButtonText = "Add Item",
  renderActions,
}: DataTableProps<T>) {
  const getCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item)
    }
    
    if (typeof column.key === 'string' && column.key.includes('.')) {
      // Handle nested properties like 'user.name'
      const keys = column.key.split('.')
      let value = item
      
      try {
        for (const key of keys) {
          if (value === null || value === undefined) {
            return ""
          }
          value = value?.[key]
        }
        return value ?? ""
      } catch (error) {
        console.error(`Error accessing nested property '${column.key}':`, error)
        return ""
      }
    }
    
    return item[column.key as keyof T] ?? ""
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        {onAdd && (
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {addButtonText}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>
                  {column.header}
                </TableHead>
              ))}
              {renderActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No {title.toLowerCase()} found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {data.map((item, index) => (
                  <motion.tr
                    key={item.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b"
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {getCellValue(item, column)}
                      </TableCell>
                    ))}
                    {renderActions && (
                      <TableCell>
                        {renderActions(item)}
                      </TableCell>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}