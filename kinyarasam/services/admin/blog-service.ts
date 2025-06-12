import { BaseApiService, type ApiResponse, type PaginatedResponse } from "./base-api"
import type {
  BlogPost,
  BlogPostDetail,
  CreateBlogPostData,
  UpdateBlogPostData,
  ListQueryParams,
  FileUploadResponse,
} from "../interface"

export class BlogAdminService extends BaseApiService {
  private readonly endpoint = "/api/v1/blog"

  // Get all blog posts with optional filtering
  async getBlogPosts(params?: ListQueryParams): Promise<PaginatedResponse<BlogPost>> {
    return this.get<PaginatedResponse<BlogPost>>(this.endpoint, params)
  }

  // Get a single blog post by ID
  async getBlogPost(id: string): Promise<ApiResponse<BlogPostDetail>> {
    return this.get<ApiResponse<BlogPostDetail>>(`${this.endpoint}/${id}`)
  }

  // Get a blog post by slug
  async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPostDetail>> {
    return this.get<ApiResponse<BlogPostDetail>>(`${this.endpoint}/slug/${slug}`)
  }

  // Create a new blog post
  async createBlogPost(data: CreateBlogPostData): Promise<ApiResponse<BlogPost>> {
    return this.post<ApiResponse<BlogPost>>(this.endpoint, data)
  }

  // Update an existing blog post
  async updateBlogPost(id: string, data: UpdateBlogPostData): Promise<ApiResponse<BlogPost>> {
    return this.patch<ApiResponse<BlogPost>>(`${this.endpoint}/${id}`, data)
  }

  // Delete a blog post
  async deleteBlogPost(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.endpoint}/${id}`)
  }

  // Bulk delete blog posts
  async bulkDeleteBlogPosts(ids: number[]): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`${this.endpoint}/bulk-delete`, { ids })
  }

  // Upload blog image
  async uploadBlogImage(file: File): Promise<ApiResponse<FileUploadResponse>> {
    return this.uploadFile<ApiResponse<FileUploadResponse>>(`${this.endpoint}/upload-image`, file)
  }

  // Get blog categories
  async getBlogCategories(): Promise<ApiResponse<string[]>> {
    return this.get<ApiResponse<string[]>>(`${this.endpoint}/categories`)
  }

  // Get blog statistics
  async getBlogStats(): Promise<
    ApiResponse<{
      total: number
      published: number
      drafts: number
      byCategory: Record<string, number>
      recentViews: number
    }>
  > {
    return this.get<ApiResponse<any>>(`${this.endpoint}/stats`)
  }

  // Toggle blog post featured status
  async toggleFeatured(id: string): Promise<ApiResponse<BlogPost>> {
    return this.patch<ApiResponse<BlogPost>>(`${this.endpoint}/${id}/toggle-featured`)
  }

  // Publish/unpublish blog post
  async togglePublishStatus(id: string): Promise<ApiResponse<BlogPost>> {
    return this.patch<ApiResponse<BlogPost>>(`${this.endpoint}/${id}/toggle-publish`)
  }

  // Generate slug from title
  async generateSlug(title: string): Promise<ApiResponse<{ slug: string }>> {
    return this.post<ApiResponse<{ slug: string }>>(`${this.endpoint}/generate-slug`, { title })
  }
}

// Create singleton instance
export const blogAdminService = new BlogAdminService()
