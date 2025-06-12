"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import {
  BarChart,
  FileText,
  Folder,
  GraduationCap,
  MessageSquare,
  Edit,
  Plus,
  Upload,
  ImageIcon,
  FileUp,
  Activity,
  TrendingUp,
} from "lucide-react"
import { adminServices } from "@/services/admin"
import { useAdminApi } from "@/hooks/use-admin-api"

interface DashboardStats {
  projects: number
  blogPosts: number
  experiences: number
  education: number
  messages: number
}

interface RecentActivity {
  id: string
  type: string
  title: string
  action: string
  date: string
  image?: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    blogPosts: 0,
    experiences: 0,
    education: 0,
    messages: 0,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const controls = useAnimation()

  // API hooks
  const statsApi = useAdminApi()
  const activityApi = useAdminApi()
  const uploadApi = useAdminApi()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await statsApi.execute(() => adminServices.dashboard.getDashboardStats())
        if (statsResponse?.success && statsResponse.data) {
          // Map the API response to our stats structure
          setStats({
            projects: statsResponse.data.projects?.total || 0,
            blogPosts: statsResponse.data.blog?.total || 0,
            experiences: statsResponse.data.experience?.total || 0,
            education: statsResponse.data.education?.total || 0,
            messages: statsResponse.data.messages?.total || 0,
          })
        }

        // Fetch recent activity
        const activityResponse = await activityApi.execute(() => adminServices.dashboard.getRecentActivity())
        if (activityResponse?.success && activityResponse.data) {
          // Map the API response to our activity structure
          const mappedActivity = activityResponse.data.map((item) => ({
            id: item.id || String(Math.random()),
            type: item.type,
            title: item.title,
            action: item.action,
            date: item.date,
            image: item.image,
          }))
          setRecentActivity(mappedActivity)
        }

        // Animate stats counters
        controls.start({ opacity: 1, y: 0 })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Fallback to mock data if API fails
        setStats({
          projects: 6,
          blogPosts: 12,
          experiences: 3,
          education: 2,
          messages: 8,
        })

        setRecentActivity([
          {
            id: "1",
            type: "blog",
            title: "Understanding 5G Network Architecture",
            action: "updated",
            date: "2 hours ago",
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: "2",
            type: "project",
            title: "E-commerce Platform",
            action: "created",
            date: "1 day ago",
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: "3",
            type: "experience",
            title: "Senior Software Engineer",
            action: "updated",
            date: "3 days ago",
          },
          {
            id: "4",
            type: "message",
            title: "Collaboration opportunity",
            action: "received",
            date: "1 week ago",
          },
        ])
      }
    }

    fetchDashboardData()
  }, [controls])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    try {
      // Use the file upload service
      const result = await uploadApi.execute(() => adminServices.dashboard.uploadDashboardFile(selectedFile))

      if (result?.success) {
        setUploadProgress(100)

        // Add the uploaded file to recent activity
        const newActivity = {
          id: Date.now().toString(),
          type: "file",
          title: selectedFile.name,
          action: "uploaded",
          date: "Just now",
        }

        setRecentActivity([newActivity, ...recentActivity])
        setSelectedFile(null)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const isLoading = statsApi.loading || activityApi.loading

  const statCards = [
    {
      title: "Projects",
      count: stats.projects,
      icon: Folder,
      gradient: "from-blue-500 to-cyan-400",
      href: "/admin/projects",
      description: "Active portfolio projects",
    },
    {
      title: "Blog Posts",
      count: stats.blogPosts,
      icon: FileText,
      gradient: "from-emerald-500 to-teal-400",
      href: "/admin/blog",
      description: "Published articles",
    },
    {
      title: "Experience",
      count: stats.experiences,
      icon: BarChart,
      gradient: "from-violet-500 to-purple-400",
      href: "/admin/experience",
      description: "Work experiences",
    },
    {
      title: "Education",
      count: stats.education,
      icon: GraduationCap,
      gradient: "from-amber-500 to-yellow-400",
      href: "/admin/education",
      description: "Educational background",
    },
    {
      title: "Messages",
      count: stats.messages,
      icon: MessageSquare,
      gradient: "from-rose-500 to-pink-400",
      href: "/admin/messages",
      description: "Unread messages",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="h-5 w-5 text-emerald-500" />
      case "project":
        return <Folder className="h-5 w-5 text-blue-500" />
      case "experience":
        return <BarChart className="h-5 w-5 text-violet-500" />
      case "education":
        return <GraduationCap className="h-5 w-5 text-amber-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-rose-500" />
      case "file":
        return <FileUp className="h-5 w-5 text-indigo-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header with animated gradient background */}
      <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        <div className="absolute -inset-x-40 -bottom-40 -top-40 opacity-20 blur-3xl" aria-hidden="true">
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Your Dashboard</h1>
            <p className="text-indigo-100 max-w-xl">
              Manage your portfolio content, track performance, and keep your site up-to-date.
            </p>
          </motion.div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/admin/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Site
            </Link>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(statsApi.error || activityApi.error) && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{statsApi.error || activityApi.error}</p>
        </div>
      )}

      {/* Stats Grid with animations */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <Link href={card.href} className="block h-full">
              <div className="h-full bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="p-5 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className={`flex-shrink-0 rounded-lg p-3 bg-gradient-to-br ${card.gradient} shadow-lg`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isLoading ? (
                          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                        ) : (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                          >
                            {card.count}
                          </motion.span>
                        )}
                      </div>
                      <div className="ml-auto">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                      </div>
                    </div>
                    <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${card.gradient} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: isLoading ? "30%" : `${Math.min(100, card.count * 8)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                </div>
                <Link
                  href="/admin/activity"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="p-6 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
              ) : (
                <AnimatePresence>
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          {activity.image ? (
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <Image
                                src={activity.image || "/placeholder.svg"}
                                alt={activity.title}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                              {getActivityIcon(activity.type)}
                            </div>
                          )}
                          <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-white dark:border-gray-800">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                              {activity.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Link
                            href={`/admin/${activity.type}/${activity.id}`}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* File Upload and Quick Actions */}
        <div className="space-y-8">
          {/* File Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Upload className="h-5 w-5 text-indigo-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">File Upload</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Upload images, PDFs, and other files to use in your portfolio.
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                        selectedFile
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-700/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      } transition-all duration-200`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {selectedFile ? (
                          <>
                            <div className="mb-2 text-indigo-500">
                              {selectedFile.type.startsWith("image/") ? (
                                <ImageIcon className="h-8 w-8" />
                              ) : (
                                <FileText className="h-8 w-8" />
                              )}
                            </div>
                            <p className="mb-1 text-sm text-gray-900 dark:text-white font-medium">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or PDF (MAX. 10MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {uploadApi.error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-800 dark:text-red-200 text-sm">{uploadApi.error}</p>
                </div>
              )}

              {selectedFile && (
                <div className="mt-4">
                  {isUploading && (
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <motion.div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{uploadProgress}%</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpload}
                      disabled={isUploading || uploadApi.loading}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isUploading || uploadApi.loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload File
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
                      }}
                      disabled={isUploading || uploadApi.loading}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-amber-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <Link href="/admin/blog/new">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md p-2 bg-gradient-to-br from-emerald-500 to-teal-400 shadow-md">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">New Blog Post</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Create a new article</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/admin/projects/new">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/20 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md p-2 bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">New Project</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Add a project to your portfolio</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/admin/experience/new">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 border border-violet-500/20 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md p-2 bg-gradient-to-br from-violet-500 to-purple-400 shadow-md">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">New Experience</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Add work experience</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Additional components
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
