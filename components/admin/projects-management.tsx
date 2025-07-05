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
import { getAllProjects } from "@/lib/database/queries"
import type { ProjectWithTechnologies } from "@/lib/database/queries"
import { Edit, Plus, Trash2, Eye, Search, Globe, Github, ExternalLink, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProjectsManagement() {
  const [projects, setProjects] = useState<ProjectWithTechnologies[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithTechnologies[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<ProjectWithTechnologies | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    image_url: "",
    demo_url: "",
    github_url: "",
    is_featured: false,
    sort_order: 0,
    status: "active" as "active" | "draft" | "archived"
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    setFilteredProjects(filtered)
  }, [projects, searchTerm])

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    // This would be implemented with a proper API call
    toast({
      title: "Feature Coming Soon",
      description: "Project creation will be implemented in the next update.",
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditProject = async () => {
    // This would be implemented with a proper API call
    toast({
      title: "Feature Coming Soon", 
      description: "Project editing will be implemented in the next update.",
    })
    setIsEditDialogOpen(false)
  }

  const getStatusBadge = (status: string, isFeatured: boolean) => {
    return (
      <div className="flex gap-2">
        <Badge 
          variant={status === "active" ? "default" : status === "draft" ? "secondary" : "outline"}
        >
          {status}
        </Badge>
        {isFeatured && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            Featured
          </Badge>
        )}
      </div>
    )
  }

  const openEditDialog = (project: ProjectWithTechnologies) => {
    setSelectedProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      short_description: project.short_description || "",
      image_url: project.image_url || "",
      demo_url: project.demo_url || "",
      github_url: project.github_url || "",
      is_featured: project.is_featured,
      sort_order: project.sort_order,
      status: (project.status as any) || "active"
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input placeholder="Search projects..." className="max-w-sm" disabled />
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => (
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
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your portfolio</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Project title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed project description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="demo_url">Demo URL</Label>
                  <Input
                    id="demo_url"
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured Project</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project, index) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {project.image_url && (
                          <img 
                            src={project.image_url} 
                            alt={`${project.title} logo`} 
                            className="w-8 h-8 rounded bg-muted flex-shrink-0 object-cover"
                          />
                        )}
                        {/* TODO: Add placeholder when image_url is missing */}
                        <div>
                          <div className="font-semibold">{project.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {project.short_description || project.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech.id} variant="outline" className="text-xs">
                            {tech.name}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(project.status || "active", project.is_featured)}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const timestamp = project.updated_at || project.created_at
                        if (!timestamp) {
                          return "No date available"
                        }
                        try {
                          return format(new Date(timestamp), "MMM dd, yyyy")
                        } catch (error) {
                          console.error("Date formatting error:", error)
                          return "Invalid date"
                        }
                      })()}
                    </TableCell>
                    <TableCell>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(project)}
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
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <Label htmlFor="edit-demo">Demo URL</Label>
                <Input
                  id="edit-demo"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-github">GitHub URL</Label>
                <Input
                  id="edit-github"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="edit-featured">Featured Project</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "draft" | "archived") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}