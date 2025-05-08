
// Types for our API responses
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
  }

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
