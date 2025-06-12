import { BaseApiService, type ApiResponse, type PaginatedResponse } from "./base-api"
import type { Experience, CreateExperienceData, UpdateExperienceData, ListQueryParams } from "../interface"

export class ExperienceAdminService extends BaseApiService {
  private readonly endpoint = "/api/v1/experience"

  // Get all experiences with optional filtering
  async getExperiences(params?: ListQueryParams): Promise<PaginatedResponse<Experience>> {
    return this.get<PaginatedResponse<Experience>>(this.endpoint, params)
  }

  // Get a single experience by ID
  async getExperience(id: string): Promise<ApiResponse<Experience>> {
    return this.get<ApiResponse<Experience>>(`${this.endpoint}/${id}`)
  }

  // Create a new experience
  async createExperience(data: CreateExperienceData): Promise<ApiResponse<Experience>> {
    return this.post<ApiResponse<Experience>>(this.endpoint, data)
  }

  // Update an existing experience
  async updateExperience(id: string, data: UpdateExperienceData): Promise<ApiResponse<Experience>> {
    return this.patch<ApiResponse<Experience>>(`${this.endpoint}/${id}`, data)
  }

  // Delete an experience
  async deleteExperience(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.endpoint}/${id}`)
  }

  // Bulk delete experiences
  async bulkDeleteExperiences(ids: number[]): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`${this.endpoint}/bulk-delete`, { ids })
  }

  // Reorder experiences
  async reorderExperiences(reorderData: { id: string; order: number }[]): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`${this.endpoint}/reorder`, { items: reorderData })
  }

  // Get experience statistics
  async getExperienceStats(): Promise<
    ApiResponse<{
      total: number
      byType: Record<string, number>
      recentCount: number
    }>
  > {
    return this.get<ApiResponse<any>>(`${this.endpoint}/stats`)
  }
}

// Create singleton instance
export const experienceAdminService = new ExperienceAdminService()
