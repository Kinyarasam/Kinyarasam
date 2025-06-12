/**
 * File management service for handling file uploads and retrievals
 */

// Define the response type for file uploads
interface FileUploadResponse {
  success: boolean
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  message?: string
}

// Define the file type for file metadata
export interface FileMetadata {
  id: string
  url: string
  name: string
  type: string
  size: number
  createdAt: string
  updatedAt: string
}

/**
 * Upload a file to the server
 * @param file The file to upload
 * @param folder Optional folder path to organize files
 * @returns Promise with the upload response
 */
export async function uploadFile(file: File, folder?: string): Promise<FileUploadResponse> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    if (folder) {
      formData.append("folder", folder)
    }

    // Get the JWT token from localStorage
    const token = localStorage.getItem("adminToken")

    if (!token) {
      throw new Error("Authentication token not found")
    }

    // Replace with your actual file management endpoint
    const response = await fetch("your-file-management-endpoint", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to upload file")
    }

    return await response.json()
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

/**
 * Get a list of files
 * @param folder Optional folder to filter files
 * @param fileType Optional file type to filter (e.g., 'image', 'pdf')
 * @returns Promise with array of file metadata
 */
export async function getFiles(folder?: string, fileType?: string): Promise<FileMetadata[]> {
  try {
    // Get the JWT token from localStorage
    const token = localStorage.getItem("adminToken")

    if (!token) {
      throw new Error("Authentication token not found")
    }

    // Build query parameters
    const params = new URLSearchParams()
    if (folder) params.append("folder", folder)
    if (fileType) params.append("type", fileType)

    // Replace with your actual file management endpoint
    const url = `your-file-management-endpoint?${params.toString()}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch files")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching files:", error)
    throw error
  }
}

/**
 * Delete a file
 * @param fileId The ID of the file to delete
 * @returns Promise with the deletion response
 */
export async function deleteFile(fileId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get the JWT token from localStorage
    const token = localStorage.getItem("adminToken")

    if (!token) {
      throw new Error("Authentication token not found")
    }

    // Replace with your actual file management endpoint
    const response = await fetch(`your-file-management-endpoint/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete file")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}
