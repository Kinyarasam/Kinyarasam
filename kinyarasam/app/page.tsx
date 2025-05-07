"use client"

import type React from "react"

import { ArrowRight, Code, Github, Linkedin, Mail, Menu, Terminal, Wifi } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"

import { NetworkGraph } from "@/components/network-graph"
import { TerminalDemo } from "@/components/terminal-demo"
// import { useMobile } from "@/hooks/use-mobile"
import { FloatingNav } from "@/components/floating-nav"
import { HeroParticles } from "@/components/hero-particles"
import { ChatBot } from "@/components/chat-bot"
import { apiService, type Project, type Experience, type BlogPost, type Profile } from "@/services/api"
import { Button } from "@/components/ui/button"
import { CircuitBackground } from "@/components/circuit-background"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillRadar } from "@/components/skill-radar"
import { WavyBackground } from "@/components/wavy-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnimatedBadgeProps {
  children: React.ReactNode
  delay?: number
}
function AnimatedBadge({ children, delay = 0 }: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-200">
        {children}
      </div>
    </motion.div>
  )
}

function AnimatedProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="overflow-hidden h-full rounded-lg border border-gray-200 bg-white shadow-sm group dark:border-gray-800 dark:bg-gray-950">
        <div className="aspect-video w-full overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            width={300}
            height={200}
            className="h-full w-full object-cover transition-all group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">{project.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{project.description}</p>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between p-6 pt-0">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Demo
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Github className="mr-2 h-4 w-4" />
            Code
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectSkeleton() {
  return (
    <div className="overflow-hidden h-full rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
      <div className="p-6">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded mt-1 animate-pulse"></div>
      </div>
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-5 w-14 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-between p-6 pt-0">
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

function AnimatedTimelineItem({ experience, delay = 0 }: { experience: Experience; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative pl-8 pb-4"
    >
      <div className="absolute left-0 top-0 h-full w-px bg-gray-200 dark:bg-gray-800" />
      <motion.div
        className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-indigo-600"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
      />
      <div className="space-y-1">
        <h3 className="font-bold group-hover:text-indigo-600 transition-colors">{experience.title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">{experience.organization}</p>
          <p className="text-sm font-medium">{experience.period}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{experience.description}</p>
      </div>
    </motion.div>
  )
}

function ExperienceSkeleton() {
  return (
    <div className="relative pl-8 pb-4">
      <div className="absolute left-0 top-0 h-full w-px bg-gray-200 dark:bg-gray-800" />
      <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div className="space-y-1">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded mt-1 sm:mt-0 animate-pulse"></div>
        </div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mt-1 animate-pulse"></div>
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded mt-1 animate-pulse"></div>
      </div>
    </div>
  )
}

function AnimatedBlogCard({ post, delay = 0 }: { post: BlogPost; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="overflow-hidden h-full rounded-lg border border-gray-200 bg-white shadow-sm group dark:border-gray-800 dark:bg-gray-950">
          <div className="aspect-video w-full overflow-hidden">
            <Image
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              width={300}
              height={200}
              className="h-full w-full object-cover transition-all group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                {post.category}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{post.publishedAt}</span>
            </div>
            <h3 className="text-xl font-bold mt-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{post.excerpt}</p>
          </div>
          <div className="p-6 pt-0">
            <button className="inline-flex items-center text-indigo-600 hover:text-indigo-800 w-full justify-center">
              Read More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function BlogSkeleton() {
  return (
    <div className="overflow-hidden h-full rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded mt-2 animate-pulse"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mt-1 animate-pulse"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded mt-1 animate-pulse"></div>
      </div>
      <div className="p-6 pt-0">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

export default function Home() {
  // const isMobile = useMobile()
  const [activeSection, setActiveSection] = useState("hero")
  const [projectCategory, setProjectCategory] = useState("all")
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const sectionRefs = useMemo(
    () => ({
      hero: heroRef,
      about: aboutRef,
      projects: projectsRef,
      blog: blogRef,
      experience: experienceRef,
      contact: contactRef,
    }),
    [heroRef, aboutRef, projectsRef, blogRef, experienceRef, contactRef]
  );

  // State for data
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [experience, setExperience] = useState<Experience[] | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[] | null>(null)

  // Loading states
  const [profileLoading, setProfileLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [experienceLoading, setExperienceLoading] = useState(true)
  const [blogLoading, setBlogLoading] = useState(true)

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        const data = await apiService.getProfile()
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        // Set default profile data when API fails
        setProfile({
          name: "Kinyara Samuel Gachigo",
          title: "Software Engineer & Telecom Expert",
          bio: "I'm a software engineer with a background in telecommunications.",
          expertise: [
            {
              title: "Software Development",
              description: "Full-stack development with modern frameworks and cloud technologies.",
              icon: "Code",
            },
            {
              title: "Telecommunications",
              description: "Network protocols, VoIP systems, and wireless communications.",
              icon: "Wifi",
            },
          ],
          skills: [
            { name: "JavaScript", value: 0.9 },
            { name: "React", value: 0.85 },
            { name: "Node.js", value: 0.8 },
          ],
          technologies: ["Golang", "Java", "C", "Python", "Arduino", "JavaScript", "TypeScript", "React", "Next.js", "Node.js"],
          contact: {
            email: "skinyara.30@gmail.com",
            linkedin: "linkedin.com/in/kinyarasam",
            github: "github.com/kinyarasam",
            twitter: "twitter.com/kinyarasam",
          },
          resumeUrl: "/api/resume",
        })
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Add similar error handling for other API calls
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true)
        const data = await apiService.getProjects(projectCategory)
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
        // Set default projects data when API fails
        setProjects([
          {
            id: 1,
            title: "Network Traffic Analyzer",
            description: "A real-time network traffic analysis tool built with Python and React.",
            tags: ["Python", "React", "WebSockets", "Network"],
            image: "/placeholder.svg?height=200&width=300",
            category: "telecom",
            demoUrl: "https://example.com/demo",
            githubUrl: "https://github.com/example/project",
          },
          {
            id: 2,
            title: "E-commerce Platform",
            description: "A full-stack e-commerce solution with payment processing and inventory management.",
            tags: ["Next.js", "Node.js", "MongoDB", "Stripe"],
            image: "/placeholder.svg?height=200&width=300",
            category: "web",
            demoUrl: "https://example.com/demo",
            githubUrl: "https://github.com/example/project",
          },
        ])
      } finally {
        setProjectsLoading(false)
      }
    }

    fetchProjects()
  }, [projectCategory])

  // Fetch experience data
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setExperienceLoading(true)
        const data = await apiService.getExperience()
        setExperience(data)
      } catch (error) {
        console.error("Error fetching experience:", error)
      } finally {
        setExperienceLoading(false)
      }
    }

    fetchExperience()
  }, [])

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setBlogLoading(true)
        const data = await apiService.getBlogPosts({ limit: 3 })
        setBlogPosts(data)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setBlogLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Form state for contact form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState<{
    status: "idle" | "submitting" | "success" | "error"
    message: string
  }>({
    status: "idle",
    message: "",
  })

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setFormStatus({ status: "submitting", message: "Sending your message..." })

      const response = await apiService.submitContactForm(contactForm)

      setFormStatus({
        status: "success",
        message: response.message || "Your message has been sent successfully!",
      })

      // Reset form
      setContactForm({ name: "", email: "", message: "" })
    } catch (error) {
      setFormStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to send message",
      })
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      Object.entries(sectionRefs).forEach(([section, ref]) => {
        if (ref.current) {
          const element = ref.current as HTMLElement
          if (element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
            setActiveSection(section)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sectionRefs])

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Blog", href: "#blog" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <FloatingNav navItems={navItems} activeSection={activeSection} />
      </div>

      {/* Mobile Navigation */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <div>
          <button
            className="rounded-full bg-white p-2 shadow-md dark:bg-gray-800"
            onClick={() => {
              const menu = document.getElementById("mobile-menu")
              if (menu) {
                menu.classList.toggle("hidden")
              }
            }}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </button>
          <div
            id="mobile-menu"
            className="hidden absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg dark:bg-gray-800"
          >
            <div className="py-1">
              {navItems.map(
                (item) =>
                  item.href && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-sm ${
                        activeSection === item.href.substring(1)
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Component */}
      <ChatBot />

      <main className="flex-1">
        <section
          id="hero"
          ref={sectionRefs.hero}
          className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden"
        >
          <HeroParticles />
          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 mb-2">
                    <Terminal className="mr-1 h-3 w-3" />
                    <span>Software Engineer</span>
                    <span className="mx-1">•</span>
                    <Wifi className="mr-1 h-3 w-3" />
                    <span>Telecom Expert</span>
                  </div>
                  <motion.h1
                    className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {profileLoading ? (
                      <div className="h-16 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    ) : (
                      profile?.name || "Kinyara Samuel Gachigo"
                    )}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <TerminalDemo />
                  </motion.div>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    View My Work
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#blog"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Read My Blog
                    <Code className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                  </a>
                  {profile?.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      download
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Download Resume
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  )}
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <NetworkGraph />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-[200px] w-[200px] md:h-[250px] md:w-[250px] rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden border border-indigo-200 dark:border-indigo-800">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Profile"
                        width={250}
                        height={250}
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </section>

        <section id="about" ref={sectionRefs.about} className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <CircuitBackground className="absolute inset-0 -z-10 opacity-10" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Code className="mr-1 h-3 w-3" />
                  About Me
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">The Tech Behind the Engineer</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {profileLoading ? (
                    <>
                      <Skeleton className="h-6 w-full mx-auto max-w-[700px]" />
                      <Skeleton className="h-6 w-5/6 mx-auto max-w-[650px] mt-2" />
                    </>
                  ) : (
                    profile?.bio || "Loading bio..."
                  )}
                </p>
              </motion.div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">My Expertise</h3>
                  <p className="text-muted-foreground">
                    I combine my software engineering skills with telecommunications knowledge to build robust
                    applications that leverage network infrastructure effectively. My experience spans from frontend
                    development to backend systems and network optimization.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {profileLoading ? (
                    <>
                      <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                        <CardHeader className="p-4">
                          <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6 mt-1" />
                        </CardContent>
                      </Card>
                      <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                        <CardHeader className="p-4">
                          <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6 mt-1" />
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    profile?.expertise.map((item, index) => (
                      <Card key={index} className="bg-background/50 backdrop-blur-sm border-primary/20">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base flex items-center">
                            {item.icon === "Code" ? (
                              <Code className="mr-2 h-4 w-4 text-primary" />
                            ) : (
                              <Wifi className="mr-2 h-4 w-4 text-primary" />
                            )}
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold">Skills & Technologies</h3>
                <SkillRadar />
                <div className="flex flex-wrap gap-2 mt-4">
                  {profileLoading
                    ? Array(10)
                        .fill(0)
                        .map((_, i) => <Skeleton key={i} className="h-6 w-20" />)
                    : profile?.technologies.map((tech, index) => (
                        <AnimatedBadge key={tech} delay={index * 0.1}>
                          {tech}
                        </AnimatedBadge>
                      ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="projects" ref={sectionRefs.projects} className="relative w-full py-12 md:py-24 lg:py-32">
          <WavyBackground className="absolute inset-0 -z-10" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Terminal className="mr-1 h-3 w-3" />
                  Portfolio
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">My Projects</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A showcase of my recent work across software development and telecommunications.
                </p>
              </motion.div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <Tabs defaultValue="all" className="w-full" value={projectCategory} onValueChange={setProjectCategory}>
                <div className="flex justify-center mb-8 overflow-x-auto pb-2">
                  <TabsList className="bg-background/50 backdrop-blur-sm">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="web">Web Dev</TabsTrigger>
                    <TabsTrigger value="telecom">Telecom</TabsTrigger>
                    <TabsTrigger value="automation">Automation</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value={projectCategory} className="space-y-4">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projectsLoading ? (
                      Array(6)
                        .fill(0)
                        .map((_, i) => <ProjectSkeleton key={i} />)
                    ) : projects && projects.length > 0 ? (
                      projects.map((project, index) => (
                        <AnimatedProjectCard key={project.id} project={project} delay={index * 0.1} />
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-12">
                        <p className="text-muted-foreground">No projects found in this category.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section id="blog" ref={sectionRefs.blog} className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Code className="mr-1 h-3 w-3" />
                  Blog
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Latest Articles</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Thoughts, insights, and tutorials on software engineering and telecommunications.
                </p>
              </motion.div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {blogLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => <BlogSkeleton key={i} />)
              ) : blogPosts && blogPosts.length > 0 ? (
                blogPosts.map((post, index) => <AnimatedBlogCard key={post.id} post={post} delay={index * 0.1} />)
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No blog posts found.</p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <Link href="/blog">
                <Button variant="outline" className="group">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="experience" ref={sectionRefs.experience} className="relative w-full py-12 md:py-24 lg:py-32">
          <CircuitBackground className="absolute inset-0 -z-10 opacity-5" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Terminal className="mr-1 h-3 w-3" />
                  Career
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Experience & Education</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  My professional journey and academic background.
                </p>
              </motion.div>
            </div>
            <div className="mx-auto max-w-3xl py-12">
              <div className="space-y-8">
                {experienceLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <ExperienceSkeleton key={i} />)
                ) : experience && experience.length > 0 ? (
                  experience.map((item, index) => (
                    <AnimatedTimelineItem key={item.id} experience={item} delay={index * 0.1} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No experience data found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" ref={sectionRefs.contact} className="relative w-full py-12 md:py-24 lg:py-32">
          <WavyBackground className="absolute inset-0 -z-10" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Mail className="mr-1 h-3 w-3" />
                  Contact
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get In Touch</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have a project in mind or just want to connect? Feel free to reach out.
                </p>
              </motion.div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold">Contact Information</h3>
                <p className="text-muted-foreground">Feel free to reach out through any of these channels:</p>
                <div className="mt-4 flex flex-col gap-4">
                  {profileLoading ? (
                    Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-5 w-40" />
                        </div>
                      ))
                  ) : profile?.contact ? (
                    <>
                      {profile.contact.email && (
                        <motion.div className="flex items-center gap-2 group" whileHover={{ x: 5 }}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <span>{profile.contact.email}</span>
                        </motion.div>
                      )}
                      {profile.contact.linkedin && (
                        <motion.div className="flex items-center gap-2 group" whileHover={{ x: 5 }}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Linkedin className="h-5 w-5 text-primary" />
                          </div>
                          <span>{profile.contact.linkedin}</span>
                        </motion.div>
                      )}
                      {profile.contact.github && (
                        <motion.div className="flex items-center gap-2 group" whileHover={{ x: 5 }}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Github className="h-5 w-5 text-primary" />
                          </div>
                          <span>{profile.contact.github}</span>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">Contact information not available.</p>
                  )}
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold">Send a Message</h3>
                <p className="text-muted-foreground">
                I&apos;m open to discussing new projects and opportunities. Send me a message, and I&apos;ll get back to you as soon as possible.
                </p>
                {/* Contact Form */}
                <form className="flex flex-col gap-4 mt-4" onSubmit={handleContactSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  {formStatus.status !== "idle" && (
                    <div
                      className={`text-sm ${formStatus.status === "error" ? "text-destructive" : formStatus.status === "success" ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      {formStatus.message}
                    </div>
                  )}

                  <Button type="submit" disabled={formStatus.status === "submitting"} className="mt-2">
                    {formStatus.status === "submitting" ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      <footer className="relative w-full border-t py-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Samuel Gachigo Kinyara. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="https://github.com/kinyarasam" aria-label="GitHub">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-5 w-5 text-primary" />
              </motion.div>
            </Link>
            <Link href="https://www.linkedin.com/in/kinyara-samuel-gachigo-885b151a5/" aria-label="LinkedIn">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-5 w-5 text-primary" />
              </motion.div>
            </Link>
            <Link href="mailto:samgkdev@gmail.com" aria-label="Email">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-5 w-5 text-primary" />
              </motion.div>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
