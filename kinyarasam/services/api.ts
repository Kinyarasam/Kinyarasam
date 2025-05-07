import { API_ENDPOINTS } from "@/app/config"

// Types for our API responses
export interface Profile {
  name: string
  title: string
  bio: string
  expertise: {
    title: string
    description: string
    icon: string
  }[]
  skills: {
    name: string
    value: number
  }[]
  technologies: string[]
  contact: {
    email: string
    linkedin: string
    github: string
    twitter: string
  }
  resumeUrl: string
}

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  image: string
  category: string
  demoUrl: string
  githubUrl: string
}

export interface Experience {
  id: number
  title: string
  organization: string
  period: string
  description: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  category: string
  image?: string
  featuredImage: string
  readingTime?: string
  tags?: string[]
  content?: string
  featured?: boolean
}

export interface BlogPostDetail extends BlogPost {
  content: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  images: string[]
  video?: string
  codeSnippet?: string
  tableOfContents: {
    id: string
    title: string
    level: number
  }[]
  relatedPosts: {
    title: string
    slug: string
    excerpt: string
    category: string
    image: string
  }[]
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

// API service functions
export const apiService = {
  // Profile
  getProfile: async (): Promise<Profile> => {
    const response = await fetch(API_ENDPOINTS.PROFILE)
    if (!response.ok) throw new Error("Failed to fetch profile")
    return response.json()
  },

  // Projects
  getProjects: async (category?: string): Promise<Project[]> => {
    const url =
      category && category !== "all" ? `${API_ENDPOINTS.PROJECTS}?category=${category}` : API_ENDPOINTS.PROJECTS

    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch projects")
    return response.json()
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
    if (!response.ok) throw new Error("Failed to fetch blog post")
    return response.json()
  },

  getBlogCategories: async (): Promise<string[]> => {
    const response = await fetch(API_ENDPOINTS.BLOG_CATEGORIES)
    if (!response.ok) throw new Error("Failed to fetch blog categories")
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
