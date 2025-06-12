import { BaseApiService, type ApiResponse, type PaginatedResponse } from "./base-api"
import type { Education, CreateEducationData, UpdateEducationData, ListQueryParams } from "../interface"

export class EducationAdminService extends BaseApiService {
  private readonly endpoint = "/api/v1/education"

  // Get all education records with optional filtering
  async getEducationRecords(params?: ListQueryParams): Promise<PaginatedResponse<Education>> {
    return this.get<PaginatedResponse<Education>>(this.endpoint, params)
  }

  // Get a single education record by ID
  async getEducationRecord(id: string): Promise<ApiResponse<Education>> {
    return this.get<ApiResponse<Education>>(`${this.endpoint}/${id}`)
  }

  // Create a new education record
  async createEducationRecord(data: CreateEducationData): Promise<ApiResponse<Education>> {
    return this.post<ApiResponse<Education>>(this.endpoint, data)
  }

  // Update an existing education record
  async updateEducationRecord(id: string, data: UpdateEducationData): Promise<ApiResponse<Education>> {
    return this.patch<ApiResponse<Education>>(`${this.endpoint}/${id}`, data)
  }

  // Delete an education record
  async deleteEducationRecord(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.endpoint}/${id}`)
  }

  // Bulk delete education records
  async bulkDeleteEducationRecords(ids: string[]): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`${this.endpoint}/bulk-delete`, { ids })
  }

  // Reorder education records
  async reorderEducationRecords(reorderData: { id: string; order: number }[]): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`${this.endpoint}/reorder`, { items: reorderData })
  }

  // Get education statistics
  async getEducationStats(): Promise<
    ApiResponse<{
      total: number
      byInstitution: Record<string, number>
      recentCount: number
    }>
  > {
    return this.get<ApiResponse<any>>(`${this.endpoint}/stats`)
  }
}

// Create singleton instance
export const educationAdminService = new EducationAdminService()
