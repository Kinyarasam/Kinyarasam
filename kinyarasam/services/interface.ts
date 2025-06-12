// Base interface for all entities
export interface BaseEntity {
  id: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

// Profile interfaces
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

// Project interfaces
export interface Project extends BaseEntity {
  title: string
  description: string
  tags: string[]
  image: string
  category: string
  demoUrl: string
  githubUrl: string
  featured?: boolean
  status?: "active" | "archived" | "draft"
}

export interface CreateProjectData {
  title: string
  description: string
  tags: string[]
  image?: string
  category: string
  demoUrl: string
  githubUrl: string
  featured?: boolean
  status?: "active" | "archived" | "draft"
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Experience interfaces
export interface Experience extends BaseEntity {
  title: string
  institution: string
  start_date: string
  end_date: string
  description: string
  order: number
  type?: "work" | "internship" | "freelance"
  location?: string
  skills?: string[]
}

export interface CreateExperienceData {
  title: string
  institution: string
  period: string
  description: string
  order: number
  type?:  "internship" | "freelance" | "full-time" | "contract"
  location?: string
  skills?: string[]
}

export interface UpdateExperienceData extends Partial<CreateExperienceData> {}

// Education interfaces
export interface Education extends BaseEntity {
  title: string
  institution: string
  period: string
  description: string
  order: number
  gpa?: string
  honors?: string[]
  coursework?: string[]
}

export interface CreateEducationData {
  degree: string
  institution: string
  period: string
  description: string
  order: number
  gpa?: string
  honors?: string[]
  coursework?: string[]
}

export interface UpdateEducationData extends Partial<CreateEducationData> {}

// Blog interfaces
export interface BlogPost extends BaseEntity {
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
  status?: "published" | "draft" | "archived"
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

export interface CreateBlogPostData {
  title: string
  slug?: string
  excerpt: string
  category: string
  featuredImage: string
  tags?: string[]
  content: string
  featured?: boolean
  status?: "published" | "draft" | "archived"
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {}

// Contact form interface
export interface ContactFormData {
  name: string
  email: string
  message: string
}

// Query parameters for list endpoints
export interface ListQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// File upload interface
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}
