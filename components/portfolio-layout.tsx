"use client"

import Link from "next/link"
import { MountainIcon, Menu, Github, Linkedin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import { SkipLink } from "./skip-link"
import { CommandPalette } from "./ui/command-palette"
import { PageTransition } from "./ui/page-transition"
import { LiveFeedbackWidget } from "./ui/live-feedback-widget"
import type React from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/feedback", label: "Feedback" },
]

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <MountainIcon className="h-6 w-6" />
            <span className="font-bold sm:inline-block">MyPortfolio</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>{link.label}</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <CommandPalette />
            </div>
            <div className="hidden md:block">
              <ModeToggle />
            </div>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    aria-label="Toggle navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <nav className="flex flex-col space-y-4 pt-6" role="navigation" aria-label="Mobile navigation">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center rounded-md px-3 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                    <div className="pt-4 border-t space-y-4">
                      <div className="lg:hidden">
                        <CommandPalette />
                      </div>
                      <ModeToggle />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1" role="main">
        <PageTransition>{children}</PageTransition>
      </main>

      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:h-20 md:flex-row md:py-0 max-w-screen-2xl px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <div className="flex items-center gap-2">
              <MountainIcon className="h-6 w-6" aria-hidden="true" />
              <span className="font-bold">MyPortfolio</span>
            </div>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} MyPortfolio. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              aria-label="Visit GitHub profile"
            >
              <Github className="h-6 w-6" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              aria-label="Visit LinkedIn profile"
            >
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              aria-label="Admin access"
            >
              <Shield className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>

      <LiveFeedbackWidget />
    </div>
  )
}
