import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"
import type { ProjectWithTechnologies } from "./queries"

type Project = Database["public"]["Tables"]["projects"]["Row"]
type Feedback = Database["public"]["Tables"]["feedback"]["Row"]

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

async function withRetry<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return withRetry(operation, retries - 1)
    }
    throw error
  }
}

// Project Management
export async function createProject(projectData: Omit<Project, 'id' | 'created_at'>, technologyIds: string[]): Promise<Project | null> {
  return withRetry(async () => {
    const { data, error } = await supabase.from("projects").insert([projectData]).select().single()

    if (error) {
      throw new Error(`Error creating project: ${error.message}`)
    }

    if (data && technologyIds.length > 0) {
      const projectTechnologies = technologyIds.map(techId => ({ project_id: data.id, technology_id: techId }))
      const { error: techError } = await supabase.from("project_technologies").insert(projectTechnologies)
      if (techError) {
        console.error("Error linking technologies to project:", techError)
        // Decide whether to roll back project creation or just log the error
      }
    }

    return data
  })
}

export async function updateProject(id: string, projectData: Partial<Omit<Project, 'id' | 'created_at'>>, technologyIds?: string[]): Promise<Project | null> {
  return withRetry(async () => {
    const { data, error } = await supabase.from("projects").update(projectData).eq("id", id).select().single()

    if (error) {
      throw new Error(`Error updating project: ${error.message}`)
    }

    if (data && technologyIds !== undefined) {
      // First, delete existing technologies for this project
      const { error: deleteError } = await supabase.from("project_technologies").delete().eq("project_id", id)
      if (deleteError) {
        console.error("Error deleting old technologies for project:", deleteError)
      }

      // Then, insert new technologies
      if (technologyIds.length > 0) {
        const projectTechnologies = technologyIds.map(techId => ({ project_id: id, technology_id: techId }))
        const { error: insertError } = await supabase.from("project_technologies").insert(projectTechnologies)
        if (insertError) {
          console.error("Error inserting new technologies for project:", insertError)
        }
      }
    }

    return data
  })
}

export async function deleteProject(id: string): Promise<boolean> {
  return withRetry(async () => {
    // Delete associated technologies first
    const { error: techError } = await supabase.from("project_technologies").delete().eq("project_id", id)
    if (techError) {
      console.error("Error deleting project technologies:", techError)
      return false
    }

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting project: ${error.message}`)
      return false
    }

    return true
  })
}

export async function getProjectById(id: string): Promise<ProjectWithTechnologies | null> {
  return withRetry(async () => {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(`*,
        technologies (
          id,
          name,
          icon_name,
          category,
          created_at
        )
      `)
      .eq("id", id)
      .single()

    if (projectError) {
      if (projectError.code === "PGRST116") { // No rows returned
        return null
      }
      throw new Error(`Error fetching project by ID: ${projectError.message}`)
    }

    return project as ProjectWithTechnologies
  })
}

// Feedback Management
export async function updateFeedbackStatus(id: string, status: 'read' | 'spam' | 'archived'): Promise<boolean> {
  return withRetry(async () => {
    const { error } = await supabase
      .from("feedback")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Error updating feedback status:", error)
      return false
    }

    return true
  })
}

export async function deleteFeedback(id: string): Promise<boolean> {
  return withRetry(async () => {
    const { error } = await supabase.from("feedback").delete().eq("id", id)

    if (error) {
      console.error("Error deleting feedback:", error)
      return false
    }

    return true
  })
}

export async function getFeedbackWithSenderInfo(): Promise<FeedbackWithSenderInfo[]> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*, connections(name, email, subject)") // Assuming feedback is linked to connections
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Error fetching feedback with sender info: ${error.message}`)
    }

    return data as FeedbackWithSenderInfo[]
  })
}

export async function replyToFeedback(feedbackId: string, replyMessage: string): Promise<boolean> {
  return withRetry(async () => {
    const { error } = await supabase
      .from("feedback")
      .update({ reply_message: replyMessage, status: 'replied', updated_at: new Date().toISOString() })
      .eq("id", feedbackId)

    if (error) {
      console.error("Error replying to feedback:", error)
      return false
    }

    return true
  })
}
