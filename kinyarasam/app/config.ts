// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// API endpoints
export const API_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/api/v1/profile`,
  PROJECTS: `${API_BASE_URL}/api/v1/projects`,
  EXPERIENCE: `${API_BASE_URL}/api/v1/experience`,
  EDUCATION: `${API_BASE_URL}/api/v1/education`,
  BLOG: `${API_BASE_URL}/api/v1/blog`,
  BLOG_CATEGORIES: `${API_BASE_URL}/api/v1/blog/categories`,
  CONTACT: `${API_BASE_URL}/api/v1/contact`,
  RESUME: `${API_BASE_URL}/api/v1/resume`,
  AUTH: `${API_BASE_URL}/api/v1/auth`,
}
