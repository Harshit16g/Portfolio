
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useProjects } from "@/hooks/use-portfolio-data";
import { createProject, updateProject, deleteProject } from "@/lib/database/admin-queries";
import { getAllTechnologies } from "@/lib/database/queries";
import { Eye, Trash2, Search, RefreshCw, Plus, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Technology = {
  id: string;
  name: string;
  icon_name?: string;
  category: string;
  created_at: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  is_featured: boolean;
  sort_order: number;
  live_url?: string;
  repo_url?: string;
  created_at: string;
  technologies: Technology[];
};

export function ProjectsTable() {
  const { data: projects, loading, error, refetch } = useProjects();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, "id" | "created_at" | "technologies">>({
    title: "",
    description: "",
    image_url: "",
    project_url: "",
    github_url: "",
    is_featured: false,
    sort_order: 0,
    live_url: "",
    repo_url: "",
  });
  const [editProject, setEditProject] = useState<Partial<Omit<Project, "id" | "created_at" | "technologies">>>({});
  const [editTechIds, setEditTechIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const techs = await getAllTechnologies();
        setTechnologies(techs);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load technologies.",
          variant: "destructive",
        });
      }
    };
    fetchTechnologies();
  }, [toast]);

  useEffect(() => {
    setFilteredProjects(
      projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [projects, searchTerm]);

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteProject(id);
      if (success) {
        toast({
          title: "Project deleted",
          description: "The project has been permanently deleted.",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async () => {
    try {
      const projectData = { ...newProject };
      const success = await createProject(projectData, selectedTechIds);
      if (success) {
        toast({
          title: "Project created",
          description: "The project has been successfully created.",
        });
        refetch();
        setIsCreateOpen(false);
        setNewProject({
          title: "",
          description: "",
          image_url: "",
          project_url: "",
          github_url: "",
          is_featured: false,
          sort_order: 0,
          live_url: "",
          repo_url: "",
        });
        setSelectedTechIds([]);
      } else {
        toast({
          title: "Error",
          description: "Failed to create project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const success = await updateProject(id, editProject, editTechIds);
      if (success) {
        toast({
          title: "Project updated",
          description: "The project has been successfully updated.",
        });
        refetch();
        setIsEditOpen(false);
        setEditProject({});
        setEditTechIds([]);
      } else {
        toast({
          title: "Error",
          description: "Failed to update project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <Input placeholder="Search projects..." className="max-w-sm" disabled />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Date</TableHead>
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
        <Button onClick={refetch} className="mt-4" aria-label="Retry loading projects">
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Fill in the details to create a new project.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="font-semibold">Title:</label>
                <Input
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">Description:</label>
                <Textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">Image URL:</label>
                <Input
                  value={newProject.image_url}
                  onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">Project URL:</label>
                <Input
                  value={newProject.project_url}
                  onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">GitHub URL:</label>
                <Input
                  value={newProject.github_url}
                  onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">Live URL:</label>
                <Input
                  value={newProject.live_url || ""}
                  onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">Repo URL:</label>
                <Input
                  value={newProject.repo_url || ""}
                  onChange={(e) => setNewProject({ ...newProject, repo_url: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">Sort Order:</label>
                <Input
                  type="number"
                  value={newProject.sort_order}
                  onChange={(e) => setNewProject({ ...newProject, sort_order: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-semibold">Featured:</label>
                <input
                  type="checkbox"
                  checked={newProject.is_featured}
                  onChange={(e) => setNewProject({ ...newProject, is_featured: e.target.checked })}
                />
              </div>
              <div>
                <label className="font-semibold">Technologies:</label>
                <Select
                  onValueChange={(value) =>
                    setSelectedTechIds((prev) =>
                      prev.includes(value) ? prev : [...prev, value]
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technologies" />
                  </SelectTrigger>
                  <SelectContent>
                    {technologies.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  {selectedTechIds
                    .map((id) => technologies.find((tech) => tech.id === id)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                  <TableCell>
                    {project.technologies.map((tech) => tech.name).join(", ") || "None"}
                  </TableCell>
                  <TableCell>{project.is_featured ? "Yes" : "No"}</TableCell>
                  <TableCell>{format(new Date(project.created_at), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedProject?.title}</DialogTitle>
                            <DialogDescription>
                              Created on {selectedProject && format(new Date(selectedProject.created_at), "MMM dd, yyyy")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Description:</h4>
                              <p className="text-sm whitespace-pre-wrap">{selectedProject?.description}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Technologies:</h4>
                              <p className="text-sm">{selectedProject?.technologies.map((tech) => tech.name).join(", ") || "None"}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Featured:</h4>
                              <p className="text-sm">{selectedProject?.is_featured ? "Yes" : "No"}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Project URL:</h4>
                              <p className="text-sm">{selectedProject?.project_url}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">GitHub URL:</h4>
                              <p className="text-sm">{selectedProject?.github_url}</p>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditProject({
                                    title: project.title,
                                    description: project.description,
                                    image_url: project.image_url,
                                    project_url: project.project_url,
                                    github_url: project.github_url,
                                    is_featured: project.is_featured,
                                    sort_order: project.sort_order,
                                    live_url: project.live_url,
                                    repo_url: project.repo_url,
                                  });
                                  setEditTechIds(project.technologies.map((tech) => tech.id));
                                  setIsEditOpen(true);
                                }}
                                className="flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => selectedProject && handleDelete(selectedProject.id)}
                                className="flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Project</DialogTitle>
                            <DialogDescription>Update the project details.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="font-semibold">Title:</label>
                              <Input
                                value={editProject.title || ""}
                                onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">Description:</label>
                              <Textarea
                                value={editProject.description || ""}
                                onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">Image URL:</label>
                              <Input
                                value={editProject.image_url || ""}
                                onChange={(e) => setEditProject({ ...editProject, image_url: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">Project URL:</label>
                              <Input
                                value={editProject.project_url || ""}
                                onChange={(e) => setEditProject({ ...editProject, project_url: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">GitHub URL:</label>
                              <Input
                                value={editProject.github_url || ""}
                                onChange={(e) => setEditProject({ ...editProject, github_url: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">Live URL:</label>
                              <Input
                                value={editProject.live_url || ""}
                                onChange={(e) => setEditProject({ ...editProject, live_url: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">Repo URL:</label>
                              <Input
                                value={editProject.repo_url || ""}
                                onChange={(e) => setEditProject({ ...editProject, repo_url: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">Sort Order:</label>
                              <Input
                                type="number"
                                value={editProject.sort_order || 0}
                                onChange={(e) => setEditProject({ ...editProject, sort_order: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">Featured:</label>
                              <input
                                type="checkbox"
                                checked={editProject.is_featured || false}
                                onChange={(e) => setEditProject({ ...editProject, is_featured: e.target.checked })}
                              />
                            </div>
                            <div>
                              <label className="font-semibold">Technologies:</label>
                              <Select
                                onValueChange={(value) =>
                                  setEditTechIds((prev) =>
                                    prev.includes(value) ? prev : [...prev, value]
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select technologies" />
                                </SelectTrigger>
                                <SelectContent>
                                  {technologies.map((tech) => (
                                    <SelectItem key={tech.id} value={tech.id}>
                                      {tech.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="mt-2">
                                {editTechIds
                                  .map((id) => technologies.find((tech) => tech.id === id)?.name)
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={() => selectedProject && handleEdit(selectedProject.id)}>Update</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
