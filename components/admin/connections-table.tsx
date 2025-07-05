
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
} from "@/components/ui/dialog";
import { Eye, Search, Mail, CheckCircle, Clock, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConnections } from "@/hooks/use-portfolio-data";
import { updateConnectionStatus, deleteConnection } from "@/lib/database/queries";

type Connection = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "read" | "unread" | "replied";
  created_at: string;
};

export function ConnectionsTable() {
  const { data: connections, loading, error, refetch } = useConnections();
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setFilteredConnections(
      connections.filter(
        (connection) =>
          connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          connection.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          connection.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [connections, searchTerm]);

  const handleStatusUpdate = async (id: string, status: "read" | "unread" | "replied") => {
    try {
      const success = await updateConnectionStatus(id, status);
      if (success) {
        toast({
          title: "Status updated",
          description: `Connection marked as ${status}.`,
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to update status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteConnection(id);
      if (success) {
        toast({
          title: "Connection deleted",
          description: "Connection removed successfully.",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete connection.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete connection.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Unread
          </Badge>
        );
      case "read":
        return (
          <Badge variant="outline">
            <Eye className="h-3 w-3 mr-1" />
            Read
          </Badge>
        );
      case "replied":
        return (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Replied
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <Input placeholder="Search connections..." className="max-w-sm" disabled />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" aria-live="polite">
        <p className="text-red-500">{error}</p>
        <Button onClick={refetch} className="mt-4" aria-label="Retry loading connections">
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Search connections..."
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
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConnections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No connections found.
                </TableCell>
              </TableRow>
            ) : (
              filteredConnections.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="font-medium">{connection.name || "N/A"}</TableCell>
                  <TableCell>{connection.email || "N/A"}</TableCell>
                  <TableCell className="max-w-xs truncate">{connection.subject || "No subject"}</TableCell>
                  <TableCell>{getStatusBadge(connection.status || "unread")}</TableCell>
                  <TableCell>{format(new Date(connection.created_at), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedConnection(connection);
                              if (connection.status === "unread") {
                                handleStatusUpdate(connection.id, "read");
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Message from {selectedConnection?.name}</DialogTitle>
                            <DialogDescription>
                              {selectedConnection?.email} •{" "}
                              {selectedConnection &&
                                format(new Date(selectedConnection.created_at), "MMM dd, yyyy 'at' HH:mm")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Subject:</h4>
                              <p className="text-sm">{selectedConnection?.subject}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Message:</h4>
                              <p className="text-sm whitespace-pre-wrap">{selectedConnection?.message}</p>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button
                                onClick={() =>
                                  selectedConnection && handleStatusUpdate(selectedConnection.id, "replied")
                                }
                                className="flex items-center"
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Mark as Replied
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => selectedConnection && handleDelete(selectedConnection.id)}
                                className="flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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

