# Portfolio Repository Directory Tree
## Admin Dashboard Enhancement Branch

This document provides a comprehensive overview of the repository structure for Harshit Lodhi's Portfolio project, with particular focus on the admin dashboard enhancement features.

## Repository Structure

```
Portfolio/
├── .github/                           # GitHub configuration and templates
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md             # Bug report template
│       └── feature_request.md        # Feature request template
├── .gitignore                        # Git ignore rules
├── README.md                         # Project documentation
├── DIRECTORY_TREE.md                 # This file - Repository structure documentation
│
├── app/                              # Next.js App Router directory
│   ├── about/
│   │   └── page.tsx                  # About page component
│   ├── admin/                        # 🔥 ADMIN DASHBOARD ROUTES
│   │   └── page.tsx                  # Main admin dashboard page
│   ├── blog/
│   │   └── page.tsx                  # Blog page component
│   ├── certifications/
│   │   └── page.tsx                  # Certifications page
│   ├── contact/
│   │   └── page.tsx                  # Contact page component
│   ├── education/
│   │   └── page.tsx                  # Education page component
│   ├── experience/
│   │   ├── data.tsx                  # Experience data definitions
│   │   └── page.tsx                  # Experience page component
│   ├── projects/
│   │   └── page.tsx                  # Projects page component
│   ├── stats/
│   │   └── page.tsx                  # Statistics page component
│   ├── testimonials/
│   │   └── page.tsx                  # Testimonials page component
│   ├── toolbox/
│   │   └── page.tsx                  # Toolbox page component
│   ├── globals.css                   # Global CSS styles
│   ├── layout.tsx                    # Root layout component
│   └── page.tsx                      # Home page component
│
├── components/                       # React components directory
│   ├── about/                        # About page components
│   │   ├── fun-facts-section.tsx
│   │   ├── profile-card.tsx
│   │   └── timeline-section.tsx
│   │
│   ├── admin/                        # 🔥 ADMIN DASHBOARD COMPONENTS
│   │   ├── admin-dashboard.tsx       # Main admin dashboard interface
│   │   ├── admin-login.tsx           # Admin authentication form
│   │   ├── admin-route-guard.tsx     # Route protection component
│   │   ├── connections-table.tsx     # Table for managing connections
│   │   ├── feedback-table.tsx        # Table for managing feedback
│   │   └── reviews-table.tsx         # Table for managing reviews
│   │
│   ├── blog/
│   │   └── blog-grid.tsx             # Blog posts grid layout
│   ├── certifications/
│   │   └── certifications-grid.tsx   # Certifications grid layout
│   ├── contact/
│   │   ├── contact-form.tsx          # Contact form component
│   │   └── contact-info.tsx          # Contact information display
│   ├── education/
│   │   └── education-timeline.tsx    # Education timeline component
│   ├── experience/
│   │   └── experience-timeline.tsx   # Experience timeline component
│   ├── projects/
│   │   └── projects-grid.tsx         # Projects grid layout
│   ├── seo/
│   │   └── structured-data.tsx       # SEO structured data component
│   ├── stats/
│   │   └── stats-overview.tsx        # Statistics overview component
│   ├── testimonials/
│   │   └── testimonials-grid.tsx     # Testimonials grid layout
│   ├── toolbox/
│   │   └── toolbox-grid.tsx          # Toolbox grid layout
│   │
│   ├── ui/                           # UI component library (ShadCN/UI based)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card-grid.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command-palette.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── error-boundary.tsx
│   │   ├── error-message.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── live-feedback-widget.tsx
│   │   ├── loading-card.tsx
│   │   ├── loading-skeleton.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── optimized-image.tsx
│   │   ├── page-transition.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── section-heading.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx               # 🔥 USED IN ADMIN DASHBOARD
│   │   ├── skeleton.tsx
│   │   ├── skip-link.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx                 # 🔥 USED IN ADMIN TABLES
│   │   ├── tabs.tsx                  # 🔥 USED IN ADMIN DASHBOARD
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── featured-projects.tsx         # Featured projects component
│   ├── hero-section.tsx              # Hero section component
│   ├── mode-toggle.tsx               # Dark/light mode toggle
│   ├── portfolio-layout.tsx          # Main portfolio layout
│   ├── skip-link.tsx                 # Accessibility skip link
│   ├── tech-stack.tsx                # Technology stack display
│   ├── theme-provider.tsx            # Theme context provider
│   └── typing-effect.tsx             # Typing animation component
│
├── hooks/                            # Custom React hooks
│   ├── use-about-data.ts             # Hook for about page data
│   ├── use-mobile.tsx                # Mobile detection hook
│   ├── use-portfolio-data.ts         # Hook for portfolio data
│   ├── use-rate-limit.ts             # 🔥 RATE LIMITING FOR ADMIN
│   └── use-toast.ts                  # Toast notification hook
│
├── lib/                              # Utility libraries and configurations
│   ├── auth/                         # 🔥 ADMIN AUTHENTICATION
│   │   └── admin-auth.tsx            # Admin authentication context and logic
│   ├── config/                       # 🔥 ADMIN CONFIGURATION
│   │   └── admin-config.ts           # Admin panel configuration settings
│   ├── database/
│   │   └── queries.ts                # Database query utilities
│   ├── rate-limit/                   # 🔥 RATE LIMITING SYSTEM
│   │   └── rate-limiter.ts           # Rate limiting implementation
│   ├── supabase/                     # Supabase database integration
│   │   ├── client.ts                 # Supabase client configuration
│   │   ├── server.ts                 # Server-side Supabase utilities
│   │   └── types.ts                  # TypeScript type definitions
│   ├── icons.tsx                     # Icon components
│   └── utils.ts                      # General utility functions
│
├── public/                           # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
│
├── styles/                           # Styling files
│   └── globals.css                   # Global CSS styles
│
├── components.json                   # ShadCN/UI configuration
├── next.config.mjs                   # Next.js configuration
├── package.json                      # Project dependencies and scripts
├── pnpm-lock.yaml                    # Lockfile for pnpm package manager
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript configuration
```

