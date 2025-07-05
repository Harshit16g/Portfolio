
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getFeedbackWithSenderInfo, updateFeedbackStatus, deleteFeedback, replyToFeedback } from "@/lib/database/admin-queries";
import { Eye, Search, AlertTriangle, MessageCircle, Lightbulb, Trash2, Mail } from "lucide-react";

// Feedback type definitions
interface Feedback {
  id: string;
  type: string;
  created_at: string;
  status: 'read' | 'unread' | 'replied';
  reply_message?: string;
  name?: string;
  email?: string;
  subject?: string;
  content: string;
  priority?: string;
}

interface FeedbackWithSenderInfo extends Feedback {
  connections: { name: string; email: string; subject: string; status: 'read' | 'unread' | 'replied' } | null;
}

export function FeedbackTable() {
  const [feedback, setFeedback] = useState<FeedbackWithSenderInfo[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackWithSenderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackWithSenderInfo | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    const filtered = feedback.filter(
      (item) =>
        (item.connections?.name || item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.connections?.email || item.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.connections?.subject || item.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFeedback(filtered);
  }, [feedback, searchTerm]);

  const fetchFeedback = async () => {
    try {
      const data = await getFeedbackWithSenderInfo();
      setFeedback(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load feedback: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "feedback":
        return (
          <Badge variant="default">
            <MessageCircle className="h-3 w-3 mr-1" />
            Feedback
          </Badge>
        );
      case "complaint":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Complaint
          </Badge>
        );
      case "suggestion":
        return (
          <Badge variant="secondary">
            <Lightbulb className="h-3 w-3 mr-1" />
            Suggestion
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "normal":
        return <Badge variant="secondary">Normal</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleUpdateStatus = async (id: string, status: 'read' | 'unread' | 'replied') => {
    try {
      await updateFeedbackStatus(id, status);
      toast({
        title: "Feedback Status Updated",
        description: `Feedback status changed to ${status}.`,
      });
      await fetchFeedback();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update feedback status: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      await deleteFeedback(id);
      toast({
        title: "Feedback Deleted",
        description: "Feedback has been successfully deleted.",
      });
      await fetchFeedback();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete feedback: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleReply = async () => {
    if (!selectedFeedback || !replyMessage) return;

    try {
      await replyToFeedback(selectedFeedback.id, replyMessage);
      toast({
        title: "Reply Sent",
        description: "Reply has been successfully sent and feedback marked as replied.",
      });
      await fetchFeedback();
      setSelectedFeedback(null);
      setReplyMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to send reply: ${error.message}`,
        variant: "destructive",
      });
    }
  };

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
    );
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
                  <TableCell className="font-medium">{item.connections?.name || item.name || "N/A"}</TableCell>
                  <TableCell>{item.connections?.email || item.email || "N/A"}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.connections?.subject || item.subject || "No subject"}</TableCell>
                  <TableCell>{getTypeBadge(item.type || "feedback")}</TableCell>
                  <TableCell>{getPriorityBadge(item.priority || "normal")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(item.created_at), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog onOpenChange={(open) => !open && setSelectedFeedback(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedFeedback(item);
                          setReplyMessage(item.reply_message || "");
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {item.type === "complaint" ? "Complaint" : item.type === "suggestion" ? "Suggestion" : "Feedback"}
                          </DialogTitle>
                          <DialogDescription>
                            {(item.connections?.name || item.name) && (item.connections?.email || item.email)
                              ? `${item.connections?.name || item.name} (${item.connections?.email || item.email}) • `
                              : ""}
                            {format(new Date(item.created_at), "MMM dd, yyyy 'at' HH:mm")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {(item.connections?.subject || item.subject) && (
                            <div>
                              <h4 className="font-semibold mb-2">Subject:</h4>
                              <p className="text-sm">{item.connections?.subject || item.subject}</p>
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold mb-2">Content:</h4>
                            <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                          </div>
                          {item.reply_message && (
                            <div>
                              <h4 className="font-semibold mb-2">Admin Reply:</h4>
                              <p className="text-sm whitespace-pre-wrap">{item.reply_message}</p>
                            </div>
                          )}
                          <div className="flex items-center space-x-4">
                            <div>
                              <span className="text-sm font-medium">Priority: </span>
                              {getPriorityBadge(item.priority || "normal")}
                            </div>
                            <div>
                              <span className="text-sm font-medium">Status: </span>
                              <Badge variant="outline">{item.status}</Badge>
                            </div>
                            {item.connections?.status && (
                              <div>
                                <span className="text-sm font-medium">Connection Status: </span>
                                <Badge variant="outline">{item.connections.status}</Badge>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">Reply to Feedback</h4>
                            <Textarea
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
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(item.id, 'unread')}>
                              Mark as Unread
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteFeedback(item.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                          <Button onClick={handleReply} disabled={!replyMessage}>
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
  );
}
