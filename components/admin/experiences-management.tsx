"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTable } from "./shared/data-table"
import { useCrudManager } from "@/hooks/use-crud-manager"
import { getExperiences } from "@/lib/database/queries"
import type { ExperienceWithTechnologies } from "@/lib/database/queries"
import { Building, MapPin, Edit, Trash2 } from "lucide-react"

export function ExperiencesManagement() {
  // Search filter function
  const searchFilter = (experiences: ExperienceWithTechnologies[], searchTerm: string) => {
    return experiences.filter(
      (experience) =>
        experience.title.toLowerCase().includes(searchTerm) ||
        experience.company.toLowerCase().includes(searchTerm) ||
        experience.description.toLowerCase().includes(searchTerm) ||
        experience.technologies.some(tech => 
          tech.name.toLowerCase().includes(searchTerm)
        )
    )
  }

  // Initial form data
  const initialFormData = {
    title: "",
    company: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
    sort_order: 0,
  }

  // Use the shared CRUD manager
  const {
    filteredItems: filteredExperiences,
    loading,
    searchTerm,
    setSearchTerm,
    handleDelete,
  } = useCrudManager<ExperienceWithTechnologies>({
    fetchData: getExperiences,
    searchFilter,
    initialFormData,
  })

  // Note: Employment type field doesn't exist in current database schema
  // When implemented, this should display the actual employment type from the database

  // Date range formatter with error handling
  const formatDateRange = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    try {
      // Validate startDate
      if (!startDate) {
        return ""
      }
      
      const startDateObj = new Date(startDate)
      if (isNaN(startDateObj.getTime())) {
        return ""
      }
      
      const start = format(startDateObj, "MMM yyyy")
      
      if (isCurrent) {
        return `${start} - Present`
      }
      
      if (endDate) {
        const endDateObj = new Date(endDate)
        if (isNaN(endDateObj.getTime())) {
          return start // Return just start date if end date is invalid
        }
        const end = format(endDateObj, "MMM yyyy")
        return `${start} - ${end}`
      }
      
      return start
    } catch (error) {
      console.error("Date formatting error:", error)
      return ""
    }
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

  // Position title renderer
  const renderPosition = (experience: ExperienceWithTechnologies) => (
    <div>
      <div className="font-semibold">{experience.title}</div>
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <Building className="h-3 w-3" />
        {experience.company}
      </div>
    </div>
  )

  // Actions renderer
  const renderActions = (experience: ExperienceWithTechnologies) => (
    <div className="flex items-center space-x-2">
      {/* Edit and Delete buttons hidden until CRUD API is implemented */}
      {false && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", experience)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(experience)}
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
      header: 'Position',
      render: renderPosition,
    },
    {
      key: 'start_date',
      header: 'Duration',
      render: (experience: ExperienceWithTechnologies) => 
        formatDateRange(experience.start_date, experience.end_date, experience.is_current),
    },
    {
      key: 'employment_type',
      header: 'Type',
      render: () => (
        <span className="text-muted-foreground text-sm italic">
          Not available
        </span>
      ), // Employment type field doesn't exist in current database schema
    },
    {
      key: 'technologies',
      header: 'Technologies',
      render: (experience: ExperienceWithTechnologies) => renderTechnologies(experience.technologies),
    },
  ], [])

  return (
    <DataTable
      title="Experience Management"
      description="Manage your work experience and employment history."
      data={filteredExperiences}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      renderActions={renderActions}
      // onAdd functionality temporarily disabled until CRUD API is implemented
      // TODO: When implementing dialogs, use the shared FormDialog component from ./shared/form-dialog.tsx
      // onAdd={openCreateDialog}
      // addButtonText="Add Experience"
    />
  )
}