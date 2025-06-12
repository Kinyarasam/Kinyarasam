"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart,
  FileText,
  Folder,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  X,
} from "lucide-react"
import { AdminThemeToggle } from "@/components/admin/theme-toggle"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken")

    if (!token && !pathname.includes("/admin/login")) {
      router.push("/admin/login")
    } else if (token) {
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  // Don't apply admin layout to login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Experience", href: "/admin/experience", icon: BarChart },
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    { name: "Projects", href: "/admin/projects", icon: Folder },
    { name: "Blog", href: "/admin/blog", icon: FileText },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          )}

          {/* Sidebar */}
          <div
            className={`
            fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-indigo-700 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
              <Link href="/admin/dashboard" className="text-white font-bold text-xl">
                Portfolio Admin
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="text-indigo-200 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-5 pb-4">
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-base font-medium rounded-md
                      ${pathname === item.href ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600"}
                    `}
                  >
                    <item.icon className="mr-4 h-6 w-6 text-indigo-300" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-indigo-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-indigo-100">Theme</span>
                <AdminThemeToggle />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-base font-medium text-indigo-100 rounded-md hover:bg-indigo-600"
              >
                <LogOut className="mr-4 h-6 w-6 text-indigo-300" />
                Logout
              </button>
              <Link
                href="/"
                className="flex items-center mt-2 px-2 py-2 text-base font-medium text-indigo-100 rounded-md hover:bg-indigo-600"
              >
                <Home className="mr-4 h-6 w-6 text-indigo-300" />
                View Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-indigo-700 lg:pt-5 lg:pb-4">
        <div className="flex items-center justify-center h-16 px-4">
          <Link href="/admin/dashboard" className="text-white font-bold text-xl">
            Portfolio Admin
          </Link>
        </div>
        <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
          <nav className="px-3 mt-6">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${pathname === item.href ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600"}
                  `}
                >
                  <item.icon className="mr-3 h-6 w-6 text-indigo-300" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-indigo-100">Theme</span>
            <AdminThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-indigo-100 rounded-md hover:bg-indigo-600"
          >
            <LogOut className="mr-3 h-6 w-6 text-indigo-300" />
            Logout
          </button>
          <Link
            href="/"
            className="flex items-center mt-2 px-2 py-2 text-sm font-medium text-indigo-100 rounded-md hover:bg-indigo-600"
          >
            <Home className="mr-3 h-6 w-6 text-indigo-300" />
            View Site
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm lg:hidden">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                  >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" />
                  </button>
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Admin</span>
                  </div>
                  <div className="ml-auto">
                    <AdminThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-8">{children}</main>
      </div>
    </div>
  )
}
