import { authService } from "@/services/auth/base-api";
import { useCallback, useState } from "react";

export function useAuth<T = any>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(
    async <R = T>(
      apiCall: () => Promise<R>,
      onSuccess?: (data: R) => void,
      onError?: (error: string) => void,
    ): Promise<R | null> => {
      try {
        setLoading(true)
        setError(null)

        const result = await apiCall()
        setData(result as unknown as T)

        if (onSuccess) {
          onSuccess(result)
        }

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)

        if (onError) {
          onError(errorMessage)
        }

        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset,
  }
}

// Specific hooks for authentication
export function useAuthApi() {
  const api = useAuth()

  return {
    ...api,
    login: (data: any) => api.execute(() => authService.login(data)),
    logout: () => api.execute(() => authService.logout())
  }
}