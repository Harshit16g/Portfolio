"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectsTable } from "./projects-table";
import { FeedbackTable } from "./feedback-table";
import { ConnectionsTable } from "./connections-table";
import { ReviewsTable } from "./reviews-table";
import { AdminLogin } from "./admin-login";
import { useAdminAuth, AdminAuthProvider } from "@/lib/auth/admin-auth";
import { MessageSquare, Star, MessageCircle, BarChart3, LogOut, Shield, Activity, Clock, User } from "lucide-react";

// Placeholder for ConnectionsTable and ReviewsTable if not implemented
const PlaceholderTable = ({ title }: { title: string }) => (
  <div className="text-center py-8 text-muted-foreground">
    {title} coming soon...
  </div>
);

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState("connections");
  const [sessionTime, setSessionTime] = useState("");
  const { isAuthenticated, logout, loading } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const updateSessionTime = () => {
        const authData = localStorage.getItem("portfolio_admin_auth");
        if (authData) {
          try {
            const { timestamp } = JSON.parse(authData);
            const elapsed = Date.now() - timestamp;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            setSessionTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
          } catch (error) {
            setSessionTime("--:--");
          }
        }
      };

      updateSessionTime();
      const interval = setInterval(updateSessionTime, 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-7xl">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2" aria-label="Admin Dashboard">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your portfolio content and user interactions.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Rate Protected
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {sessionTime}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Admin
            </Badge>
          </div>
          <Button onClick={logout} variant="outline" size="sm" aria-label="Log out">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <TabsTrigger value="projects" className="flex items-center gap-2" aria-label="Projects Tab">
            <BarChart3 className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2" aria-label="Connections Tab">
            <MessageSquare className="h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2" aria-label="Reviews Tab">
            <Star className="h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2" aria-label="Feedback Tab">
            <MessageCircle className="h-4 w-4" />
            Feedback
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2" aria-label="Stats Tab">
            <BarChart3 className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>Manage portfolio projects by adding, editing, or removing them.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>Manage messages received through the contact form.</CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectionsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Review and approve testimonials before they go live.</CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Complaints</CardTitle>
              <CardDescription>Manage user feedback and support requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Statistics</CardTitle>
              <CardDescription>View an overview of your portfolio metrics and performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <PlaceholderTable title="Stats dashboard" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <AdminAuthProvider>
      <AdminDashboardContent />
    </AdminAuthProvider>
  );
}
