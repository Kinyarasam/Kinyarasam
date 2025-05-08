import { API_ENDPOINTS } from "@/app/config"
import { ApiResponse, BlogPost, BlogPostDetail, ContactFormData, Experience, Profile, Project } from "./interface"

// API service functions
export const apiService = {
  // Profile
  getProfile: async (): Promise<Profile> => {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE);
      
      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data: ApiResponse<Profile> = await response.json();
      
      // Validate response structure
      if (!data.success || !data.data) {
        throw new Error('Invalid response structure');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Projects
  getProjects: async (category?: string): Promise<Project[]> => {
    try {
      const url =
        category && category !== "all" ? `${API_ENDPOINTS.PROJECTS}?category=${category}` : API_ENDPOINTS.PROJECTS

      const response = await fetch(url)
      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch projects")
      }

      const data: ApiResponse<Project[]> = await response.json()

      // Validate response structure
      if (!data.success || !data.data) {
        throw new Error("Invalid response structure")
      }

      return data.data
    } catch (error) {
      console.error("Error fetching projects")
      throw error;
    }
  },

  // Experience
  getExperience: async (): Promise<Experience[]> => {
    const response = await fetch(API_ENDPOINTS.EXPERIENCE)
    if (!response.ok) throw new Error("Failed to fetch experience")
    return response.json()
  },

  // Blog
  getBlogPosts: async (params?: { category?: string; search?: string; limit?: number }): Promise<BlogPost[]> => {
    let url = API_ENDPOINTS.BLOG

    if (params) {
      const queryParams = new URLSearchParams()
      if (params.category) queryParams.append("category", params.category)
      if (params.search) queryParams.append("search", params.search)
      if (params.limit) queryParams.append("limit", params.limit.toString())

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`
      }
    }

    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch blog posts")
    return response.json()
  },

  getBlogPost: async (slug: string): Promise<BlogPostDetail> => {
    const response = await fetch(`${API_ENDPOINTS.BLOG}/${slug}`)
    // if (!response.ok) throw new Error("Failed to fetch blog post")
    return response.json()
  },

  getBlogCategories: async (): Promise<string[]> => {
    const response = await fetch(API_ENDPOINTS.BLOG_CATEGORIES)
    // if (!response.ok) throw new Error("Failed to fetch blog categories")
    const data = await response.json()
    return data.categories
  },

  // Contact
  submitContactForm: async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(API_ENDPOINTS.CONTACT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit contact form")
    }

    return data
  },

  // Resume
  getResumeUrl: (): string => {
    return API_ENDPOINTS.RESUME
  },
}
