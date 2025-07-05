import { supabase } from "@/lib/supabase/client";

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

interface Feedback {
  id: string;
  type: string;
  created_at: string;
  status: 'read' | 'unread' | 'replied';
  reply_message?: string;
  name?: string;
  email?: string;
  subject?: string;
  content: string;
  priority?: string;
}

interface FeedbackWithSenderInfo extends Feedback {
  connections: { name: string; email: string; subject: string;xaf status: 'read' | 'unread' | 'replied' } | null;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function withRetry<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
}

// Project Management
export async function createProject(projectData: Omit<Project, 'id' | 'created_at'>, technologyIds: string[]): Promise<Project | null> {
  return withRetry(async () => {
    const { data, error } = await supabase.from("projects").insert([projectData]).select().single();
    if (error) {
      throw new Error(`Error creating project: ${error.message}`);
    }
    if (data && technologyIds.length > 0) {
      const projectTechnologies = technologyIds.map(techId => ({ project_id: data.id, technology_id: techId }));
      const { error: techError } = await supabase.from("project_technologies").insert(projectTechnologies);
      if (techError) {
        await supabase.from("projects").delete().eq("id", data.id); // Rollback
        throw new Error(`Error linking technologies to project: ${techError.message}`);
      }
    }
    return data;
  });
}

export async function updateProject(id: string, projectData: Partial<Omit<Project, 'id' | 'created_at'>>, technologyIds?: string[]): Promise<Project | null> {
  return withRetry(async () => {
    const { data, error } = await supabase.from("projects").update(projectData).eq("id", id).select().single();
    if (error) {
      throw new Error(`Error updating project: ${error.message}`);
    }
    if (data && technologyIds !== undefined) {
      const { error: deleteError } = await supabase.from("project_technologies").delete().eq("project_id", id);
      if (deleteError) {
        throw new Error(`Error deleting old technologies for project: ${deleteError.message}`);
      }
      if (technologyIds.length > 0) {
        const projectTechnologies = technologyIds.map(techId => ({ project_id: id, technology_id: techId }));
        const { error: insertError } = await supabase.from("project_technologies").insert(projectTechnologies);
        if (insertError) {
          throw new Error(`Error inserting new technologies for project: ${insertError.message}`);
        }
      }
    }
    return data;
  });
}

export async function deleteProject(id: string): Promise<boolean> {
  return withRetry(async () => {
    const { error: techError } = await supabase.from("project_technologies").delete().eq("project_id", id);
    if (techError) {
      throw new Error(`Error deleting project technologies: ${techError.message}`);
    }
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      throw new Error(`Error deleting project: ${error.message}`);
    }
    return true;
  });
}

export async function getProjectById(id: string): Promise<Project | null> {
  return withRetry(async () => {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (projectError) {
      if (projectError.code === "PGRST116") {
        return null;
      }
      throw new Error(`Error fetching project by ID: ${projectError.message}`);
    }
    return project as Project;
  });
}

// Feedback Management
export async function updateFeedbackStatus(id: string, status: 'read' | 'unread' | 'replied'): Promise<boolean> {
  return withRetry(async () => {
    const { error } = await supabase
      .from("feedback")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      throw new Error(`Error updating feedback status: ${error.message}`);
    }
    return true;
  });
}

export async function deleteFeedback(id: string): Promise<boolean> {
  return withRetry(async () => {
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      throw new Error(`Error deleting feedback: ${error.message}`);
    }
    return true;
  });
}

export async function getFeedbackWithSenderInfo(): Promise<FeedbackWithSenderInfo[]> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*, connections(name, email, subject, status)")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(`Error fetching feedback with sender info: ${error.message}`);
    }
    return data as FeedbackWithSenderInfo[];
  });
}

export async function replyToFeedback(feedbackId: string, replyMessage: string): Promise<boolean> {
  return withRetry(async () => {
    const { error } = await supabase
      .from("feedback")
      .update({ reply_message: replyMessage, status: 'replied', updated_at: new Date().toISOString() })
      .eq("id", feedbackId);
    if (error) {
      throw new Error(`Error replying to feedback: ${error.message}`);
    }
    return true;
  });
}
