// Base types for API responses
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success: boolean
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<{
  items: T[]
  pagination: Pagination
}> {}

export interface Pagination {
  total_items: number
  start_index: number
  page: number
  page_size: number
  current_page: string
  next_page: string
  last_page: string
  previous_page: string
}

// Base API configuration
export class BaseApiService {
  private baseUrl: string
  private defaultHeaders: HeadersInit

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || "") {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminToken")
    }
    return null
  }

  // Get headers with auth token
  private getHeaders(customHeaders: HeadersInit = {}): HeadersInit {
    const token = this.getAuthToken()
    return {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    }
  }

  // Handle API responses
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type")

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // If JSON parsing fails, use default error message
        }
      }

      throw new Error(errorMessage)
    }

    if (contentType?.includes("application/json")) {
      return response.json()
    }

    return response.text() as unknown as T
  }

  // Generic GET request
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    })

    console.log(response)

    return this.handleResponse<T>(response)
  }

  // Generic POST request
  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  // Generic PATCH request
  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  // Generic PUT request
  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  // Generic DELETE request
  protected async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  // File upload request
  protected async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const token = this.getAuthToken()
    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    })

    return this.handleResponse<T>(response)
  }
}
