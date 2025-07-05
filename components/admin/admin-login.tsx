"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/lib/auth/admin-auth"
import { Lock, Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { 
  containerVariants, 
  itemVariants, 
  fadeInVariants, 
  slideUpVariants,
  scaleInVariants,
  springScaleVariants
} from "./shared/animations"

export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const { login } = useAdminAuth()
  const { toast } = useToast()

  const MAX_ATTEMPTS = 3
  const isBlocked = attempts >= MAX_ATTEMPTS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isBlocked) {
      toast({
        title: "Access blocked",
        description: "Too many failed attempts. Please refresh the page to try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await login(password)

      if (success) {
        toast({
          title: "Access granted",
          description: "Welcome to the admin dashboard.",
        })
        setAttempts(0)
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)

        toast({
          title: "Access denied",
          description: `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`,
          variant: "destructive",
        })
        setPassword("")

        if (newAttempts >= MAX_ATTEMPTS) {
          toast({
            title: "Account locked",
            description: "Too many failed attempts. Please refresh the page to try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during authentication.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <motion.div
        variants={springScaleVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-2 relative overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <CardHeader className="text-center relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-primary/20 rounded-full border-t-primary"
              />
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription>Enter your admin credentials to access the portfolio dashboard</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10">
            <AnimatePresence>
              {isBlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">Account temporarily locked due to failed attempts</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    disabled={isBlocked}
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent transition-all duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isBlocked}
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: showPassword ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </motion.div>
                  </Button>
                </div>
              </motion.div>

              <AnimatePresence>
                {attempts > 0 && !isBlocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-muted-foreground text-center bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md border border-yellow-200 dark:border-yellow-800"
                  >
                    ⚠️ {MAX_ATTEMPTS - attempts} attempts remaining
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden group transition-all duration-300" 
                  disabled={isLoading || isBlocked}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary"
                    animate={{
                      x: isLoading ? ["-100%", "100%"] : "0%",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isLoading ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : isBlocked ? (
                      "Access Blocked"
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Access Dashboard
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 p-4 bg-muted/30 rounded-lg border border-muted/50"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Lock className="h-4 w-4" />
                </motion.div>
                <span>Secure admin access with session management</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
