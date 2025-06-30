"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getFeedbackWithSenderInfo, updateFeedbackStatus, deleteFeedback, replyToFeedback } from "@/lib/database/admin-queries"
import type { Database } from "@/lib/supabase/types"
import { Eye, Search, AlertTriangle, MessageCircle, Lightbulb, Trash2, Mail, Ban } from "lucide-react"

type Feedback = Database["public"]["Tables"]["feedback"]["Row"]

interface FeedbackWithSenderInfo extends Feedback {
  connections: { name: string; email: string; subject: string } | null;
}

export function FeedbackTable() {
  const [feedback, setFeedback] = useState<FeedbackWithSenderInfo[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackWithSenderInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackWithSenderInfo | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchFeedback()
  }, [])

  useEffect(() => {
    const filtered = feedback.filter(
      (item) =>
        (item.connections?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (item.connections?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (item.connections?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredFeedback(filtered)
  }, [feedback, searchTerm])

  const fetchFeedback = async () => {
    try {
      const data = await getFeedbackWithSenderInfo()
      setFeedback(data)
    } catch (error) {
      console.error("Error fetching feedback:", error)
      toast({
        title: "Error",
        description: `Failed to load feedback: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "feedback":
        return (
          <Badge variant="default">
            <MessageCircle className="h-3 w-3 mr-1" />
            Feedback
          </Badge>
        )
      case "complaint":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Complaint
          </Badge>
        )
      case "suggestion":
        return (
          <Badge variant="secondary">
            <Lightbulb className="h-3 w-3 mr-1" />
            Suggestion
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "normal":
        return <Badge variant="secondary">Normal</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const handleUpdateStatus = async (id: string, status: 'read' | 'spam' | 'archived') => {
    try {
      const success = await updateFeedbackStatus(id, status)
      if (success) {
        toast({
          title: "Feedback Status Updated",
          description: `Feedback status changed to ${status}.`,
        })
        fetchFeedback()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating feedback status:", error)
      toast({
        title: "Error",
        description: `Failed to update feedback status: ${(error as Error).message}`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteFeedback = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        const success = await deleteFeedback(id)
        if (success) {
          toast({
            title: "Feedback Deleted",
            description: "Feedback has been successfully deleted.",
          })
          fetchFeedback()
        } else {
          throw new Error("Failed to delete feedback")
        }
      } catch (error) {
        console.error("Error deleting feedback:", error)
        toast({
          title: "Error",
          description: `Failed to delete feedback: ${(error as Error).message}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleReply = async () => {
    if (!selectedFeedback || !replyMessage) return

    try {
      const success = await replyToFeedback(selectedFeedback.id, replyMessage)
      if (success) {
        toast({
          title: "Reply Sent",
          description: "Reply has been successfully sent and feedback marked as replied.",
        })
        fetchFeedback()
        setSelectedFeedback(null)
        setReplyMessage("")
      } else {
        throw new Error("Failed to send reply")
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Error",
        description: `Failed to send reply: ${(error as Error).message}`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <Input placeholder="Search feedback..." className="max-w-sm" disabled />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedback.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No feedback found.
                </TableCell>
              </TableRow>
            ) : (
              filteredFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.connections?.name || "N/A"}</TableCell>
                  <TableCell>{item.connections?.email || "N/A"}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.connections?.subject || "No subject"}</TableCell>
                  <TableCell>{getTypeBadge(item.type || "feedback")}</TableCell>
                  <TableCell>{getPriorityBadge(item.priority || "normal")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status || "open"}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(item.created_at), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog onOpenChange={(open) => !open && setSelectedFeedback(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedFeedback(item)
                          setReplyMessage(item.reply_message || "")
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedFeedback?.type === "complaint"
                              ? "Complaint"
                              : selectedFeedback?.type === "suggestion"
                                ? "Suggestion"
                                : "Feedback"}
                          </DialogTitle>
                          <DialogDescription>
                            {selectedFeedback?.connections?.name &&
                              selectedFeedback?.connections?.email &&
                              `${selectedFeedback.connections.name} (${selectedFeedback.connections.email}) • `}
                            {selectedFeedback &&
                              format(new Date(selectedFeedback.created_at), "MMM dd, yyyy 'at' HH:mm")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {selectedFeedback?.connections?.subject && (
                            <div>
                              <h4 className="font-semibold mb-2">Subject:</h4>
                              <p className="text-sm">{selectedFeedback.connections.subject}</p>
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold mb-2">Content:</h4>
                            <p className="text-sm whitespace-pre-wrap">{selectedFeedback?.content}</p>
                          </div>
                          {selectedFeedback?.reply_message && (
                            <div>
                              <h4 className="font-semibold mb-2">Admin Reply:</h4>
                              <p className="text-sm whitespace-pre-wrap">{selectedFeedback.reply_message}</p>
                            </div>
                          )}
                          <div className="flex items-center space-x-4">
                            <div>
                              <span className="text-sm font-medium">Priority: </span>
                              {selectedFeedback && getPriorityBadge(selectedFeedback.priority || "normal")}
                            </div>
                            <div>
                              <span className="text-sm font-medium">Status: </span>
                              <Badge variant="outline">{selectedFeedback?.status || "open"}</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reply-message">Reply to Feedback</Label>
                            <Textarea
                              id="reply-message"
                              placeholder="Type your reply here..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(item.id, 'read')}>
                              Mark as Read
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(item.id, 'spam')}>
                              <Ban className="h-4 w-4 mr-2" />
                              Mark as Spam
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteFeedback(item.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                          <Button onClick={handleReply} disabled={!replyMessage || selectedFeedback?.status === 'replied'}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


