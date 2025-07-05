"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTable } from "./shared/data-table"
import { useCrudManager } from "@/hooks/use-crud-manager"
import { getAllProjects } from "@/lib/database/queries"
import type { ProjectWithTechnologies } from "@/lib/database/queries"
import { Globe, Github, Star, Edit, Trash2 } from "lucide-react"

export function ProjectsManagement() {
  // Search filter function
  const searchFilter = (projects: ProjectWithTechnologies[], searchTerm: string) => {
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some(tech => 
          tech.name.toLowerCase().includes(searchTerm)
        )
    )
  }

  // Initial form data
  const initialFormData = {
    title: "",
    description: "",
    short_description: "",
    image_url: "",
    demo_url: "",
    github_url: "",
    is_featured: false,
    sort_order: 0,
    status: "active" as "active" | "draft" | "archived"
  }

  // Use the shared CRUD manager
  const {
    filteredItems: filteredProjects,
    loading,
    searchTerm,
    setSearchTerm,
    handleDelete,
  } = useCrudManager<ProjectWithTechnologies>({
    fetchData: getAllProjects,
    searchFilter,
    initialFormData,
  })

  // Status badge renderer
  const getStatusBadge = (status: string, is_featured?: boolean) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      draft: { variant: "secondary" as const, label: "Draft" },
      archived: { variant: "outline" as const, label: "Archived" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    
    return (
      <div className="flex items-center gap-2">
        <Badge variant={config.variant}>{config.label}</Badge>
        {is_featured && (
          <Badge variant="secondary" className="text-yellow-600">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}
      </div>
    )
  }

  // Technology badges renderer with tooltip for overflow
  const renderTechnologies = (technologies: Array<{ id: number, name: string }>) => (
    <div className="flex flex-wrap gap-1">
      {technologies.slice(0, 3).map((tech) => (
        <Badge key={tech.id} variant="outline" className="text-xs">
          {tech.name}
        </Badge>
      ))}
      {technologies.length > 3 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="text-xs cursor-pointer">
                +{technologies.length - 3}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <div className="flex flex-wrap gap-1 max-w-xs">
                {technologies.map((tech) => (
                  <span key={tech.id} className="block text-xs">
                    {tech.name}
                  </span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )

  // Project image/title renderer
  const renderProjectTitle = (project: ProjectWithTechnologies) => (
    <div className="flex items-center gap-2">
      {project.image_url ? (
        <img 
          src={project.image_url} 
          alt={`${project.title} logo`} 
          className="w-8 h-8 rounded bg-muted flex-shrink-0 object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground text-sm font-medium">
          {project.title ? project.title.charAt(0).toUpperCase() : "?"}
        </div>
      )}
      <div>
        <div className="font-semibold">{project.title}</div>
        <div className="text-sm text-muted-foreground truncate max-w-xs">
          {project.short_description || project.description}
        </div>
      </div>
    </div>
  )

  // Date formatter with error handling
  const formatDate = (timestamp: string | null | undefined) => {
    if (!timestamp) {
      return "No date available"
    }
    try {
      return format(new Date(timestamp), "MMM dd, yyyy")
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date"
    }
  }

  // Actions renderer
  const renderActions = (project: ProjectWithTechnologies) => (
    <div className="flex items-center space-x-2">
      {project.demo_url && (
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
            <Globe className="h-4 w-4" />
          </a>
        </Button>
      )}
      {project.github_url && (
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
          </a>
        </Button>
      )}
      {/* Edit and Delete buttons hidden until CRUD API is implemented */}
      {false && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", project)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(project)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )

  // Table columns configuration
  const columns = useMemo(() => [
    {
      key: 'title',
      header: 'Project',
      render: renderProjectTitle,
    },
    {
      key: 'technologies',
      header: 'Technologies',
      render: (project: ProjectWithTechnologies) => renderTechnologies(project.technologies),
    },
    {
      key: 'status',
      header: 'Status',
      render: (project: ProjectWithTechnologies) => getStatusBadge(project.status || "active", project.is_featured),
    },
    {
      key: 'updated_at',
      header: 'Updated',
      render: (project: ProjectWithTechnologies) => formatDate(project.updated_at || project.created_at),
    },
  ], [])

  return (
    <DataTable
      title="Projects Management"
      description="Create, edit, and manage your portfolio projects."
      data={filteredProjects}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      renderActions={renderActions}
      // onAdd functionality temporarily disabled until CRUD API is implemented
      // TODO: When implementing dialogs, use the shared FormDialog component from ./shared/form-dialog.tsx
      // onAdd={openCreateDialog}
      // addButtonText="Add Project"
    />
  )
}