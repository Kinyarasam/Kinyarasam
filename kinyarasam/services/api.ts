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
    try {
      const response = await fetch(API_ENDPOINTS.EXPERIENCE)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch experience")
      }

      const data: ApiResponse<Experience[]> = await response.json();

      // Validate response structure
      if (!data.success || !data.data) {
        throw new Error('Invalid response structure');
      }

      return data.data
    } catch(error) {
      console.error("Error fetching Experience:", error)
      throw error
    }
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

    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch blog posts")
      }

      const data: ApiResponse<BlogPost[]> = await response.json();

      // Validate response structure
      if (!data.success || !data.data) {
        throw new Error('Invalid response structure');
      }

      return data.data
    } catch(error) {
      console.error("Error fetching blog posts:", error)
      throw error
    }
  },

  getBlogPost: async (slug: string): Promise<BlogPostDetail> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BLOG}/${slug}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "FFailed to fetch blog post")
      }

      const data: ApiResponse<BlogPostDetail> = await response.json();

      // Validate response structure
      if (!data.success || !data.data) {
        throw new Error('Invalid response structure');
      }

      return data.data
    } catch(error) {
      console.error("Error fetching blog posts:", error)
      throw error
    }
  },

  getBlogCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(API_ENDPOINTS.BLOG_CATEGORIES)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "FFailed to fetch blog post")
      }

      const data: ApiResponse<string[]> = await response.json();

      // Validate response structure
      if (!data.success || !data.data) {
        throw new Error('Invalid response structure');
      }

      return data.data
    } catch(error) {
      console.error("Error fetching blog posts:", error)
      throw error
    }
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
