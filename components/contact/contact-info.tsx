"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from "lucide-react"

export function ContactInfo() {
  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: "harshitlodhi220593@acropolis.in",
      href: "mailto:harshitlodhi220593@acropolis.in",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8770963987",
      href: "tel:+918770963987",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Indore, India",
      href: null,
    },
  ]

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/harshit16g",
      color: "hover:text-gray-900 dark:hover:text-gray-100",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/harshit-lodhi-5575b8314?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      color: "hover:text-blue-600",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Information</CardTitle>
          <CardDescription>Feel free to reach out through any of these channels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactDetails.map((detail, index) => (
            <motion.div
              key={detail.label}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-full bg-primary/10">
                <detail.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                {detail.href ? (
                  <Link href={detail.href} className="text-foreground hover:text-primary transition-colors font-medium">
                    {detail.value}
                  </Link>
                ) : (
                  <p className="text-foreground font-medium">{detail.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Connect with me</CardTitle>
          <CardDescription>Follow me on social media for updates and insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <motion.div
                key={social.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg" className={`group ${social.color}`}>
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="mr-2 h-5 w-5" />
                    {social.name}
                    <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Quick Response</h3>
            <p className="text-sm text-muted-foreground mb-4">
              I typically respond to messages within 24 hours. For urgent matters, feel free to call directly.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-primary">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Usually responds quickly</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
