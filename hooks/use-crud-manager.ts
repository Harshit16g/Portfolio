"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface UseCrudManagerOptions<T> {
  fetchData: () => Promise<T[]>
  searchFilter: (items: T[], searchTerm: string) => T[]
  initialFormData: any
}

export function useCrudManager<T extends Record<string, any>>({
  fetchData,
  searchFilter,
  initialFormData,
}: UseCrudManagerOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [filteredItems, setFilteredItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const { toast } = useToast()

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchData()
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [fetchData, toast])

  // Initial load
  useEffect(() => {
    loadData()
  }, [loadData])

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items)
    } else {
      const filtered = searchFilter(items, searchTerm.toLowerCase())
      setFilteredItems(filtered)
    }
  }, [items, searchTerm, searchFilter])

  // Dialog handlers
  const openCreateDialog = () => {
    setFormData(initialFormData)
    setSelectedItem(null)
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (item: T) => {
    setSelectedItem(item)
    setFormData({ ...item })
    setIsEditDialogOpen(true)
  }

  const closeDialogs = () => {
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
    setSelectedItem(null)
    setFormData(initialFormData)
  }

  // CRUD operations (to be implemented by specific components)
  const handleCreate = () => {
    toast({
      title: "Coming Soon",
      description: "Create functionality will be implemented soon.",
    })
    closeDialogs()
  }

  const handleUpdate = () => {
    toast({
      title: "Coming Soon", 
      description: "Update functionality will be implemented soon.",
    })
    closeDialogs()
  }

  const handleDelete = (item: T) => {
    toast({
      title: "Coming Soon",
      description: "Delete functionality will be implemented soon.",
    })
  }

  return {
    // State
    items,
    filteredItems,
    loading,
    searchTerm,
    selectedItem,
    isCreateDialogOpen,
    isEditDialogOpen,
    formData,
    
    // Actions
    setSearchTerm,
    setFormData,
    openCreateDialog,
    openEditDialog,
    closeDialogs,
    handleCreate,
    handleUpdate,
    handleDelete,
    loadData,
  }
}