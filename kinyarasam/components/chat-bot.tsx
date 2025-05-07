"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react"
import { nanoid } from "nanoid"

// Types for our chat messages
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nanoid(),
      role: "assistant",
      content: "Hi there! I'm the AI assistant for this portfolio. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Check for dark mode
  useEffect(() => {
    // Check initial preference
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDarkMode(darkModeQuery.matches)

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    darkModeQuery.addEventListener("change", handler)

    return () => darkModeQuery.removeEventListener("change", handler)
  }, [])

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (this will be replaced with actual AI integration)
    setTimeout(() => {
      const placeholderResponses = [
        "Thanks for your message! When the AI backend is integrated, I'll be able to provide more specific information about the portfolio owner.",
        "Great question! Once the AI backend is connected, I'll be able to answer questions about skills, experience, and projects.",
        "I'm currently running in demo mode. Soon I'll be connected to an AI that can provide detailed information about the portfolio owner's background and work.",
        "I'm designed to help you learn more about the portfolio owner. The full AI functionality will be available soon!",
      ]

      const responseIndex = Math.floor(Math.random() * placeholderResponses.length)

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: placeholderResponses[responseIndex],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat toggle button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full w-12 h-12 p-0 flex items-center justify-center ${
            isOpen ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
        >
          {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 w-80 md:w-96"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="flex flex-col h-[500px] overflow-hidden border rounded-lg shadow-lg"
              style={{
                borderColor: isDarkMode ? "#333" : "#e5e5e5",
                backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
              }}
            >
              {/* Chat header */}
              <div className="p-3 border-b flex items-center justify-between bg-indigo-600 text-white">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <h3 className="font-medium">Portfolio Assistant</h3>
                </div>
                <button
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat messages */}
              <div
                className="flex-1 overflow-y-auto p-3"
                style={{
                  backgroundColor: isDarkMode ? "#0f0f0f" : "#f9f9f9",
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          message.role === "assistant" ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                        style={{
                          backgroundColor:
                            message.role === "assistant" ? "#4f46e5" : isDarkMode ? "#4a4a4a" : "#d1d1d1",
                        }}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-white" />
                        ) : (
                          <User className="h-4 w-4" style={{ color: isDarkMode ? "#e5e5e5" : "#333" }} />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 text-sm`}
                        style={{
                          backgroundColor:
                            message.role === "assistant" ? (isDarkMode ? "#2a2a2a" : "#e5e5e5") : "#4f46e5",
                          color: message.role === "assistant" ? (isDarkMode ? "#e5e5e5" : "#171717") : "#ffffff",
                          border:
                            message.role === "assistant" ? `1px solid ${isDarkMode ? "#444" : "#d1d1d1"}` : "none",
                        }}
                      >
                        {message.content}
                        <div
                          className="text-xs mt-1"
                          style={{
                            color:
                              message.role === "assistant"
                                ? isDarkMode
                                  ? "#999"
                                  : "#666"
                                : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex mb-4 justify-start">
                    <div className="flex gap-2 max-w-[80%]">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-600">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div
                        className="rounded-lg p-3 text-sm"
                        style={{
                          backgroundColor: isDarkMode ? "#2a2a2a" : "#e5e5e5",
                          border: `1px solid ${isDarkMode ? "#444" : "#d1d1d1"}`,
                        }}
                      >
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div
                className="p-3 border-t"
                style={{
                  borderColor: isDarkMode ? "#333" : "#e5e5e5",
                  backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                }}
              >
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="min-h-10 resize-none w-full rounded-md border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                      color: isDarkMode ? "#e5e5e5" : "#171717",
                      borderColor: isDarkMode ? "#444" : "#d1d1d1",
                    }}
                    maxLength={500}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md w-10 h-10 flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xs mt-2 text-center" style={{ color: isDarkMode ? "#999" : "#666" }}>
                  This is a demo chatbot. AI integration coming soon!
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
