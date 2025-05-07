// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// API endpoints
export const API_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/api/profile`,
  PROJECTS: `${API_BASE_URL}/api/projects`,
  EXPERIENCE: `${API_BASE_URL}/api/experience`,
  BLOG: `${API_BASE_URL}/api/blog`,
  BLOG_CATEGORIES: `${API_BASE_URL}/api/blog/categories`,
  CONTACT: `${API_BASE_URL}/api/contact`,
  RESUME: `${API_BASE_URL}/api/resume`,
}
