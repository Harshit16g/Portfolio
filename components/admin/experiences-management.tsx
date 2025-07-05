"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getExperiences } from "@/lib/database/queries"
import type { ExperienceWithTechnologies } from "@/lib/database/queries"
import { Edit, Plus, Trash2, Search, Building, Calendar, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ExperiencesManagement() {
  const [experiences, setExperiences] = useState<ExperienceWithTechnologies[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<ExperienceWithTechnologies[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExperience, setSelectedExperience] = useState<ExperienceWithTechnologies | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
    sort_order: 0,
    employment_type: "full-time" as "full-time" | "part-time" | "contract" | "internship" | "freelance"
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchExperiences()
  }, [])

  useEffect(() => {
    const filtered = experiences.filter(
      (experience) =>
        experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (experience.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        experience.technologies.some(tech => 
          tech.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    setFilteredExperiences(filtered)
  }, [experiences, searchTerm])

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences()
      setExperiences(data)
    } catch (error) {
      console.error("Error fetching experiences:", error)
      toast({
        title: "Error",
        description: "Failed to load experiences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExperience = async () => {
    // This would be implemented with a proper API call
    toast({
      title: "Feature Coming Soon",
      description: "Experience creation will be implemented in the next update.",
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditExperience = async () => {
    // This would be implemented with a proper API call
    toast({
      title: "Feature Coming Soon", 
      description: "Experience editing will be implemented in the next update.",
    })
    setIsEditDialogOpen(false)
  }

  const getEmploymentTypeBadge = (type: string) => {
    const colors = {
      "full-time": "default",
      "part-time": "secondary",
      "contract": "outline",
      "internship": "destructive",
      "freelance": "secondary"
    } as const
    
    return (
      <Badge variant={colors[type as keyof typeof colors] || "outline"}>
        {type.replace("-", " ").toUpperCase()}
      </Badge>
    )
  }

  const formatDateRange = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    try {
      // Validate startDate
      if (!startDate) {
        return "Invalid date"
      }
      
      const startDateObj = new Date(startDate)
      if (isNaN(startDateObj.getTime())) {
        return "Invalid start date"
      }
      
      const start = format(startDateObj, "MMM yyyy")
      
      if (isCurrent) {
        return `${start} - Present`
      }
      
      if (endDate) {
        const endDateObj = new Date(endDate)
        if (isNaN(endDateObj.getTime())) {
          return `${start} - Invalid end date`
        }
        const end = format(endDateObj, "MMM yyyy")
        return `${start} - ${end}`
      }
      
      return start
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date format"
    }
  }

  const openEditDialog = (experience: ExperienceWithTechnologies) => {
    setSelectedExperience(experience)
    setFormData({
      title: experience.title,
      company: experience.company,
      location: experience.location || "",
      description: experience.description,
      start_date: experience.start_date.split('T')[0], // Convert to YYYY-MM-DD format
      end_date: experience.end_date?.split('T')[0] || "",
      is_current: experience.is_current,
      sort_order: experience.sort_order,
      employment_type: (experience.employment_type as any) || "full-time"
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input placeholder="Search experiences..." className="max-w-sm" disabled />
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search experiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Experience</DialogTitle>
              <DialogDescription>Add a new work experience to your portfolio</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Tech Company Inc."
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your role and achievements"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={formData.is_current}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_current"
                    checked={formData.is_current}
                    onCheckedChange={(checked) => setFormData({ 
                      ...formData, 
                      is_current: checked,
                      end_date: checked ? "" : formData.end_date
                    })}
                  />
                  <Label htmlFor="is_current">Currently working here</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Select
                    value={formData.employment_type}
                    onValueChange={(value: any) => setFormData({ ...formData, employment_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateExperience}>Add Experience</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredExperiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No experiences found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExperiences.map((experience, index) => (
                  <motion.tr
                    key={experience.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{experience.title}</div>
                        {experience.location && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {experience.location}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {experience.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDateRange(experience.start_date, experience.end_date, experience.is_current)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getEmploymentTypeBadge(experience.employment_type || "full-time")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {experience.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech.id} variant="outline" className="text-xs">
                            {tech.name}
                          </Badge>
                        ))}
                        {experience.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{experience.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(experience)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
            <DialogDescription>Update experience information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Job Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start">Start Date</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end">End Date</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  disabled={formData.is_current}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-current"
                  checked={formData.is_current}
                  onCheckedChange={(checked) => setFormData({ 
                    ...formData, 
                    is_current: checked,
                    end_date: checked ? "" : formData.end_date
                  })}
                />
                <Label htmlFor="edit-current">Currently working here</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Employment Type</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value: any) => setFormData({ ...formData, employment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditExperience}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}