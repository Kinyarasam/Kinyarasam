import { experienceAdminService } from "./experience-service"
import { educationAdminService } from "./education-service"
import { projectsAdminService } from "./projects-service"
import { blogAdminService } from "./blog-service"
import { BaseApiService, type ApiResponse } from "./base-api"

// Dashboard service for admin overview
export class DashboardAdminService extends BaseApiService {
  private readonly endpoint = "/api/v1/dashboard"

  // Get dashboard overview stats
  async getDashboardStats(): Promise<
    ApiResponse<{
      projects: { total: number; featured: number }
      blog: { total: number; published: number; drafts: number }
      experience: { total: number }
      education: { total: number }
      messages: { total: number }
    }>
  > {
    return this.get<ApiResponse<any>>(this.endpoint)
  }

  // Get recent activity
  async getRecentActivity(limit = 10): Promise<
    ApiResponse<
      Array<{
        id: string
        type: string
        action: string
        title: string
        date: string
        image?: string
      }>
    >
  > {
    return this.get<ApiResponse<any>>(`${this.endpoint}/activity`, { limit })
  }

  // Upload file - public wrapper for the protected uploadFile method
  async uploadDashboardFile(
    file: File,
    additionalData?: Record<string, any>,
  ): Promise<
    ApiResponse<{
      fileUrl: string
      fileName: string
      fileSize: number
      fileType: string
    }>
  > {
    return this.uploadFile<ApiResponse<any>>(`${this.endpoint}/upload`, file, additionalData)
  }
}

// Create singleton instance
export const dashboardAdminService = new DashboardAdminService()

// Export all admin services
export const adminServices = {
  experience: experienceAdminService,
  education: educationAdminService,
  projects: projectsAdminService,
  blog: blogAdminService,
  dashboard: dashboardAdminService,
}

// Export individual services
export { experienceAdminService, educationAdminService, projectsAdminService, blogAdminService }

// Export types
export * from "./base-api"
export * from "../interface"