## Admin Dashboard Enhancement Features

The repository includes a comprehensive admin dashboard system with the following key components:

### 🔐 Authentication & Security
- **`lib/auth/admin-auth.tsx`** - Admin authentication context with session management
- **`components/admin/admin-login.tsx`** - Secure login interface
- **`components/admin/admin-route-guard.tsx`** - Route protection for admin areas
- **`lib/rate-limit/rate-limiter.ts`** - Rate limiting to prevent abuse
- **`hooks/use-rate-limit.ts`** - React hook for rate limiting functionality

### 📊 Dashboard Interface
- **`app/admin/page.tsx`** - Main admin dashboard route
- **`components/admin/admin-dashboard.tsx`** - Core dashboard interface with tabs
- **`lib/config/admin-config.ts`** - Centralized admin configuration

### 📋 Data Management Tables
- **`components/admin/connections-table.tsx`** - Manage portfolio connections
- **`components/admin/feedback-table.tsx`** - Handle user feedback and complaints  
- **`components/admin/reviews-table.tsx`** - Review and approve testimonials

### 🎨 UI Components (Admin-Focused)
- **`components/ui/sidebar.tsx`** - Sidebar navigation for admin interface
- **`components/ui/table.tsx`** - Table components for data display
- **`components/ui/tabs.tsx`** - Tab interface for dashboard sections
- **`components/ui/badge.tsx`** - Status badges for admin interface
- **`components/ui/card.tsx`** - Card layouts for dashboard sections

## Tech Stack

| Category | Tools / Libraries |
|----------|-------------------|
| **Frontend** | Next.js (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, ShadCN/UI Components |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Custom admin auth with Supabase |
| **State Management** | React Context, Custom Hooks |
| **Package Manager** | pnpm |
| **Deployment** | Vercel |

## Key Files Summary

- **Total Files**: 135+
- **Total Directories**: 38+
- **Admin Components**: 6 dedicated admin components
- **UI Components**: 50+ reusable UI components
- **Pages**: 11 main application pages
- **Custom Hooks**: 5 custom React hooks
- **Configuration Files**: 6 config files

## Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

*Generated on: $(date)*
*Repository: Harshit16g/Portfolio*
*Branch: Admin Dashboard Enhancement*