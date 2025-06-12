"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Edit, Plus, Trash2, Search, ArrowUpDown, RefreshCw } from "lucide-react"
import { useExperienceAdmin } from "@/hooks/use-admin-api"
import type { Experience } from "@/services/interface"

export default function ExperiencePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<"title" | "organization" | "period" | "order">("order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [experiences, setExperiences] = useState<Experience[]>([])

  const { loading: isLoading, error, getExperiences, deleteExperience } = useExperienceAdmin()

  useEffect(() => {
    fetchExperiences()
  }, [sortField, sortDirection])

  const fetchExperiences = async () => {
    const result = await getExperiences({
      search: searchQuery,
      sortBy: sortField,
      sortOrder: sortDirection,
    })

    if (result && result.data) {
      setExperiences(result.data.items)
    }
  }

  const handleSort = (field: "title" | "organization" | "period" | "order") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) {
      return
    }

    const result = await deleteExperience(id)
    if (result) {
      // Remove from local state
      setExperiences(experiences.filter((exp) => exp.id !== id))
    }
  }

  const handleSearch = async () => {
    await fetchExperiences()
  }

  const handleRefresh = async () => {
    setSearchQuery("")
    setSortField("order")
    setSortDirection("asc")
    await fetchExperiences()
  }

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your work experience and professional history.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/admin/experience/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Search and filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search experiences..."
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {/* Experience list */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Title
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                  {sortField === "title" && (
                    <span className="ml-1 text-indigo-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("organization")}
              >
                <div className="flex items-center">
                  Organization
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                  {sortField === "organization" && (
                    <span className="ml-1 text-indigo-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("period")}
              >
                <div className="flex items-center">
                  Period
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                  {sortField === "period" && (
                    <span className="ml-1 text-indigo-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("order")}
              >
                <div className="flex items-center">
                  Order
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                  {sortField === "order" && (
                    <span className="ml-1 text-indigo-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
                      </td>
                    </tr>
                  ))
              : filteredExperiences.map((experience, index) => (
                  <motion.tr
                    key={experience.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{experience.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{experience.institution}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{experience.period}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{experience.order}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/experience/${experience.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        >
                          <Edit className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(experience.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

            {!isLoading && filteredExperiences.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="mb-2">No experiences found.</p>
                    {searchQuery ? (
                      <p>
                        Try a different search term or{" "}
                        <button
                          onClick={() => {
                            setSearchQuery("")
                            fetchExperiences()
                          }}
                          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                          clear search
                        </button>
                        .
                      </p>
                    ) : (
                      <Link
                        href="/admin/experience/new"
                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Add your first experience
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {!isLoading && filteredExperiences.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? "s" : ""}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  )
}
