"use client"

import { useState, useCallback } from "react"
import { adminServices } from "@/services/admin"

// Generic hook for API operations
export function useAdminApi<T = any>() {
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

// Specific hooks for each service
export function useExperienceAdmin() {
  const api = useAdminApi()

  return {
    ...api,
    getExperiences: (params?: any) => api.execute(() => adminServices.experience.getExperiences(params)),
    createExperience: (data: any) => api.execute(() => adminServices.experience.createExperience(data)),
    updateExperience: (id: string, data: any) => api.execute(() => adminServices.experience.updateExperience(id, data)),
    deleteExperience: (id: string) => api.execute(() => adminServices.experience.deleteExperience(id)),
  }
}

export function useEducationAdmin() {
  const api = useAdminApi()

  return {
    ...api,
    getEducationRecords: (params?: any) => api.execute(() => adminServices.education.getEducationRecords(params)),
    createEducationRecord: (data: any) => api.execute(() => adminServices.education.createEducationRecord(data)),
    updateEducationRecord: (id: string, data: any) =>
      api.execute(() => adminServices.education.updateEducationRecord(id, data)),
    deleteEducationRecord: (id: string) => api.execute(() => adminServices.education.deleteEducationRecord(id)),
  }
}

export function useProjectsAdmin() {
  const api = useAdminApi()

  return {
    ...api,
    getProjects: (params?: any) => api.execute(() => adminServices.projects.getProjects(params)),
    createProject: (data: any) => api.execute(() => adminServices.projects.createProject(data)),
    updateProject: (id: string, data: any) => api.execute(() => adminServices.projects.updateProject(id, data)),
    deleteProject: (id: string) => api.execute(() => adminServices.projects.deleteProject(id)),
    uploadImage: (file: File) => api.execute(() => adminServices.projects.uploadProjectImage(file)),
  }
}

export function useBlogAdmin() {
  const api = useAdminApi()

  return {
    ...api,
    getBlogPosts: (params?: any) => api.execute(() => adminServices.blog.getBlogPosts(params)),
    createBlogPost: (data: any) => api.execute(() => adminServices.blog.createBlogPost(data)),
    updateBlogPost: (id: string, data: any) => api.execute(() => adminServices.blog.updateBlogPost(id, data)),
    deleteBlogPost: (id: string) => api.execute(() => adminServices.blog.deleteBlogPost(id)),
    uploadImage: (file: File) => api.execute(() => adminServices.blog.uploadBlogImage(file)),
  }
}
