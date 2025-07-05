"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Dialog, DialogContent, DialogTrigger } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLink, Github, PlusCircle, Edit, Trash2 } from "lucide-react";
import { getAllProjects, deleteProject, createProject, updateProject } from "@/lib/database/admin-queries";

// Project type definitions
interface Project {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  is_featured: boolean;
  sort_order: number;
  live_url?: string;
  repo_url?: string;
  created_at?: string;
}

interface ProjectWithTechnologies extends Project {
  technologies: any[];
}

interface ProjectFormProps {
  project?: ProjectWithTechnologies | null;
  onSave: () => void;
  onClose: () => void;
  projects?: ProjectWithTechnologies[];
}

// Custom hook for projects data
function useProjects() {
  const [projects, setProjects] = useState<ProjectWithTechnologies[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      setProjects(await getAllProjects());
    } catch (err: any) {
      setError("Failed to load projects");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteProject(id);
      toast({ title: "Project deleted", description: "Project removed successfully." });
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return { projects, loading, error, fetchAll, remove };
}

// Custom hook for project mutations
function useProjectMutations(onDone: () => void) {
  const { toast } = useToast();

  async function save(id: string | null, data: Partial<Project>, technologyIds: string[] = []) {
    try {
      if (id) {
        await updateProject(id, data, technologyIds);
        toast({ title: "Project updated", description: `Project '${data.title}' has been updated.` });
      } else {
        await createProject(data, technologyIds);
        toast({ title: "Project created", description: `Project '${data.title}' has been created.` });
      }
      onDone();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  return { save };
}

// ProjectForm component
function ProjectForm({ project, onSave, onClose, projects = [] }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [image_url, setImage_url] = useState(project?.image_url || "");
  const [project_url, setProject_url] = useState(project?.project_url || "");
  const [github_url, setGithub_url] = useState(project?.github_url || "");
  const [live_url, setLive_url] = useState(project?.live_url || "");
  const [repo_url, setRepo_url] = useState(project?.repo_url || "");
  const [is_featured, setIs_featured] = useState(project?.is_featured || false);
  const getNextSortOrder = () => {
    if (project?.sort_order !== undefined) return project.sort_order;
    if (!projects || projects.length === 0) return 1;
    return Math.max(...projects.map((p) => p.sort_order || 0)) + 1;
  };
  const [sort_order, setSort_order] = useState(getNextSortOrder());
  const [loading, setLoading] = useState(false);
  const { save } = useProjectMutations(() => {
    setLoading(false);
    onSave();
    onClose();
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        save(project?.id || null, {
          title,
          description,
          image_url: image_url || null,
          project_url: project_url || null,
          github_url: github_url || null,
          live_url: live_url || null,
          repo_url: repo_url || null,
          is_featured,
          sort_order,
        });
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required aria-required="true" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          aria-required="true"
        />
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
      <div>
        <Label htmlFor="live_url">Live URL</Label>
        <Input id="live_url" value={live_url} onChange={(e) => setLive_url(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="repo_url">Repository URL</Label>
        <Input id="repo_url" value={repo_url} onChange={(e) => setRepo_url(e.target.value)} />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="is_featured"
          type="checkbox"
          checked={is_featured}
          onChange={(e) => setIs_featured(e.target.checked)}
        />
        <Label htmlFor="is_featured">Featured Project</Label>
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input
          id="sort_order"
          type="number"
          value={sort_order}
          onChange={(e) => setSort_order(Number(e.target.value))}
          required
          aria-required="true"
        />
      </div>
      <Button type="submit" disabled={loading} aria-disabled={loading}>
        {loading ? "Saving..." : "Save Project"}
      </Button>
    </form>
  );
}

// Main ProjectsTable component
export function ProjectsTable() {
  const { projects, loading, error, fetchAll, remove } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithTechnologies | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button disabled aria-disabled="true">
            <PlusCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            Add New Project
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Live Demo</TableHead>
                <TableHead>GitHub</TableHead>
                <TableHead>Live URL</TableHead>
                <TableHead>Repo URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" aria-live="polite">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchAll} className="mt-4" aria-label="Retry loading projects">
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setSelectedProject(null); setIsFormOpen(true); }} aria-label="Add new project">
              <PlusCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={selectedProject}
              onSave={fetchAll}
              onClose={() => setIsFormOpen(false)}
              projects={projects}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Live Demo</TableHead>
              <TableHead>GitHub</TableHead>
              <TableHead>Live URL</TableHead>
              <TableHead>Repo URL</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.is_featured ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {project.project_url ? (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        aria-label={`View live demo for ${project.title}`}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>
                    {project.github_url ? (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        aria-label={`View GitHub for ${project.title}`}
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>
                    {project.live_url ? (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        aria-label={`View live URL for ${project.title}`}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>
                    {project.repo_url ? (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        aria-label={`View repository for ${project.title}`}
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSelectedProject(project); setIsFormOpen(true); }}
                      aria-label={`Edit project ${project.title}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(project.id!)}
                      aria-label={`Delete project ${project.title}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
