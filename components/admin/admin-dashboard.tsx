"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConnectionsTable } from "./connections-table"
import { ReviewsTable } from "./reviews-table"
import { FeedbackTable } from "./feedback-table"
import { ProjectsManagement } from "./projects-management"
import { ExperiencesManagement } from "./experiences-management"
import { AdminLogin } from "./admin-login"
import { useAdminAuth, AdminAuthProvider } from "@/lib/auth/admin-auth"
import { MessageSquare, Star, MessageCircle, BarChart3, LogOut, Shield, Activity, Clock, User, Briefcase, Code, Settings } from "lucide-react"
import { 
  containerVariants, 
  itemVariants, 
  fadeInVariants, 
  slideUpVariants,
  slideTransitionVariants,
  staggeredItemVariants,
  getContainerMotionProps,
  getItemMotionProps 
} from "./shared/animations"

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState("connections")
  const [sessionTime, setSessionTime] = useState("")
  const { isAuthenticated, logout, loading } = useAdminAuth()

  // Update session time display
  useEffect(() => {
    if (isAuthenticated) {
      const updateSessionTime = () => {
        const authData = localStorage.getItem("portfolio_admin_auth")
        if (authData) {
          try {
            const { timestamp } = JSON.parse(authData)
            const elapsed = Date.now() - timestamp
            const minutes = Math.floor(elapsed / 60000)
            const seconds = Math.floor((elapsed % 60000) / 1000)
            setSessionTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
          } catch (error) {
            setSessionTime("--:--")
          }
        }
      }

      updateSessionTime()
      const interval = setInterval(updateSessionTime, 1000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Verifying admin session...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 py-8 md:px-6"
    >
      <motion.div
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold tracking-tight flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            Admin Dashboard
          </motion.h1>
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-muted-foreground"
          >
            Manage your portfolio content and user interactions.
          </motion.p>
        </div>
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4"
        >
          <div className="hidden md:flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="secondary" className="flex items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="h-3 w-3" />
                </motion.div>
                Rate Protected
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {sessionTime}
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Admin
              </Badge>
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={() => logout()} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <TabsList className="grid w-full grid-cols-6">
              {[
                { value: "connections", icon: MessageSquare, label: "Connections" },
                { value: "reviews", icon: Star, label: "Reviews" },
                { value: "feedback", icon: MessageCircle, label: "Feedback" },
                { value: "projects", icon: Code, label: "Projects" },
                { value: "experience", icon: Briefcase, label: "Experience" },
                { value: "stats", icon: BarChart3, label: "Stats" },
              ].map((tab, index) => (
                <motion.div
                  key={tab.value}
                  variants={staggeredItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <TabsTrigger 
                    value={tab.value} 
                    className="flex items-center gap-2 transition-all duration-200 hover:bg-muted/50"
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={slideTransitionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
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
                  <CardDescription>Track and manage user feedback and support requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FeedbackTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projects Management</CardTitle>
                  <CardDescription>Create, edit, and manage your portfolio projects.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectsManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Experience Management</CardTitle>
                  <CardDescription>Manage your work experience and professional history.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExperiencesManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Statistics</CardTitle>
                  <CardDescription>Overview of your portfolio metrics and performance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
                    >
                      <BarChart3 className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="text-muted-foreground">Advanced analytics dashboard coming soon...</p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 2 }}
                      className="mt-4 h-2 bg-primary/20 rounded-full overflow-hidden max-w-xs mx-auto"
                    >
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full w-1/3 bg-primary rounded-full"
                      />
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

export function AdminDashboard() {
  return (
    <AdminAuthProvider>
      <AdminDashboardContent />
    </AdminAuthProvider>
  )
}
