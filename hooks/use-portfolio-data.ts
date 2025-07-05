"use client";

import { useState, useEffect, useCallback } from "react";

interface Connection {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "read" | "unread" | "replied";
  created_at: string;
}

interface Review {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface Feedback {
  id: string;
  type: string;
  created_at: string;
  status: "read" | "unread" | "replied";
  reply_message?: string;
  name?: string;
  email?: string;
  subject?: string;
  content: string;
  priority?: string;
}

interface Project {
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
  technologies: { id: string; name: string }[];
}

interface UseDataArrayResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useConnections(): UseDataArrayResult<Connection> {
  const [data, setData] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const { getConnections } = await import("@/lib/database/queries");
      const result = await getConnections();
      setData(result);
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError("Failed to load connections");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function usePendingReviews(): UseDataArrayResult<Review> {
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const { getPendingReviews } = await import("@/lib/database/queries");
      const result = await getPendingReviews();
      setData(result);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useFeedback(): UseDataArrayResult<Feedback> {
  const [data, setData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const { getFeedback } = await import("@/lib/database/queries");
      const result = await getFeedback();
      setData(result);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useProjects(): UseDataArrayResult<Project> {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const { getAllProjects } = await import("@/lib/database/queries");
      const result = await getAllProjects();
      setData(result);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
