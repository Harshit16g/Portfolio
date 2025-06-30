import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2, ExternalLink, Github, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { getAllProjects } from "@/lib/database/queries"
import { createProject, updateProject, deleteProject } from "@/lib/database/admin-queries"
import type { ProjectWithTechnologies } from "@/lib/database/queries"

interface ProjectFormProps {
  project?: ProjectWithTechnologies | null;
  onSave: () => void;
  onClose: () => void;
}

function ProjectForm({ project, onSave, onClose }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || "")
  const [description, setDescription] = useState(project?.description || "")
  const [image_url, setImage_url] = useState(project?.image_url || "")
  const [project_url, setProject_url] = useState(project?.project_url || "")
  const [github_url, setGithub_url] = useState(project?.github_url || "")
  const [is_featured, setIs_featured] = useState(project?.is_featured || false)
  const [sort_order, setSort_order] = useState(project?.sort_order || 0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const projectData = {
      title,
      description,
      image_url,
      project_url,
      github_url,
      is_featured,
      sort_order,
    }

    try {
      if (project) {
        await updateProject(project.id, projectData)
        toast({
          title: "Project Updated",
          description: `Project '${title}' has been updated.`, 
        })
      } else {
        await createProject(projectData, []) // Technologies can be added later or in a separate step
        toast({
          title: "Project Created",
          description: `Project '${title}' has been created.`, 
        })
      }
      onSave()
      onClose()
    } catch (error) {
      console.error("Failed to save project:", error)
      toast({
        title: "Error",
        description: `Failed to save project: ${(error as Error).message}`, 
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" value={image_url} onChange={(e) => setImage_url(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="project_url">Live Demo URL</Label>
        <Input id="project_url" value={project_url} onChange={(e) => setProject_url(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="github_url">GitHub URL</Label>
        <Input id="github_url" value={github_url} onChange={(e) => setGithub_url(e.target.value)} />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="is_featured" checked={is_featured} onCheckedChange={(checked) => setIs_featured(!!checked)} />
        <Label htmlFor="is_featured">Featured Project</Label>
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input id="sort_order" type="number" value={sort_order} onChange={(e) => setSort_order(Number(e.target.value))} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Project"}
      </Button>
    </form>
  )
}

export function ProjectsTable() {
  const [projects, setProjects] = useState<ProjectWithTechnologies[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectWithTechnologies | null>(null)
  const { toast } = useToast()

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllProjects()
      setProjects(data)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError("Failed to load projects.")
      toast({
        title: "Error",
        description: "Failed to load projects.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id)
        toast({
          title: "Project Deleted",
          description: "The project has been successfully deleted.",
        })
        fetchProjects()
      } catch (error) {
        console.error("Failed to delete project:", error)
        toast({
          title: "Error",
          description: `Failed to delete project: ${(error as Error).message}`, 
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (project: ProjectWithTechnologies) => {
    setSelectedProject(project)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setSelectedProject(null)
    setIsFormOpen(true)
  }

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchProjects} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={selectedProject}
              onSave={fetchProjects}
              onClose={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Live Demo</TableHead>
            <TableHead>GitHub</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No projects found.</TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.is_featured ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {project.project_url ? (
                    <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : "N/A"}
                </TableCell>
                <TableCell>
                  {project.github_url ? (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      <Github className="h-4 w-4" />
                    </a>
                  ) : "N/A"}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}


