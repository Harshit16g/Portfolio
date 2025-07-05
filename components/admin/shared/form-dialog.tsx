"use client"

import { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  onSave: () => void
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  loading?: boolean
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  loading = false,
}: FormDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {children}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onSave}
            disabled={loading}
          >
            {loading ? "Saving..." : saveText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}