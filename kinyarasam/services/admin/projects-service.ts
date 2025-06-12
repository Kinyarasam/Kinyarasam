import { BaseApiService, type ApiResponse, type PaginatedResponse } from "./base-api"
import type { Project, CreateProjectData, UpdateProjectData, ListQueryParams, FileUploadResponse } from "../interface"

export class ProjectsAdminService extends BaseApiService {
  private readonly endpoint = "/api/v1/projects"

  // Get all projects with optional filtering
  async getProjects(params?: ListQueryParams): Promise<PaginatedResponse<Project>> {
    return this.get<PaginatedResponse<Project>>(this.endpoint, params)
  }

  // Get a single project by ID
  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.get<ApiResponse<Project>>(`${this.endpoint}/${id}`)
  }

  // Create a new project
  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    return this.post<ApiResponse<Project>>(this.endpoint, data)
  }

  // Update an existing project
  async updateProject(id: string, data: UpdateProjectData): Promise<ApiResponse<Project>> {
    return this.patch<ApiResponse<Project>>(`${this.endpoint}/${id}`, data)
  }

  // Delete a project
  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.endpoint}/${id}`)
  }

  // Bulk delete projects
  async bulkDeleteProjects(ids: number[]): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`${this.endpoint}/bulk-delete`, { ids })
  }

  // Upload project image
  async uploadProjectImage(file: File): Promise<ApiResponse<FileUploadResponse>> {
    return this.uploadFile<ApiResponse<FileUploadResponse>>(`${this.endpoint}/upload-image`, file)
  }

  // Get project categories
  async getProjectCategories(): Promise<ApiResponse<string[]>> {
    return this.get<ApiResponse<string[]>>(`${this.endpoint}/categories`)
  }

  // Get project statistics
  async getProjectStats(): Promise<
    ApiResponse<{
      total: number
      byCategory: Record<string, number>
      byStatus: Record<string, number>
      featuredCount: number
    }>
  > {
    return this.get<ApiResponse<any>>(`${this.endpoint}/stats`)
  }

  // Toggle project featured status
  async toggleFeatured(id: string): Promise<ApiResponse<Project>> {
    return this.patch<ApiResponse<Project>>(`${this.endpoint}/${id}/toggle-featured`)
  }
}

// Create singleton instance
export const projectsAdminService = new ProjectsAdminService()
