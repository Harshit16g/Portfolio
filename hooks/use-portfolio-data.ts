export function useConnections(): UseDataArrayResult<Connection> {
  const [data, setData] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const { getConnections } = await import("@/lib/database/queries")
      const result = await getConnections()
      setData(result)
    } catch (err) {
      console.error("Error fetching connections:", err)
      setError("Failed to load connections")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function usePendingReviews(): UseDataArrayResult<Review> {
  const [data, setData] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const { getPendingReviews } = await import("@/lib/database/queries")
      const result = await getPendingReviews()
      setData(result)
    } catch (err) {
      console.error("Error fetching reviews:", err)
      setError("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useFeedback(): UseDataArrayResult<Feedback> {
  const [data, setData] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const { getFeedback } = await import("@/lib/database/queries")
      const result = await getFeedback()
      setData(result)
    } catch (err) {
      console.error("Error fetching feedback:", err)
      setError("Failed to load feedback")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}